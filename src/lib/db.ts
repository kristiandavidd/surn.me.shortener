import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

function getDb() {
  if (_db) return _db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.warn("⚠️ TURSO_DATABASE_URL is missing in environment variables.");
  }

  _db = createClient({
    url: url || "",
    authToken: authToken,
  });

  return _db;
}

// Note: createTable should be done via migration normally,
// but keeping the logic if needed for simple setup.
export async function ensureTable() {
  const db = getDb();

  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS link (
      id TEXT PRIMARY KEY,
      shortCode TEXT UNIQUE NOT NULL,
      longUrl TEXT NOT NULL,
      title TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      userId TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS link_tree (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS link_tree_item (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      linkTreeId TEXT NOT NULL,
      [order] INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Migration for existing tables
  try {
    await db.execute("ALTER TABLE link_tree ADD COLUMN description TEXT");
  } catch (e) {
    // Column might already exist
  }

  try {
    await db.execute("ALTER TABLE link_tree_item ADD COLUMN icon TEXT");
  } catch (e) {}

  try {
    await db.execute("ALTER TABLE link_tree ADD COLUMN image TEXT");
  } catch (e) {}
}

export async function findLinkByCode(shortCode: string) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, shortCode, longUrl, title FROM link WHERE shortCode = ?",
    args: [shortCode],
  });
  return result.rows[0] as unknown as
    | { id: string; shortCode: string; longUrl: string; title: string | null }
    | undefined;
}

export async function insertLink(
  shortCode: string,
  longUrl: string,
  userId?: string,
  title?: string
) {
  const db = getDb();
  await db.execute({
    sql: "INSERT INTO link (id, shortCode, longUrl, userId, title) VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)",
    args: [shortCode, longUrl, userId || null, title || null],
  });
}

export async function updateLink(id: string, userId: string, title: string, longUrl: string) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE link SET title = ?, longUrl = ? WHERE id = ? AND userId = ?",
    args: [title, longUrl, id, userId],
  });
}

export async function getLinksByUserId(userId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, shortCode, longUrl, title, createdAt FROM link WHERE userId = ? ORDER BY createdAt DESC",
    args: [userId],
  });
  return result.rows as unknown as {
    id: string;
    shortCode: string;
    longUrl: string;
    title: string | null;
    createdAt: string;
  }[];
}

// Link Tree Functions
export async function createLinkTree(
  userId: string,
  title: string,
  slug: string,
  description?: string,
  image?: string
) {
  const db = getDb();
  const id = Math.random().toString(36).substring(2, 15);
  await db.execute({
    sql: "INSERT INTO link_tree (id, slug, title, description, image, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    args: [id, slug, title, description || null, image || null, userId],
  });
  return id;
}

export async function updateLinkTree(
  id: string,
  userId: string,
  title: string,
  description?: string,
  image?: string
) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE link_tree SET title = ?, description = ?, image = ?, updatedAt = datetime('now') WHERE id = ? AND userId = ?",
    args: [title, description || null, image || null, id, userId],
  });

  // Clear old items to re-insert new ones (simplest approach for edit)
  await db.execute({
    sql: "DELETE FROM link_tree_item WHERE linkTreeId = ?",
    args: [id],
  });
}

export async function addLinkTreeItem(
  linkTreeId: string,
  title: string,
  url: string,
  icon?: string,
  order: number = 0
) {
  const db = getDb();
  const id = Math.random().toString(36).substring(2, 15);
  await db.execute({
    sql: "INSERT INTO link_tree_item (id, title, url, icon, linkTreeId, [order]) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, title, url, icon || null, linkTreeId, order],
  });
  return id;
}

export async function getLinkTreesByUserId(userId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, slug, title, description, image, createdAt FROM link_tree WHERE userId = ? ORDER BY createdAt DESC",
    args: [userId],
  });
  return result.rows as unknown as {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    image: string | null;
    createdAt: string;
  }[];
}

export async function getLinkTreeBySlug(slug: string) {
  const db = getDb();
  const treeResult = await db.execute({
    sql: "SELECT id, slug, title, description, image FROM link_tree WHERE slug = ?",
    args: [slug],
  });

  const tree = treeResult.rows[0] as unknown as
    | {
        id: string;
        slug: string;
        title: string;
        description: string | null;
        image: string | null;
      }
    | undefined;

  if (!tree) return null;

  const itemsResult = await db.execute({
    sql: "SELECT id, title, url, icon FROM link_tree_item WHERE linkTreeId = ? ORDER BY [order] ASC",
    args: [tree.id],
  });

  return {
    ...tree,
    items: itemsResult.rows as unknown as {
      id: string;
      title: string;
      url: string;
      icon: string | null;
    }[],
  };
}

export async function deleteLinkTree(id: string, userId: string) {
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM link_tree WHERE id = ? AND userId = ?",
    args: [id, userId],
  });
}

export async function getLinkTreeWithItems(id: string, userId: string) {
  const db = getDb();
  const treeResult = await db.execute({
    sql: "SELECT id, slug, title, description, image FROM link_tree WHERE id = ? AND userId = ?",
    args: [id, userId],
  });

  const tree = treeResult.rows[0] as unknown as
    | {
        id: string;
        slug: string;
        title: string;
        description: string | null;
        image: string | null;
      }
    | undefined;

  if (!tree) return null;

  const itemsResult = await db.execute({
    sql: "SELECT id, title, url, icon FROM link_tree_item WHERE linkTreeId = ? ORDER BY [order] ASC",
    args: [tree.id],
  });

  return {
    ...tree,
    items: itemsResult.rows as unknown as {
      id: string;
      title: string;
      url: string;
      icon: string | null;
    }[],
  };
}

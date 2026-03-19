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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS link (
      id TEXT PRIMARY KEY,
      shortCode TEXT UNIQUE NOT NULL,
      longUrl TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      userId TEXT
    );
  `);
}

export async function findLinkByCode(shortCode: string) {
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, shortCode, longUrl FROM link WHERE shortCode = ?",
    args: [shortCode],
  });
  return result.rows[0] as unknown as
    | { id: string; shortCode: string; longUrl: string }
    | undefined;
}

export async function insertLink(
  shortCode: string,
  longUrl: string,
  userId?: string
) {
  const db = getDb();
  await db.execute({
    sql: "INSERT INTO link (id, shortCode, longUrl, userId) VALUES (lower(hex(randomblob(16))), ?, ?, ?)",
    args: [shortCode, longUrl, userId || null],
  });
}

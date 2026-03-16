import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const db = createClient({
  url: url,
  authToken: authToken,
});

// Note: createTable should be done via migration normally, 
// but keeping the logic if needed for simple setup.
export async function ensureTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Link (
      id TEXT PRIMARY KEY,
      shortCode TEXT UNIQUE NOT NULL,
      longUrl TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export async function findLinkByCode(shortCode: string) {
  const result = await db.execute({
    sql: "SELECT id, shortCode, longUrl FROM Link WHERE shortCode = ?",
    args: [shortCode],
  });
  return result.rows[0] as unknown as { id: string; shortCode: string; longUrl: string } | undefined;
}

export async function insertLink(shortCode: string, longUrl: string) {
  await db.execute({
    sql: "INSERT INTO Link (id, shortCode, longUrl) VALUES (lower(hex(randomblob(16))), ?, ?)",
    args: [shortCode, longUrl],
  });
}


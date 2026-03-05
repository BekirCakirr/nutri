import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client:", err);
});

/** Run a single query. */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (env.nodeEnv === "development") {
    console.log(`[DB] ${duration}ms — ${text.slice(0, 80)}…`);
  }
  return { rows: result.rows as T[], rowCount: result.rowCount };
}

/** Get a client from the pool (for transactions). */
export async function getClient() {
  return pool.connect();
}

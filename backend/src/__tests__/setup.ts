import { pool } from "../config";

// Clean up database connection after all tests
afterAll(async () => {
  await pool.end();
});

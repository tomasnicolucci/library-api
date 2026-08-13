import { pool } from "../../src/database/connection.js";

export const clearDatabase = async () => {
  await pool.query(`
    TRUNCATE TABLE
      refresh_tokens,
      loans,
      books,
      authors,
      users
    RESTART IDENTITY
    CASCADE
  `);
};
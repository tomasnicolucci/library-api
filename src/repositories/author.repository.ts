import { pool } from "../database/connection.js";

export const createAuthor = async (name: string) => {
  const result = await pool.query(
    `
      INSERT INTO authors (name)
      VALUES ($1)
      RETURNING id, name
    `,
    [name]
  );

  return result.rows[0];
};

export const findAllAuthors = async () => {
  const result = await pool.query(
    `
      SELECT id, name
      FROM authors
      ORDER BY id
    `
  );

  return result.rows;
};

export const findAuthorById = async (id: number) => {
  const result = await pool.query(
    `
      SELECT id, name
      FROM authors
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
};
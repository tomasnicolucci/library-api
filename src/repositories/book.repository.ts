import { pool } from "../database/connection.js";

export const createBook = async (
  title: string,
  isbn: string,
  publishedYear: number,
  authorId: number
) => {
  const result = await pool.query(
    `
      INSERT INTO books (
        title,
        isbn,
        published_year,
        author_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        isbn,
        published_year,
        author_id
    `,
    [title, isbn, publishedYear, authorId]
  );

  return result.rows[0];
};

export const findAllBooks = async () => {
  const result = await pool.query(
    `
      SELECT
        b.id,
        b.title,
        b.isbn,
        b.published_year,
        a.id AS author_id,
        a.name AS author_name
      FROM books b
      INNER JOIN authors a
        ON b.author_id = a.id
      ORDER BY b.id
    `
  );

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    isbn: row.isbn,
    publishedYear: row.published_year,
    author: {
      id: row.author_id,
      name: row.author_name
    }
  }));
};

export const findBookById = async (id: number) => {
  const result = await pool.query(
    `
      SELECT
        b.id,
        b.title,
        b.isbn,
        b.published_year,
        a.id AS author_id,
        a.name AS author_name
      FROM books b
      INNER JOIN authors a
        ON b.author_id = a.id
      WHERE b.id = $1
    `,
    [id]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    isbn: row.isbn,
    publishedYear: row.published_year,
    author: {
      id: row.author_id,
      name: row.author_name
    }
  };
};

export const updateBook = async (
  id: number,
  title: string,
  isbn: string,
  publishedYear: number,
  authorId: number
) => {
  const result = await pool.query(
    `
      UPDATE books
      SET
        title = $1,
        isbn = $2,
        published_year = $3,
        author_id = $4
      WHERE id = $5
      RETURNING
        id,
        title,
        isbn,
        published_year,
        author_id
    `,
    [title, isbn, publishedYear, authorId, id]
  );

  return result.rows[0] ?? null;
};

export const patchBook = async (
  id: number,
  fields: Record<string, unknown>
) => {
  const entries = Object.entries(fields);

  const setClauses = entries.map(
    ([column], index) => `${column} = $${index + 1}`
  );

  const values = entries.map(([, value]) => value);

  const result = await pool.query(
    `
      UPDATE books
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length + 1}
      RETURNING
        id,
        title,
        isbn,
        published_year,
        author_id
    `,
    [...values, id]
  );

  return result.rows[0] ?? null;
};

export const deleteBook = async (id: number) => {
  const result = await pool.query(
    `
      DELETE FROM books
      WHERE id = $1
    `,
    [id]
  );

  return result.rowCount;
};
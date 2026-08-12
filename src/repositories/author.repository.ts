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
      SELECT
        a.id,
        a.name,
        b.id AS book_id,
        b.title,
        b.isbn,
        b.published_year
      FROM authors a
      LEFT JOIN books b
        ON b.author_id = a.id
      WHERE a.id = $1
      ORDER BY b.id
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const author = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    books: [] as Array<{
      id: number;
      title: string;
      isbn: string;
      publishedYear: number;
    }>
  };

  for (const row of result.rows) {
    if (row.book_id !== null) {
      author.books.push({
        id: row.book_id,
        title: row.title,
        isbn: row.isbn,
        publishedYear: row.published_year
      });
    }
  }

  return author;
};
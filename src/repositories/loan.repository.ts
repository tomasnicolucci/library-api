import { pool } from "../database/connection.js";

export const findActiveLoanByBookId = async (bookId: number) => {
  const result = await pool.query(
    `
      SELECT
        id,
        user_id,
        book_id,
        loaned_at,
        due_at
      FROM loans
      WHERE book_id = $1
        AND returned_at IS NULL
    `,
    [bookId]
  );

  return result.rows[0] ?? null;
};

export const createLoan = async (
  userId: number,
  bookId: number,
  dueAt: string
) => {
  const result = await pool.query(
    `
      INSERT INTO loans (
        user_id,
        book_id,
        due_at
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        user_id,
        book_id,
        loaned_at,
        due_at,
        returned_at
    `,
    [userId, bookId, dueAt]
  );

  return result.rows[0];
};

export const findAllLoansByUserId = async (userId: number) => {
  const result = await pool.query(
    `
      SELECT
        l.id,
        l.user_id,
        l.book_id,
        l.loaned_at,
        l.due_at,
        l.returned_at,
        b.title AS book_title,
        b.isbn AS book_isbn,
        a.id AS author_id,
        a.name AS author_name
      FROM loans l
      INNER JOIN books b
        ON l.book_id = b.id
      INNER JOIN authors a
        ON b.author_id = a.id
      WHERE l.user_id = $1
      ORDER BY l.loaned_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    loanedAt: row.loaned_at,
    dueAt: row.due_at,
    returnedAt: row.returned_at,
    book: {
      id: row.book_id,
      title: row.book_title,
      isbn: row.book_isbn,
      author: {
        id: row.author_id,
        name: row.author_name
      }
    }
  }));
};

export const findLoanByIdAndUserId = async (
  id: number,
  userId: number
) => {
  const result = await pool.query(
    `
      SELECT
        l.id,
        l.user_id,
        l.book_id,
        l.loaned_at,
        l.due_at,
        l.returned_at,
        b.title AS book_title,
        b.isbn AS book_isbn,
        a.id AS author_id,
        a.name AS author_name
      FROM loans l
      INNER JOIN books b
        ON l.book_id = b.id
      INNER JOIN authors a
        ON b.author_id = a.id
      WHERE l.id = $1
        AND l.user_id = $2
    `,
    [id, userId]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    loanedAt: row.loaned_at,
    dueAt: row.due_at,
    returnedAt: row.returned_at,
    book: {
      id: row.book_id,
      title: row.book_title,
      isbn: row.book_isbn,
      author: {
        id: row.author_id,
        name: row.author_name
      }
    }
  };
};

export const returnLoan = async (
  id: number,
  userId: number
) => {
  const result = await pool.query(
    `
      UPDATE loans
      SET returned_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND user_id = $2
        AND returned_at IS NULL
      RETURNING
        id,
        user_id,
        book_id,
        loaned_at,
        due_at,
        returned_at
    `,
    [id, userId]
  );

  return result.rows[0] ?? null;
};
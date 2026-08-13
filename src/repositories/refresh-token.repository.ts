import { pool } from "../database/connection.js";

export const createRefreshToken = async (
  userId: number,
  tokenHash: string,
  expiresAt: Date
) => {
  const result = await pool.query(
    `
      INSERT INTO refresh_tokens (
        user_id,
        token_hash,
        expires_at
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        user_id,
        expires_at,
        created_at
    `,
    [userId, tokenHash, expiresAt]
  );

  return result.rows[0];
};

export const findRefreshToken = async (
  tokenHash: string
) => {
  const result = await pool.query(
    `
      SELECT
        id,
        user_id,
        token_hash,
        expires_at,
        revoked_at
      FROM refresh_tokens
      WHERE token_hash = $1
    `,
    [tokenHash]
  );

  return result.rows[0] ?? null;
};

export const revokeRefreshToken = async (
  id: number
) => {
  await pool.query(
    `
      UPDATE refresh_tokens
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
    [id]
  );
};
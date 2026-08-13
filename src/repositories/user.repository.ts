import { pool } from "../database/connection.js";
import { DatabaseError } from "../errors/database-error.js";

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
}

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.password_hash,
    role: user.role
  };
};

export const findUserById = async (id: number) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.password_hash,
    role: user.role
  };
};

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  try {
    const result = await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          name,
          email,
          password_hash,
          role
      `,
      [name, email, passwordHash]
    );

    const user = result.rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new DatabaseError("Email already exists");
    }

    throw error;
  }
};
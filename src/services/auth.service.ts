import { RegisterInput, LoginInput } from "../validators/auth.validator.js";
import { AppError } from "../errors/app-error.js";
import { DatabaseError } from "../errors/database-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import {
  createUser,
  findUserByEmail
} from "../repositories/user.repository.js";

export const register = async (input: RegisterInput) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  try {
    const user = await createUser(
      input.name,
      input.email,
      passwordHash
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      throw new AppError("Email already registered", 409);
    }

    throw error;
  }
};

export const login = async (input: LoginInput) => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await verifyPassword(
    input.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    token
  };
};
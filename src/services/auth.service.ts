import { RegisterInput } from "../types/auth.types.js";
import { AppError } from "../errors/app-error.js";
import {
  createUser,
  findUserByEmail
} from "../repositories/user.repository.js";

export const register = (input: RegisterInput) => {
  const existingUser = findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = `hashed_${input.password}`;

  const user = createUser(
    input.name,
    input.email,
    passwordHash
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};
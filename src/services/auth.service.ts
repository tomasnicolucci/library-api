import { RegisterInput, LoginInput, RefreshTokenInput } from "../validators/validator.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh-token.js";
import { createRefreshToken, findRefreshToken, revokeRefreshToken } from "../repositories/refresh-token.repository.js";
import { AppError } from "../errors/app-error.js";
import { DatabaseError } from "../errors/database-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository.js";

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

  const accessToken = generateToken(
    user.id,
    user.role
  );

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await createRefreshToken(
    user.id,
    refreshTokenHash,
    expiresAt
  );

  return {
    accessToken,
    refreshToken
  };
};

export const refresh = async (
  input: RefreshTokenInput
) => {
  const tokenHash = hashRefreshToken(
    input.refreshToken
  );

  const storedToken = await findRefreshToken(tokenHash);

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedToken.revoked_at !== null) {
    throw new AppError("Invalid refresh token", 401);
  }

  const expiresAt = new Date(storedToken.expires_at);

  if (expiresAt <= new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  const user = await findUserById(storedToken.user_id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await revokeRefreshToken(storedToken.id);

  const newAccessToken = generateToken(
    user.id,
    user.role
  );

  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash =
    hashRefreshToken(newRefreshToken);

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  await createRefreshToken(
    user.id,
    newRefreshTokenHash,
    newExpiresAt
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

export const logout = async (
  input: RefreshTokenInput
) => {
  const tokenHash = hashRefreshToken(
    input.refreshToken
  );

  const storedToken = await findRefreshToken(tokenHash);

  if (!storedToken) {
    return;
  }

  if (storedToken.revoked_at !== null) {
    return;
  }

  await revokeRefreshToken(storedToken.id);
};
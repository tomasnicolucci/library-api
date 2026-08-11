import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../errors/app-error.js";

export const authenticate = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = res.req.headers.authorization;

  if (!authorization) {
    throw new AppError("Authentication required", 401);
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Invalid authorization header", 401);
  }

  try {
    const payload = verifyToken(token);

    if (!payload.sub) {
      throw new AppError("Invalid token", 401);
    }

    res.locals.userId = Number(payload.sub);

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401);
  }
};
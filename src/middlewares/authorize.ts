import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";

type Role = "USER" | "ADMIN";

export const authorize = (...allowedRoles: Role[]) => {
  return (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const role = res.locals.role as Role | undefined;

    if (!role || !allowedRoles.includes(role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
};
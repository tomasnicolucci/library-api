import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type ValidationTarget = "body" | "query";

export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = "body"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues
      });
    }

    if (target === "body") {
      req.body = result.data;
    } else {
      res.locals.validatedQuery = result.data;
    }

    next();
  };
};
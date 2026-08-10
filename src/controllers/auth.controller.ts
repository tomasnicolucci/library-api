import { Request, Response } from "express";
import { register } from "../services/auth.service.js";
import type { RegisterInput } from "../validators/auth.validator.js";

export const registerUser = (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const user = register(req.body);

  return res.status(201).json(user);
};
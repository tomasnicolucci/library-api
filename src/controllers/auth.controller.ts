import { Request, Response } from "express";
import { register, login } from "../services/auth.service.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.js";

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const user = await register(req.body);

  return res.status(201).json(user);
};

export const loginUser = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const result = await login(req.body);

  return res.status(200).json(result);
};

export const getMe = async (
  _req: Request,
  res: Response
) => {
  return res.status(200).json({
    userId: res.locals.userId
  });
};
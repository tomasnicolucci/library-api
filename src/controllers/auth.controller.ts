import { Request, Response } from "express";
import { register } from "../services/auth.service.js";

export const registerUser = (req: Request, res: Response) => {
  const user = register(req.body);

  return res.status(201).json(user);
};
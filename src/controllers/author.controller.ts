import type { Request, Response } from "express";
import { create, findAll, findById } from "../services/author.service.js";
import type { CreateAuthorInput } from "../validators/validator.js";

export const createAuthor = async (
  req: Request<{}, {}, CreateAuthorInput>,
  res: Response
) => {
  const author = await create(req.body);

  return res.status(201).json(author);
};

export const getAuthors = async (
  _req: Request,
  res: Response
) => {
  const authors = await findAll();

  return res.status(200).json(authors);
};

export const getAuthorById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);

  const author = await findById(id);

  return res.status(200).json(author);
};
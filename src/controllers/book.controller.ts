import type { Request, Response } from "express";
import { create, findAll, findById, update, remove, patch } from "../services/book.service.js";
import type { CreateBookInput, PatchBookInput, UpdateBookInput, BookQueryInput } from "../validators/validator.js";

export const createBook = async (
  req: Request<{}, {}, CreateBookInput>,
  res: Response
) => {
  const book = await create(req.body);

  return res.status(201).json(book);
};

export const getBooks = async (
  _req: Request,
  res: Response
) => {
  const query =
    res.locals.validatedQuery as BookQueryInput;

  const books = await findAll(query);

  return res.status(200).json(books);
};

export const getBookById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);

  const book = await findById(id);

  return res.status(200).json(book);
};

export const updateBook = async (
  req: Request<{ id: string }, {}, UpdateBookInput>,
  res: Response
) => {
  const id = Number(req.params.id);

  const book = await update(id, req.body);

  return res.status(200).json(book);
};

export const patchBook = async (
  req: Request<{ id: string }, {}, PatchBookInput>,
  res: Response
) => {
  const id = Number(req.params.id);

  const book = await patch(id, req.body);

  return res.status(200).json(book);
};

export const deleteBook = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);

  await remove(id);

  return res.status(204).send();
};
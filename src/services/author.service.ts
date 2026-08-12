import type { CreateAuthorInput } from "../validators/validator.js";
import { createAuthor, findAllAuthors, findAuthorById } from "../repositories/author.repository.js";
import { AppError } from "../errors/app-error.js";

export const create = async (input: CreateAuthorInput) => {
  const author = await createAuthor(input.name);

  return author;
};

export const findAll = async () => {
  const authors = await findAllAuthors();

  return authors;
};

export const findById = async (id: number) => {
  const author = await findAuthorById(id);

  if (!author) {
    throw new AppError("Author not found", 404);
  }

  return author;
};
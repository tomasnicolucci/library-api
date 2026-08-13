import type { CreateBookInput, PatchBookInput, UpdateBookInput, BookQueryInput } from "../validators/validator.js";
import { AppError } from "../errors/app-error.js";
import { createBook, findAllBooks, findBookById, updateBook, deleteBook, patchBook } from "../repositories/book.repository.js";
import { findAuthorById } from "../repositories/author.repository.js";

export const create = async (input: CreateBookInput) => {
  const author = await findAuthorById(input.authorId);

  if (!author) {
    throw new AppError("Author not found", 404);
  }

  const book = await createBook(
    input.title,
    input.isbn,
    input.publishedYear,
    input.authorId
  );

  return book;
};

export const findAll = async (
  query: BookQueryInput
) => {
  return findAllBooks(query);
};

export const findById = async (id: number) => {
  const book = await findBookById(id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  return book;
};

export const update = async (
  id: number,
  input: UpdateBookInput
) => {
  const existingBook = await findBookById(id);

  if (!existingBook) {
    throw new AppError("Book not found", 404);
  }

  const author = await findAuthorById(input.authorId);

  if (!author) {
    throw new AppError("Author not found", 404);
  }

  const book = await updateBook(
    id,
    input.title,
    input.isbn,
    input.publishedYear,
    input.authorId
  );

  return book;
};

export const patch = async (
  id: number,
  input: PatchBookInput
) => {
  const existingBook = await findBookById(id);

  if (!existingBook) {
    throw new AppError("Book not found", 404);
  }

  if (input.authorId !== undefined) {
    const author = await findAuthorById(input.authorId);

    if (!author) {
      throw new AppError("Author not found", 404);
    }
  }

  const fields: Record<string, unknown> = {};

  if (input.title !== undefined) {
    fields.title = input.title;
  }

  if (input.isbn !== undefined) {
    fields.isbn = input.isbn;
  }

  if (input.publishedYear !== undefined) {
    fields.published_year = input.publishedYear;
  }

  if (input.authorId !== undefined) {
    fields.author_id = input.authorId;
  }

  const book = await patchBook(id, fields);

  return book;
};

export const remove = async (id: number) => {
  const existingBook = await findBookById(id);

  if (!existingBook) {
    throw new AppError("Book not found", 404);
  }

  await deleteBook(id);
};
import type { Request, Response } from "express";
import { create, findAll, findById, returnBook, findAllAdmin, findActiveAdmin } from "../services/loan.service.js";
import type { CreateLoanInput } from "../validators/validator.js";

export const createLoan = async (
  req: Request<{}, {}, CreateLoanInput>,
  res: Response
) => {
  const userId = res.locals.userId;

  const loan = await create(
    userId,
    req.body
  );

  return res.status(201).json(loan);
};

export const getLoans = async (
  _req: Request,
  res: Response
) => {
  const userId = res.locals.userId;

  const loans = await findAll(userId);

  return res.status(200).json(loans);
};

export const getLoanById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);
  const userId = res.locals.userId;

  const loan = await findById(id, userId);

  return res.status(200).json(loan);
};

export const returnLoan = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const id = Number(req.params.id);
  const userId = res.locals.userId;

  const loan = await returnBook(id, userId);

  return res.status(200).json(loan);
};

export const getAllLoans = async (
  _req: Request,
  res: Response
) => {
  const loans = await findAllAdmin();

  return res.status(200).json(loans);
};

export const getAllActiveLoans = async (
  _req: Request,
  res: Response
) => {
  const loans = await findActiveAdmin();

  return res.status(200).json(loans);
};
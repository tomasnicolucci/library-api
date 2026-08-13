import type { CreateLoanInput } from "../validators/validator.js";
import { AppError } from "../errors/app-error.js";
import { findBookById } from "../repositories/book.repository.js";
import { findActiveLoanByBookId, createLoan, returnLoan, findLoanByIdAndUserId, findAllLoansByUserId, findAllLoans, findAllActiveLoans} from "../repositories/loan.repository.js";

export const create = async (
  userId: number,
  input: CreateLoanInput
) => {
  const book = await findBookById(input.bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  const activeLoan = await findActiveLoanByBookId(input.bookId);

  if (activeLoan) {
    throw new AppError("Book is already on loan", 409);
  }

  const loan = await createLoan(
    userId,
    input.bookId,
    input.dueAt
  );

  return loan;
};

export const findAll = async (userId: number) => {
  return findAllLoansByUserId(userId);
};

export const findById = async (
  id: number,
  userId: number
) => {
  const loan = await findLoanByIdAndUserId(id, userId);

  if (!loan) {
    throw new AppError("Loan not found", 404);
  }

  return loan;
};

export const returnBook = async (
  id: number,
  userId: number
) => {
  const loan = await findLoanByIdAndUserId(id, userId);

  if (!loan) {
    throw new AppError("Loan not found", 404);
  }

  if (loan.returnedAt !== null) {
    throw new AppError("Loan has already been returned", 409);
  }

  const returnedLoan = await returnLoan(id, userId);

  return returnedLoan;
};

export const findAllAdmin = async () => {
  return findAllLoans();
};

export const findActiveAdmin = async () => {
  return findAllActiveLoans();
};
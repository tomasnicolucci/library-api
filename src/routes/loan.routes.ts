import { Router } from "express";
import { createLoan, getLoanById, getLoans, returnLoan } from "../controllers/loan.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { createLoanSchema } from "../validators/validator.js";

const router = Router();

router.post("/", authenticate, validate(createLoanSchema), asyncHandler(createLoan));

router.get("/", authenticate, asyncHandler(getLoans));

router.get("/:id", authenticate, asyncHandler(getLoanById));

router.post("/:id/return", authenticate, asyncHandler(returnLoan));

export default router;
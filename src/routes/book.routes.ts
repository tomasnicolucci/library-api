import { Router } from "express";

import { createBook, deleteBook, getBookById, getBooks, patchBook, updateBook } from "../controllers/book.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { createBookSchema, patchBookSchema, updateBookSchema } from "../validators/validator.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getBooks));

router.get("/:id", authenticate, asyncHandler(getBookById));

router.post("/", authenticate, validate(createBookSchema), asyncHandler(createBook));

router.put("/:id", authenticate, validate(updateBookSchema), asyncHandler(updateBook));

router.patch("/:id", authenticate, validate(patchBookSchema), asyncHandler(patchBook));

router.delete("/:id", authenticate, asyncHandler(deleteBook));

export default router;
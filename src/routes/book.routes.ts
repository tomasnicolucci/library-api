import { Router } from "express";
import { authorize } from "../middlewares/authorize.js";
import { createBook, deleteBook, getBookById, getBooks, patchBook, updateBook } from "../controllers/book.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { createBookSchema, patchBookSchema, updateBookSchema } from "../validators/validator.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getBooks));

router.get("/:id", authenticate, asyncHandler(getBookById));

router.post("/", authenticate, authorize("ADMIN"), validate(createBookSchema), asyncHandler(createBook));

router.put("/:id", authenticate, authorize("ADMIN"), validate(updateBookSchema), asyncHandler(updateBook));

router.patch("/:id", authenticate, authorize("ADMIN"), validate(patchBookSchema), asyncHandler(patchBook));

router.delete("/:id", authenticate, authorize("ADMIN"), asyncHandler(deleteBook));

export default router;
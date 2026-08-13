import { Router } from "express";
import { createAuthor, getAuthors, getAuthorById } from "../controllers/author.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { validate } from "../middlewares/validate.js";
import { createAuthorSchema } from "../validators/validator.js";

const router = Router();

router.get("/", authenticate, asyncHandler(getAuthors));

router.get("/:id", authenticate, asyncHandler(getAuthorById));

router.post("/", authenticate, authorize("ADMIN"), validate(createAuthorSchema), asyncHandler(createAuthor));

export default router;
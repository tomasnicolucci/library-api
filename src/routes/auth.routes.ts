import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));

export default router;
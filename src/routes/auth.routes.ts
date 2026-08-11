import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));

router.post("/login", validate(loginSchema), asyncHandler(loginUser));

router.get("/me", authenticate, asyncHandler(getMe));

export default router;
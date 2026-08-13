import { Router } from "express";
import { registerUser, loginUser, getMe, refreshToken, logoutUser } from "../controllers/auth.controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/validator.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(registerUser));

router.post("/login", validate(loginSchema), asyncHandler(loginUser));

router.post("/refresh", validate(refreshTokenSchema), asyncHandler(refreshToken));

router.post("/logout", validate(refreshTokenSchema), asyncHandler(logoutUser));

router.get("/me", authenticate, asyncHandler(getMe));

export default router;
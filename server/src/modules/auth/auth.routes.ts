import { Router, type Request, type Response, type NextFunction } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

export const authRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

authRoutes.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(authController.register)
);

authRoutes.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  authController.login
);

authRoutes.post("/logout", requireAuth, authController.logout);

authRoutes.get("/me", authController.me);

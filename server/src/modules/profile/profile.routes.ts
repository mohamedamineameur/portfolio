import { Router, type Request, type Response, type NextFunction } from "express";
import { profileController } from "./profile.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateProfileSchema } from "./profile.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

export const profileRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

// GET /api/profile - Get the profile (public)
profileRoutes.get("/", apiLimiter, asyncHandler(profileController.findOne));

// PUT /api/profile - Update the profile (requires auth)
profileRoutes.put(
  "/",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(profileController.update)
);

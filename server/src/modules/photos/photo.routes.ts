import { Router, type Request, type Response, type NextFunction } from "express";
import { photoController } from "./photo.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

export const photoRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

// GET /api/photos - Get all photos (public)
photoRoutes.get("/", apiLimiter, asyncHandler(photoController.findAll));

// GET /api/photos/:id - Get a photo by ID (public)
photoRoutes.get(
  "/:id",
  apiLimiter,
  asyncHandler(photoController.findById)
);

// POST /api/photos/upload - Upload a photo (requires auth)
photoRoutes.post(
  "/upload",
  requireAuth,
  upload.single("photo"),
  asyncHandler(photoController.upload)
);

// DELETE /api/photos/:id - Delete a photo (requires auth)
photoRoutes.delete(
  "/:id",
  requireAuth,
  asyncHandler(photoController.delete)
);

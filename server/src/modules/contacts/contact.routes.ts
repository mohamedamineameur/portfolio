import { Router, type Request, type Response, type NextFunction } from "express";
import { contactController } from "./contact.controller.js";
import { validate, validateParams } from "../../middlewares/validate.middleware.js";
import {
  createContactSchema,
  contactParamsSchema,
} from "./contact.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { contactLimiter } from "../../middlewares/rateLimit.middleware.js";

export const contactRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

contactRoutes.post(
  "/",
  contactLimiter,
  validate(createContactSchema),
  asyncHandler(contactController.create)
);

contactRoutes.get("/", requireAuth, asyncHandler(contactController.findAll));

contactRoutes.get(
  "/:id",
  requireAuth,
  validateParams(contactParamsSchema),
  asyncHandler(contactController.findById)
);

contactRoutes.patch(
  "/:id/read",
  requireAuth,
  validateParams(contactParamsSchema),
  asyncHandler(contactController.markAsRead)
);

contactRoutes.delete(
  "/:id",
  requireAuth,
  validateParams(contactParamsSchema),
  asyncHandler(contactController.delete)
);

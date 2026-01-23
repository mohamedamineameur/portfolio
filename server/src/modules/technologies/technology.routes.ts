import { Router, type Request, type Response, type NextFunction } from "express";
import { technologyController } from "./technology.controller.js";
import { validate, validateParams } from "../../middlewares/validate.middleware.js";
import {
  technologyParamsSchema,
  createTechnologySchema,
  updateTechnologySchema,
} from "./technology.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

export const technologyRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

technologyRoutes.get("/", apiLimiter, asyncHandler(technologyController.findAll));

technologyRoutes.get(
  "/:id",
  apiLimiter,
  validateParams(technologyParamsSchema),
  asyncHandler(technologyController.findById)
);

technologyRoutes.post(
  "/",
  requireAuth,
  validate(createTechnologySchema),
  asyncHandler(technologyController.create)
);

technologyRoutes.put(
  "/:id",
  requireAuth,
  validateParams(technologyParamsSchema),
  validate(updateTechnologySchema),
  asyncHandler(technologyController.update)
);

technologyRoutes.delete(
  "/:id",
  requireAuth,
  validateParams(technologyParamsSchema),
  asyncHandler(technologyController.delete)
);

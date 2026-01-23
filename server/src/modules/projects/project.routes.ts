import { Router, type Request, type Response, type NextFunction } from "express";
import { projectController } from "./project.controller.js";
import { validate, validateParams } from "../../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectParamsSchema,
} from "./project.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";

export const projectRoutes = Router();

// Helper to wrap async controllers and handle Promises
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

projectRoutes.get("/", apiLimiter, asyncHandler(projectController.findAll));

projectRoutes.get(
  "/:id",
  apiLimiter,
  validateParams(projectParamsSchema),
  asyncHandler(projectController.findById)
);

projectRoutes.post(
  "/",
  requireAuth,
  validate(createProjectSchema),
  asyncHandler(projectController.create)
);

projectRoutes.put(
  "/:id",
  requireAuth,
  validateParams(projectParamsSchema),
  validate(updateProjectSchema),
  asyncHandler(projectController.update)
);

projectRoutes.delete(
  "/:id",
  requireAuth,
  validateParams(projectParamsSchema),
  asyncHandler(projectController.delete)
);

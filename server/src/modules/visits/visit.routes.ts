import { Router, type Request, type Response, type NextFunction } from "express";
import { visitController } from "./visit.controller.js";
import { validate, validateQuery } from "../../middlewares/validate.middleware.js";
import { recordVisitSchema, listVisitsQuerySchema } from "./visit.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
};

export const visitRoutes = Router();

visitRoutes.post(
  "/",
  validate(recordVisitSchema),
  asyncHandler(visitController.record)
);

visitRoutes.get(
  "/",
  requireAuth,
  validateQuery(listVisitsQuerySchema),
  asyncHandler(visitController.findAll)
);

visitRoutes.get("/stats", requireAuth, asyncHandler(visitController.getStats));

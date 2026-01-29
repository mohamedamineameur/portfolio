import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: ErrorWithStatusCode,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message;

  const payload: { error: string; stack?: string; details?: unknown } = {
    error: message,
  };
  if (env.NODE_ENV === "development" && err.stack) {
    payload.stack = err.stack;
  }
  const errWithDetails = err as Error & { details?: unknown };
  if (errWithDetails.details !== undefined) {
    payload.details = errWithDetails.details;
  }

  res.status(statusCode).json(payload);
};

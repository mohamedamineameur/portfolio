import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, z } from "zod";

export const validate = <T extends ZodSchema>(schema: T) => {
  return (req: Request<unknown, unknown, z.infer<T>>, res: Response, next: NextFunction): void => {
    try {
      // Zod's parse method returns the validated and typed value
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed = schema.parse(req.body) as z.infer<T>;
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation error",
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};

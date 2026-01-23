import { Request, Response, NextFunction } from "express";
import { technologyService } from "./technology.service.js";

export const technologyController = {
  findAll: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const technologies = await technologyService.findAll();
      res.json(technologies);
    } catch (error) {
      next(error);
    }
  },

  findById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as unknown as number;
      const technology = await technologyService.findById(id);
      if (!technology) {
        res.status(404).json({ error: "Technology not found" });
        return;
      }
      res.json(technology);
    } catch (error) {
      next(error);
    }
  },

  create: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const technology = await technologyService.create(req.body);
      res.status(201).json(technology);
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as unknown as number;
      const technology = await technologyService.update(id, req.body);
      res.json(technology);
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as unknown as number;
      await technologyService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

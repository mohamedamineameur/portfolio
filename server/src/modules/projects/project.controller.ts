import { Request, Response, NextFunction } from "express";
import { projectService } from "./project.service.js";

export const projectController = {
  findAll: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const published =
        req.query.published === "true"
          ? true
          : req.query.published === "false"
          ? false
          : undefined;
      const projects = await projectService.findAll(published);
      res.json(projects);
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
      const id = req.params.id as string;
      const project = await projectService.findById(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
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
      const project = await projectService.create(req.body);
      res.status(201).json(project);
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
      const id = req.params.id as string;
      const project = await projectService.update(id, req.body);
      res.json(project);
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
      const id = req.params.id as string;
      await projectService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

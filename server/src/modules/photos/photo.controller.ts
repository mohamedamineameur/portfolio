import { Request, Response, NextFunction } from "express";
import { photoService } from "./photo.service.js";

export const photoController = {
  findAll: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const photos = await photoService.findAll();
      res.json(photos);
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
      const photo = await photoService.findById(id);
      if (!photo) {
        res.status(404).json({ error: "Photo not found" });
        return;
      }
      res.json(photo);
    } catch (error) {
      next(error);
    }
  },

  upload: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      // Le fichier est déjà sauvegardé par multer
      // On crée juste l'entrée dans la base de données
      const relativePath = `/uploads/${req.file.filename}`;
      const photo = await photoService.create(relativePath);
      res.status(201).json(photo);
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
      await photoService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

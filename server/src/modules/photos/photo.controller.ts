import { Request, Response, NextFunction } from "express";
import { photoService } from "./photo.service.js";
import { uploadToGcs, isGcsConfigured } from "../../services/gcs.service.js";
import { generateFilename } from "../../middlewares/upload.middleware.js";

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
      const id = req.params.id;
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

      if (!isGcsConfigured()) {
        res.status(500).json({ error: "Storage not configured. Set GCS_BUCKET_NAME and GCS_PROJECT_ID." });
        return;
      }

      // Generate unique filename and upload to GCS
      const filename = generateFilename(req.file.originalname);
      const publicUrl = await uploadToGcs(
        req.file.buffer,
        filename,
        req.file.mimetype
      );

      // Save the public URL in database
      const photo = await photoService.create(publicUrl);
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
      const id = req.params.id;
      await photoService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

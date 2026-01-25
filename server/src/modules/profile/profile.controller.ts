import { Request, Response, NextFunction } from "express";
import { profileService } from "./profile.service.js";

export const profileController = {
  findOne: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const profile = await profileService.findOne();
      if (!profile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }
      res.json(profile);
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
      const profile = await profileService.createOrUpdate(req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },
};

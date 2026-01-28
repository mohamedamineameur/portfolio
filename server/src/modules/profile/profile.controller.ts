import { Request, Response, NextFunction } from "express";
import { profileService } from "./profile.service.js";
import { updateProfileSchema } from "./profile.schema.js";
import type { z } from "zod";

type UpdateProfileBody = z.infer<typeof updateProfileSchema>;

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
    req: Request<unknown, unknown, UpdateProfileBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body: UpdateProfileBody = req.body;
      const profile = await profileService.createOrUpdate(body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },
};

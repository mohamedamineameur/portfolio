import { z } from "zod";

export const updateProfileSchema = z
  .object({
    nom: z.string().min(1).optional(),
    prenom: z.string().min(1).optional(),
    email: z.string().email().optional(),
    tel: z.string().optional().nullable(),
    linkedIn: z.string().url().optional().nullable(),
    github: z.string().url().optional().nullable(),
    photoId: z.string().uuid().optional().nullable(),
  })
  .strict();

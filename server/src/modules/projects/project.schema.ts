import { z } from "zod";

export const createProjectSchema = z
  .object({
    titleFr: z.string().min(1),
    titleEn: z.string().min(1),
    descriptionFr: z.string().min(10),
    descriptionEn: z.string().min(10),
    url: z.string().url().optional().nullable(),
    githubUrl: z.string().url().optional().nullable(),
    imageUrls: z.array(z.string().min(1)).optional(),
    published: z.boolean(),
    technologyIds: z.array(z.string().uuid()).optional(),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    titleFr: z.string().min(1).optional(),
    titleEn: z.string().min(1).optional(),
    descriptionFr: z.string().min(10).optional(),
    descriptionEn: z.string().min(10).optional(),
    url: z.string().url().optional().nullable(),
    githubUrl: z.string().url().optional().nullable(),
    imageUrls: z.array(z.string().min(1)).optional(),
    published: z.boolean().optional(),
    technologyIds: z.array(z.string().uuid()).optional(),
  })
  .strict();

export const projectParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

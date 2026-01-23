import { z } from "zod";

export const createProjectSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(10),
    url: z.string().url().optional().nullable(),
    githubUrl: z.string().url().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    published: z.boolean(),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    url: z.string().url().optional().nullable(),
    githubUrl: z.string().url().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
    published: z.boolean().optional(),
  })
  .strict();

export const projectParamsSchema = z
  .object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })
  .strict();

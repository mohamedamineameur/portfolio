import { z } from "zod";

export const technologyParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const createTechnologySchema = z
  .object({
    name: z.string().min(1),
    icon: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
  })
  .strict();

export const updateTechnologySchema = z
  .object({
    name: z.string().min(1).optional(),
    icon: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
  })
  .strict();

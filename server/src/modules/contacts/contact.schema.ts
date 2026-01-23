import { z } from "zod";

export const createContactSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(10),
  })
  .strict();

export const contactParamsSchema = z
  .object({
    id: z.string().regex(/^\d+$/).transform(Number),
  })
  .strict();

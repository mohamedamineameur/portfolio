import { z } from "zod";

export const recordVisitSchema = z.object({
  visitorId: z.string().uuid(),
});

export const listVisitsQuerySchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.coerce.number().min(1).max(500).optional().default(100),
  offset: z.coerce.number().min(0).optional().default(0),
});

export type RecordVisitBody = z.infer<typeof recordVisitSchema>;
export type ListVisitsQuery = z.infer<typeof listVisitsQuerySchema>;

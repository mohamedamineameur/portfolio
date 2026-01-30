import type { Request, Response, NextFunction } from "express";
import { visitService } from "./visit.service.js";
import { listVisitsQuerySchema, type RecordVisitBody, type ListVisitsQuery } from "./visit.schema.js";

function getClientIp(req: Request<unknown, unknown, RecordVisitBody>): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || req.socket?.remoteAddress || "";
  }
  return req.socket?.remoteAddress || "";
}

export const visitController = {
  record: async (
    req: Request<unknown, unknown, RecordVisitBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { visitorId } = req.body;
      const ip = getClientIp(req);
      const userAgent = req.headers["user-agent"] || null;

      const visit = await visitService.record(visitorId, ip, userAgent);

      if (!visit) {
        res.status(200).json({ recorded: false, message: "Within 30-minute window" });
        return;
      }

      res.status(201).json({ recorded: true, visit: { id: visit.id, createdAt: visit.createdAt } });
    } catch (error) {
      next(error);
    }
  },

  findAll: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters = listVisitsQuerySchema.parse(req.query) as ListVisitsQuery;
      const { visits, total } = await visitService.findAll(filters);

      res.json({
        visits: visits.map((v) => ({
          id: v.id,
          visitorId: v.visitorId,
          ip: v.ip,
          country: v.country,
          city: v.city,
          userAgent: v.userAgent,
          createdAt: v.createdAt,
        })),
        total,
      });
    } catch (error) {
      next(error);
    }
  },

  getStats: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await visitService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },
};

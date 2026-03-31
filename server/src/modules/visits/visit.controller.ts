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

function isRealBrowser(req: Request<unknown, unknown, unknown, unknown>): boolean {
  const ua = req.headers["user-agent"];
  const accept = req.headers["accept"];
  const lang = req.headers["accept-language"];
  const secFetchSite = req.headers["sec-fetch-site"];
  const secFetchMode = req.headers["sec-fetch-mode"];
  const secFetchDest = req.headers["sec-fetch-dest"];
  const secChUa = req.headers["sec-ch-ua"];

  // 1. User-Agent valide
  if (typeof ua !== "string" || !ua.includes("Mozilla")) return false;

  // 2. Doit accepter du HTML (navigateur)
  if (typeof accept !== "string" || !accept.includes("text/html")) return false;

  // 3. Langue présente (humain)
  if (typeof lang !== "string" || lang.trim().length === 0) return false;

  // 4. Headers modernes navigateur
  if (typeof secFetchSite !== "string") return false;
  if (typeof secFetchMode !== "string") return false;
  if (typeof secFetchDest !== "string") return false;

  // 5. Client hints (Chrome/Edge)
  if (typeof secChUa !== "string") return false;

  return true;
}

export const visitController = {
  record: async (
    req: Request<unknown, unknown, RecordVisitBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!isRealBrowser(req)) {
        res.status(200).json({ recorded: false, message: "Not a real browser" });
        return;
      }

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
      const filters: ListVisitsQuery = listVisitsQuerySchema.parse(req.query);
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

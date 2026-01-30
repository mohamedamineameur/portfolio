import { Op } from "sequelize";
import type { WhereOptions } from "sequelize";
import geoip from "geoip-lite";
import { Visit } from "../../database/models/Visit.model.js";
import type { ListVisitsQuery } from "./visit.schema.js";

const VISIT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export const visitService = {
  async record(
    visitorId: string,
    ip: string,
    userAgent: string | null
  ): Promise<Visit | null> {
    const recent = await Visit.findOne({
      where: { visitorId },
      order: [["createdAt", "DESC"]],
    });

    if (recent) {
      const elapsed = Date.now() - new Date(recent.createdAt).getTime();
      if (elapsed < VISIT_WINDOW_MS) {
        return null;
      }
    }

    const geo = geoip.lookup(ip);
    const visit = await Visit.create({
      visitorId,
      ip: ip || null,
      country: geo?.country ?? null,
      city: geo?.city ?? null,
      userAgent: userAgent || null,
    });

    return visit;
  },

  async findAll(filters: ListVisitsQuery): Promise<{ visits: Visit[]; total: number }> {
    const where: WhereOptions = {};

    if (filters.country) {
      where.country = { [Op.iLike]: `%${filters.country}%` };
    }
    if (filters.city) {
      where.city = { [Op.iLike]: `%${filters.city}%` };
    }
    if (filters.from || filters.to) {
      if (filters.from && filters.to) {
        where.createdAt = { [Op.between]: [new Date(filters.from), new Date(filters.to)] };
      } else if (filters.from) {
        where.createdAt = { [Op.gte]: new Date(filters.from) };
      } else if (filters.to) {
        where.createdAt = { [Op.lte]: new Date(filters.to) };
      }
    }

    const [visits, total] = await Promise.all([
      Visit.findAll({
        where,
        order: [["createdAt", "DESC"]],
        limit: filters.limit,
        offset: filters.offset,
      }),
      Visit.count({ where }),
    ]);

    return { visits, total };
  },

  async getStats(): Promise<{
    total: number;
    uniqueCountries: number;
    countries: { country: string; count: number }[];
    cities: { city: string; country: string; count: number }[];
  }> {
    const all = await Visit.findAll({ order: [["createdAt", "DESC"]] });
    const total = all.length;

    const countryCount = new Map<string, number>();
    const cityCount = new Map<string, { country: string; count: number }>();

    for (const v of all) {
      const country = v.country || "Unknown";
      countryCount.set(country, (countryCount.get(country) || 0) + 1);

      const city = v.city || "Unknown";
      const key = `${city}|${country}`;
      const existing = cityCount.get(key);
      if (existing) {
        existing.count++;
      } else {
        cityCount.set(key, { country, count: 1 });
      }
    }

    const countries = Array.from(countryCount.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const cities = Array.from(cityCount.entries())
      .map(([key, data]) => {
        const [city] = key.split("|");
        return { city, country: data.country, count: data.count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    return {
      total,
      uniqueCountries: countryCount.size,
      countries,
      cities,
    };
  },
};

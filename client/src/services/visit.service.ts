import { apiClient } from "../config/api.js";
import type { Visit, VisitStats } from "../types/api.js";

export interface ListVisitsParams {
  country?: string;
  city?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export const visitService = {
  record(visitorId: string): Promise<{ recorded: boolean; visit?: { id: string; createdAt: string } }> {
    return apiClient
      .post<{ recorded: boolean; visit?: { id: string; createdAt: string } }>("/api/visits", {
        visitorId,
      })
      .then((res) => res.data);
  },

  findAll(params?: ListVisitsParams): Promise<{ visits: Visit[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.country) searchParams.set("country", params.country);
    if (params?.city) searchParams.set("city", params.city);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.offset != null) searchParams.set("offset", String(params.offset));
    const query = searchParams.toString();
    return apiClient
      .get<{ visits: Visit[]; total: number }>(`/api/visits${query ? `?${query}` : ""}`)
      .then((res) => res.data);
  },

  getStats(): Promise<VisitStats> {
    return apiClient.get<VisitStats>("/api/visits/stats").then((res) => res.data);
  },
};

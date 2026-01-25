import { apiClient } from "../config/api.js";
import type { Technology } from "../types/api.js";

export const technologyService = {
  async findAll(): Promise<Technology[]> {
    const response = await apiClient.get<Technology[]>("/api/technologies");
    return response.data;
  },

  async findById(id: string): Promise<Technology> {
    const response = await apiClient.get<Technology>(`/api/technologies/${id}`);
    return response.data;
  },

  async create(data: {
    name: string;
    icon?: string | null;
    category?: string | null;
  }): Promise<Technology> {
    const response = await apiClient.post<Technology>("/api/technologies", data);
    return response.data;
  },

  async update(
    id: string,
    data: {
      name?: string;
      icon?: string | null;
      category?: string | null;
    }
  ): Promise<Technology> {
    const response = await apiClient.put<Technology>(`/api/technologies/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/technologies/${id}`);
  },
};

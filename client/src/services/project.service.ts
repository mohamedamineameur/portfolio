import { apiClient } from "../config/api.js";
import type { Project } from "../types/api.js";

export const projectService = {
  async findAll(published?: boolean): Promise<Project[]> {
    const params = published !== undefined ? { published: String(published) } : {};
    const response = await apiClient.get<Project[]>("/api/projects", { params });
    return response.data;
  },

  async findById(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  async create(data: {
    title: string;
    description: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    published: boolean;
    technologyIds?: number[];
  }): Promise<Project> {
    const response = await apiClient.post<Project>("/api/projects", data);
    return response.data;
  },

  async update(
    id: number,
    data: {
      title?: string;
      description?: string;
      url?: string | null;
      githubUrl?: string | null;
      imageUrl?: string | null;
      published?: boolean;
      technologyIds?: number[];
    }
  ): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/projects/${id}`);
  },
};

import { apiClient } from "../config/api.js";
import type { Project } from "../types/api.js";

export const projectService = {
  async findAll(published?: boolean): Promise<Project[]> {
    const params = published !== undefined ? { published: String(published) } : {};
    const response = await apiClient.get<Project[]>("/api/projects", { params });
    return response.data;
  },

  async findById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  async create(data: {
    titleFr: string;
    titleEn: string;
    descriptionFr: string;
    descriptionEn: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    published: boolean;
    technologyIds?: string[];
  }): Promise<Project> {
    const response = await apiClient.post<Project>("/api/projects", data);
    return response.data;
  },

  async update(
    id: string,
    data: {
      titleFr?: string;
      titleEn?: string;
      descriptionFr?: string;
      descriptionEn?: string;
      url?: string | null;
      githubUrl?: string | null;
      imageUrl?: string | null;
      published?: boolean;
      technologyIds?: string[];
    }
  ): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/projects/${id}`);
  },
};

import { apiClient } from "../config/api.js";
import type { Photo } from "../types/api.js";

export const photoService = {
  async findAll(): Promise<Photo[]> {
    const response = await apiClient.get<Photo[]>("/api/photos");
    return response.data;
  },

  async findById(id: number): Promise<Photo> {
    const response = await apiClient.get<Photo>(`/api/photos/${id}`);
    return response.data;
  },

  async upload(file: File): Promise<Photo> {
    const formData = new FormData();
    formData.append("photo", file);
    // Ne pas forcer "Content-Type" ici: Axios ajoutera automatiquement le boundary requis.
    const response = await apiClient.post<Photo>("/api/photos/upload", formData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/photos/${id}`);
  },
};

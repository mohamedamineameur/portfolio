import { apiClient } from "../config/api.js";
import type { Profile } from "../types/api.js";

export const profileService = {
  async findOne(): Promise<Profile> {
    const response = await apiClient.get<Profile>("/api/profile");
    return response.data;
  },

  async update(data: {
    nom?: string;
    prenom?: string;
    email?: string;
    tel?: string | null;
    linkedIn?: string | null;
    github?: string | null;
    photoId?: string | null;
  }): Promise<Profile> {
    const response = await apiClient.put<Profile>("/api/profile", data);
    return response.data;
  },
};

import { apiClient } from "../config/api.js";
import type { AuthResponse, User } from "../types/api.js";

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  },

  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>("/api/auth/me");
    return response.data;
  },
};

import { apiClient } from "../config/api.js";
import type { Contact } from "../types/api.js";

export const contactService = {
  async create(data: {
    name: string;
    email: string;
    message: string;
  }): Promise<{ message: string; contact: Contact }> {
    const response = await apiClient.post<{ message: string; contact: Contact }>(
      "/api/contacts",
      data
    );
    return response.data;
  },

  async findAll(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>("/api/contacts");
    return response.data;
  },

  async findById(id: string): Promise<Contact> {
    const response = await apiClient.get<Contact>(`/api/contacts/${id}`);
    return response.data;
  },

  async markAsRead(id: string): Promise<Contact> {
    const response = await apiClient.patch<Contact>(`/api/contacts/${id}/read`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/contacts/${id}`);
  },
};

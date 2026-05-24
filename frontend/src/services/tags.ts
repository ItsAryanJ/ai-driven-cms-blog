import { api } from "./api";
import type { TagWithCount, Tag } from "@/types";

export const tagsService = {
  async getAll(): Promise<TagWithCount[]> {
    return api.get<TagWithCount[]>("/tags");
  },

  async create(data: { name: string }): Promise<Tag> {
    return api.post<Tag>("/tags", data);
  },

  async update(id: number, data: { name: string }): Promise<Tag> {
    return api.put<Tag>(`/tags/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
};

import { api } from "./api";
import type { CategoryWithCount, Category } from "@/types";

export const categoriesService = {
  async getAll(): Promise<CategoryWithCount[]> {
    return api.get<CategoryWithCount[]>("/categories");
  },

  async create(data: { name: string }): Promise<Category> {
    return api.post<Category>("/categories", data);
  },

  async update(id: number, data: { name: string }): Promise<Category> {
    return api.put<Category>(`/categories/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

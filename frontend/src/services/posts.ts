import { api } from "./api";
import type {
  Post,
  PostListItem,
  PostCreateData,
  PostUpdateData,
  PaginatedResponse,
  DashboardStats,
} from "@/types";

export const postsService = {
  async getPublished(params?: {
    page?: number;
    page_size?: number;
    category?: string;
    tag?: string;
  }): Promise<PaginatedResponse<PostListItem>> {
    return api.get<PaginatedResponse<PostListItem>>("/posts", params);
  },

  async getBySlug(slug: string): Promise<Post> {
    return api.get<Post>(`/posts/${slug}`);
  },

  async create(data: PostCreateData): Promise<Post> {
    return api.post<Post>("/posts", data);
  },

  async update(id: number, data: PostUpdateData): Promise<Post> {
    return api.put<Post>(`/posts/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async search(params: {
    q: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<PostListItem>> {
    return api.get<PaginatedResponse<PostListItem>>("/search", params);
  },

  async getAdminPosts(params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<PaginatedResponse<PostListItem>> {
    return api.get<PaginatedResponse<PostListItem>>("/admin/posts", params);
  },

  async getById(id: number): Promise<Post> {
    return api.get<Post>(`/admin/posts/${id}`);
  },

  async getDashboard(): Promise<DashboardStats> {
    return api.get<DashboardStats>("/admin/dashboard");
  },
};

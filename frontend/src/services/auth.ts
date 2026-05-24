import { api } from "./api";
import type { User, LoginData } from "@/types";

export const authService = {
  async login(data: LoginData): Promise<User> {
    return api.post<User>("/auth/login", data);
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async getMe(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  async refresh(): Promise<User> {
    return api.post<User>("/auth/refresh");
  },
};

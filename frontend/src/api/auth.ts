import type { UserAuth } from "@/types/auth";
import type { LoginRequest, LoginResponse } from "@/types/user";
import { api } from "./api";

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<{ message: string }>("/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<UserAuth>("/me");
    return response.data;
  },
};

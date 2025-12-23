import type {
  ChangePasswordRequest,
  ListUsersRequest,
  PaginatedUsersResponse,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from "@/types/user";
import { api } from "./api";

export const userApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<{ message: string }>("/register", data);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await api.put<{
      message: string;
    }>("/profile", data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await api.post<{ message: string }>(
      "/change-password",
      data,
    );
    return response.data;
  },

  listUsers: async (params: ListUsersRequest) => {
    const response = await api.get<PaginatedUsersResponse>("/users", {
      params,
    });
    return response.data;
  },

  getUser: async (username: string) => {
    const response = await api.get<User>(`/users/${username}`);
    return response.data;
  },
};

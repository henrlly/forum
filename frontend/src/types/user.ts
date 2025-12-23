import type z from "zod";
import type {
  changePasswordSchema,
  listUsersRequestSchema,
  listUsersSearchParamsSchema,
  loginSchema,
  newPasswordFormSchema,
  profileSchema,
  registerFormSchema,
  registerSchema,
  usersSortValueSchema,
} from "@/schema/users";

export interface User {
  id: number;
  username: string;
  email: string;
  karma: number;
  created_at: string;
}

export type UsersSortValue = z.infer<typeof usersSortValueSchema>;

export type ListUsersSearchParams = z.infer<typeof listUsersSearchParamsSchema>;

export type ListUsersRequest = z.infer<typeof listUsersRequestSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type UpdateProfileRequest = z.infer<typeof profileSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

export type RegisterForm = z.infer<typeof registerFormSchema>;
export type ChangePasswordForm = z.infer<typeof newPasswordFormSchema>;

export interface PaginatedUsersResponse {
  users: User[];
  count: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
}

import type { UsersSortValue } from "@/types/user";

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 100;

export const PASSWORD_HELPER_TEXT = `Choose a strong password (at least ${MIN_PASSWORD_LENGTH} characters)`;

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 20;

export const USERNAME_HELPER_TEXT = `Your unique username (${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters, letters, numbers, and underscores only)`;

export const USERS_PER_PAGE = 9;

interface UsersSortOption {
  value: UsersSortValue;
  label: string;
}

export const USERS_SORT_OPTIONS: UsersSortOption[] = [
  { value: { sort: "created_at", order_by: "desc" }, label: "Newest" },
  { value: { sort: "created_at", order_by: "asc" }, label: "Oldest" },
  { value: { sort: "karma", order_by: "desc" }, label: "Top (Karma)" },
];

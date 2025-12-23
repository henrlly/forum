import type { PostsSortValue } from "@/types/post";

export const POSTS_PER_PAGE = 10;
export const POST_SUMMARY_LENGTH = 400; // sync with backend

export const POST_TRUNCATE_LENGTH_THRESHOLD = 1000; // sync with backend

export const MAX_POST_TITLE_LENGTH = 500;
export const MAX_POST_CONTENT_LENGTH = 10_000;

interface PostsSortOption {
  value: PostsSortValue;
  label: string;
}

export const POSTS_SORT_OPTIONS: PostsSortOption[] = [
  { value: { sort: "created_at", order_by: "desc" }, label: "Newest" },
  { value: { sort: "created_at", order_by: "asc" }, label: "Oldest" },
  { value: { sort: "score", order_by: "desc" }, label: "Top (Upvotes)" },
  {
    value: { sort: "no_of_comments", order_by: "desc" },
    label: "Top (Comments)",
  },
];

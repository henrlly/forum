import type { CommentsSortValue } from "@/types/comment";

export const COMMENTS_PER_PAGE = 10;
export const COMMENT_SUMMARY_LENGTH = 400; // sync with backend

export const MAX_COMMENT_CONTENT_LENGTH = 10_000;

interface CommentsSortOption {
  value: CommentsSortValue;
  label: string;
}

export const COMMENTS_SORT_OPTIONS: CommentsSortOption[] = [
  { value: { sort: "created_at", order_by: "desc" }, label: "Newest" },
  { value: { sort: "created_at", order_by: "asc" }, label: "Oldest" },
  { value: { sort: "score", order_by: "desc" }, label: "Top (Upvotes)" },
];

export const POST_COMMENTS_SORT_OPTIONS: CommentsSortOption[] = [
  { value: { sort: "score", order_by: "desc" }, label: "Top (Upvotes)" },
  { value: { sort: "created_at", order_by: "desc" }, label: "Newest" },
];

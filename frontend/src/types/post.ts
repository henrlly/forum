import type { z } from "zod";
import type {
  createPostSchema,
  listPostsRequestSchema,
  listPostsSearchParamsSchema,
  postsSortValueSchema,
  updatePostSchema,
} from "@/schema/posts";

export interface Post {
  id: number;
  topic_id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  pinned_comment_id: number | null;
  score: number;
  no_of_comments: number;
  is_deleted: boolean;
  deleted_at: string | null;
  my_vote: number;
  topic_name: string;
  username: string;
}

export type PostsSortValue = z.infer<typeof postsSortValueSchema>;

export type ListPostsSearchParams = z.infer<typeof listPostsSearchParamsSchema>;

export type ListPostsRequest = z.infer<typeof listPostsRequestSchema>;
export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;

export type VotePostRequest = {
  vote_value: -1 | 0 | 1;
};

export type PinCommentRequest = {
  comment_id: number | null;
};

export interface PaginatedPostsResponse {
  posts: Post[];
  count: number;
}

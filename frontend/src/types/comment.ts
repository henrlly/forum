import type { z } from "zod";
import type {
  commentsSortValueSchema,
  createCommentSchema,
  listCommentsRequestSchema,
  listCommentsSearchParamsSchema,
  updateCommentSchema,
} from "@/schema/comments";

export interface Comment {
  id: number;
  post_id: number;
  summary: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  score: number;
  parent_id: number | null;
  path: string;
  no_of_replies: number;
  is_deleted: boolean;
  deleted_at: string | null;
  my_vote: number;
  username: string;
  topic_name: string;
  post_title?: string;
  has_long_content?: boolean;
}

export type CommentsSortValue = z.infer<typeof commentsSortValueSchema>;

export type ListCommentsSearchParams = z.infer<
  typeof listCommentsSearchParamsSchema
>;

export type ListCommentsRequest = z.infer<typeof listCommentsRequestSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
export type UpdateCommentRequest = z.infer<typeof updateCommentSchema>;

export type VoteCommentRequest = {
  vote_value: -1 | 0 | 1;
};

export interface PaginatedCommentsResponse {
  comments: Comment[];
  count: number;
}

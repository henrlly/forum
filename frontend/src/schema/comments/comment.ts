import { z } from "zod";
import { MAX_COMMENT_CONTENT_LENGTH } from "@/constants/comments";

export const commentContentSchema = z
  .string()
  .min(1, "Content is required")
  .max(
    MAX_COMMENT_CONTENT_LENGTH,
    `Content must be less than ${MAX_COMMENT_CONTENT_LENGTH.toLocaleString()} characters`,
  );

export const createCommentSchema = z.object({
  post_id: z.number().min(1, "Post ID is required"),
  content: commentContentSchema,
  parent_id: z.number().nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: commentContentSchema,
});

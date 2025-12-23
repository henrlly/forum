import { z } from "zod";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "@/constants/posts";

export const postTitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(
    MAX_POST_TITLE_LENGTH,
    `Title must be less than ${MAX_POST_TITLE_LENGTH.toLocaleString()} characters`,
  );

export const postContentSchema = z
  .string()
  .max(
    MAX_POST_CONTENT_LENGTH,
    `Content must be less than ${MAX_POST_CONTENT_LENGTH.toLocaleString()} characters`,
  );

export const createPostSchema = z.object({
  topic_id: z.number().min(1, "Topic is required"),
  title: postTitleSchema,
  content: postContentSchema,
});

export const updatePostSchema = z.object({
  title: postTitleSchema,
  content: postContentSchema,
});

import { z } from "zod";
import { COMMENTS_PER_PAGE, COMMENTS_SORT_OPTIONS } from "@/constants/comments";
import { extraSearchParams } from "@/schema/searchParams";

const commentsSortValueObject = {
  sort: z.enum(["score", "created_at"]),
  order_by: z.enum(["asc", "desc"]),
};

export const commentsSortValueSchema = z.object(commentsSortValueObject);

export const listCommentsSearchParamsSchema = z
  .object({
    sort: commentsSortValueObject.sort.catch(
      COMMENTS_SORT_OPTIONS[0].value.sort,
    ),
    order_by: commentsSortValueObject.order_by.catch(
      COMMENTS_SORT_OPTIONS[0].value.order_by,
    ),
    ...extraSearchParams,
  })
  .partial();

export const listCommentsRequestSchema = z
  .object({
    ...commentsSortValueObject,
    ...extraSearchParams,
    post_id: z.coerce.number().positive(),
    user_id: z.coerce.number().positive(),
    parent_id: z.coerce.number().positive(),
    only_top_level: z.boolean(),
    show_deleted_comments: z.boolean(),
    show_post_title: z.boolean(),
    page_size: z.coerce.number().nonnegative(), // Allow 0 for fetching all comments
  })
  .partial()
  .transform((data) => ({
    ...data,
    page: data.page ?? 1,
    page_size: data.page_size ?? COMMENTS_PER_PAGE,
    sort: data.sort ?? COMMENTS_SORT_OPTIONS[0].value.sort,
    order_by: data.order_by ?? COMMENTS_SORT_OPTIONS[0].value.order_by,
    only_top_level: false,
  }));

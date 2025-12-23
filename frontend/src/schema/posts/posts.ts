import { z } from "zod";
import { POSTS_PER_PAGE, POSTS_SORT_OPTIONS } from "@/constants/posts";
import { extraSearchParams } from "@/schema/searchParams";

const postsSortValueObject = {
  sort: z.enum(["score", "no_of_comments", "created_at"]),
  order_by: z.enum(["asc", "desc"]),
};

export const postsSortValueSchema = z.object(postsSortValueObject);

export const listPostsSearchParamsSchema = z
  .object({
    sort: postsSortValueObject.sort.catch(POSTS_SORT_OPTIONS[0].value.sort),
    order_by: postsSortValueObject.order_by.catch(
      POSTS_SORT_OPTIONS[0].value.order_by,
    ),
    ...extraSearchParams,
  })
  .partial();

export const listPostsRequestSchema = z
  .object({
    ...postsSortValueObject,
    ...extraSearchParams,
    topic_id: z.coerce.number().positive(),
    user_id: z.coerce.number(),
    filter_following_topics: z.boolean(),
  })
  .partial()
  .transform((data) => ({
    ...data,
    page: data.page ?? 1,
    page_size: POSTS_PER_PAGE,
    sort: data.sort ?? POSTS_SORT_OPTIONS[0].value.sort,
    order_by: data.order_by ?? POSTS_SORT_OPTIONS[0].value.order_by,
  }));

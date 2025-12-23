import { z } from "zod";
import { TOPICS_PER_PAGE, TOPICS_SORT_OPTIONS } from "@/constants/topics";
import { extraSearchParams } from "@/schema/searchParams";

const topicsSortValueObject = {
  sort: z.enum(["name", "no_of_posts", "no_of_followers"]),
  order_by: z.enum(["asc", "desc"]),
};

export const topicsSortValueSchema = z.object(topicsSortValueObject);

export const listTopicsSearchParamsSchema = z
  .object({
    sort: topicsSortValueObject.sort.catch(TOPICS_SORT_OPTIONS[0].value.sort),
    order_by: topicsSortValueObject.order_by.catch(
      TOPICS_SORT_OPTIONS[0].value.order_by,
    ),
    ...extraSearchParams,
    filter_following: z
      .boolean()
      .transform((val) => (val === false ? undefined : val))
      .optional(),
  })
  .partial();

export const listTopicsRequestSchema = listTopicsSearchParamsSchema.transform(
  (data) => ({
    ...data,
    page: data.page ?? 1,
    page_size: TOPICS_PER_PAGE,
    sort: data.sort ?? TOPICS_SORT_OPTIONS[0].value.sort,
    order_by: data.order_by ?? TOPICS_SORT_OPTIONS[0].value.order_by,
  }),
);

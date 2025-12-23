import { z } from "zod";
import { USERS_PER_PAGE, USERS_SORT_OPTIONS } from "@/constants/users";
import { extraSearchParams } from "@/schema/searchParams";

const usersSortValueObject = {
  sort: z.enum(["karma", "created_at"]),
  order_by: z.enum(["asc", "desc"]),
};

export const usersSortValueSchema = z.object(usersSortValueObject);

export const listUsersSearchParamsSchema = z
  .object({
    sort: usersSortValueObject.sort.catch(USERS_SORT_OPTIONS[0].value.sort),
    order_by: usersSortValueObject.order_by.catch(
      USERS_SORT_OPTIONS[0].value.order_by,
    ),
    ...extraSearchParams,
  })
  .partial();

export const listUsersRequestSchema = listUsersSearchParamsSchema.transform(
  (data) => ({
    ...data,
    page: data.page ?? 1,
    page_size: USERS_PER_PAGE,
    sort: data.sort ?? USERS_SORT_OPTIONS[0].value.sort,
    order_by: data.order_by ?? USERS_SORT_OPTIONS[0].value.order_by,
  }),
);

import { z } from "zod";

export const extraSearchParams = {
  page: z.coerce
    .number()
    .positive()
    .transform((val) => (val === 1 ? undefined : val))
    .optional()
    .catch(undefined),
  search: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .catch(undefined),
};

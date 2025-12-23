import type { SortOption } from "@/components/List";

export interface GetSortOptionParams {
  options: SortOption[];
  sort?: string;
  order_by?: string;
}

export function getSortOption({
  options,
  sort,
  order_by,
}: GetSortOptionParams): number {
  const index = options.findIndex(
    (option) =>
      option.value.sort === sort && option.value.order_by === order_by,
  );
  return index !== -1 ? index : 0;
}

import type { QueryClient } from "@tanstack/react-query";

export interface MutateParams<T> {
  queryClient: QueryClient;
  itemName: string;
  itemKey: number | string;
  mutateFn: (item: T) => T;
}

export function mutateCache<T>({
  queryClient,
  itemName,
  itemKey,
  mutateFn,
}: MutateParams<T>) {
  const itemNamePlural = `${itemName}s`;

  queryClient.setQueryData<T[]>([itemName], (oldItems) => {
    if (!oldItems) return oldItems;
    return oldItems.map((item) => mutateFn(item));
  });

  queryClient.setQueryData<T>([itemName, itemKey], (oldItem) => {
    if (!oldItem) return oldItem;
    return mutateFn(oldItem);
  });

  queryClient.setQueriesData<{ [itemNamePlural]: T[]; count: number }>(
    { queryKey: [itemNamePlural] },
    (oldData) => {
      if (
        !oldData?.[itemNamePlural] ||
        typeof oldData?.[itemNamePlural] === "number"
      )
        return oldData;
      return {
        ...oldData,
        [itemNamePlural]: oldData?.[itemNamePlural].map((item) =>
          mutateFn(item),
        ),
      };
    },
  );
  return;
}

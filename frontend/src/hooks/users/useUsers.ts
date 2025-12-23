import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { ListUsersRequest } from "@/types/user";

export function useUsers(queryParams: ListUsersRequest) {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => userApi.listUsers(queryParams),
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

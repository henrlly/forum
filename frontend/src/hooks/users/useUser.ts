import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";

export function useUser(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => userApi.getUser(username),
    enabled: !!username,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

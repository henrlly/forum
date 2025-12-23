import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/api/comment";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { ListCommentsRequest } from "@/types/comment";

export function useComments(queryParams: ListCommentsRequest) {
  return useQuery({
    queryKey: ["comments", queryParams],
    queryFn: () => commentApi.listComment(queryParams),
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

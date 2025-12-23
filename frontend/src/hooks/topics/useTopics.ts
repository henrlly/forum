import { useQuery } from "@tanstack/react-query";
import { topicApi } from "@/api/topic";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { ListTopicsRequest } from "@/types/topic";

export function useTopics(queryParams: ListTopicsRequest) {
  return useQuery({
    queryKey: ["topics", queryParams],
    queryFn: () => topicApi.listTopics(queryParams),
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

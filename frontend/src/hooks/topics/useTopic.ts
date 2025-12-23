import { useQuery } from "@tanstack/react-query";
import { topicApi } from "@/api/topic";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";

export function useTopic(topicSlug: string) {
  return useQuery({
    queryKey: ["topic", topicSlug],
    queryFn: () => topicApi.getTopic(topicSlug),
    enabled: !!topicSlug,
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

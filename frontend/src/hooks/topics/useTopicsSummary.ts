import { useQuery } from "@tanstack/react-query";
import { topicApi } from "@/api/topic";
import { TOPIC_SUMMARY_QUERY_STALE_TIME } from "@/constants/query";

export function useTopicsSummary() {
  return useQuery({
    queryKey: ["topics-summary"],
    queryFn: () => topicApi.listTopicsSummary(),
    staleTime: TOPIC_SUMMARY_QUERY_STALE_TIME,
  });
}

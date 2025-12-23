import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/api/comment";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { UseItemParams } from "@/types/hook";

export function useComment({
  id,
  isEnabled = true,
  staleTime = DEFAULT_QUERY_STALE_TIME,
}: UseItemParams) {
  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => commentApi.getComment(id),
    enabled: isEnabled && !!id,
    staleTime: staleTime,
  });
}

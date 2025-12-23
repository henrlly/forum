import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/api/post";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { UseItemParams } from "@/types/hook";

export function usePost({
  id,
  isEnabled = true,
  staleTime = DEFAULT_QUERY_STALE_TIME,
}: UseItemParams) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postApi.getPost(id),
    staleTime: staleTime,
    enabled: isEnabled && !!id,
  });
}

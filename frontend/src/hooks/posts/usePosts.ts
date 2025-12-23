import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/api/post";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import type { ListPostsRequest } from "@/types/post";

export function usePosts(queryParams: ListPostsRequest) {
  return useQuery({
    queryKey: ["posts", queryParams],
    queryFn: () => postApi.listPosts(queryParams),
    staleTime: DEFAULT_QUERY_STALE_TIME,
  });
}

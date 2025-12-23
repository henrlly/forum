import { Container, Stack } from "@mui/material";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { UserTabs } from "@/components/common/UserTabs";
import type { ChipData } from "@/components/List";
import { List, ListHeader } from "@/components/List";
import { PostCard } from "@/components/posts/PostCard";
import { POSTS_PER_PAGE, POSTS_SORT_OPTIONS } from "@/constants/posts";
import { usePosts } from "@/hooks/posts";
import { useDebounce } from "@/hooks/utils";
import { listPostsRequestSchema } from "@/schema/posts";
import type { ListPostsRequest } from "@/types/post";

export interface PostsPageProps {
  routePath:
    | "/posts/all"
    | "/posts/following"
    | "/topics/$topicSlug"
    | "/users/$username/posts";
  routePathId:
    | "/posts/all"
    | "/_authenticated/posts/following"
    | "/topics/$topicSlug/"
    | "/users/$username/posts";
  title?: string;
  subtitle?: string;
  showNewPostButton?: boolean;
  topicId?: number;
  searchPlaceholder?: string;
  extraPostFilters?: Partial<ListPostsRequest>;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  isFollowLoading?: boolean;
  onFollowToggle?: () => void;
  chips?: ChipData[];
  showUserTabs?: boolean;
}

export function PostsPage({
  routePath,
  routePathId,
  title = "Posts",
  subtitle = "Browse all posts in the community",
  showNewPostButton = true,
  topicId,
  searchPlaceholder = "Search all posts...",
  extraPostFilters = {},
  showFollowButton = false,
  isFollowing = false,
  isFollowLoading = false,
  onFollowToggle,
  chips,
  showUserTabs = false,
}: PostsPageProps) {
  const { page, search, sort, order_by } = useSearch({
    from: routePathId,
  });

  const debouncedSearch = useDebounce(search);

  const usePostsParams = useMemo(
    () =>
      listPostsRequestSchema.parse({
        page,
        search: debouncedSearch,
        sort,
        order_by,
        ...extraPostFilters,
      }),
    [page, debouncedSearch, sort, order_by, extraPostFilters],
  );

  const { data, isLoading, error } = usePosts(usePostsParams);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="column" spacing={3}>
        <ListHeader
          routePath={routePath}
          title={title}
          subtitle={subtitle}
          searchValue={search}
          searchProps={{ placeholder: searchPlaceholder }}
          sortOptions={POSTS_SORT_OPTIONS}
          sort={sort}
          order_by={order_by}
          showNewPostButton={showNewPostButton}
          topicId={topicId}
          showFollowButton={showFollowButton}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          onFollowToggle={onFollowToggle}
          chips={chips}
        />

        {showUserTabs && <UserTabs tabSelected="posts" />}

        <List
          listName="posts"
          ItemComponent={PostCard}
          items={data?.posts}
          isLoading={isLoading}
          error={error?.message}
          page={page}
          totalCount={data?.count}
          pageSize={POSTS_PER_PAGE}
          routePath={routePath}
        />
      </Stack>
    </Container>
  );
}

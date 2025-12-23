import { Container, Stack } from "@mui/material";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { CommentCard } from "@/components/comment/CommentCard";
import { UserTabs } from "@/components/common/UserTabs";
import type { ChipData } from "@/components/List";
import { List, ListHeader } from "@/components/List";
import { COMMENTS_PER_PAGE, COMMENTS_SORT_OPTIONS } from "@/constants/comments";
import { useComments } from "@/hooks/comments";
import { useDebounce } from "@/hooks/utils";
import { listCommentsRequestSchema } from "@/schema/comments";
import type { ListCommentsRequest } from "@/types/comment";

export interface CommentsPageProps {
  routePath: "/comments" | "/users/$username/comments";
  routePathId: "/comments/" | "/users/$username/comments";
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  extraCommentFilters?: Partial<ListCommentsRequest>;
  chips?: ChipData[];
  showUserTabs?: boolean;
}

export function CommentsPage({
  routePath,
  routePathId,
  title = "Comments",
  subtitle = "Browse comments in the community",
  searchPlaceholder = "Search comments...",
  extraCommentFilters = {},
  chips,
  showUserTabs = false,
}: CommentsPageProps) {
  const { page, search, sort, order_by } = useSearch({
    from: routePathId,
  });

  const debouncedSearch = useDebounce(search);

  const useCommentsParams = useMemo(
    () =>
      listCommentsRequestSchema.parse({
        page,
        search: debouncedSearch,
        sort,
        order_by,
        only_top_level: false,
        show_post_title: true,
        ...extraCommentFilters,
      }),
    [page, debouncedSearch, sort, order_by, extraCommentFilters],
  );

  const { data, isLoading, error } = useComments(useCommentsParams);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="column" spacing={3}>
        <ListHeader
          routePath={routePath}
          title={title}
          subtitle={subtitle}
          searchValue={search}
          searchProps={{ placeholder: searchPlaceholder }}
          sort={sort}
          order_by={order_by}
          sortOptions={COMMENTS_SORT_OPTIONS}
          showNewPostButton={false}
          chips={chips}
        />

        {showUserTabs && <UserTabs tabSelected="comments" />}

        <List
          routePath={routePath}
          listName="comments"
          ItemComponent={CommentCard}
          items={data?.comments}
          isLoading={isLoading}
          error={error?.message || null}
          page={page}
          totalCount={data?.count}
          pageSize={COMMENTS_PER_PAGE}
          isGrid={false}
        />
      </Stack>
    </Container>
  );
}

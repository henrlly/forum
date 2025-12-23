import { Container, Stack } from "@mui/material";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { List, ListHeader } from "@/components/List";
import { TopicCard } from "@/components/topics/TopicCard";
import { TOPICS_PER_PAGE, TOPICS_SORT_OPTIONS } from "@/constants/topics";
import { useAuth } from "@/contexts/AuthContext";
import { useTopics } from "@/hooks/topics";
import { useDebounce } from "@/hooks/utils";
import {
  listTopicsRequestSchema,
  listTopicsSearchParamsSchema,
} from "@/schema/topics";
import type { ListTopicsSearchParams } from "@/types/topic";

export const Route = createFileRoute("/topics/")({
  component: TopicsPage,
  validateSearch: (search): ListTopicsSearchParams =>
    listTopicsSearchParamsSchema.parse(search),
});

function TopicsPage() {
  const { page, search, sort, order_by, filter_following } = useSearch({
    from: "/topics/",
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate({ from: "/topics" });

  useEffect(() => {
    if (!isAuthenticated && filter_following !== undefined) {
      navigate({
        search: ({ filter_following, ...rest }) => rest,
        replace: true,
      });
    }
  }, [isAuthenticated, filter_following, navigate]);

  const debouncedSearch = useDebounce(search);

  const useTopicsParams = useMemo(
    () =>
      listTopicsRequestSchema.parse({
        page,
        search: debouncedSearch,
        sort,
        order_by,
        filter_following,
      }),
    [page, debouncedSearch, sort, order_by, filter_following],
  );

  const { data, isLoading, error } = useTopics(useTopicsParams);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="column" spacing={3}>
        <ListHeader
          routePath="/topics"
          title="Topics"
          subtitle="Discover and explore community topics"
          searchValue={search}
          searchProps={{ placeholder: "Search topics..." }}
          sortOptions={TOPICS_SORT_OPTIONS}
          sort={sort}
          order_by={order_by}
          showNewPostButton={true}
          filterLabel="Show Only Following"
          filterValue={filter_following ?? false}
          filterKey={isAuthenticated ? "filter_following" : undefined}
        />
        <List
          routePath="/topics"
          listName="topics"
          ItemComponent={TopicCard}
          items={data?.topics}
          isLoading={isLoading}
          error={error?.message || null}
          page={page}
          totalCount={data?.count}
          pageSize={TOPICS_PER_PAGE}
          isGrid={true}
        />
      </Stack>
    </Container>
  );
}

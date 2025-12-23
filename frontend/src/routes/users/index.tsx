import { Container, Stack } from "@mui/material";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { List, ListHeader } from "@/components/List";
import { UserCard } from "@/components/users/UserCard";
import { USERS_PER_PAGE, USERS_SORT_OPTIONS } from "@/constants/users";
import { useUsers } from "@/hooks/users";
import { useDebounce } from "@/hooks/utils";
import {
  listUsersRequestSchema,
  listUsersSearchParamsSchema,
} from "@/schema/users";
import type { ListUsersSearchParams } from "@/types/user";

export const Route = createFileRoute("/users/")({
  component: UsersPage,
  validateSearch: (search): ListUsersSearchParams =>
    listUsersSearchParamsSchema.parse(search),
});

function UsersPage() {
  const { page, search, sort, order_by } = useSearch({
    from: "/users/",
  });

  const debouncedSearch = useDebounce(search);

  const useUsersParams = useMemo(
    () =>
      listUsersRequestSchema.parse({
        page,
        search: debouncedSearch,
        sort,
        order_by,
      }),
    [page, debouncedSearch, sort, order_by],
  );

  const { data, isLoading, error } = useUsers(useUsersParams);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack direction="column" spacing={3}>
        <ListHeader
          routePath="/users"
          title="Users"
          subtitle="Browse community members"
          searchValue={search || ""}
          searchProps={{ placeholder: "Search users..." }}
          sortOptions={USERS_SORT_OPTIONS}
          sort={sort}
          order_by={order_by}
          showNewPostButton={false}
        />
        <List
          routePath="/users"
          listName="users"
          ItemComponent={UserCard}
          items={data?.users}
          isLoading={isLoading}
          error={error?.message || null}
          page={page}
          totalCount={data?.count}
          pageSize={USERS_PER_PAGE}
          isGrid={true}
        />
      </Stack>
    </Container>
  );
}

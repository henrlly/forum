import { Alert, Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Loading } from "@/components/common/Loading";
import type { ListPageRoutes } from "@/types/route";
import { Pagination } from ".";

interface ListProps<T> {
  listName: string;
  ItemComponent: ({ item }: { item: T }) => ReactNode;
  items?: T[];
  page?: number;
  pageSize: number;
  totalCount?: number;
  isLoading?: boolean;
  error?: string | null;
  isGrid?: boolean;
  itemProps?: Record<string, unknown>;
  routePath: ListPageRoutes;
}

export function List<T extends { id: number }>({
  listName,
  ItemComponent,
  items,
  isLoading,
  error,
  page,
  pageSize,
  totalCount,
  isGrid = false,
  itemProps = {},
  routePath,
}: ListProps<T>) {
  if (isLoading) {
    return <Loading loadingText={`Loading ${listName}...`} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load {listName}: {error}
      </Alert>
    );
  }

  if (items?.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={6}>
        No {listName} found.
      </Typography>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      {isGrid ? (
        // MUI Grid component overrides ItemComponent card styling
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
        >
          {items?.map((item) => (
            <ItemComponent key={item.id} item={item} {...itemProps} />
          ))}
        </Box>
      ) : (
        <Stack spacing={2}>
          {items?.map((item) => (
            <ItemComponent key={item.id} item={item} {...itemProps} />
          ))}
        </Stack>
      )}

      <Pagination
        itemName={listName}
        currentPage={page}
        totalItems={totalCount ?? 0}
        itemsPerPage={pageSize}
        routePath={routePath}
      />
    </Stack>
  );
}

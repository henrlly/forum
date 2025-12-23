import {
  Pagination as MuiPagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { ListPageRoutes } from "@/types/route";

interface PaginationProps {
  currentPage?: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
  routePath: ListPageRoutes;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  itemName,
  routePath,
}: PaginationProps) {
  currentPage = currentPage && currentPage > 0 ? currentPage : 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (!currentPage) {
    return null;
  }

  return (
    <Stack direction="column" alignItems="center" spacing={2} py={2} px={1}>
      <Typography
        variant={"body2"}
        color="text.secondary"
        textAlign="center"
        fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
        whiteSpace="normal"
        overflow="visible"
        textOverflow="clip"
      >
        {startItem} - {endItem} of {totalItems} {itemName}
      </Typography>

      {totalPages > 1 && (
        <MuiPagination
          count={totalPages}
          page={currentPage}
          renderItem={(item) => (
            <Link
              from={routePath}
              search={(old) => ({
                ...old,
                page: item.page ?? undefined,
              })}
            >
              <PaginationItem {...item} />
            </Link>
          )}
          color="primary"
        />
      )}
    </Stack>
  );
}

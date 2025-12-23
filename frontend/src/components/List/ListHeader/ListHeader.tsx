import { Add, PersonAdd, PersonRemove } from "@mui/icons-material";
import { Button, type ButtonProps, Collapse, Stack } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FormSubmitButton } from "@/components/common/form";
import type { FilterProps, SearchProps, SortProps } from "@/components/List";
import {
  ControlsSummary,
  ControlsViewToggle,
  Filter,
  Search,
  Sort,
} from "@/components/List";
import type { CommentsSortValue } from "@/types/comment";
import type { PostsSortValue } from "@/types/post";
import type { ListPageRoutes } from "@/types/route";
import type { TopicsSortValue } from "@/types/topic";
import type { UsersSortValue } from "@/types/user";
import { getSortOption } from "@/utils/sort";
import type { ChipData } from ".";
import { ListHeaderContent } from ".";

export interface ListHeaderProps {
  routePath: ListPageRoutes;

  title?: string;
  subtitle?: string;
  chips?: ChipData[];

  searchValue?: string;
  onSearchChange?: (value: string) => void;

  onSortChange?: (value: number) => void;
  sortOptions: {
    label: string;
    value:
      | PostsSortValue
      | CommentsSortValue
      | TopicsSortValue
      | UsersSortValue;
  }[];
  sort?:
    | PostsSortValue["sort"]
    | CommentsSortValue["sort"]
    | TopicsSortValue["sort"]
    | UsersSortValue["sort"];
  order_by?:
    | PostsSortValue["order_by"]
    | CommentsSortValue["order_by"]
    | TopicsSortValue["order_by"]
    | UsersSortValue["order_by"];

  filterValue?: boolean;
  filterKey?: "filter_following";
  onFilterChange?: (value: boolean) => void;
  filterLabel?: string;

  searchProps?: Partial<SearchProps>;
  sortProps?: Partial<SortProps>;
  filterProps?: Partial<FilterProps>;

  showNewPostButton?: boolean;
  newPostButtonProps?: Partial<ButtonProps>;
  topicId?: number;

  showFollowButton?: boolean;
  followButtonProps?: Partial<ButtonProps>;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  isFollowLoading?: boolean;

  defaultExpanded?: boolean;
}

export function ListHeader({
  routePath,
  title,
  subtitle,
  chips,
  searchValue,
  onSearchChange,
  onSortChange,
  sortOptions,
  sort,
  order_by,
  filterValue,
  onFilterChange,
  filterLabel,
  filterKey,
  searchProps,
  sortProps,
  filterProps,
  showNewPostButton = false,
  newPostButtonProps = {},
  topicId,
  showFollowButton = false,
  followButtonProps = {},
  isFollowing,
  onFollowToggle,
  isFollowLoading,
  defaultExpanded = false,
}: ListHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const navigate = useNavigate({ from: routePath });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleClick = () => {
    setIsExpanded(false);
  };

  const activeControlsCount = useMemo(() => {
    let count = 1;
    if (searchValue) count += 1;
    if (filterValue) count += 1;
    return count;
  }, [searchValue, filterValue]);

  const handleSearchChange = (searchValue: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: searchValue || undefined,
        page: 1,
      }),
      replace: true,
    });
    onSearchChange?.(searchValue);
  };

  const handleSortChange = (sortValue: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: sortOptions[sortValue].value.sort,
        order_by: sortOptions[sortValue].value.order_by,
        page: 1,
      }),
    });
    onSortChange?.(sortValue);
  };

  const handleFilterChange = (filterValue: boolean) => {
    if (!filterLabel || !filterKey || filterValue === undefined) return;
    navigate({
      search: (prev) => ({
        ...prev,
        [filterKey]: filterValue || undefined,
        page: 1,
      }),
    });
    onFilterChange?.(filterValue);
  };

  const sortValue = getSortOption({
    options: sortOptions,
    sort,
    order_by,
  });

  const headerActions = (
    <Stack
      direction="column"
      alignItems="flex-end"
      spacing={1}
      position="relative"
      height={56}
    >
      {/* Follow (topic) Button */}
      {showFollowButton && (
        <FormSubmitButton
          onClick={onFollowToggle}
          variant={isFollowing ? "outlined" : "contained"}
          size="small"
          isSubmitting={isFollowLoading}
          color="secondary"
          startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
          removeSx={true}
          fullWidth={false}
          {...followButtonProps}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </FormSubmitButton>
      )}

      {/* Create New Post Button */}
      {showNewPostButton && (
        <Link to="/posts/new" search={{ topic: topicId }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            color="primary"
            {...newPostButtonProps}
            sx={{ minWidth: 120, ...newPostButtonProps.sx }}
          >
            New Post
          </Button>
        </Link>
      )}

      {/* Expand/Collapse Filters Toggle */}
      <ControlsViewToggle
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
        activeControlsCount={activeControlsCount}
      />

      {/* Filter Summary Chips */}
      <ControlsSummary
        searchValue={searchValue}
        sortValueLabel={sortOptions[sortValue].label}
        filterValue={filterValue}
        filterValueLabel={filterLabel}
        isVisible={!isExpanded}
      />
    </Stack>
  );

  return (
    <Stack direction="column" p={3} spacing={3}>
      {/* Title, Subtitle, and Actions */}
      <ListHeaderContent
        onTitleClick={handleTitleClick}
        title={title}
        subtitle={subtitle}
        chips={chips}
        actions={headerActions}
      />

      {/* Expandable Controls */}
      <Collapse in={isExpanded} timeout={300} unmountOnExit={false}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Search
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            {...searchProps}
          />

          <Sort
            sortValue={sortValue}
            onSortChange={handleSortChange}
            sortOptions={sortOptions}
            {...sortProps}
          />

          {filterValue !== undefined && filterKey && filterLabel && (
            <Filter
              filterValue={filterValue}
              onFilterChange={handleFilterChange}
              filterLabel={filterLabel}
              {...filterProps}
            />
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}

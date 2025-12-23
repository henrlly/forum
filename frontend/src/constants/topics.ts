import type { TopicsSortValue } from "@/types/topic";

export const TOPICS_PER_PAGE = 9;

interface TopicsSortOption {
  value: TopicsSortValue;
  label: string;
}

export const TOPICS_SORT_OPTIONS: TopicsSortOption[] = [
  { value: { sort: "name", order_by: "asc" }, label: "Name (A-Z)" },
  { value: { sort: "name", order_by: "desc" }, label: "Name (Z-A)" },
  {
    value: { sort: "no_of_followers", order_by: "desc" },
    label: "Top (Followers)",
  },
  { value: { sort: "no_of_posts", order_by: "desc" }, label: "Top (Posts)" },
];

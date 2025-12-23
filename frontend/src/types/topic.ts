import type z from "zod";
import type {
  listTopicsRequestSchema,
  listTopicsSearchParamsSchema,
  topicsSortValueSchema,
} from "@/schema/topics";

export interface Topic {
  id: number;
  name: string;
  description: string;
  no_of_posts: number;
  no_of_followers: number;
  is_following: boolean;
}

export type TopicsSortValue = z.infer<typeof topicsSortValueSchema>;

export type ListTopicsSearchParams = z.infer<typeof listTopicsSearchParamsSchema>;

export type ListTopicsRequest = z.infer<typeof listTopicsRequestSchema>;

export type FollowTopicRequest = {
  topic_slug: string;
  is_follow: boolean;
};

export interface PaginatedTopicsResponse {
  topics: Topic[];
  count: number;
}

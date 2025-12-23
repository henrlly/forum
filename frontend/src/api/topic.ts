import type {
  FollowTopicRequest,
  ListTopicsRequest,
  PaginatedTopicsResponse,
  Topic,
} from "@/types/topic";
import { api } from "./api";

export const topicApi = {
  follow: async (data: FollowTopicRequest) => {
    const response = await api.post<{ message: string }>(
      `/topics/${data.topic_slug}/follow`,
      { is_follow: data.is_follow },
    );
    return response.data;
  },

  listTopics: async (params: ListTopicsRequest) => {
    const response = await api.get<PaginatedTopicsResponse>("/topics", {
      params,
    });
    return response.data;
  },

  listTopicsSummary: async () => {
    const response = await api.get<Topic[]>("/topics-summary");
    return response.data;
  },

  getTopic: async (topicSlug: string) => {
    const response = await api.get<Topic>(`/topics/${topicSlug}`);
    return response.data;
  },
};

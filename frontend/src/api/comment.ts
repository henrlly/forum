import type {
  Comment,
  CreateCommentRequest,
  ListCommentsRequest,
  PaginatedCommentsResponse,
  UpdateCommentRequest,
  VoteCommentRequest,
} from "@/types/comment";
import { api } from "./api";

export const commentApi = {
  createComment: async (data: CreateCommentRequest) => {
    const response = await api.post<{ message: string; comment_id: number }>(
      "/comments",
      data,
    );
    return response.data;
  },

  updateComment: async (commentId: number, data: UpdateCommentRequest) => {
    const response = await api.put<{ message: string }>(
      `/comments/${commentId}`,
      data,
    );
    return response.data;
  },

  deleteComment: async (commentId: number) => {
    const response = await api.delete<{ message: string }>(
      `/comments/${commentId}`,
    );
    return response.data;
  },

  listComment: async (params: ListCommentsRequest) => {
    const response = await api.get<PaginatedCommentsResponse>("/comments", {
      params,
    });
    return response.data;
  },

  getComment: async (commentId: number) => {
    const response = await api.get<Comment>(`/comments/${commentId}`);
    return response.data;
  },

  voteComment: async (commentId: number, data: VoteCommentRequest) => {
    const response = await api.post<{ message: string; score: number }>(
      `/comments/${commentId}/vote`,
      data,
    );
    return response.data;
  },
};

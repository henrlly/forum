import type {
  CreatePostRequest,
  ListPostsRequest,
  PaginatedPostsResponse,
  PinCommentRequest,
  Post,
  UpdatePostRequest,
  VotePostRequest,
} from "@/types/post";
import { api } from "./api";

export const postApi = {
  createPost: async (data: CreatePostRequest) => {
    const response = await api.post<{ message: string; post_id: number }>(
      "/posts",
      data,
    );
    return response.data;
  },

  updatePost: async (postId: number, data: UpdatePostRequest) => {
    const response = await api.put<{ message: string }>(
      `/posts/${postId}`,
      data,
    );
    return response.data;
  },

  deletePost: async (postId: number) => {
    const response = await api.delete<{ message: string }>(`/posts/${postId}`);
    return response.data;
  },

  listPosts: async (params: ListPostsRequest) => {
    const response = await api.get<PaginatedPostsResponse>("/posts", {
      params,
    });
    return response.data;
  },

  getPost: async (postId: number) => {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  votePost: async (postId: number, data: VotePostRequest) => {
    const response = await api.post<{ message: string; score: number }>(
      `/posts/${postId}/vote`,
      data,
    );
    return response.data;
  },

  pinComment: async (postId: number, data: PinCommentRequest) => {
    const response = await api.post<{ message: string }>(
      `/posts/${postId}/pin-comment`,
      data,
    );
    return response.data;
  },
};

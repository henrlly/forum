import { slugifyTopicName } from "@/utils/slugify";

export interface GetCommentLinkParams {
  relative?: boolean;
  commentId: number;
  topicName: string;
  postId: number;
}

export function getCommentLink({
  relative = false,
  commentId,
  topicName,
  postId,
}: GetCommentLinkParams): string {
  return `${relative ? "" : window.location.origin}/topics/${slugifyTopicName(topicName)}/posts/${postId}#comment-${commentId}`;
}

export interface GetPostLinkParams {
  relative?: boolean;
  topicName: string;
  postId: number;
}

export function getPostLink({
  relative = false,
  topicName,
  postId,
}: GetPostLinkParams): string {
  return `${relative ? "" : window.location.origin}/topics/${slugifyTopicName(
    topicName,
  )}/posts/${postId}`;
}

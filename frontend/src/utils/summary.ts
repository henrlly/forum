import { COMMENT_SUMMARY_LENGTH } from "@/constants/comments";
import { POST_SUMMARY_LENGTH } from "@/constants/posts";

export interface SummaryResult {
  summary: string;
  isTruncated: boolean;
}

export function summarizeCommentContent(content: string): SummaryResult {
  if (content.length <= COMMENT_SUMMARY_LENGTH) {
    return { summary: content, isTruncated: false };
  }
  return {
    summary: `${content.slice(0, COMMENT_SUMMARY_LENGTH)}...`,
    isTruncated: true,
  };
}

export function summarizePostContent(content: string): string {
  if (content.length <= POST_SUMMARY_LENGTH) {
    return content;
  }
  return `${content.slice(0, POST_SUMMARY_LENGTH)}...`;
}

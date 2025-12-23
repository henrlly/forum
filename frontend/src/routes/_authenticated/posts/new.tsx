import { Container } from "@mui/material";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { PostForm } from "@/components/forms/PostForm";

const newPostSearchParamsSchema = z.object({
  topic: z.number().min(1).optional().catch(undefined),
});

type NewPostSearchParams = z.infer<typeof newPostSearchParamsSchema>;

export const Route = createFileRoute("/_authenticated/posts/new")({
  component: NewPostPage,
  validateSearch: (search): NewPostSearchParams =>
    newPostSearchParamsSchema.parse(search),
});

function NewPostPage() {
  const { topic } = useSearch({ from: "/_authenticated/posts/new" });
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <PostForm initialTopicId={topic} />
    </Container>
  );
}

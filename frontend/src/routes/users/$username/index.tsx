import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$username/")({
  loader: ({ params }) => {
    throw redirect({
      to: "/users/$username/posts",
      params,
      replace: true,
    });
  },
});

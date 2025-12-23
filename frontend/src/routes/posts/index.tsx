import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  beforeLoad: async ({ search }) => {
    throw redirect({
      to: "/posts/all",
      search, // keep search params intact when redirecting
      replace: true,
    });
  },
});

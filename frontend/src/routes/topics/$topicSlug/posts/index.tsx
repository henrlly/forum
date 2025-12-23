import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/topics/$topicSlug/posts/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/topics/$topicSlug",
			params,
			replace: true,
		});
	},
});

import { createFileRoute } from "@tanstack/react-router";
import { FeedView } from "@/components/academy/views/feed";

export const Route = createFileRoute("/tutor/feed")({
  head: () => ({ meta: [{ title: "Tech feed · DarlTech Academy" }] }),
  component: () => <FeedView role="tutor" />,
});

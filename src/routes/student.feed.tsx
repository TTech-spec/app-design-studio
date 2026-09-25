import { createFileRoute } from "@tanstack/react-router";
import { FeedView } from "@/components/academy/views/feed";

export const Route = createFileRoute("/student/feed")({
  head: () => ({ meta: [{ title: "Home · DarlTech Academy" }] }),
  component: () => <FeedView role="student" />,
});

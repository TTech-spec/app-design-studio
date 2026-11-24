import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/components/academy/dash";

export const Route = createFileRoute("/student/community")({
  head: () => ({ meta: [{ title: "Community · DarlTech Academy" }] }),
  component: CommunityPage,
});

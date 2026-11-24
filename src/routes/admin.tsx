import { createFileRoute } from "@tanstack/react-router";
import { AdminDash } from "@/components/academy/dash";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard · DarlTech Academy" }] }),
  component: AdminDash,
});

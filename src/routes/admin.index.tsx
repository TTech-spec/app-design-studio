import { createFileRoute } from "@tanstack/react-router";
import { AdminHome } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

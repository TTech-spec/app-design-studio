import { createFileRoute } from "@tanstack/react-router";
import { AdminReports } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

import { createFileRoute } from "@tanstack/react-router";
import { AdminAnnouncements } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

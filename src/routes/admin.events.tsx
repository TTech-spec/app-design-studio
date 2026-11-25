import { createFileRoute } from "@tanstack/react-router";
import { AdminEvents } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

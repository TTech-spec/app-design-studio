import { createFileRoute } from "@tanstack/react-router";
import { AdminScholarships } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/scholarships")({
  component: AdminScholarships,
});

import { createFileRoute } from "@tanstack/react-router";
import { AdminCourses } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCourses,
});

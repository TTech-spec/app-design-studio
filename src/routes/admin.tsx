import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/kit";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · DarlTech Academy" }, { name: "robots", content: "noindex" }],
  }),
  ssr: false,
  component: () => (
    <AdminGate>
      <Outlet />
    </AdminGate>
  ),
});

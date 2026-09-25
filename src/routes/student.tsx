import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/academy/shell";

export const Route = createFileRoute("/student")({
  component: () => (
    <AppShell role="student">
      <Outlet />
    </AppShell>
  ),
});

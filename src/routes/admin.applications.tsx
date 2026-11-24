import { createFileRoute } from "@tanstack/react-router";
import { AdminApplications } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/applications")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: Page,
});

function Page() {
  const { q } = Route.useSearch();
  return <AdminApplications key={q} q={q} />;
}

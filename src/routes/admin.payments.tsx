import { createFileRoute } from "@tanstack/react-router";
import { AdminPayments } from "@/components/admin/pages";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

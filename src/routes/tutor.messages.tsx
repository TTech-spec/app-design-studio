import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TUTOR_CONVERSATIONS } from "@/lib/academy/data";
import { MessagesView } from "@/components/academy/views/messages";

export const Route = createFileRoute("/tutor/messages")({
  validateSearch: (s: Record<string, unknown>): { c?: string } =>
    typeof s.c === "string" ? { c: s.c } : {},
  head: () => ({ meta: [{ title: "Messages · DarlTech Academy" }] }),
  component: TutorMessages,
});

function TutorMessages() {
  const { c } = Route.useSearch();
  const navigate = useNavigate({ from: "/tutor/messages" });
  return (
    <MessagesView
      conversations={TUTOR_CONVERSATIONS}
      active={c}
      onSelect={(id) => navigate({ search: id ? { c: id } : {} })}
      filters={["All", "Students", "Groups"] as const}
    />
  );
}

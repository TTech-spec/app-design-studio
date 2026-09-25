import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { STUDENT_CONVERSATIONS } from "@/lib/academy/data";
import { MessagesView } from "@/components/academy/views/messages";

export const Route = createFileRoute("/student/messages")({
  validateSearch: (s: Record<string, unknown>): { c?: string } =>
    typeof s.c === "string" ? { c: s.c } : {},
  head: () => ({ meta: [{ title: "Messages · DarlTech Academy" }] }),
  component: StudentMessages,
});

function StudentMessages() {
  const { c } = Route.useSearch();
  const navigate = useNavigate({ from: "/student/messages" });
  return (
    <MessagesView
      conversations={STUDENT_CONVERSATIONS}
      active={c}
      onSelect={(id) => navigate({ search: id ? { c: id } : {} })}
      filters={["All", "Tutors", "Groups", "Support"] as const}
    />
  );
}

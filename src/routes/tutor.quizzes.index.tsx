import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ClipboardCheck, Globe, Plus } from "lucide-react";
import { COHORTS, courseById, SAMPLE_ATTEMPTS } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { btn, Card, PageTitle, Pill } from "@/components/academy/ui";

export const Route = createFileRoute("/tutor/quizzes/")({
  head: () => ({ meta: [{ title: "Quizzes · DarlTech Academy" }] }),
  component: TutorQuizzes,
});

function TutorQuizzes() {
  const { allQuizzes, quizzes, attempts } = useAcademy();
  const mine = allQuizzes.filter((q) => q.tutorId === "tunde-bakare");
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Quizzes & results"
        sub="Share quizzes with your cohorts or anyone online, then see how they did."
      >
        <Link to="/tutor/quizzes/new" className={btn.primary}>
          <Plus size={16} /> Create quiz
        </Link>
      </PageTitle>
      <Card className="p-2 md:p-3">
        {mine.map((q) => {
          const n =
            SAMPLE_ATTEMPTS.filter((a) => a.quizId === q.id).length +
            attempts.filter((a) => a.quizId === q.id).length;
          return (
            <Link
              key={q.id}
              to="/tutor/quizzes/$quizId"
              params={{ quizId: q.id }}
              search={{}}
              className="flex items-center gap-3.5 rounded-xl p-3 hover:bg-surface"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fdecea] text-[#D7372C]">
                <ClipboardCheck size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 text-[15px] font-bold">
                  {q.title}
                  {quizzes.some((x) => x.id === q.id) && <Pill tone="red">New</Pill>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {courseById(q.courseId)?.name} · {q.questions.length} questions ·{" "}
                  {q.cohorts
                    .map((c) => COHORTS.find((x) => x.id === c)?.name.split(" · ")[1])
                    .filter(Boolean)
                    .join(", ") || "No cohorts"}
                </span>
              </span>
              {q.openToAll && (
                <Pill tone="green" className="hidden sm:inline-flex">
                  <Globe size={12} className="mr-1" /> Open to all
                </Pill>
              )}
              <span className="text-sm font-bold">{n} attempts</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}

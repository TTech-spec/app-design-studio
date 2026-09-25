import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { courseById, tutorById } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Card, EmptyState, PageTitle, Pill, SectionTitle } from "@/components/academy/ui";

export const Route = createFileRoute("/student/quizzes")({
  head: () => ({ meta: [{ title: "Quizzes · DarlTech Academy" }] }),
  component: Quizzes,
});

function Quizzes() {
  const { allQuizzes, attempts, enrollments } = useAcademy();
  const mine = new Set(enrollments.map((e) => e.courseId));
  const courseQuizzes = allQuizzes.filter((q) => mine.has(q.courseId));
  const open = allQuizzes.filter((q) => q.openToAll && !mine.has(q.courseId));
  const row = (q: (typeof allQuizzes)[number]) => {
    const best = attempts.filter((a) => a.quizId === q.id).sort((a, b) => b.score - a.score)[0];
    return (
      <Link
        key={q.id}
        to="/quiz/$quizId"
        params={{ quizId: q.id }}
        className="flex items-center gap-3 border-t border-border py-3.5 hover:bg-surface"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fdecea] text-[#D7372C]">
          <ClipboardCheck size={20} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[15px] font-bold">{q.title}</span>
          <span className="text-xs text-muted-foreground">
            {courseById(q.courseId)?.name} · {q.questions.length} questions · by{" "}
            {tutorById(q.tutorId)?.name ?? "your tutor"}
          </span>
        </span>
        {best ? (
          <Pill tone={best.score >= q.passMark ? "green" : "red"}>Best {best.score}%</Pill>
        ) : (
          <Pill>New</Pill>
        )}
        <ChevronRight size={18} className="text-muted-foreground" />
      </Link>
    );
  };
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Quizzes"
        sub="Check what you’ve learned. Your scores show up on your dashboard."
      />
      <Card>
        <SectionTitle title="From your courses" />
        {courseQuizzes.length ? (
          courseQuizzes.map(row)
        ) : (
          <EmptyState
            title="No course quizzes yet"
            body="Enroll in a course and your module quizzes appear here."
            action={
              <Link to="/student/explore" className="font-bold text-[#D7372C]">
                Browse courses
              </Link>
            }
          />
        )}
      </Card>
      <Card>
        <SectionTitle title="Free quizzes open to everyone" />
        {open.map(row)}
      </Card>
      {attempts.length > 0 && (
        <Card>
          <SectionTitle title="Your history" />
          {attempts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between border-t border-border py-3 text-sm"
            >
              <span className="font-semibold">
                {allQuizzes.find((q) => q.id === a.quizId)?.title ?? "Quiz"}
              </span>
              <Pill tone={a.score >= 70 ? "green" : "red"}>
                {a.score}% · {a.correct}/{a.total}
              </Pill>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

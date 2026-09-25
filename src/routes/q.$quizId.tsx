import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ClipboardCheck, Play } from "lucide-react";
import { courseById, decodeQuiz, SAMPLE_ATTEMPTS, tutorById } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, btn, Card, CourseTile, Logo, Pill } from "@/components/academy/ui";

export const Route = createFileRoute("/q/$quizId")({
  validateSearch: (s: Record<string, unknown>): { via?: string; d?: string } => ({
    ...(typeof s.via === "string" ? { via: s.via } : {}),
    ...(typeof s.d === "string" ? { d: s.d } : {}),
  }),
  head: () => ({
    meta: [
      { title: "You’ve been sent a quiz · DarlTech Academy" },
      { name: "description", content: "Take a free quiz from a DarlTech Academy tutor." },
    ],
  }),
  component: QuizInvite,
});

function QuizInvite() {
  const { quizId } = Route.useParams();
  const { via, d } = Route.useSearch();
  const { quizById, user, ready, attempts } = useAcademy();
  const quiz = quizById(quizId) ?? decodeQuiz(d);

  if (!quiz)
    return (
      <div className="academy flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-extrabold">
          {ready ? "This quiz link isn’t available" : "Loading…"}
        </h1>
        {ready && (
          <Link to="/" className={btn.primary}>
            Go to DarlTech Academy
          </Link>
        )}
      </div>
    );

  const tutor = tutorById(quiz.tutorId);
  const course = courseById(quiz.courseId);
  const all = [
    ...SAMPLE_ATTEMPTS.filter((a) => a.quizId === quiz.id),
    ...attempts.filter((a) => a.quizId === quiz.id),
  ];
  const avg = all.length ? Math.round(all.reduce((s, a) => s + a.score, 0) / all.length) : null;
  const source = via ? `Online · ${via}` : user ? "Student portal" : "Online · shared link";

  return (
    <div className="academy min-h-screen bg-surface">
      <header className="flex h-16 items-center gap-3 border-b border-border bg-white px-4 md:h-[72px] md:px-12">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex-1" />
        {user ? (
          <Link
            to={user.role === "tutor" ? "/tutor" : "/student"}
            className="text-sm font-bold text-[#D7372C]"
          >
            My dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="hidden text-sm font-bold text-[#D7372C] sm:block">
              Log in
            </Link>
            <Link to="/join" className={btn.primary + " h-10"}>
              Join free
            </Link>
          </>
        )}
      </header>
      <main className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-6 md:py-12 lg:flex-row lg:justify-center">
        <section className="flex flex-col gap-5 rounded-3xl border border-border bg-white p-6 md:p-9 lg:w-[720px]">
          {tutor && (
            <div className="flex items-center gap-3">
              <Avatar initials={tutor.initials} color={tutor.color} size={44} />
              <span className="text-[15px]">
                <Link
                  to="/student/tutors/$tutorId"
                  params={{ tutorId: tutor.id }}
                  className="font-extrabold hover:underline"
                >
                  {tutor.name}
                </Link>{" "}
                shared a quiz with you
              </span>
            </div>
          )}
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-[#D7372C] text-white md:h-20 md:w-20 md:rounded-[20px]">
              <ClipboardCheck size={36} strokeWidth={1.6} />
            </span>
            <div>
              <h1 className="text-[28px] font-extrabold leading-tight md:text-[34px]">
                {quiz.title}
              </h1>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Pill>{quiz.questions.length} questions</Pill>
                <Pill>{quiz.minutes} min</Pill>
                <Pill>{quiz.module}</Pill>
                <Pill tone="green">Free</Pill>
              </div>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
            A quick check of the core ideas{course ? ` from ${course.name}` : ""}. Anyone can take
            it — no account needed to start.
          </p>
          <div>
            <h2 className="mb-3 text-[17px] font-extrabold">What it covers</h2>
            <ul className="flex flex-col gap-2.5">
              {quiz.questions.slice(0, 4).map((q) => (
                <li key={q.id} className="flex items-start gap-2.5 text-[15px] leading-snug">
                  <Check size={18} className="mt-0.5 shrink-0 text-[#16794a]" strokeWidth={2.6} />
                  <span className="line-clamp-1">{q.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              to="/quiz/$quizId"
              params={{ quizId: quiz.id }}
              search={{ src: source, ...(d ? { d } : {}) }}
              className={btn.big + " sm:w-auto sm:px-8"}
            >
              <Play size={16} /> Start quiz
            </Link>
            {!user && (
              <span className="text-center text-sm text-muted-foreground sm:text-left">
                or{" "}
                <Link to="/join/student" className="font-bold text-[#D7372C]">
                  join free
                </Link>{" "}
                to save your score
              </span>
            )}
          </div>
        </section>
        <aside className="flex flex-col gap-4 lg:w-[360px]">
          <Card>
            <span className="text-xs font-bold text-muted-foreground">SO FAR</span>
            <div className="mt-2.5 flex gap-8">
              <div>
                <div className="font-display text-[28px] font-extrabold">{all.length}</div>
                <div className="text-xs text-muted-foreground">attempts</div>
              </div>
              <div>
                <div className="font-display text-[28px] font-extrabold">
                  {avg === null ? "—" : `${avg}%`}
                </div>
                <div className="text-xs text-muted-foreground">average score</div>
              </div>
            </div>
          </Card>
          {course && (
            <Card>
              <span className="text-xs font-bold text-muted-foreground">WANT TO GO DEEPER?</span>
              <div className="my-3 flex items-center gap-3">
                <CourseTile course={course} size={52} />
                <span className="flex flex-col">
                  <span className="text-[15px] font-extrabold">{course.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {course.duration}
                    {tutor ? ` · taught by ${tutor.name.split(" ")[0]}` : ""}
                  </span>
                </span>
              </div>
              <Link
                to="/student/courses/$courseId"
                params={{ courseId: course.id }}
                className={btn.outline + " h-10"}
              >
                View course
              </Link>
            </Card>
          )}
        </aside>
      </main>
    </div>
  );
}

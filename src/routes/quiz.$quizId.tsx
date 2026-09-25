import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Check, ChevronLeft, Clock, Flag, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { courseById, decodeQuiz, tutorById } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { btn, Logo, Pill, Progress, SuccessArt } from "@/components/academy/ui";

export const Route = createFileRoute("/quiz/$quizId")({
  validateSearch: (s: Record<string, unknown>): { src?: string; d?: string } => ({
    ...(typeof s.src === "string" ? { src: s.src } : {}),
    ...(typeof s.d === "string" ? { d: s.d } : {}),
  }),
  head: () => ({ meta: [{ title: "Quiz · DarlTech Academy" }] }),
  component: TakeQuiz,
});

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function TakeQuiz() {
  const { quizId } = Route.useParams();
  const { src, d } = Route.useSearch();
  const { quizById, recordAttempt, user, ready } = useAcademy();
  const quiz = quizById(quizId) ?? decodeQuiz(d);
  const router = useRouter();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [flags, setFlags] = useState<number[]>([]);
  const [left, setLeft] = useState((quiz?.minutes ?? 10) * 60);
  const [result, setResult] = useState<{ score: number; correct: number } | null>(null);
  const started = useRef(Date.now());

  useEffect(() => {
    if (result || !quiz) return;
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [result, quiz]);

  const submit = useMemo(
    () => () => {
      if (!quiz) return;
      const correct = quiz.questions.filter((q, k) => answers[k] === q.answer).length;
      const score = Math.round((correct / quiz.questions.length) * 100);
      recordAttempt({
        quizId: quiz.id,
        score,
        correct,
        total: quiz.questions.length,
        answers,
        minutes: Math.max(1, Math.round((Date.now() - started.current) / 60000)),
        source: src ?? (user ? "Student portal" : "Online · shared link"),
      });
      setResult({ score, correct });
    },
    [quiz, answers, recordAttempt, src, user],
  );

  useEffect(() => {
    if (left === 0 && !result) submit();
  }, [left, result, submit]);

  if (!quiz)
    return (
      <div className="academy flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-extrabold">{ready ? "Quiz not found" : "Loading…"}</h1>
        {ready && (
          <Link to="/student/quizzes" className={btn.primary}>
            See all quizzes
          </Link>
        )}
      </div>
    );

  const q = quiz.questions[i];
  const exit = () =>
    window.history.length > 1 ? router.history.back() : navigate({ to: "/student" });

  if (result) {
    const passed = result.score >= quiz.passMark;
    const course = courseById(quiz.courseId);
    return (
      <div className="academy min-h-screen bg-surface">
        <header className="flex h-16 items-center border-b border-border bg-white px-4 md:px-8">
          <Logo />
        </header>
        <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8">
          <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-white p-6 text-center md:p-8">
            <SuccessArt className="max-w-[220px]" />
            <Pill tone={passed ? "green" : "red"}>{passed ? "Passed" : "Below the pass mark"}</Pill>
            <h1 className="text-3xl font-extrabold">{result.score}%</h1>
            <p className="text-sm text-muted-foreground">
              You got {result.correct} of {quiz.questions.length} right on “{quiz.title}”. Pass mark
              is {quiz.passMark}%.
            </p>
            {!user && (
              <div className="mt-2 w-full rounded-2xl bg-primary-soft p-4 text-left text-sm">
                <b>Save your score and get feedback.</b> Create a free DarlTech account to keep your
                results and learn more with {tutorById(quiz.tutorId)?.name}.
                <Link to="/join/student" className={cn(btn.primary, "mt-3 w-full")}>
                  Join free
                </Link>
              </div>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                className={btn.outline}
                onClick={() => {
                  setAnswers([]);
                  setI(0);
                  setLeft(quiz.minutes * 60);
                  started.current = Date.now();
                  setResult(null);
                }}
              >
                <RotateCcw size={16} /> Try again
              </button>
              {user && (
                <Link to={user.role === "tutor" ? "/tutor" : "/student"} className={btn.primary}>
                  Back to dashboard
                </Link>
              )}
              {course && (
                <Link
                  to="/student/courses/$courseId"
                  params={{ courseId: course.id }}
                  className={btn.navy}
                >
                  Learn more: {course.name}
                </Link>
              )}
            </div>
          </section>
          <section className="rounded-3xl border border-border bg-white p-5 md:p-6">
            <h2 className="mb-3 text-[17px] font-extrabold">Review your answers</h2>
            {quiz.questions.map((qq, k) => {
              const ok = answers[k] === qq.answer;
              return (
                <div key={qq.id} className="flex gap-3 border-t border-border py-3.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
                      ok ? "bg-[#16794a]" : "bg-[#D7372C]",
                    )}
                  >
                    {ok ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  </span>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold">{qq.text}</span>
                    {!ok && (
                      <span className="text-muted-foreground">
                        Your answer:{" "}
                        {answers[k] === undefined ? "No answer" : qq.options[answers[k]]}
                      </span>
                    )}
                    <span className="font-semibold text-[#16794a]">
                      Correct: {qq.options[qq.answer]}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== undefined).length;
  const navGrid = (
    <div className="grid grid-cols-5 gap-2">
      {quiz.questions.map((_, k) => {
        const cur = k === i;
        const done = answers[k] !== undefined;
        const fl = flags.includes(k);
        return (
          <button
            key={k}
            type="button"
            aria-label={`Question ${k + 1}`}
            aria-current={cur ? "step" : undefined}
            onClick={() => setI(k)}
            className={cn(
              "h-11 rounded-[10px] border text-sm font-bold",
              cur
                ? "border-2 border-primary bg-white"
                : fl
                  ? "border-[#EF4136] bg-[#fdecea] text-[#D7372C]"
                  : done
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-muted-foreground",
            )}
          >
            {k + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="academy min-h-screen bg-white lg:bg-surface">
      <header className="flex h-16 items-center gap-2 border-b border-border bg-white px-2 md:px-8">
        <button
          type="button"
          onClick={exit}
          aria-label="Exit quiz"
          className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="truncate text-base font-extrabold md:text-lg">{quiz.title}</h1>
          <span className="hidden text-xs text-muted-foreground md:block">
            {courseById(quiz.courseId)?.name} · {quiz.questions.length} questions · pass mark{" "}
            {quiz.passMark}%
          </span>
        </div>
        <span
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold",
            left < 60 ? "bg-[#D7372C] text-white" : "bg-[#fdecea] text-[#D7372C]",
          )}
          aria-live="polite"
        >
          <Clock size={16} /> {fmt(left)}
        </span>
      </header>
      <main className="mx-auto grid max-w-[1180px] gap-6 px-5 py-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-8">
        <section className="flex flex-col lg:rounded-3xl lg:border lg:border-border lg:bg-white lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-muted-foreground">
              Question {i + 1} of {quiz.questions.length}
            </span>
            <button
              type="button"
              aria-pressed={flags.includes(i)}
              onClick={() =>
                setFlags((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]))
              }
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-[10px] border px-3 text-[13px] font-semibold",
                flags.includes(i) ? "border-[#EF4136] text-[#D7372C]" : "border-border",
              )}
            >
              <Flag size={15} /> {flags.includes(i) ? "Flagged" : "Flag"}
            </button>
          </div>
          <Progress value={((i + 1) / quiz.questions.length) * 100} className="mt-2.5 h-1.5" />
          <h2 className="mb-5 mt-6 text-xl font-extrabold leading-snug md:text-[22px]">{q.text}</h2>
          <div role="radiogroup" aria-label="Answers" className="flex flex-col gap-2.5">
            {q.options.map((o, k) => {
              const on = answers[i] === k;
              return (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setAnswers((a) => Object.assign([...a], { [i]: k }))}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl p-4 text-left transition",
                    on
                      ? "border-2 border-primary bg-[#f3f6fb]"
                      : "border border-border bg-white hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-sm font-extrabold",
                      on ? "bg-primary text-white" : "bg-surface-2",
                    )}
                  >
                    {"ABCDEF"[k]}
                  </span>
                  <span
                    className={cn("text-[15px] leading-snug", on ? "font-semibold" : "font-medium")}
                  >
                    {o}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="min-h-8 flex-1" />
          <div className="mt-8 flex gap-2.5">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => setI(i - 1)}
              className={cn(btn.outline, "h-14 w-32 disabled:opacity-40")}
            >
              Previous
            </button>
            {i < quiz.questions.length - 1 ? (
              <button type="button" onClick={() => setI(i + 1)} className={cn(btn.big, "flex-1")}>
                Next question
              </button>
            ) : (
              <button type="button" onClick={submit} className={cn(btn.big, "flex-1")}>
                Submit quiz
              </button>
            )}
          </div>
        </section>
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="mb-3.5 text-[17px] font-extrabold">Questions</h2>
            {navGrid}
            <p className="mt-4 text-xs text-muted-foreground">
              {answered} of {quiz.questions.length} answered
            </p>
            <button type="button" onClick={submit} className={cn(btn.navy, "mt-4 h-12 w-full")}>
              Submit quiz
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

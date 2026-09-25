import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Plus, Send, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COURSES, type Question } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Field, selectCls, textareaCls } from "@/components/academy/auth";
import { btn, Card, PageTitle, Pill } from "@/components/academy/ui";

export const Route = createFileRoute("/tutor/quizzes/new")({
  head: () => ({ meta: [{ title: "Create quiz · DarlTech Academy" }] }),
  component: QuizBuilder,
});

type Draft = {
  text: string;
  options: string[];
  answer: number;
  kind: "Multiple choice" | "True / false";
};
const blank = (kind: Draft["kind"] = "Multiple choice"): Draft =>
  kind === "True / false"
    ? { text: "", options: ["True", "False"], answer: 0, kind }
    : { text: "", options: ["", "", "", ""], answer: 0, kind };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "quiz";

function QuizBuilder() {
  const navigate = useNavigate();
  const { saveQuiz } = useAcademy();
  const [meta, setMeta] = useState({
    title: "",
    courseId: "ui-ux-design",
    module: "",
    minutes: "15",
    passMark: "70",
    due: "",
  });
  const [qs, setQs] = useState<Draft[]>([blank()]);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (i: number, p: Partial<Draft>) =>
    setQs((xs) => xs.map((q, k) => (k === i ? { ...q, ...p } : q)));
  const setOption = (i: number, o: number, v: string) =>
    setQs((xs) =>
      xs.map((q, k) =>
        k === i ? { ...q, options: q.options.map((x, j) => (j === o ? v : x)) } : q,
      ),
    );

  const publish = () => {
    const err: string[] = [];
    if (!meta.title.trim()) err.push("Give the quiz a title.");
    qs.forEach((q, i) => {
      if (!q.text.trim()) err.push(`Question ${i + 1} needs text.`);
      if (q.options.filter((o) => o.trim()).length < 2)
        err.push(`Question ${i + 1} needs at least 2 answers.`);
      if (!q.options[q.answer]?.trim())
        err.push(`Question ${i + 1}: mark a filled-in answer as correct.`);
    });
    setErrors(err);
    if (err.length) {
      toast.error(err[0]);
      return;
    }
    const id = `${slug(meta.title)}-${Math.random().toString(36).slice(2, 6)}`;
    const questions: Question[] = qs.map((q, i) => {
      const kept = q.options.map((o, j) => ({ o: o.trim(), j })).filter((x) => x.o);
      return {
        id: `q${i + 1}`,
        text: q.text.trim(),
        options: kept.map((x) => x.o),
        answer: kept.findIndex((x) => x.j === q.answer),
      };
    });
    saveQuiz({
      id,
      title: meta.title.trim(),
      courseId: meta.courseId,
      tutorId: "tunde-bakare",
      module: meta.module.trim() || "General",
      minutes: Math.max(1, Number(meta.minutes) || 15),
      passMark: Math.min(100, Math.max(1, Number(meta.passMark) || 70)),
      due: meta.due || "Open",
      openToAll: true,
      cohorts: ["c5"],
      questions,
    });
    navigate({ to: "/tutor/quizzes/$quizId", params: { quizId: id }, search: { share: true } });
  };

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Create quiz"
        sub="Build it here, then share it with your cohorts or anyone online."
      >
        <button type="button" onClick={publish} className={btn.primary}>
          <Send size={16} /> Publish &amp; share
        </button>
      </PageTitle>
      {errors.length > 0 && (
        <div role="alert" className="rounded-2xl border border-[#f5c9c4] bg-[#fdecea] p-4 text-sm">
          <b>Fix these before publishing:</b>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="h-fit">
          <h2 className="mb-4 text-[17px] font-extrabold">Quiz settings</h2>
          <div className="flex flex-col gap-3.5">
            <Field
              id="q-title"
              label="Quiz title"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="e.g. Wireframing basics"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="q-course" className="text-sm font-semibold">
                Course
              </label>
              <select
                id="q-course"
                value={meta.courseId}
                onChange={(e) => setMeta({ ...meta, courseId: e.target.value })}
                className={selectCls}
              >
                {COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Field
              id="q-module"
              label="Module"
              value={meta.module}
              onChange={(e) => setMeta({ ...meta, module: e.target.value })}
              placeholder="e.g. Module 4 · Wireframing"
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="q-min"
                label="Time (min)"
                inputMode="numeric"
                value={meta.minutes}
                onChange={(e) => setMeta({ ...meta, minutes: e.target.value.replace(/\D/g, "") })}
              />
              <Field
                id="q-pass"
                label="Pass mark (%)"
                inputMode="numeric"
                value={meta.passMark}
                onChange={(e) => setMeta({ ...meta, passMark: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <Field
              id="q-due"
              label="Due date"
              type="date"
              value={meta.due}
              onChange={(e) => setMeta({ ...meta, due: e.target.value })}
            />
          </div>
        </Card>
        <div className="flex min-w-0 flex-col gap-4">
          {qs.map((q, i) => (
            <Card key={i}>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-[13px] font-bold text-muted-foreground">
                  Question {i + 1}
                </span>
                <Pill>{q.kind}</Pill>
                <div className="flex-1" />
                {qs.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Delete question ${i + 1}`}
                    onClick={() => setQs((xs) => xs.filter((_, k) => k !== i))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-surface"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <label htmlFor={`qt-${i}`} className="sr-only">
                Question {i + 1} text
              </label>
              <textarea
                id={`qt-${i}`}
                rows={2}
                value={q.text}
                onChange={(e) => update(i, { text: e.target.value })}
                placeholder="Type your question"
                className={cn(textareaCls, "font-semibold")}
              />
              <div
                role="radiogroup"
                aria-label={`Answers for question ${i + 1}`}
                className="mt-3.5 flex flex-col gap-2.5"
              >
                {q.options.map((o, j) => {
                  const correct = q.answer === j;
                  return (
                    <div key={j} className="flex items-center gap-2.5">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={correct}
                        aria-label={`Mark answer ${j + 1} as correct`}
                        onClick={() => update(i, { answer: j })}
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          correct ? "bg-[#16794a] text-white" : "border-2 border-border",
                        )}
                      >
                        {correct && <Check size={14} strokeWidth={3} />}
                      </button>
                      <input
                        value={o}
                        readOnly={q.kind === "True / false"}
                        onChange={(e) => setOption(i, j, e.target.value)}
                        aria-label={`Answer ${j + 1}`}
                        placeholder={`Answer ${j + 1}`}
                        className={cn(
                          "h-12 flex-1 rounded-xl border px-3.5 text-sm outline-none focus:border-primary",
                          correct
                            ? "border-[#9fd3b5] bg-[#eef8f2]"
                            : "border-primary-soft bg-surface",
                        )}
                      />
                      {q.kind === "Multiple choice" && q.options.length > 2 && (
                        <button
                          type="button"
                          aria-label={`Remove answer ${j + 1}`}
                          onClick={() =>
                            update(i, {
                              options: q.options.filter((_, k) => k !== j),
                              answer: q.answer >= j && q.answer > 0 ? q.answer - 1 : q.answer,
                            })
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2.5 text-xs font-semibold text-[#16794a]">
                Tap the circle to mark the correct answer.
              </p>
              {q.kind === "Multiple choice" && q.options.length < 6 && (
                <button
                  type="button"
                  onClick={() => update(i, { options: [...q.options, ""] })}
                  className="mt-2 inline-flex h-10 items-center gap-1.5 text-[13px] font-bold text-[#D7372C]"
                >
                  <Plus size={16} /> Add answer
                </button>
              )}
            </Card>
          ))}
          <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-[#b9c3d8] p-4">
            <span className="mr-1 text-sm font-bold">Add question</span>
            {(["Multiple choice", "True / false"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setQs((xs) => [...xs, blank(k)])}
                className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-border bg-white px-3.5 text-[13px] font-semibold"
              >
                <Plus size={16} /> {k}
              </button>
            ))}
          </div>
          <button type="button" onClick={publish} className={btn.big}>
            <Send size={18} /> Publish &amp; share
          </button>
        </div>
      </div>
    </div>
  );
}

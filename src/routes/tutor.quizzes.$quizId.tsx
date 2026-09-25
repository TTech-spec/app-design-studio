import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Check,
  ClipboardCheck,
  Download,
  Link as LinkIcon,
  Share2,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { initialsOf, SAMPLE_ATTEMPTS, type Attempt } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { ShareQuizDialog } from "@/components/academy/share-quiz";
import {
  Avatar,
  btn,
  Card,
  EmptyState,
  PageTitle,
  Pill,
  Progress,
  SectionTitle,
  StatTile,
} from "@/components/academy/ui";

export const Route = createFileRoute("/tutor/quizzes/$quizId")({
  validateSearch: (s: Record<string, unknown>): { share?: boolean } =>
    s.share === true || s.share === "true" ? { share: true } : {},
  head: () => ({ meta: [{ title: "Quiz results · DarlTech Academy" }] }),
  component: QuizResults,
});

function QuizResults() {
  const { quizId } = Route.useParams();
  const { share } = Route.useSearch();
  const navigate = useNavigate({ from: "/tutor/quizzes/$quizId" });
  const { quizById, attempts, quizzes, user, ready } = useAcademy();
  const quiz = quizById(quizId);

  const all: Attempt[] = useMemo(
    () => [
      ...attempts
        .filter((a) => a.quizId === quizId)
        .map((a) => ({
          id: a.id,
          quizId: a.quizId,
          learner: user?.role === "student" ? user.name : "Online learner",
          initials: user?.role === "student" ? initialsOf(user.name) : "OL",
          color: "#1f6b5e",
          source: a.source,
          score: a.score,
          minutes: a.minutes,
        })),
      ...SAMPLE_ATTEMPTS.filter((a) => a.quizId === quizId),
    ],
    [attempts, quizId, user],
  );

  if (!quiz)
    return (
      <EmptyState
        title={ready ? "Quiz not found" : "Loading…"}
        body="It may have been removed."
        action={
          <Link to="/tutor/quizzes" className={btn.primary}>
            All quizzes
          </Link>
        }
      />
    );

  const isNew = quizzes.some((q) => q.id === quiz.id);
  const avg = all.length ? Math.round(all.reduce((s, a) => s + a.score, 0) / all.length) : 0;
  const passed = all.filter((a) => a.score >= quiz.passMark).length;
  const online = all.filter((a) => a.source.startsWith("Online")).length;
  const sources = Object.entries(
    all.reduce<Record<string, number>>((m, a) => {
      const k = a.source.startsWith("Online · ") ? a.source.replace("Online · ", "") : a.source;
      m[k] = (m[k] ?? 0) + 1;
      return m;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxSrc = Math.max(1, ...sources.map((s) => s[1]));

  const exportCsv = () => {
    const rows = [
      ["Learner", "Came from", "Score", "Minutes"],
      ...all.map((a) => [a.learner, a.source, `${a.score}`, `${a.minutes}`]),
    ];
    const blob = new Blob(
      [rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.id}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <span className="text-[13px] text-muted-foreground">
        <Link to="/tutor/quizzes" className="font-bold text-[#D7372C] hover:underline">
          Quizzes
        </Link>{" "}
        / Results
      </span>
      <PageTitle
        title={
          <span className="flex flex-wrap items-center gap-2.5">
            {quiz.title}
            <Pill tone="green">
              {quiz.openToAll ? "Live · open to all" : "Live · cohorts only"}
            </Pill>
          </span>
        }
        sub={`${quiz.module} · ${quiz.questions.length} questions · pass mark ${quiz.passMark}%`}
      >
        <button
          type="button"
          onClick={exportCsv}
          disabled={!all.length}
          className={btn.outline + " disabled:opacity-50"}
        >
          <Download size={16} /> Export
        </button>
        <button
          type="button"
          onClick={() => navigate({ search: { share: true } })}
          className={btn.primary}
        >
          <Share2 size={16} /> Share
        </button>
      </PageTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatTile label="Attempts" value={all.length} sub="So far" icon={<Users size={16} />} />
        <StatTile
          label="Average score"
          value={all.length ? `${avg}%` : "—"}
          sub={`Pass mark ${quiz.passMark}%`}
          icon={<BarChart3 size={16} />}
        />
        <StatTile
          label="Pass rate"
          value={all.length ? `${Math.round((passed / all.length) * 100)}%` : "—"}
          sub={`${passed} of ${all.length} passed`}
          icon={<Check size={16} />}
        />
        <StatTile
          label="Online learners"
          value={online}
          sub="From shared links"
          icon={<LinkIcon size={16} />}
          tint="red"
        />
      </div>
      {all.length === 0 ? (
        <EmptyState
          title={isNew ? "No attempts yet" : "No attempts"}
          body="Share the link with your cohorts or post it to the tech feed. Results appear here as people finish."
          action={
            <button
              type="button"
              onClick={() => navigate({ search: { share: true } })}
              className={btn.primary}
            >
              <Share2 size={16} /> Share quiz
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <SectionTitle title="Attempts" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr className="text-left text-xs font-bold text-muted-foreground">
                    <th scope="col" className="pb-2.5">
                      Learner
                    </th>
                    <th scope="col" className="pb-2.5">
                      Came from
                    </th>
                    <th scope="col" className="pb-2.5">
                      Score
                    </th>
                    <th scope="col" className="pb-2.5">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="py-3">
                        <span className="flex items-center gap-2.5">
                          <Avatar initials={a.initials} color={a.color} size={32} />
                          <span className="text-sm font-bold">{a.learner}</span>
                        </span>
                      </td>
                      <td className="py-3">
                        <Pill tone={a.source.startsWith("Online") ? "green" : "soft"}>
                          {a.source}
                        </Pill>
                      </td>
                      <td className="py-3">
                        <Pill tone={a.score >= quiz.passMark ? "green" : "red"}>
                          {a.score}% · {a.score >= quiz.passMark ? "Passed" : "Below pass"}
                        </Pill>
                      </td>
                      <td className="py-3 text-[13px] text-muted-foreground">{a.minutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="flex flex-col gap-5">
            <Card>
              <SectionTitle title="Where attempts came from" />
              <div className="flex flex-col gap-3">
                {sources.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[13px]">
                      <span className="font-semibold">{k}</span>
                      <span className="font-bold">{v}</span>
                    </div>
                    <Progress value={(v / maxSrc) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle title="Questions" />
              {quiz.questions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-3 border-t border-border py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-xs font-extrabold">
                    Q{i + 1}
                  </span>
                  <span className="line-clamp-2 flex-1 text-[13px] leading-snug">{q.text}</span>
                  <ClipboardCheck size={16} className="text-muted-foreground" />
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
      <ShareQuizDialog
        quiz={quiz}
        open={!!share}
        justPublished={isNew}
        onClose={() => navigate({ search: {} })}
      />
    </div>
  );
}

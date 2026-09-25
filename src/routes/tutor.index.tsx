import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardCheck,
  MessageCircle,
  Pencil,
  Plus,
  Upload,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { COHORTS, SAMPLE_ATTEMPTS } from "@/lib/academy/data";
import { firstName, useAcademy } from "@/lib/academy/store";
import {
  Avatar,
  btn,
  Card,
  PageTitle,
  Pill,
  Progress,
  SectionTitle,
  StatTile,
} from "@/components/academy/ui";

export const Route = createFileRoute("/tutor/")({
  head: () => ({ meta: [{ title: "Tutor dashboard · DarlTech Academy" }] }),
  component: TutorDashboard,
});

const NUDGE = [
  {
    initials: "IO",
    color: "#1f6b5e",
    name: "Ifeoma Okeke",
    why: "Stuck on Module 3 · 50% quiz",
    c: "ifeoma",
  },
  {
    initials: "KA",
    color: "#8b5a2b",
    name: "Kunle Ade",
    why: "No activity for 9 days",
    c: "cohort5",
  },
  {
    initials: "AO",
    color: "#EF4136",
    name: "Amaka Obi",
    why: "Asked for feedback on wireframes",
    c: "amaka",
  },
];

function TutorDashboard() {
  const { user, allQuizzes, attempts } = useAcademy();
  const recent = [
    ...attempts.map((a) => ({
      id: a.id,
      quizId: a.quizId,
      learner: user?.role === "student" ? user.name : "Online learner",
      source: a.source,
      score: a.score,
    })),
    ...SAMPLE_ATTEMPTS,
  ].slice(0, 4);
  const students = COHORTS.reduce((s, c) => s + c.students, 0);
  const avg = Math.round(SAMPLE_ATTEMPTS.reduce((s, a) => s + a.score, 0) / SAMPLE_ATTEMPTS.length);
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-5">
        {user?.status === "pending" && (
          <div className="rounded-2xl border border-[#f5c9c4] bg-[#fdecea] px-4 py-3 text-sm">
            <b>Your application is under review.</b> You can set up quizzes and your profile now.
            Students see them once you’re approved.
          </div>
        )}
        <PageTitle
          title={`Welcome back, ${firstName(user, "Tunde")}`}
          sub={`${recent.length} quiz submissions and 2 messages are waiting for you.`}
        >
          <button
            type="button"
            onClick={() => toast("Material uploads are coming soon.")}
            className={btn.outline}
          >
            <Upload size={16} /> Upload material
          </button>
          <Link to="/tutor/quizzes/new" className={btn.primary}>
            <Plus size={16} /> Create quiz
          </Link>
        </PageTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatTile
            label="Active students"
            value={students}
            sub={`Across ${COHORTS.length} cohorts`}
            icon={<Users size={16} />}
          />
          <StatTile
            label="Average quiz score"
            value={`${avg}%`}
            sub="Last 30 days"
            icon={<BarChart3 size={16} />}
          />
          <StatTile
            label="Unread messages"
            value={2}
            sub="Reply within 24h"
            icon={<MessageCircle size={16} />}
            tint="red"
          />
          <StatTile
            label="Quizzes published"
            value={allQuizzes.filter((q) => q.tutorId === "tunde-bakare").length}
            sub="Shared with cohorts & online"
            icon={<Wallet size={16} />}
          />
        </div>
        <Card>
          <SectionTitle title="Your cohorts" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="text-left text-xs font-bold text-muted-foreground">
                  <th scope="col" className="pb-2.5">
                    Cohort
                  </th>
                  <th scope="col" className="pb-2.5">
                    Students
                  </th>
                  <th scope="col" className="pb-2.5">
                    Average progress
                  </th>
                  <th scope="col" className="pb-2.5">
                    Next session
                  </th>
                </tr>
              </thead>
              <tbody>
                {COHORTS.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="py-3.5 text-sm font-bold">{c.name}</td>
                    <td className="py-3.5 text-sm">{c.students}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <Progress value={c.progress} className="h-1.5 flex-1" />
                        <span className="w-9 text-[13px] font-bold">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-[13px] text-muted-foreground">{c.next}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <SectionTitle
            title="Latest quiz results"
            action={<Link to="/tutor/quizzes">See all</Link>}
          />
          {recent.map((a) => (
            <Link
              key={a.id}
              to="/tutor/quizzes/$quizId"
              params={{ quizId: a.quizId }}
              search={{}}
              className="flex items-center gap-3 border-t border-border py-3 hover:bg-surface"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <ClipboardCheck size={18} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-bold">{a.learner}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {allQuizzes.find((q) => q.id === a.quizId)?.title} · {a.source}
                </span>
              </span>
              <Pill tone={a.score >= 70 ? "green" : "red"}>{a.score}%</Pill>
            </Link>
          ))}
        </Card>
      </div>
      <aside className="flex flex-col gap-4">
        <Card>
          <SectionTitle title="Students who need a nudge" />
          <div className="flex flex-col gap-3.5">
            {NUDGE.map((n) => (
              <div key={n.name} className="flex items-center gap-3">
                <Avatar initials={n.initials} color={n.color} size={40} />
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-bold">{n.name}</span>
                  <span className="text-xs text-muted-foreground">{n.why}</span>
                </span>
                <Link
                  to="/tutor/messages"
                  search={{ c: n.c }}
                  aria-label={`Message ${n.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border"
                >
                  <MessageCircle size={18} />
                </Link>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Live classes" />
          <div className="flex flex-col gap-3">
            {[
              { t: "Figma auto layout", s: "Cohort 5 · Thu, 6:00 pm" },
              { t: "Logo design critique", s: "Graphics · Sat, 11:00 am" },
            ].map((l) => (
              <div key={l.t} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdecea] text-[#D7372C]">
                  <Video size={18} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{l.t}</span>
                  <span className="text-xs text-muted-foreground">{l.s}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Post to the tech feed" />
          <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
            Share news, tips or job openings with every DarlTech student.
          </p>
          <Link to="/tutor/feed" className={btn.outline + " h-10"}>
            <Pencil size={16} /> Write a post
          </Link>
        </Card>
      </aside>
    </div>
  );
}

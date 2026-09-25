import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Award,
  CalendarDays,
  Check,
  ClipboardCheck,
  Lock,
  MessageCircle,
  Play,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { courseById, naira, SCHOLARSHIP_FEE, tutorById } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, btn, Card, CourseTile, Pill, SectionTitle } from "@/components/academy/ui";

export const Route = createFileRoute("/student/courses/$courseId")({
  loader: ({ params }) => {
    const course = courseById(params.courseId);
    if (!course) throw notFound();
    return { courseId: course.id };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${courseById(loaderData?.courseId ?? "")?.name ?? "Course"} · DarlTech Academy` },
    ],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useLoaderData();
  const course = courseById(courseId)!;
  const tutor = tutorById(course.tutorId)!;
  const navigate = useNavigate();
  const { enrollments, watchPreview } = useAcademy();
  const enrolled = enrollments.find((e) => e.courseId === course.id);
  const [plan, setPlan] = useState<"full" | "scholarship">("full");
  const [preview, setPreview] = useState(false);
  const lessons = course.modules.reduce((s, m) => s + m.lessons, 0);
  const includes = [
    { icon: Video, text: `${lessons} video lessons` },
    { icon: CalendarDays, text: "Weekly live classes" },
    { icon: ClipboardCheck, text: `${course.modules.length} module quizzes` },
    { icon: MessageCircle, text: "Chat with your tutor" },
    { icon: Award, text: "DarlTech certificate" },
  ];

  const openPreview = () => {
    setPreview(true);
    watchPreview();
  };

  const enrollBox = (
    <Card className="p-6">
      {enrolled ? (
        <>
          <Pill tone="green">
            {enrolled.plan === "scholarship" ? "Scholarship under review" : "You’re enrolled"}
          </Pill>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick up where you left off on your dashboard.
          </p>
          <Link to="/student" className={cn(btn.big, "mt-4")}>
            Go to my dashboard
          </Link>
        </>
      ) : (
        <>
          <span className="text-[13px] font-bold text-muted-foreground">Course fee</span>
          <div className="mb-4 mt-1 font-display text-3xl font-extrabold">{naira(course.fee)}</div>
          <div role="radiogroup" aria-label="Payment option" className="flex flex-col gap-2">
            {[
              {
                id: "full" as const,
                title: "Pay full course fee",
                sub: "Instant access to every lesson",
              },
              {
                id: "scholarship" as const,
                title: "Apply for a scholarship",
                sub: `${naira(SCHOLARSHIP_FEE)} acceptance fee · reviewed by our team`,
              },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={plan === o.id}
                onClick={() => setPlan(o.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-3.5 text-left",
                  plan === o.id
                    ? "border-2 border-primary bg-[#f3f6fb]"
                    : "border border-border bg-white",
                )}
              >
                <span
                  className={cn(
                    "h-[22px] w-[22px] shrink-0 rounded-full",
                    plan === o.id ? "border-[7px] border-primary" : "border-2 border-border",
                  )}
                />
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold">{o.title}</span>
                  <span className="text-xs text-muted-foreground">{o.sub}</span>
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={cn(btn.big, "mt-4")}
            onClick={() =>
              navigate({
                to: "/student/checkout/$courseId",
                params: { courseId: course.id },
                search: { plan },
              })
            }
          >
            Enroll now
          </button>
          <button
            type="button"
            onClick={openPreview}
            className={cn(btn.outline, "mt-2.5 h-12 w-full")}
          >
            <Play size={16} /> Watch a free preview
          </button>
        </>
      )}
      <div className="my-5 h-px bg-border" />
      <span className="text-sm font-bold">This course includes</span>
      <ul className="mt-3 flex flex-col gap-2.5">
        {includes.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-sm">
            <Icon size={18} /> {text}
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex min-w-0 flex-col gap-5">
        <span className="text-[13px] text-muted-foreground">
          <Link to="/student/explore" className="font-bold text-[#D7372C] hover:underline">
            Explore
          </Link>{" "}
          / {course.name}
        </span>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <CourseTile course={course} size={112} radius={24} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Pill>{course.kind}</Pill>
              <Pill>{course.duration}</Pill>
              <Pill>Beginner friendly</Pill>
              <Pill tone="green">Certificate</Pill>
            </div>
            <h1 className="text-3xl font-extrabold">{course.name}</h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {course.summary}
            </p>
          </div>
        </div>
        <div className="lg:hidden">{enrollBox}</div>
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle title="What you’ll learn" />
            <ul className="flex flex-col gap-2.5">
              {course.learn.map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Check size={18} className="mt-0.5 shrink-0 text-[#16794a]" strokeWidth={2.6} />{" "}
                  {l}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <SectionTitle
              title="Curriculum"
              action={
                <span className="text-muted-foreground">{course.modules.length} modules</span>
              }
            />
            {course.modules.map((m, i) => (
              <div key={m.title} className="flex items-center gap-3 border-t border-border py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-[13px] font-extrabold">
                  {i + 1}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-bold">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{m.lessons} lessons</span>
                </span>
                {m.free || enrolled ? (
                  <button type="button" onClick={openPreview}>
                    <Pill tone="green">{enrolled ? "Open" : "Free preview"}</Pill>
                  </button>
                ) : (
                  <Lock size={16} className="text-muted-foreground" aria-label="Locked" />
                )}
              </div>
            ))}
          </Card>
        </div>
        <Card>
          <div className="flex flex-wrap items-center gap-3.5">
            <Avatar initials={tutor.initials} color={tutor.color} size={52} />
            <div className="flex flex-1 flex-col">
              <span className="text-xs font-bold text-muted-foreground">YOUR TUTOR</span>
              <span className="text-base font-extrabold">{tutor.name}</span>
              <span className="text-[13px] text-muted-foreground">{tutor.headline}</span>
            </div>
            <Link
              to="/student/tutors/$tutorId"
              params={{ tutorId: tutor.id }}
              className={btn.outline + " h-10"}
            >
              View profile
            </Link>
          </div>
        </Card>
      </div>
      <aside className="hidden lg:block">{enrollBox}</aside>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Free preview lesson"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 p-4"
          onClick={() => setPreview(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative flex aspect-video items-center justify-center text-white"
              style={{ background: course.color }}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Play size={36} />
              </span>
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreview(false)}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D7372C]">
                Free preview · Lesson 1.1
              </span>
              <span className="text-lg font-extrabold">{course.modules[0].title}</span>
              <span className="text-sm text-muted-foreground">
                Lesson videos will play here once they’re uploaded.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

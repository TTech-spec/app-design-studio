import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ClipboardCheck, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { COURSES, courseById } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, btn, CourseTile, Logo, Pill, Progress } from "@/components/academy/ui";

export const Route = createFileRoute("/tour")({
  head: () => ({ meta: [{ title: "App tour · DarlTech Academy" }] }),
  component: Tour,
});

const shadow = "shadow-[0_6px_20px_-8px_rgba(14,42,84,0.25)]";

function CoursesVisual() {
  return (
    <div className="flex w-full flex-col gap-3">
      {[COURSES[1], COURSES[3], COURSES[0]].map((c) => (
        <div key={c.id} className={cn("flex items-center gap-3 rounded-2xl bg-white p-3", shadow)}>
          <CourseTile course={c} size={48} />
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-bold">{c.name}</span>
            <span className="text-xs text-muted-foreground">
              {c.kind} · {c.duration}
            </span>
          </div>
          <Pill tone="green">Free preview</Pill>
        </div>
      ))}
    </div>
  );
}
function QuizVisual() {
  return (
    <div className="relative w-full">
      <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-white p-4", shadow)}>
        <span className="text-xs font-bold text-muted-foreground">Question 3 of 10</span>
        <Progress value={30} className="h-1.5" />
        <span className="text-sm font-bold leading-snug">
          Which should you build to test information architecture early?
        </span>
        {["Hi-fi mockups", "Low-fi wireframes", "Coded prototype"].map((o, i) => (
          <div
            key={o}
            className={cn(
              "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold",
              i === 1 ? "border-2 border-primary bg-[#f3f6fb]" : "border border-border",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-md text-xs font-extrabold",
                i === 1 ? "bg-primary text-white" : "bg-surface-2",
              )}
            >
              {"ABC"[i]}
            </span>
            {o}
          </div>
        ))}
      </div>
      <span className="absolute -right-1.5 -top-4 flex h-[34px] items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-white">
        <TrendingUp size={14} /> 84% average
      </span>
    </div>
  );
}
function ChatVisual() {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5">
        <Avatar initials="TB" color="#1a3d72" size={36} />
        <span className="flex flex-col">
          <span className="text-[13px] font-bold">Tunde Bakare</span>
          <span className="text-[11px] text-muted-foreground">Your UI/UX tutor · online</span>
        </span>
      </div>
      <div className="max-w-[230px] self-start rounded-[14px_14px_14px_4px] bg-white px-3.5 py-2.5 text-[13px] leading-snug">
        Nice work! Merge the two address screens and add a progress bar.
      </div>
      <div className="max-w-[230px] self-end rounded-[14px_14px_4px_14px] bg-primary px-3.5 py-2.5 text-[13px] leading-snug text-white">
        Thanks Tunde! Updating it now.
      </div>
      <div className="max-w-[230px] self-start rounded-[14px_14px_14px_4px] bg-white px-3.5 py-2.5 text-[13px] leading-snug">
        Share it before Thursday’s live class.
      </div>
    </div>
  );
}
function FeedVisual() {
  const c = courseById("ui-ux-design")!;
  return (
    <div className="flex w-full flex-col gap-3">
      <div className={cn("flex flex-col gap-2 rounded-2xl bg-white p-3.5", shadow)}>
        <div className="flex items-center gap-2">
          <Avatar initials="TB" color="#1a3d72" size={30} />
          <span className="text-[13px] font-bold">Tunde Bakare</span>
          <Pill tone="red">Tutor</Pill>
        </div>
        <span className="text-[13px] leading-snug">
          What hiring managers look for in a junior UX portfolio
        </span>
        <div className="flex gap-3.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart size={14} />
            128
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            34
          </span>
        </div>
      </div>
      <div className={cn("flex items-center gap-3 rounded-2xl bg-white p-3", shadow)}>
        <CourseTile course={c} size={44} />
        <span className="flex flex-1 flex-col">
          <span className="text-[13px] font-bold">UX Research Field Guide</span>
          <span className="text-xs text-muted-foreground">E-book · ₦6,500</span>
        </span>
        <Pill>Store</Pill>
      </div>
    </div>
  );
}

const STEPS: { title: string; body: string; visual: ReactNode }[] = [
  {
    title: "Courses built for real tech jobs",
    body: "Browse six programmes, from AI Automation to Cybersecurity. Watch free preview lessons, then enroll when you’re ready.",
    visual: <CoursesVisual />,
  },
  {
    title: "Quizzes that show your progress",
    body: "Short quizzes after every module show what you’ve mastered and what to revisit. Tutors also share free quizzes anyone can take.",
    visual: <QuizVisual />,
  },
  {
    title: "Your tutor is one message away",
    body: "Ask questions, share your work and get feedback from your tutor and your cohort group.",
    visual: <ChatVisual />,
  },
  {
    title: "Stay current with the tech feed",
    body: "News, tips, events and job openings from tutors and students. Plus a store for e-books and templates.",
    visual: <FeedVisual />,
  },
];

function Tour() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { completeTour } = useAcademy();
  const done = () => {
    completeTour();
    navigate({ to: "/student" });
  };
  const s = STEPS[i];
  return (
    <div className="academy flex min-h-screen items-stretch justify-center bg-white lg:items-center lg:bg-primary/90 lg:p-8">
      <div className="flex w-full max-w-[440px] flex-col px-6 pb-8 pt-6 lg:max-w-[920px] lg:rounded-[28px] lg:bg-white lg:p-8">
        <div className="flex h-11 items-center justify-between">
          {i > 0 ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() => setI(i - 1)}
              className="-ml-3 flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface"
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          ) : (
            <Logo />
          )}
          <button
            type="button"
            onClick={done}
            className="h-11 text-sm font-bold text-[#D7372C] hover:underline"
          >
            Skip tour
          </button>
        </div>
        <div className="mt-4 flex flex-1 flex-col lg:flex-row lg:items-stretch lg:gap-8">
          <div className="flex h-[380px] items-center justify-center rounded-[28px] bg-surface-2 px-6 py-7 lg:w-[400px] lg:shrink-0">
            {s.visual}
          </div>
          <div className="flex flex-1 flex-col lg:pt-6">
            <p className="mt-8 text-[13px] font-bold text-[#D7372C] lg:mt-0">
              App tour · {i + 1} of 4
            </p>
            <h1 className="mt-2 text-[26px] font-extrabold leading-tight lg:text-[30px]">
              {s.title}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground lg:text-base">
              {s.body}
            </p>
            <div className="min-h-8 flex-1" />
            <div className="mb-5 flex justify-center gap-1.5 lg:justify-start">
              {STEPS.map((_, k) => (
                <span
                  key={k}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    k === i ? "w-6 bg-primary" : "w-2 bg-[#c9d1e2]",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              className={btn.big}
              onClick={() => (i < 3 ? setI(i + 1) : done())}
            >
              {i < 3 ? "Next" : "Go to my dashboard"}
            </button>
          </div>
        </div>
        <Link to="/student" className="sr-only">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

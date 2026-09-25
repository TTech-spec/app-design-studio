import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, GraduationCap, Presentation } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthLayout, StepHeader } from "@/components/academy/auth";
import { btn } from "@/components/academy/ui";

export const Route = createFileRoute("/join/")({
  head: () => ({ meta: [{ title: "Join DarlTech Academy" }] }),
  component: ChooseRole,
});

const ROLES = [
  {
    id: "student" as const,
    icon: GraduationCap,
    color: "#0E2A54",
    title: "I want to learn",
    body: "Look around for free, then enroll in a course, take quizzes, chat with tutors and earn a certificate.",
  },
  {
    id: "tutor" as const,
    icon: Presentation,
    color: "#EF4136",
    title: "I want to teach",
    body: "Apply as a tutor. Run cohorts, set and share quizzes, sell course materials and guide students.",
  },
];

function ChooseRole() {
  const [role, setRole] = useState<"student" | "tutor">("student");
  return (
    <AuthLayout>
      <StepHeader />
      <div className="mt-7">
        <p className="text-[13px] font-semibold text-muted-foreground">Create a free account</p>
        <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight lg:text-[32px]">
          How do you want to join DarlTech?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Students and tutors get their own sign-up and their own dashboard.
        </p>
      </div>
      <div role="radiogroup" aria-label="Choose your role" className="mt-7 flex flex-col gap-3.5">
        {ROLES.map((r) => {
          const on = role === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setRole(r.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition",
                on ? "border-primary bg-[#f3f6fb]" : "border-border bg-white hover:bg-surface",
              )}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-white"
                style={{ background: r.color }}
              >
                <Icon size={24} />
              </span>
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-[17px] font-bold">{r.title}</span>
                <span className="text-[13px] leading-relaxed text-muted-foreground">{r.body}</span>
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                  on ? "border-primary bg-primary text-white" : "border-border",
                )}
              >
                {on && <Check size={14} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="min-h-8 flex-1" />
      <Link
        to={role === "student" ? "/join/student" : "/join/tutor"}
        className={cn(btn.big, "mt-8")}
      >
        Continue as a {role}
      </Link>
      <p className="mt-3.5 text-center text-[13px] text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[#D7372C] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

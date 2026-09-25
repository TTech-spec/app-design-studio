import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  ClipboardCheck,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Bot,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  courseById,
  naira,
  type Course,
  type Material,
  type Post,
  type Quiz,
  type Tutor,
} from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";

export const CTA = "#D7372C";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#D7372C] px-5 h-11 text-sm font-bold text-white transition hover:bg-[#b52d24] disabled:cursor-not-allowed disabled:bg-[#e4e8f0] disabled:text-[#7a86a0]",
  navy: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 h-11 text-sm font-bold text-white transition hover:bg-[#1a3d72]",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 h-11 text-sm font-bold text-primary transition hover:bg-surface",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 h-11 text-sm font-semibold text-muted-foreground hover:bg-surface",
  big: "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D7372C] text-base font-bold text-white transition hover:bg-[#b52d24] disabled:cursor-not-allowed disabled:bg-[#e4e8f0] disabled:text-[#7a86a0]",
};

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[10px] font-display text-[17px] font-extrabold",
          light ? "bg-white text-primary" : "bg-primary text-white",
        )}
      >
        D
      </span>
      <span
        className={cn(
          "font-display text-base font-extrabold",
          light ? "text-white" : "text-primary",
        )}
      >
        DarlTech <span className={light ? "text-[#ff8a80]" : "text-[#EF4136]"}>Academy</span>
      </span>
    </span>
  );
}

export function Avatar({
  initials,
  color,
  size = 40,
  className,
}: {
  initials: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.max(10, Math.round(size * 0.34)),
      }}
    >
      {initials}
    </span>
  );
}

type Tone = "soft" | "navy" | "green" | "red" | "white";
const TONES: Record<Tone, string> = {
  soft: "bg-primary-soft text-primary",
  navy: "bg-primary text-white",
  green: "bg-[#e3f3ea] text-[#16794a]",
  red: "bg-[#fdecea] text-[#D7372C]",
  white: "bg-white text-primary border border-border",
};
export function Pill({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-bold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Progress({
  value,
  color = "#0E2A54",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-white p-5", className)}>
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3.5 flex items-center justify-between gap-3", className)}>
      <h2 className="text-[17px] font-extrabold">{title}</h2>
      {action && (
        <div className="text-[13px] font-bold text-[#D7372C] [&_a]:hover:underline">{action}</div>
      )}
    </div>
  );
}

export function PageTitle({
  title,
  sub,
  children,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold md:text-[28px]">{title}</h1>
        {sub && <p className="mt-1.5 text-[15px] text-muted-foreground">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2.5">{children}</div>}
    </div>
  );
}

export function CourseTile({
  course,
  size = 56,
  radius = 12,
}: {
  course: Course;
  size?: number;
  radius?: number;
}) {
  const Icon = course.icon;
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center text-white"
      style={{ width: size, height: size, borderRadius: radius, background: course.color }}
    >
      <Icon size={Math.round(size * 0.45)} strokeWidth={1.8} />
    </span>
  );
}

export function CourseCard({ course, className }: { course: Course; className?: string }) {
  const Icon = course.icon;
  return (
    <Link
      to="/student/courses/$courseId"
      params={{ courseId: course.id }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div
        className="flex h-28 items-center justify-center text-white"
        style={{ background: course.color }}
      >
        <Icon size={40} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs font-bold text-muted-foreground">
          {course.kind} · {course.duration}
        </span>
        <span className="text-[17px] font-extrabold">{course.name}</span>
        <span className="mt-1 flex items-center justify-between">
          <Pill tone="green">Free preview</Pill>
          <span className="flex items-center gap-1 text-[13px] font-bold text-[#D7372C] group-hover:underline">
            View course <ChevronRight size={16} />
          </span>
        </span>
      </div>
    </Link>
  );
}

export function CourseRow({ course }: { course: Course }) {
  return (
    <Link
      to="/student/courses/$courseId"
      params={{ courseId: course.id }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3 transition hover:bg-surface"
    >
      <CourseTile course={course} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] font-bold">{course.name}</span>
        <span className="text-xs text-muted-foreground">
          {course.kind} · {course.duration}
        </span>
        <span>
          <Pill tone="green">Free preview</Pill>
        </span>
      </span>
      <ChevronRight size={20} className="text-muted-foreground" />
    </Link>
  );
}

export function Rating({ value, students }: { value: number; students?: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star size={13} className="fill-[#c98a1a] text-[#c98a1a]" />
      <span className="font-bold text-primary">{value}</span>
      {students !== undefined && <span>· {students} students</span>}
    </span>
  );
}

export function TutorRow({
  tutor,
  base = "student",
}: {
  tutor: Tutor;
  base?: "student" | "tutor";
}) {
  const inner = (
    <>
      <Avatar initials={tutor.initials} color={tutor.color} size={44} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-bold">{tutor.name}</span>
        <span className="truncate text-xs text-muted-foreground">{tutor.role}</span>
        <Rating value={tutor.rating} students={tutor.students} />
      </span>
      <span className="inline-flex h-10 items-center rounded-[10px] border border-border px-3.5 text-[13px] font-bold">
        View
      </span>
    </>
  );
  return base === "student" ? (
    <Link
      to="/student/tutors/$tutorId"
      params={{ tutorId: tutor.id }}
      className="flex items-center gap-3 rounded-xl transition hover:bg-surface"
    >
      {inner}
    </Link>
  ) : (
    <div className="flex items-center gap-3">{inner}</div>
  );
}

export function QuizPromo({
  quiz,
  className,
  wide = false,
}: {
  quiz: Quiz;
  className?: string;
  wide?: boolean;
}) {
  return (
    <Link
      to="/q/$quizId"
      params={{ quizId: quiz.id }}
      className={cn(
        "flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 transition hover:bg-surface-2",
        className,
      )}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D7372C] text-white">
        <ClipboardCheck size={24} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-bold tracking-wide text-[#D7372C]">
          {quiz.openToAll ? "FREE · OPEN TO ALL" : "FREE QUIZ"}
        </span>
        <span className="text-[15px] font-extrabold">{quiz.title}</span>
        <span className="text-xs text-muted-foreground">
          {quiz.questions.length} questions · {quiz.minutes} min
        </span>
      </span>
      <span
        className={cn(
          "hidden h-10 shrink-0 items-center rounded-[10px] bg-primary px-4 text-[13px] font-bold text-white",
          wide && "sm:inline-flex",
        )}
      >
        Take quiz
      </span>
    </Link>
  );
}

export function PostCard({ post, quiz }: { post: Post; quiz?: Quiz }) {
  const { likes, toggleLike } = useAcademy();
  const liked = likes.includes(post.id);
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center gap-3">
        <Avatar initials={post.initials} color={post.color} size={44} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex flex-wrap items-center gap-2 text-[15px] font-bold">
            {post.author}
            <Pill tone={post.role === "Tutor" ? "red" : "soft"}>{post.role}</Pill>
          </span>
          <span className="text-xs text-muted-foreground">
            {post.topic} · {post.time}
          </span>
        </div>
      </div>
      <p className="my-3.5 whitespace-pre-line text-[15px] leading-relaxed">{post.text}</p>
      {quiz && <QuizPromo quiz={quiz} wide />}
      {post.event && (
        <div className="flex items-center gap-4 rounded-2xl bg-primary p-4 text-white">
          <Bot size={36} strokeWidth={1.6} />
          <div className="flex flex-col gap-1">
            <span className="font-display text-base font-extrabold">{post.event.title}</span>
            <span className="text-[13px] text-white/80">{post.event.detail}</span>
          </div>
        </div>
      )}
      <div className="mt-3">
        <Pill>#{post.topic.toLowerCase()}</Pill>
      </div>
      <div className="mt-2.5 flex gap-1 border-t border-border pt-2">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          aria-pressed={liked}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-[13px] font-semibold hover:bg-surface",
            liked ? "text-[#D7372C]" : "text-muted-foreground",
          )}
        >
          <Heart size={18} className={liked ? "fill-[#D7372C]" : ""} />{" "}
          {post.likes + (liked ? 1 : 0)}
        </button>
        <span className="inline-flex h-10 items-center gap-2 px-3 text-[13px] font-semibold text-muted-foreground">
          <MessageCircle size={18} /> {post.comments}
        </span>
        <button
          type="button"
          onClick={() => {
            const url = typeof window !== "undefined" ? window.location.href : "";
            if (typeof navigator !== "undefined" && navigator.share)
              navigator.share({ text: post.text, url }).catch(() => {});
            else if (typeof navigator !== "undefined") navigator.clipboard?.writeText(url);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-[13px] font-semibold text-muted-foreground hover:bg-surface"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </Card>
  );
}

export function MaterialCard({ material, action }: { material: Material; action?: ReactNode }) {
  const course = courseById(material.courseId);
  const Icon = course?.icon ?? Bot;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div
        aria-hidden="true"
        className="flex h-24 items-center justify-center text-white"
        style={{ background: course?.color ?? "#0E2A54" }}
      >
        <Icon size={30} strokeWidth={1.6} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7372C]">
          {material.type}
        </span>
        <span className="flex-1 text-sm font-bold leading-snug">{material.title}</span>
        <span className="text-xs text-muted-foreground">{course?.name}</span>
        <span className="mb-2 mt-1 text-[15px] font-extrabold">{naira(material.price)}</span>
        {action}
      </div>
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  icon,
  tint = "soft",
}: {
  label: string;
  value: ReactNode;
  sub: string;
  icon: ReactNode;
  tint?: "soft" | "red";
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-[10px] text-primary",
            tint === "red" ? "bg-[#fdecea]" : "bg-primary-soft",
          )}
        >
          {icon}
        </span>
      </div>
      <span className="font-display text-2xl font-extrabold leading-none md:text-[28px]">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </div>
  );
}

export function ChipTabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
    >
      {items.map((t) => (
        <button
          key={t}
          role="tab"
          type="button"
          aria-selected={t === value}
          onClick={() => onChange(t)}
          className={cn(
            "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-[13px] font-semibold transition",
            t === value
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-primary hover:bg-surface",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#b9c3d8] bg-white px-6 py-10 text-center">
      <span className="text-base font-extrabold">{title}</span>
      <span className="max-w-sm text-sm text-muted-foreground">{body}</span>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function SuccessArt({
  kind = "cert",
  className,
}: {
  kind?: "cert" | "review";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 260"
      aria-hidden="true"
      className={cn("mx-auto block h-auto w-full max-w-[320px]", className)}
    >
      <path
        d="M96 70c30-34 104-40 140-6 34 32 30 92 4 124-30 36-118 44-156 8-34-32-22-90 12-126z"
        fill="#eef1f8"
      />
      <path
        d="M0 150c60-40 120-70 190-72"
        fill="none"
        stroke="#0E2A54"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M0 168c70-46 140-74 210-72"
        fill="none"
        stroke="#1a3d72"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M140 190c60-8 120-50 180-110"
        fill="none"
        stroke="#0E2A54"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M150 206c60-4 120-44 170-100"
        fill="none"
        stroke="#EF4136"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <g transform="rotate(-6 160 130)">
        <rect x="98" y="62" width="124" height="142" rx="14" fill="#0E2A54" />
        <rect x="104" y="74" width="112" height="124" rx="8" fill="#ffffff" />
        <rect x="136" y="54" width="48" height="16" rx="6" fill="#EF4136" />
        {kind === "cert" ? (
          <>
            <rect x="120" y="92" width="80" height="8" rx="4" fill="#0E2A54" />
            <rect x="108" y="110" width="104" height="6" rx="3" fill="#eef1f8" />
            <rect x="118" y="124" width="84" height="6" rx="3" fill="#eef1f8" />
            <circle cx="160" cy="160" r="18" fill="#EF4136" />
            <path
              d="m151 160 6 6 12-12"
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <circle cx="160" cy="98" r="14" fill="#eef1f8" />
            <rect x="120" y="122" width="80" height="8" rx="4" fill="#0E2A54" />
            <rect x="112" y="138" width="96" height="6" rx="3" fill="#eef1f8" />
            <circle cx="160" cy="172" r="16" fill="#fff" stroke="#EF4136" strokeWidth="4" />
            <path
              d="M160 164v8l5 4"
              fill="none"
              stroke="#EF4136"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
      <path d="M60 58l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#0E2A54" />
      <path d="M258 150l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#EF4136" />
      <path d="M76 198l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#EF4136" />
    </svg>
  );
}

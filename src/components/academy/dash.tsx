import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { courseById } from "@/lib/academy/data";
import {
  fmtEvent,
  timeAgo,
  useAnnouncements,
  useCommunityStats,
  useEvents,
  useFeed,
  useFeedActions,
  usePublicSettings,
  useTutorSubmissions,
  type FeedItem,
} from "@/lib/academy/live";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  GraduationCap,
  Headphones,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Pin,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Star,
  ThumbsUp,
  Trophy,
  Upload,
  Users,
  Video,
  Wallet,
  HelpCircle,
  Lightbulb,
  BadgeCheck,
  Library,
  type LucideIcon,
} from "lucide-react";
import heroStudent from "@/assets/hero-student.webp";
import academyLogo from "@/assets/portal/darltech-academy-logo.png";
import { cn } from "@/lib/utils";
import { firstName, useAcademy } from "@/lib/academy/store";

/*
 * DarlTech dashboards (student, tutor, admin) and community page,
 * built to the "Do Extraordinary Things" dashboard designs.
 */

export const NAVY = "#0B1F4D";
export const RED = "#E1251B";

/* ---------------- motion helpers ---------------- */

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3, boxShadow: "0 12px 30px -12px rgba(11,31,77,.25)" }}
      className={cn("rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", className)}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up with GSAP when it mounts. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) =>
      prefix +
      n.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;
    if (reduce) {
      el.textContent = fmt(value);
      return;
    }
    const o = { n: 0 };
    const t = gsap.to(o, {
      n: value,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt(o.n);
      },
    });
    return () => {
      t.kill();
    };
  }, [value, prefix, suffix, decimals, reduce]);
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/** Progress bar that fills with GSAP. */
function Bar({ pct, className }: { pct: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const t = gsap.fromTo(
      ref.current,
      { width: "0%" },
      { width: `${pct}%`, duration: 1.2, ease: "power3.out", delay: 0.2 },
    );
    return () => {
      t.kill();
    };
  }, [pct]);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}>
      <div ref={ref} className="h-full rounded-full" style={{ backgroundColor: RED }} />
    </div>
  );
}

function Avatar({ name, size = 40, src }: { name: string; size?: number; src?: string }) {
  const colors = ["#0B1F4D", "#E1251B", "#2563EB", "#7C3AED", "#059669", "#D97706"];
  const c = colors[name.length % colors.length];
  if (src)
    return (
      <img
        src={src}
        alt={name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: c, fontSize: size * 0.36 }}
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

function SectionHead({
  title,
  to = "#",
  label = "View All",
}: {
  title: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-bold" style={{ color: NAVY }}>
        {title}
      </h3>
      <a
        href={to}
        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
      >
        {label} <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "red" | "green" | "amber" | "blue";
  children: ReactNode;
}) {
  const map = {
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", map[tone])}>
      {children}
    </span>
  );
}

function RedBtn({
  children,
  to,
  className,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[.98]",
    className,
  );
  return to ? (
    <a href={to} className={cls} style={{ backgroundColor: RED }}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls} style={{ backgroundColor: RED }}>
      {children}
    </button>
  );
}

function StatCard({
  icon: Icon,
  tint,
  label,
  children,
}: {
  icon: LucideIcon;
  tint: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Card className="flex items-center gap-4">
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: `${tint}1a`, color: tint }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="text-xl font-extrabold" style={{ color: NAVY }}>
          {children}
        </div>
      </div>
    </Card>
  );
}

/* ---------------- shell ---------------- */

type Nav = { label: string; icon: LucideIcon; to: string; badge?: number };
export type DashRole = "student" | "tutor" | "admin";

const NAVS: Record<DashRole, Nav[]> = {
  student: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/student" },
    { label: "My Course", icon: BookOpen, to: "/student/explore" },
    { label: "Assignments", icon: ClipboardList, to: "/student/quizzes" },
    { label: "Quizzes", icon: HelpCircle, to: "/student/quizzes" },
    { label: "Projects", icon: FolderKanban, to: "/student/feed" },
    { label: "Community", icon: Users, to: "/student/community" },
    { label: "Certificates", icon: Award, to: "/student/profile" },
    { label: "Messages", icon: MessageSquare, to: "/student/messages", badge: 2 },
    { label: "Settings", icon: Settings, to: "/student/profile" },
  ],
  tutor: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/tutor" },
    { label: "My Courses", icon: BookOpen, to: "/tutor/quizzes" },
    { label: "Students", icon: Users, to: "/tutor" },
    { label: "Assignments", icon: ClipboardList, to: "/tutor/quizzes" },
    { label: "Live Classes", icon: Video, to: "/tutor" },
    { label: "Resources", icon: Library, to: "/tutor/feed" },
    { label: "Messages", icon: MessageSquare, to: "/tutor/messages", badge: 1 },
    { label: "Settings", icon: Settings, to: "/tutor/profile" },
  ],
  admin: [
    { label: "Dashboard", icon: Home, to: "/admin" },
    { label: "Users", icon: Users, to: "/admin" },
    { label: "Courses", icon: BookOpen, to: "/admin" },
    { label: "Applications", icon: FileText, to: "/admin" },
    { label: "Payments", icon: CreditCard, to: "/admin" },
    { label: "Scholarships", icon: GraduationCap, to: "/admin" },
    { label: "Reports", icon: BarChart3, to: "/admin" },
    { label: "Settings", icon: Settings, to: "/admin" },
  ],
};

export function DashShell({
  role,
  children,
  searchPlaceholder = "Search anything...",
}: {
  role: DashRole;
  children: ReactNode;
  searchPlaceholder?: string;
}) {
  const { user, signOut } = useAcademy();
  const path = useLocation({ select: (l) => l.pathname.replace(/\/$/, "") });
  const navigate = useNavigate();
  const nav = NAVS[role];
  const activeIdx = nav.findIndex((n) => n.to === path);
  const name =
    role === "admin"
      ? "Admin"
      : (user?.name ?? (role === "student" ? "Ada Okafor" : "Dr. Michael A."));
  const roleLabel = role === "admin" ? "Super Admin" : role === "student" ? "Student" : "Tutor";

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col px-4 py-6 text-white lg:flex"
        style={{ backgroundColor: NAVY }}
      >
        <a href="/" className="px-2">
          <div className="flex items-center gap-2">
            <img
              src={academyLogo}
              alt=""
              className="h-11 w-11 rounded-full bg-white object-contain p-0.5"
            />
            <span className="text-lg font-extrabold leading-tight">
              DarlTech
              <br />
              Academy
            </span>
          </div>
          <p className="mt-2 text-sm italic text-white/80">Do Extraordinary Things</p>
        </a>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((n, i) => {
            const on = i === (activeIdx === -1 ? 0 : activeIdx);
            return (
              <Link
                key={n.label}
                to={n.to as never}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition",
                  on ? "text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                {on && (
                  <motion.span
                    layoutId={`dash-active-${role}`}
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: RED }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <n.icon className="relative h-5 w-5" />
                <span className="relative">{n.label}</span>
                {n.badge ? (
                  <span
                    className="relative ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold"
                    style={{ backgroundColor: RED }}
                  >
                    {n.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Headphones className="h-7 w-7" />
            <div>
              <p className="text-sm font-semibold">Need Help?</p>
              <a href="/help-center" className="text-xs text-white/80 hover:text-white">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="mt-4 flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white"
        >
          <LogOut className="h-5 w-5" /> Log Out
        </button>
      </motion.aside>

      <div className="min-w-0 flex-1">
        <header
          className={cn(
            "sticky top-0 z-20 h-[72px]",
            role === "admin" ? "flex" : "hidden lg:flex",
            " items-center gap-4 border-b border-slate-100 bg-white/90 px-6 backdrop-blur",
          )}
        >
          <label className="flex h-11 w-full max-w-md items-center gap-3 rounded-xl bg-[#EEF2FA] px-4 text-slate-500">
            <Search className="h-5 w-5" />
            <input
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
            />
          </label>
          <div className="flex-1" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white"
              style={{ backgroundColor: RED }}
            >
              {role === "admin" ? 3 : 2}
            </span>
          </motion.button>
          <div className="flex items-center gap-3">
            <Avatar name={name} src={role === "student" ? heroStudent : undefined} size={42} />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold" style={{ color: NAVY }}>
                {name}
              </p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

/* ---------------- shared live bits ---------------- */

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-100", className)} />;
}

function EmptyNote({
  icon: Icon,
  text,
  action,
}: {
  icon: LucideIcon;
  text: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-2 py-6 text-center"
    >
      <motion.span
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-slate-400"
      >
        <Icon className="h-5 w-5" />
      </motion.span>
      <p className="text-sm text-slate-500">{text}</p>
      {action}
    </motion.div>
  );
}

function CourseArt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0B1F4D] to-[#1E3A8A] font-bold text-blue-200",
        className,
      )}
    >
      &lt;/&gt;
    </div>
  );
}

/* ---------------- student dashboard ---------------- */

export function StudentDash() {
  const { user, enrollments, attempts, allQuizzes } = useAcademy();
  const name = user ? firstName(user) : "there";
  const events = useEvents();
  const feed = useFeed();
  const settings = usePublicSettings();

  const latest = [...enrollments].reverse().find((e) => courseById(e.courseId));
  const course = latest ? courseById(latest.courseId) : undefined;
  const progress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;
  const myCourses = new Set(enrollments.map((e) => e.courseId));
  const done = new Set(attempts.map((a) => a.quizId));
  const openQuizzes = allQuizzes.filter(
    (q) => !done.has(q.id) && (q.openToAll || myCourses.has(q.courseId)),
  );
  const certificates = enrollments.filter((e) => e.progress >= 100).length;

  const activities = [
    ...(events.data ?? []).slice(0, 3).map((e) => ({
      key: e.id,
      icon: e.kind === "deadline" ? Calendar : Play,
      t: e.title,
      d: fmtEvent(e.starts_at),
      tag: e.link ? (
        <a href={e.link} target="_blank" rel="noreferrer">
          <Pill tone="blue">Join</Pill>
        </a>
      ) : (
        <Pill tone={e.kind === "deadline" ? "red" : "blue"}>
          {e.kind === "deadline" ? "Due" : "Soon"}
        </Pill>
      ),
    })),
    ...openQuizzes.slice(0, 2).map((q) => ({
      key: q.id,
      icon: Trophy,
      t: `Quiz: ${q.title}`,
      d: q.due ? `Due ${q.due}` : `${q.minutes} min`,
      tag: (
        <Link to="/quiz/$quizId" params={{ quizId: q.id }}>
          <Pill tone="blue">Start</Pill>
        </Link>
      ),
    })),
  ].slice(0, 4);

  return (
    <DashShell role="student">
      <Stagger className="flex flex-col gap-5">
        <motion.div variants={item} className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E8EEFB] to-[#F4F6FB] p-8">
            <h1 className="text-3xl font-extrabold" style={{ color: NAVY }}>
              Welcome back, {name}!
            </h1>
            <p className="mt-2 text-slate-700">
              {enrollments.length
                ? "Keep learning. Keep growing. You're doing great!"
                : "Pick your first course to get started."}
            </p>
            <RedBtn to="/student/explore" className="mt-5">
              {enrollments.length ? "Continue Learning" : "Explore Courses"}{" "}
              <ArrowRight className="h-4 w-4" />
            </RedBtn>
          </div>
          <motion.div
            whileHover={{ rotate: -1, scale: 1.02 }}
            className="flex items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-[#E8EEFB] to-white p-6 shadow-sm"
          >
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <GraduationCap className="h-14 w-14" style={{ color: NAVY }} />
            </motion.span>
            <div>
              <p className="text-xl font-bold" style={{ color: NAVY }}>
                Do Extraordinary Things
              </p>
              <svg viewBox="0 0 200 12" className="mt-1 h-3 w-40">
                <path
                  d="M2 10 Q 100 0 198 6"
                  stroke={RED}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={BookOpen} tint="#2563EB" label="Course Progress">
            <CountUp value={progress} suffix="%" />
            <Bar pct={progress} className="mt-2" />
          </StatCard>
          <StatCard icon={Calendar} tint={RED} label="Quizzes">
            <CountUp value={openQuizzes.length} /> Available
          </StatCard>
          <StatCard icon={Trophy} tint="#D97706" label="Certificates">
            <CountUp value={certificates} /> Earned
          </StatCard>
          <StatCard icon={Users} tint="#2563EB" label="Community">
            <Link
              to="/student/community"
              className="inline-flex items-center gap-1 text-lg"
              style={{ color: RED }}
            >
              Join Now <ArrowRight className="h-4 w-4" />
            </Link>
          </StatCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_1fr]">
          <Card>
            <SectionHead
              title="My Course"
              label={course ? "View Course" : "Browse"}
              to={course ? `/student/courses/${course.id}` : "/student/explore"}
            />
            {course && latest ? (
              <div className="flex flex-col gap-5 sm:flex-row">
                <CourseArt className="h-36 w-full text-4xl sm:w-48" />
                <div className="flex-1">
                  <p className="text-lg font-bold" style={{ color: NAVY }}>
                    {course.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.duration} ·{" "}
                    {latest.plan === "scholarship" ? "Scholarship" : "Full plan"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{latest.progress}% Complete</p>
                  <Bar pct={latest.progress} className="mt-2" />
                  <RedBtn to={`/student/courses/${course.id}`} className="mt-5 w-full">
                    Continue Learning <ArrowRight className="h-4 w-4" />
                  </RedBtn>
                </div>
              </div>
            ) : (
              <EmptyNote
                icon={BookOpen}
                text="You haven't enrolled in a course yet."
                action={<RedBtn to="/student/explore">Explore courses</RedBtn>}
              />
            )}
          </Card>

          <Card>
            <SectionHead title="Upcoming Activities" to="/student/quizzes" />
            {events.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : activities.length ? (
              <ul className="space-y-4">
                {activities.map((a, i) => (
                  <motion.li
                    key={a.key}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.06 } }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50"
                      style={{ color: RED }}
                    >
                      <a.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                        {a.t}
                      </p>
                      <p className="text-xs text-slate-500">{a.d}</p>
                    </div>
                    {a.tag}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <EmptyNote icon={Calendar} text="Nothing scheduled right now." />
            )}
          </Card>

          <Card>
            <SectionHead title="Community" to="/student/community" />
            {feed.isLoading ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : feed.data?.length ? (
              <div className="space-y-4">
                {feed.data.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex gap-3">
                    <Avatar name={p.author} size={36} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>
                        {p.author}
                      </p>
                      <p className="text-xs text-slate-400">{timeAgo(p.created_at)}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-700">{p.text}</p>
                      <p className="mt-1 flex gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {p.likes}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {p.comments}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyNote
                icon={Users}
                text="No posts yet. Start the conversation!"
                action={
                  <Link to="/student/community" className="text-sm font-semibold text-blue-600">
                    Go to community →
                  </Link>
                }
              />
            )}
          </Card>
        </div>

        {settings.data?.applications_open !== false && (
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#E8EEFB] px-6 py-4"
          >
            <Megaphone className="h-7 w-7 text-blue-600" />
            <div className="flex-1">
              <p className="font-bold" style={{ color: NAVY }}>
                Scholarship Opportunity
              </p>
              <p className="text-sm text-slate-600">
                Apply for the DarlTech Academy Scholarship Program –{" "}
                {settings.data?.cohort_name ?? "Cohort 2"}.{" "}
                <a href="/#scholarship" className="font-semibold text-blue-600">
                  Learn more →
                </a>
              </p>
            </div>
            <RedBtn to="/apply">
              Apply Now <ArrowRight className="h-4 w-4" />
            </RedBtn>
          </motion.div>
        )}
      </Stagger>
    </DashShell>
  );
}

/* ---------------- tutor dashboard ---------------- */

export function TutorDash() {
  const { user, quizzes } = useAcademy();
  const name = user ? firstName(user) : "there";
  const subs = useTutorSubmissions();
  const events = useEvents();
  const list = subs.data ?? [];
  const students = new Set(list.map((s) => s.user_id)).size;
  const avg = list.length ? Math.round(list.reduce((s, x) => s + x.score, 0) / list.length) : 0;
  const weekAgo = Date.now() - 7 * 864e5;
  const thisWeek = list.filter((s) => new Date(s.created_at).getTime() > weekAgo).length;
  const next = (events.data ?? []).find((e) => e.kind === "live_class") ?? events.data?.[0];
  const countFor = (id: string) => list.filter((s) => s.quiz_id === id).length;

  return (
    <DashShell role="tutor" searchPlaceholder="Search...">
      <Stagger className="flex flex-col gap-5">
        <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: NAVY }}>
              Welcome, {name}!
            </h1>
            <p className="text-sm text-slate-600">Manage your quizzes and students</p>
          </div>
          <RedBtn to="/tutor/quizzes/new">
            Create Quiz <Plus className="h-4 w-4" />
          </RedBtn>
        </motion.div>

        {user?.status === "pending" && (
          <motion.div
            variants={item}
            className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800"
          >
            <b>Your tutor account is under review.</b> You can create quizzes now; we'll notify you
            when you're approved.
          </motion.div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} tint="#2563EB" label="Students Reached">
            <CountUp value={students} />
          </StatCard>
          <StatCard icon={BookOpen} tint="#7C3AED" label="My Quizzes">
            <CountUp value={quizzes.length} />
          </StatCard>
          <StatCard icon={GraduationCap} tint="#059669" label="Submissions this week">
            <CountUp value={thisWeek} />
          </StatCard>
          <StatCard icon={Star} tint="#D97706" label="Average Score">
            <CountUp value={avg} suffix="%" />
          </StatCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <SectionHead title="My Quizzes" to="/tutor/quizzes" />
            {quizzes.length ? (
              <ul className="space-y-3">
                {quizzes.slice(0, 3).map((q) => (
                  <li key={q.id} className="flex items-center gap-4">
                    <CourseArt className="h-14 w-20 text-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold" style={{ color: NAVY }}>
                        {q.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {q.questions.length} questions · {countFor(q.id)} submissions
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        {q.openToAll ? "Open to all" : `${q.cohorts.length} cohort(s)`}
                      </p>
                    </div>
                    <Link
                      to="/tutor/quizzes/$quizId"
                      params={{ quizId: q.id }}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium"
                      style={{ color: NAVY }}
                    >
                      Manage <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote
                icon={BookOpen}
                text="You haven't created a quiz yet."
                action={<RedBtn to="/tutor/quizzes/new">Create your first quiz</RedBtn>}
              />
            )}
          </Card>

          <Card>
            <SectionHead title="Recent Submissions" to="/tutor/quizzes" />
            {subs.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : list.length ? (
              <ul className="space-y-3">
                {list.slice(0, 4).map((r, i) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                    className="flex items-center gap-3"
                  >
                    <Avatar name={r.student_name} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                        {r.quiz_title ?? "Quiz"}
                      </p>
                      <p className="text-xs text-slate-500">
                        by {r.student_name} · {timeAgo(r.created_at)}
                      </p>
                    </div>
                    <Pill tone={r.score >= 50 ? "green" : "amber"}>{r.score}%</Pill>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <EmptyNote
                icon={ClipboardList}
                text="No submissions yet. Share a quiz with your students."
              />
            )}
          </Card>

          <Card>
            <h3 className="mb-4 font-bold" style={{ color: NAVY }}>
              Live Class Schedule
            </h3>
            {events.isLoading ? (
              <Skeleton className="h-16" />
            ) : next ? (
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: RED }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold" style={{ color: NAVY }}>
                    {next.title}
                  </p>
                  <p className="text-xs text-slate-500">{fmtEvent(next.starts_at, next.ends_at)}</p>
                </div>
                {next.link && (
                  <a
                    href={next.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Join Class
                  </a>
                )}
              </div>
            ) : (
              <EmptyNote icon={Video} text="No live classes scheduled." />
            )}
          </Card>

          <motion.div
            variants={item}
            className="flex items-center gap-4 rounded-2xl bg-[#E8EEFB] p-6"
          >
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <p className="text-sm text-slate-700">
              Tip: Share quizzes to the tech feed so more learners can practise.
            </p>
            <div className="flex-1" />
            <Link
              to="/tutor/quizzes"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
            >
              <Upload className="h-4 w-4" /> Share
            </Link>
          </motion.div>
        </div>
      </Stagger>
    </DashShell>
  );
}

/* ---------------- community ---------------- */

type Tab = "all" | "course" | "announcements" | "tutors";

function PostCard({ p, myName }: { p: FeedItem; myName: string }) {
  const { like, comment, remove, uid } = useFeedActions();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const last = p.commentList[p.commentList.length - 1];
  const shown = open ? p.commentList : last ? [last] : [];
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={p.author} size={48} />
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1 font-bold" style={{ color: NAVY }}>
            {p.author}
            {p.role === "Tutor" && <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />}
          </p>
          <p className="text-sm text-slate-500">
            {p.role}
            {p.course ? ` • ${p.course}` : ""}
          </p>
        </div>
        <span className="text-xs text-slate-500">{timeAgo(p.created_at)}</span>
        {p.user_id === uid && (
          <button
            aria-label="Delete post"
            onClick={() => remove.mutate(p.id)}
            className="text-slate-400 hover:text-red-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-3 whitespace-pre-line text-lg font-medium" style={{ color: NAVY }}>
        {p.text}
      </p>
      <div className="mt-3 flex gap-6 text-sm text-slate-600">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => like.mutate({ postId: p.id, liked: p.likedByMe })}
          className="inline-flex items-center gap-1.5"
        >
          <ThumbsUp className={cn("h-4 w-4", p.likedByMe && "fill-red-500 text-red-500")} />
          {p.likes} Likes
        </motion.button>
        <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4" />
          {p.comments} Comments
        </button>
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(`${window.location.origin}/student/community`);
            toast.success("Link copied");
          }}
          className="inline-flex items-center gap-1.5"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
      <div className="mt-3 rounded-xl bg-[#EEF2FA] p-4">
        {p.comments > 1 && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="mb-3 block w-full text-center text-xs font-semibold text-blue-600"
          >
            {open ? "Show less" : `View all ${p.comments} comments ⌄`}
          </button>
        )}
        <AnimatePresence initial={false}>
          {shown.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 flex gap-3"
            >
              <Avatar name={c.author} size={36} />
              <div>
                <p className="text-sm">
                  <b style={{ color: NAVY }}>{c.author}</b>{" "}
                  <span className="text-xs text-slate-500">• {timeAgo(c.created_at)}</span>
                </p>
                <p className="text-sm text-slate-700">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!reply.trim()) return;
            comment.mutate(
              { postId: p.id, text: reply.trim(), author: myName },
              {
                onSuccess: () => {
                  setReply("");
                  setOpen(true);
                },
              },
            );
          }}
          className="flex gap-2"
        >
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply…"
            className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-blue-200 focus:ring-2"
          />
          <button
            type="submit"
            disabled={!reply.trim() || comment.isPending}
            className="h-10 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: NAVY }}
          >
            Reply
          </button>
        </form>
      </div>
    </Card>
  );
}

export function CommunityPage() {
  const { user, enrollments } = useAcademy();
  const feed = useFeed();
  const ann = useAnnouncements();
  const events = useEvents();
  const stats = useCommunityStats();
  const { post } = useFeedActions();
  const [tab, setTab] = useState<Tab>("all");
  const [draft, setDraft] = useState("");
  const myName = user?.name || "Member";
  const myCourse = [...enrollments]
    .reverse()
    .map((e) => courseById(e.courseId))
    .find(Boolean);
  const pinned = (ann.data ?? []).find((a) => a.pinned) ?? ann.data?.[0];

  const posts = (feed.data ?? []).filter((p) =>
    tab === "course"
      ? Boolean(myCourse) && p.course === myCourse?.name
      : tab === "tutors"
        ? p.role === "Tutor"
        : true,
  );

  const tabs = [
    ["all", Users, "For You"],
    ["course", GraduationCap, "My Course Group"],
    ["announcements", Megaphone, "Announcements"],
    ["tutors", HelpCircle, "Ask a Tutor"],
  ] as const;

  const submit = () => {
    if (!draft.trim()) return;
    post.mutate(
      {
        author: myName,
        initials: myName
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join(""),
        color: NAVY,
        role: user?.role === "tutor" ? "Tutor" : "Student",
        topic: "Jobs",
        text: draft.trim(),
        course: myCourse?.name,
      },
      { onSuccess: () => setDraft("") },
    );
  };

  return (
    <DashShell
      role={user?.role === "tutor" ? "tutor" : "student"}
      searchPlaceholder="Search community..."
    >
      <Stagger className="flex flex-col gap-5">
        <motion.div variants={item}>
          <h1 className="text-4xl font-extrabold" style={{ color: NAVY }}>
            Community
          </h1>
          <p className="mt-2 text-slate-600">
            Connect, learn and grow together with the DarlTech Academy community.
          </p>
        </motion.div>
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {tabs.map(([key, I, l]) => (
                <motion.button
                  key={key}
                  onClick={() => setTab(key)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "relative inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm",
                    tab !== key && "bg-white",
                  )}
                  style={{ color: tab === key ? "white" : NAVY }}
                >
                  {tab === key && (
                    <motion.span
                      layoutId="community-tab"
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: RED }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <I className="relative h-4 w-4" />
                  <span className="relative">{l}</span>
                </motion.button>
              ))}
            </motion.div>

            {tab === "announcements" ? (
              ann.isLoading ? (
                <Skeleton className="h-32" />
              ) : ann.data?.length ? (
                ann.data.map((a) => (
                  <Card key={a.id} className="flex gap-4 border-blue-100 bg-[#EEF2FA]">
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white"
                      style={{ backgroundColor: NAVY }}
                    >
                      <Megaphone className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        {a.pinned ? (
                          <p
                            className="inline-flex items-center gap-1 text-sm"
                            style={{ color: RED }}
                          >
                            <Pin className="h-4 w-4" /> Pinned
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className="text-xs text-slate-500">{timeAgo(a.created_at)}</p>
                      </div>
                      <p className="text-lg font-bold" style={{ color: NAVY }}>
                        {a.title}
                      </p>
                      <p className="whitespace-pre-line text-sm text-slate-600">{a.body}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <EmptyNote icon={Megaphone} text="No announcements yet." />
                </Card>
              )
            ) : (
              <>
                {pinned && (
                  <Card className="flex gap-4 border-blue-100 bg-[#EEF2FA]">
                    <span
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-white"
                      style={{ backgroundColor: NAVY }}
                    >
                      <Megaphone className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="inline-flex items-center gap-1 text-sm"
                          style={{ color: RED }}
                        >
                          <Pin className="h-4 w-4" /> Pinned Announcement
                        </p>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">{timeAgo(pinned.created_at)}</p>
                          <span className="mt-1 inline-block">
                            <Pill tone="blue">Academy-wide</Pill>
                          </span>
                        </div>
                      </div>
                      <p className="text-lg font-bold" style={{ color: NAVY }}>
                        {pinned.title}
                      </p>
                      <p className="line-clamp-2 text-sm text-slate-600">{pinned.body}</p>
                      <button
                        onClick={() => setTab("announcements")}
                        className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                      >
                        Read more <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                )}

                <Card>
                  <div className="flex gap-3">
                    <Avatar name={myName} size={44} />
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={2}
                      placeholder={
                        tab === "tutors"
                          ? "Ask the tutors a question…"
                          : "Share something or ask a question…"
                      }
                      className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-blue-200 focus:ring-2"
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <RedBtn onClick={submit}>
                      {post.isPending ? "Posting…" : "Post"} <ArrowRight className="h-4 w-4" />
                    </RedBtn>
                  </div>
                </Card>

                {feed.isLoading ? (
                  [0, 1].map((i) => <Skeleton key={i} className="h-48" />)
                ) : posts.length ? (
                  <AnimatePresence initial={false}>
                    {posts.map((p) => (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                      >
                        <PostCard p={p} myName={myName} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <Card>
                    <EmptyNote
                      icon={MessageSquare}
                      text={
                        tab === "course" && !myCourse
                          ? "Enroll in a course to join its group."
                          : "No posts here yet. Be the first!"
                      }
                    />
                  </Card>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <motion.div
              variants={item}
              className="rounded-2xl p-5 text-white"
              style={{ backgroundColor: NAVY }}
            >
              <p className="flex items-center gap-2 text-lg font-bold">
                <Users className="h-6 w-6" /> My Learning Community
              </p>
              <button
                onClick={() => setTab(myCourse ? "course" : "all")}
                className="mt-4 flex w-full items-center gap-3 rounded-xl bg-white/10 p-4 text-left hover:bg-white/15"
              >
                <GraduationCap className="h-7 w-7" />
                <span className="flex-1 font-semibold">
                  {myCourse ? myCourse.name : "DarlTech Academy"}
                </span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="mt-4 flex justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <CountUp value={stats.data?.members ?? 0} /> Members
                </span>
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="h-2.5 w-2.5 rounded-full bg-green-500"
                  />
                  Active this week: {stats.data?.activeWeek ?? 0}
                </span>
              </div>
            </motion.div>
            <Card>
              <SectionHead title="Upcoming Community Events" />
              {events.isLoading ? (
                <Skeleton className="h-24" />
              ) : events.data?.length ? (
                events.data.slice(0, 3).map((e) => {
                  const d = new Date(e.starts_at);
                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 border-t border-slate-100 py-3 first:border-0"
                    >
                      <div
                        className="grid w-12 place-items-center rounded-lg bg-red-50 py-1 leading-none"
                        style={{ color: RED }}
                      >
                        <span className="text-xs font-bold uppercase">
                          {d.toLocaleDateString("en-GB", { month: "short" })}
                        </span>
                        <span className="text-xl font-extrabold">{d.getDate()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                          {e.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {fmtEvent(e.starts_at, e.ends_at).split(" • ")[1]}
                        </p>
                      </div>
                      {e.link ? (
                        <a
                          href={e.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Join"
                          className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600"
                        >
                          <Video className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <EmptyNote icon={Calendar} text="No upcoming events." />
              )}
            </Card>
            <Card>
              <p className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: NAVY }}>
                <ShieldCheck className="h-6 w-6" /> Community Guidelines
              </p>
              <ul className="space-y-2 text-sm" style={{ color: NAVY }}>
                {[
                  "Be respectful and kind.",
                  "Keep discussions relevant.",
                  "Do not share false information.",
                  "Support your fellow learners.",
                  "Report inappropriate content.",
                ].map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 fill-[#0B1F4D] text-white" />
                    {g}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Stagger>
    </DashShell>
  );
}

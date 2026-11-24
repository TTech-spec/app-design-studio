import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
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

/* ---------------- student dashboard ---------------- */

export function StudentDash() {
  const { user, enrollments } = useAcademy();
  const name = user ? firstName(user) : "Ada";
  const progress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 72;
  return (
    <DashShell role="student">
      <Stagger className="flex flex-col gap-5">
        <motion.div variants={item} className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E8EEFB] to-[#F4F6FB] p-8">
            <h1 className="text-3xl font-extrabold" style={{ color: NAVY }}>
              Welcome back, {name}!
            </h1>
            <p className="mt-2 text-slate-700">Keep learning. Keep growing. You're doing great!</p>
            <RedBtn to="/student/explore" className="mt-5">
              Continue Learning <ArrowRight className="h-4 w-4" />
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
          <StatCard icon={Calendar} tint={RED} label="Assignments">
            1 Pending
          </StatCard>
          <StatCard icon={Trophy} tint="#D97706" label="Certificates">
            0 Earned
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
            <SectionHead title="My Course" label="View Course" to="/student/explore" />
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="grid h-36 w-full shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0B1F4D] to-[#1E3A8A] text-4xl font-bold text-blue-200 sm:w-48">
                &lt;/&gt;
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold" style={{ color: NAVY }}>
                  Web Development Fundamentals
                </p>
                <p className="mt-2 text-sm text-slate-600">{progress}% Complete</p>
                <Bar pct={progress} className="mt-2" />
                <RedBtn to="/student/explore" className="mt-5 w-full">
                  Continue Learning <ArrowRight className="h-4 w-4" />
                </RedBtn>
              </div>
            </div>
          </Card>
          <Card>
            <SectionHead title="Upcoming Activities" />
            <ul className="space-y-4">
              {[
                {
                  icon: Calendar,
                  t: "Assignment: Build a Portfolio Website",
                  d: "Due: Oct 25, 2025",
                  tag: <Pill tone="red">Urgent</Pill>,
                },
                {
                  icon: Play,
                  t: "Live Class: Modern Web Dev",
                  d: "Oct 27, 2025 • 7:00 PM",
                  tag: <Pill tone="blue">Join</Pill>,
                },
                {
                  icon: Trophy,
                  t: "Quiz: JavaScript Basics",
                  d: "Oct 30, 2025",
                  tag: <Pill tone="blue">Start</Pill>,
                },
              ].map((a) => (
                <li key={a.t} className="flex items-center gap-3">
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
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <SectionHead title="Community" to="/student/community" />
            <div className="space-y-4">
              {[
                {
                  n: "Emmanuel K.",
                  ago: "2h ago",
                  t: "Anyone has issues with the assignment submission?",
                  l: 12,
                  c: 8,
                },
                {
                  n: "Grace Johnson",
                  ago: "3h ago",
                  t: "Great lesson! This is exactly what I needed.",
                  l: 24,
                  c: 5,
                },
              ].map((p) => (
                <div key={p.n} className="flex gap-3">
                  <Avatar name={p.n} size={36} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>
                      {p.n}
                    </p>
                    <p className="text-xs text-slate-400">{p.ago}</p>
                    <p className="mt-1 text-sm text-slate-700">{p.t}</p>
                    <p className="mt-1 flex gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {p.l}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {p.c}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

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
              Apply for the DarlTech Academy Scholarship Program – Cohort 2.{" "}
              <a href="/#scholarship" className="font-semibold text-blue-600">
                Learn more →
              </a>
            </p>
          </div>
          <RedBtn to="/join">
            Apply Now <ArrowRight className="h-4 w-4" />
          </RedBtn>
        </motion.div>
      </Stagger>
    </DashShell>
  );
}

/* ---------------- tutor dashboard ---------------- */

export function TutorDash() {
  const { user } = useAcademy();
  const name = user ? firstName(user) : "Michael";
  return (
    <DashShell role="tutor" searchPlaceholder="Search...">
      <Stagger className="flex flex-col gap-5">
        <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: NAVY }}>
              Welcome, Dr. {name}!
            </h1>
            <p className="text-sm text-slate-600">Manage your courses and students</p>
          </div>
          <RedBtn to="/tutor/quizzes/new">
            Create Course <Plus className="h-4 w-4" />
          </RedBtn>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} tint="#2563EB" label="Total Students">
            <CountUp value={342} />
          </StatCard>
          <StatCard icon={BookOpen} tint="#7C3AED" label="My Courses">
            <CountUp value={3} />
          </StatCard>
          <StatCard icon={GraduationCap} tint="#059669" label="Pending Reviews">
            <CountUp value={18} />
          </StatCard>
          <StatCard icon={Star} tint="#D97706" label="Your Rating">
            <CountUp value={4.8} decimals={1} />
          </StatCard>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <SectionHead title="My Courses" to="/tutor/quizzes" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-24 w-36 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0B1F4D] to-[#1E3A8A] text-2xl font-bold text-blue-200">
                &lt;/&gt;
              </div>
              <div className="flex-1">
                <p className="font-bold" style={{ color: NAVY }}>
                  Web Development Fundamentals
                </p>
                <p className="text-xs text-slate-500">342 Students • 12 Lessons</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </p>
              </div>
              <a
                href="/tutor/quizzes"
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-4 text-sm font-medium"
                style={{ color: NAVY }}
              >
                Manage Course <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Card>
          <Card>
            <SectionHead title="Recent Submissions" to="/tutor/quizzes" />
            <ul className="space-y-3">
              {[
                { t: "React Project", by: "Ada Okafor", s: <Pill tone="amber">Pending</Pill> },
                {
                  t: "Data Analysis Report",
                  by: "Chinedu Eze",
                  s: <Pill tone="green">Graded</Pill>,
                },
                { t: "UI Design Task", by: "Blessing Ade", s: <Pill tone="green">Graded</Pill> },
              ].map((r) => (
                <li key={r.t} className="flex items-center gap-3">
                  <Avatar name={r.by} size={34} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>
                      {r.t}
                    </p>
                    <p className="text-xs text-slate-500">by {r.by}</p>
                  </div>
                  {r.s}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-4 font-bold" style={{ color: NAVY }}>
              Live Class Schedule
            </h3>
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: RED }}
              />
              <div className="flex-1">
                <p className="font-semibold" style={{ color: NAVY }}>
                  Advanced React Development
                </p>
                <p className="text-xs text-slate-500">Today, 4:00 PM – 5:00 PM</p>
              </div>
              <button className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Join Class
              </button>
            </div>
          </Card>
          <motion.div
            variants={item}
            className="flex items-center gap-4 rounded-2xl bg-[#E8EEFB] p-6"
          >
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <p className="text-sm text-slate-700">
              Tip: Upload more resources to enrich your learners.
            </p>
            <div className="flex-1" />
            <a
              href="/tutor/feed"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
            >
              <Upload className="h-4 w-4" /> Upload
            </a>
          </motion.div>
        </div>
      </Stagger>
    </DashShell>
  );
}

/* ---------------- community ---------------- */

const POSTS = [
  {
    n: "Chinedu Eze",
    cohort: "Web Development Cohort",
    ago: "3 hours ago",
    verified: true,
    t: "Has anyone tried deploying a React project on Vercel? I'm getting this error: “Build failed: Could not find a suitable output directory.” Any help?",
    likes: 12,
    comments: 8,
    reply: {
      n: "Blessing Okeke",
      ago: "2 hours ago",
      t: "Make sure your build command is correctly set in vercel.json. It worked for me!",
    },
  },
  {
    n: "David Adebayo",
    cohort: "Data Analytics Cohort",
    ago: "5 hours ago",
    t: "Can someone explain how to use pivot tables in Excel for data analysis?",
    sub: "I'm stuck on this part of the course.",
    likes: 7,
    comments: 5,
  },
];

export function CommunityPage() {
  const tabs = [
    [Users, "For You"],
    [GraduationCap, "My Course Group"],
    [Megaphone, "Announcements"],
    [HelpCircle, "Ask a Tutor"],
  ] as const;
  return (
    <DashShell role="student" searchPlaceholder="Search community...">
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
              {tabs.map(([I, l], i) => (
                <motion.button
                  key={l}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm",
                    i === 0 ? "text-white" : "bg-white",
                  )}
                  style={i === 0 ? { backgroundColor: RED } : { color: NAVY }}
                >
                  <I className="h-4 w-4" />
                  {l}
                </motion.button>
              ))}
            </motion.div>
            <Card className="flex gap-4 border-blue-100 bg-[#EEF2FA]">
              <span
                className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-white"
                style={{ backgroundColor: NAVY }}
              >
                <Megaphone className="h-7 w-7" />
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="inline-flex items-center gap-1 text-sm" style={{ color: RED }}>
                    <Pin className="h-4 w-4" /> Pinned Announcement
                  </p>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">2 days ago</p>
                    <span className="mt-1 inline-block">
                      <Pill tone="blue">Academy-wide</Pill>
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold" style={{ color: NAVY }}>
                  Welcome to DarlTech Academy Community!
                </p>
                <p className="text-sm text-slate-600">
                  This is your space to ask questions, share ideas, and connect with fellow learners
                  and tutors.
                </p>
                <a
                  href="#"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                >
                  Read more <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Card>
            {POSTS.map((p) => (
              <Card key={p.n}>
                <div className="flex items-start gap-3">
                  <Avatar name={p.n} size={48} />
                  <div className="flex-1">
                    <p className="inline-flex items-center gap-1 font-bold" style={{ color: NAVY }}>
                      {p.n}
                      {p.verified && <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />}
                    </p>
                    <p className="text-sm text-slate-500">Student • {p.cohort}</p>
                  </div>
                  <span className="text-xs text-slate-500">{p.ago}</span>
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-3 text-lg font-medium" style={{ color: NAVY }}>
                  {p.t}
                </p>
                {p.sub && <p className="text-slate-600">{p.sub}</p>}
                <div className="mt-3 flex gap-6 text-sm text-slate-600">
                  <motion.button
                    whileTap={{ scale: 1.3 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <ThumbsUp className="h-4 w-4 fill-red-500 text-red-500" />
                    {p.likes} Likes
                  </motion.button>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    {p.comments} Comments
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="h-4 w-4" />
                    Share
                  </span>
                </div>
                {p.reply && (
                  <div className="mt-3 rounded-xl bg-[#EEF2FA] p-4">
                    <p className="mb-3 text-center text-xs font-semibold text-blue-600">
                      View all {p.comments} comments ⌄
                    </p>
                    <div className="flex gap-3">
                      <Avatar name={p.reply.n} size={40} />
                      <div>
                        <p className="text-sm">
                          <b style={{ color: NAVY }}>{p.reply.n}</b>{" "}
                          <span className="text-xs text-slate-500">• {p.reply.ago}</span>
                        </p>
                        <p className="text-sm text-slate-700">{p.reply.t}</p>
                        <p className="mt-1 flex gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            Like
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Reply
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
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
              <a
                href="#"
                className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-4 hover:bg-white/15"
              >
                <GraduationCap className="h-7 w-7" />
                <span className="flex-1 font-semibold">
                  Web Development
                  <br />
                  Cohort 2
                </span>
                <ChevronRight className="h-5 w-5" />
              </a>
              <div className="mt-4 flex justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <CountUp value={184} /> Members
                </span>
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="h-2.5 w-2.5 rounded-full bg-green-500"
                  />
                  Online: 27
                </span>
              </div>
            </motion.div>
            <Card>
              <SectionHead title="Upcoming Community Events" />
              {[
                ["OCT", "25", "Live Q&A with Tutor", "6:00 PM – 7:00 PM (WAT)"],
                ["OCT", "28", "Project Review Session", "6:00 PM – 7:30 PM (WAT)"],
              ].map(([m, d, t, time]) => (
                <div
                  key={t}
                  className="flex items-center gap-3 border-t border-slate-100 py-3 first:border-0"
                >
                  <div
                    className="grid w-12 place-items-center rounded-lg bg-red-50 py-1 leading-none"
                    style={{ color: RED }}
                  >
                    <span className="text-xs font-bold">{m}</span>
                    <span className="text-xl font-extrabold">{d}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: NAVY }}>
                      {t}
                    </p>
                    <p className="text-xs text-slate-500">{time}</p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <Video className="h-4 w-4" />
                  </span>
                </div>
              ))}
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
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
              >
                Read Full Guidelines <ArrowRight className="h-4 w-4" />
              </a>
            </Card>
          </div>
        </div>
      </Stagger>
    </DashShell>
  );
}

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Headphones,
  Home,
  Loader2,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import academyLogo from "@/assets/portal/darltech-academy-logo.png";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  downloadCsv,
  isConfigured,
  useAdminSession,
  useRemove,
  useSave,
  useTable,
  type TableName,
} from "@/lib/admin/api";

export const NAVY = "#0B1F4D";
export const RED = "#E1251B";

/* ============ motion primitives ============ */

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
export const rise: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export function Page({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">
      <motion.div variants={rise} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={{ color: NAVY }}
          >
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </motion.div>
      {children}
    </motion.div>
  );
}

export function Panel({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <motion.section
      variants={rise}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(11,31,77,.04)]",
        className,
      )}
    >
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-bold" style={{ color: NAVY }}>
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}

/** GSAP-powered count-up that re-animates from the previous value when data changes. */
export function Counter({
  value,
  format = (n) => Math.round(n).toLocaleString(),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = format(value);
      last.current = value;
      return;
    }
    const o = { n: last.current };
    const t = gsap.to(o, {
      n: value,
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = format(o.n);
      },
    });
    last.current = value;
    return () => {
      t.kill();
    };
  }, [value, format, reduce]);
  return <span ref={ref}>{format(0)}</span>;
}

export function Stat({
  icon: Icon,
  tint,
  label,
  value,
  format,
  delta,
  loading,
}: {
  icon: LucideIcon;
  tint: string;
  label: string;
  value: number;
  format?: (n: number) => string;
  delta?: number;
  loading?: boolean;
}) {
  return (
    <motion.div
      variants={rise}
      whileHover={{ y: -4, boxShadow: "0 18px 40px -18px rgba(11,31,77,.35)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: tint }}
      />
      <div className="relative flex items-center gap-4">
        <motion.span
          whileHover={{ rotate: 8, scale: 1.08 }}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-6 w-6" />
        </motion.span>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="truncate text-2xl font-extrabold" style={{ color: NAVY }}>
            {loading ? (
              <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-100 align-middle" />
            ) : (
              <Counter value={value} format={format} />
            )}
          </p>
          {delta !== undefined && !loading && (
            <p
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                delta >= 0 ? "text-green-600" : "text-red-600",
              )}
            >
              {delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(delta)}% <span className="font-normal text-slate-400">vs last 30 days</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const TONES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  paid: "bg-green-50 text-green-700 ring-green-200",
  active: "bg-green-50 text-green-700 ring-green-200",
  published: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
  refunded: "bg-violet-50 text-violet-700 ring-violet-200",
  waitlisted: "bg-blue-50 text-blue-700 ring-blue-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  archived: "bg-slate-100 text-slate-600 ring-slate-200",
  student: "bg-blue-50 text-blue-700 ring-blue-200",
  tutor: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Pill({ value }: { value: string }) {
  return (
    <motion.span
      layout
      key={value}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        TONES[value] ?? TONES.draft,
      )}
    >
      {value.replace(/_/g, " ")}
    </motion.span>
  );
}

export function Btn({
  children,
  onClick,
  variant = "red",
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "red" | "ghost" | "navy";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    red: { backgroundColor: RED, color: "white" },
    navy: { backgroundColor: NAVY, color: "white" },
    ghost: { backgroundColor: "white", color: NAVY },
  }[variant];
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold shadow-sm transition disabled:opacity-50",
        variant === "ghost" && "border border-slate-200",
        className,
      )}
      style={styles}
    >
      {children}
    </motion.button>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#0B1F4D", "#E1251B", "#2563EB", "#7C3AED", "#059669", "#D97706"];
  const c = colors[[...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % colors.length];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: c, fontSize: size * 0.36 }}
    >
      {name
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
}

export const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
};

export function Empty({
  icon: Icon = FileText,
  title,
  hint,
}: {
  icon?: LucideIcon;
  title: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2 py-12 text-center"
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400"
      >
        <Icon className="h-7 w-7" />
      </motion.span>
      <p className="font-semibold" style={{ color: NAVY }}>
        {title}
      </p>
      {hint && <p className="max-w-sm text-sm text-slate-500">{hint}</p>}
    </motion.div>
  );
}

/* ============ GSAP line chart ============ */

export function LineChart({
  series,
  height = 220,
}: {
  series: {
    name: string;
    color: string;
    points: { label: string; value: number }[];
    format?: (n: number) => string;
  }[];
  height?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 600,
    H = height,
    PAD = 36;
  const labels = series[0]?.points.map((p) => p.label) ?? [];
  const n = Math.max(labels.length, 2);
  const x = (i: number) => PAD + (i * (W - PAD * 1.5)) / (n - 1);
  // each series is normalised to its own max so counts and money share the chart
  const y = (v: number, max: number) => H - 24 - (max ? v / max : 0) * (H - 48);
  const key = JSON.stringify(series.map((s) => s.points.map((p) => p.value)));

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const tl = gsap.timeline();
    svg.querySelectorAll<SVGPathElement>("path.line").forEach((p) => {
      const len = p.getTotalLength();
      tl.fromTo(
        p,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" },
        0,
      );
    });
    tl.fromTo(
      svg.querySelectorAll("path.area"),
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      0.5,
    );
    tl.fromTo(
      svg.querySelectorAll("circle.dot"),
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, duration: 0.35, stagger: 0.04, ease: "back.out(3)" },
      0.9,
    );
    return () => {
      tl.kill();
    };
  }, [key]);

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height }}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD}
            x2={W - PAD / 2}
            y1={H - 24 - f * (H - 48)}
            y2={H - 24 - f * (H - 48)}
            stroke="#EEF2F7"
          />
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={H - 4} fontSize="11" fill="#94A3B8" textAnchor="middle">
            {l}
          </text>
        ))}
        {series.map((s) => {
          const max = Math.max(...s.points.map((p) => p.value), 1);
          const d = s.points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value, max)}`).join(" ");
          return (
            <g key={s.name}>
              <path
                className="area"
                d={`${d} L${x(s.points.length - 1)},${H - 24} L${x(0)},${H - 24}Z`}
                fill={s.color}
                fillOpacity="0.08"
              />
              <path
                className="line"
                d={d}
                stroke={s.color}
                strokeWidth="2.5"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.points.map((p, i) => (
                <circle
                  key={i}
                  className="dot"
                  cx={x(i)}
                  cy={y(p.value, max)}
                  r={hover === i ? 6 : 4}
                  fill="white"
                  stroke={s.color}
                  strokeWidth="2.5"
                />
              ))}
            </g>
          );
        })}
        {labels.map((_, i) => (
          <rect
            key={i}
            x={x(i) - W / n / 2}
            y={0}
            width={W / n}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={12}
            y2={H - 24}
            stroke="#CBD5E1"
            strokeDasharray="4 4"
          />
        )}
      </svg>
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute top-2 rounded-xl bg-[#0B1F4D] px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: `clamp(0px, calc(${(x(hover) / W) * 100}% - 60px), calc(100% - 140px))`,
            }}
          >
            <p className="mb-1 font-semibold">{labels[hover]}</p>
            {series.map((s) => (
              <p key={s.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}: {(s.format ?? ((v: number) => v.toLocaleString()))(s.points[hover].value)}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Horizontal bars that grow in with GSAP. */
export function Bars({
  rows,
  color = RED,
}: {
  rows: { label: string; value: number }[];
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(...rows.map((r) => r.value), 1);
  useEffect(() => {
    if (!ref.current) return;
    const t = gsap.fromTo(
      ref.current.querySelectorAll("[data-bar]"),
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left", duration: 1, stagger: 0.06, ease: "power3.out" },
    );
    return () => {
      t.kill();
    };
  }, [rows.map((r) => r.value).join()]);
  if (!rows.length) return <Empty icon={BarChart3} title="No data yet" />;
  return (
    <div ref={ref} className="space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-slate-700">{r.label}</span>
            <span className="text-slate-500">{r.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              data-bar
              className="h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ shell ============ */

const NAV: { label: string; icon: LucideIcon; to: string }[] = [
  { label: "Dashboard", icon: Home, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Courses", icon: BookOpen, to: "/admin/courses" },
  { label: "Applications", icon: FileText, to: "/admin/applications" },
  { label: "Payments", icon: CreditCard, to: "/admin/payments" },
  { label: "Scholarships", icon: GraduationCap, to: "/admin/scholarships" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useLocation({ select: (l) => l.pathname.replace(/\/$/, "") || "/" });
  const navigate = useNavigate();
  const { data: apps } = useTable("academy_applications");
  const pending = apps?.filter((a) => a.status === "pending").length ?? 0;
  return (
    <div className="flex h-full flex-col px-4 py-6 text-white">
      <Link to="/admin" onClick={onNavigate} className="px-2">
        <div className="flex items-center gap-2">
          <motion.img
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
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
        <p className="mt-2 text-sm italic text-white/70">Do Extraordinary Things</p>
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map((n, i) => {
          const on = n.to === "/admin" ? path === "/admin" : path.startsWith(n.to);
          return (
            <motion.div
              key={n.to}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i + 0.1 }}
            >
              <Link
                to={n.to as never}
                onClick={onNavigate}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors",
                  on ? "text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="admin-nav"
                    className="absolute inset-0 rounded-xl shadow-lg shadow-red-900/30"
                    style={{ backgroundColor: RED }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <n.icon className="relative h-5 w-5" />
                <span className="relative">{n.label}</span>
                {n.label === "Applications" && pending > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold"
                    style={{ color: RED }}
                  >
                    {pending}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <div className="flex-1" />
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <Headphones className="h-7 w-7" />
          <div>
            <p className="text-sm font-semibold">Need Help?</p>
            <a href="/help-center" className="text-xs text-white/70 hover:text-white">
              Contact Support →
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/admin" });
        }}
        className="mt-4 flex items-center gap-3 px-4 py-2 text-sm text-white/75 hover:text-white"
      >
        <LogOut className="h-5 w-5" /> Log Out
      </button>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const path = useLocation({ select: (l) => l.pathname });
  const { data: session } = useAdminSession();
  const { data: apps } = useTable("academy_applications");
  const fresh =
    apps?.filter(
      (a) => a.status === "pending" && Date.now() - new Date(a.created_at).getTime() < 7 * 864e5,
    ) ?? [];
  const [bell, setBell] = useState(false);
  const email = session?.user?.email ?? "admin";

  const search = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/admin/applications", search: { q } as never });
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        className="sticky top-0 hidden h-screen w-[256px] shrink-0 lg:block"
        style={{ backgroundColor: NAVY }}
      >
        <Sidebar />
      </motion.aside>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[270px] lg:hidden"
              style={{ backgroundColor: NAVY }}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-100 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" style={{ color: NAVY }} />
          </button>
          <form onSubmit={search} className="hidden w-full max-w-md sm:block">
            <label className="flex h-11 items-center gap-3 rounded-xl bg-[#EEF2FA] px-4 text-slate-500 ring-blue-200 transition focus-within:bg-white focus-within:ring-2">
              <Search className="h-5 w-5" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search applicants..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
              />
            </label>
          </form>
          <div className="flex-1" />
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setBell((b) => !b)}
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <motion.span
                animate={fresh.length ? { rotate: [0, -14, 12, -8, 0] } : {}}
                transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.6 }}
              >
                <Bell className="h-5 w-5" />
              </motion.span>
              {fresh.length > 0 && (
                <span
                  className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: RED }}
                >
                  {fresh.length}
                </span>
              )}
            </motion.button>
            <AnimatePresence>
              {bell && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl"
                >
                  <p className="px-2 pb-2 text-sm font-bold" style={{ color: NAVY }}>
                    New applications
                  </p>
                  {fresh.length ? (
                    fresh.slice(0, 6).map((a) => (
                      <Link
                        key={a.id}
                        to="/admin/applications"
                        search={{ q: "" }}
                        onClick={() => setBell(false)}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
                      >
                        <Avatar name={a.full_name} size={32} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                            {a.full_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {a.track} · {timeAgo(a.created_at)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="px-2 py-4 text-sm text-slate-500">You're all caught up.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name={email} size={40} />
            <div className="hidden leading-tight sm:block">
              <p className="max-w-[160px] truncate text-sm font-bold" style={{ color: NAVY }}>
                {email.split("@")[0]}
              </p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ============ gate: login + admin check ============ */

export function AdminGate({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useAdminSession();
  if (!isConfigured)
    return (
      <GateCard
        icon={AlertTriangle}
        title="Supabase is not connected"
        text="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for this project, then reload."
      />
    );
  if (isLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#F4F6FB]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: RED }} />
      </div>
    );
  if (error)
    return (
      <GateCard
        icon={AlertTriangle}
        title="Admin tables are missing"
        text="Run supabase/migrations/0010_academy_admin.sql in the Supabase SQL editor, then reload."
      />
    );
  if (!data?.user) return <AdminLogin />;
  if (!data.isAdmin)
    return (
      <GateCard
        icon={AlertTriangle}
        title="Not an admin"
        text={`${data.user.email} is signed in but isn't on the admin list. Add this account to academy_admins in Supabase.`}
        action={
          <Btn variant="ghost" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Btn>
        }
      />
    );
  return <AdminShell>{children}</AdminShell>;
}

function GateCard({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F4F6FB] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"
      >
        <Icon className="mx-auto h-10 w-10" style={{ color: RED }} />
        <h1 className="mt-4 text-xl font-extrabold" style={{ color: NAVY }}>
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
        {action && <div className="mt-5">{action}</div>}
      </motion.div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!card.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      card.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    ).fromTo(
      card.current.querySelectorAll("[data-in]"),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" },
      "-=0.4",
    );
    return () => {
      tl.kill();
    };
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  };
  return (
    <div
      className="relative grid min-h-screen place-items-center overflow-hidden p-4"
      style={{ backgroundColor: NAVY }}
    >
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: RED }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      />
      <div ref={card} className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div data-in className="flex items-center gap-2">
          <img src={academyLogo} alt="" className="h-11 w-11 rounded-full object-contain" />
          <span className="text-lg font-extrabold leading-tight" style={{ color: NAVY }}>
            DarlTech
            <br />
            Academy
          </span>
        </div>
        <h1 data-in className="mt-6 text-2xl font-extrabold" style={{ color: NAVY }}>
          Admin sign in
        </h1>
        <p data-in className="text-sm text-slate-500">
          For the DarlTech team only.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            data-in
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none ring-blue-200 focus:ring-2"
          />
          <input
            data-in
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none ring-blue-200 focus:ring-2"
          />
          <AnimatePresence>
            {err && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
              >
                {err}
              </motion.p>
            )}
          </AnimatePresence>
          <div data-in>
            <Btn type="submit" disabled={busy} className="w-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============ modal + generic CRUD table ============ */

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-[#0B1F4D]/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold" style={{ color: NAVY }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type Field = {
  key: string;
  label: string;
  type?: "text" | "email" | "number" | "select" | "textarea" | "checkbox";
  options?: string[];
  required?: boolean;
};

export type Column<R> = { label: string; render: (r: R) => ReactNode; className?: string };

export function CrudTable<R extends { id: string; created_at: string }>({
  table,
  title,
  subtitle,
  columns,
  fields,
  searchKeys,
  statusKey = "status" as keyof R,
  statuses,
  defaults,
  filter,
  rowActions,
  initialQuery = "",
}: {
  table: TableName;
  title: string;
  subtitle: string;
  columns: Column<R>[];
  fields: Field[];
  searchKeys: (keyof R)[];
  statusKey?: keyof R;
  statuses: string[];
  defaults: Partial<R>;
  filter?: (r: R) => boolean;
  rowActions?: (r: R, save: (patch: Partial<R>) => void) => ReactNode;
  initialQuery?: string;
}) {
  const { data, isLoading, error } = useTable(table);
  const save = useSave(table);
  const remove = useRemove(table);
  const [q, setQ] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Partial<R> | null>(null);
  const [confirm, setConfirm] = useState<R | null>(null);

  const rows = useMemo(() => {
    const all = ((data ?? []) as unknown as R[]).filter((r) => (filter ? filter(r) : true));
    const needle = q.trim().toLowerCase();
    return all.filter(
      (r) =>
        (status === "all" || String(r[statusKey]) === status) &&
        (!needle ||
          searchKeys.some((k) =>
            String(r[k] ?? "")
              .toLowerCase()
              .includes(needle),
          )),
    );
  }, [data, q, status, filter, searchKeys, statusKey]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const r of ((data ?? []) as unknown as R[]).filter((r) => (filter ? filter(r) : true))) {
      c.all++;
      c[String(r[statusKey])] = (c[String(r[statusKey])] ?? 0) + 1;
    }
    return c;
  }, [data, filter, statusKey]);

  return (
    <Page
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <Btn
            variant="ghost"
            onClick={() =>
              downloadCsv(
                table.replace("academy_", ""),
                rows as unknown as Record<string, unknown>[],
              )
            }
          >
            <Download className="h-4 w-4" /> Export
          </Btn>
          <Btn onClick={() => setEditing({ ...defaults })}>
            <Plus className="h-4 w-4" /> Add new
          </Btn>
        </>
      }
    >
      <Panel>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-50 p-1">
            {["all", ...statuses].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="relative rounded-lg px-3 py-1.5 text-xs font-semibold capitalize"
              >
                {status === s && (
                  <motion.span
                    layoutId={`tab-${table}`}
                    className="absolute inset-0 rounded-lg bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative" style={{ color: status === s ? NAVY : "#64748B" }}>
                  {s} <span className="text-slate-400">{counts[s] ?? 0}</span>
                </span>
              </button>
            ))}
          </div>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 md:w-72">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        {error ? (
          <Empty icon={AlertTriangle} title="Couldn't load data" hint={(error as Error).message} />
        ) : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-50" />
            ))}
          </div>
        ) : !rows.length ? (
          <Empty
            title="Nothing here yet"
            hint={
              q || status !== "all"
                ? "Try a different search or filter."
                : "Click “Add new” to create the first record."
            }
          />
        ) : (
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  {columns.map((c) => (
                    <th key={c.label} className={cn("px-5 py-3 font-semibold", c.className)}>
                      {c.label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <motion.tbody layout>
                <AnimatePresence initial={false}>
                  {rows.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: Math.min(i, 12) * 0.025 } }}
                      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="border-b border-slate-50 transition-colors hover:bg-[#F8FAFF]"
                    >
                      {columns.map((c) => (
                        <td key={c.label} className={cn("px-5 py-3", c.className)}>
                          {c.render(r)}
                        </td>
                      ))}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {rowActions?.(r, (patch) => save.mutate({ id: r.id, ...patch } as never))}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            aria-label="Edit"
                            onClick={() => setEditing(r)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            aria-label="Delete"
                            onClick={() => setConfirm(r)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && "id" in editing && editing.id ? "Edit record" : "Add new"}
      >
        {editing && (
          <RecordForm
            fields={fields}
            value={editing as Record<string, unknown>}
            busy={save.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(v) => save.mutate(v as never, { onSuccess: () => setEditing(null) })}
          />
        )}
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete this record?">
        <p className="text-sm text-slate-600">This can't be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirm(null)}>
            Cancel
          </Btn>
          <Btn
            disabled={remove.isPending}
            onClick={() =>
              confirm && remove.mutate(confirm.id, { onSuccess: () => setConfirm(null) })
            }
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Btn>
        </div>
      </Modal>
    </Page>
  );
}

export function RecordForm({
  fields,
  value,
  onSubmit,
  onCancel,
  busy,
}: {
  fields: Field[];
  value: Record<string, unknown>;
  onSubmit: (v: Record<string, unknown>) => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const [v, setV] = useState<Record<string, unknown>>(value);
  const set = (k: string, x: unknown) => setV((p) => ({ ...p, [k]: x }));
  const input =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-blue-200 transition focus:ring-2";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const out: Record<string, unknown> = { ...v };
        for (const f of fields) if (f.type === "number") out[f.key] = Number(out[f.key] ?? 0);
        onSubmit(out);
      }}
      className="space-y-4"
    >
      {fields.map((f, i) => (
        <motion.label
          key={f.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
          className={cn("block", f.type === "checkbox" && "flex items-center gap-3")}
        >
          {f.type !== "checkbox" && (
            <span className="mb-1 block text-xs font-semibold text-slate-600">
              {f.label}
              {f.required && " *"}
            </span>
          )}
          {f.type === "select" ? (
            <select
              required={f.required}
              value={String(v[f.key] ?? "")}
              onChange={(e) => set(f.key, e.target.value)}
              className={input}
            >
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              value={String(v[f.key] ?? "")}
              onChange={(e) => set(f.key, e.target.value)}
              rows={3}
              className={cn(input, "h-auto py-2")}
            />
          ) : f.type === "checkbox" ? (
            <>
              <input
                type="checkbox"
                checked={Boolean(v[f.key])}
                onChange={(e) => set(f.key, e.target.checked)}
                className="h-5 w-5 accent-[#E1251B]"
              />
              <span className="text-sm font-medium text-slate-700">{f.label}</span>
            </>
          ) : (
            <input
              type={f.type ?? "text"}
              required={f.required}
              value={String(v[f.key] ?? "")}
              onChange={(e) => set(f.key, e.target.value)}
              className={input}
              min={f.type === "number" ? 0 : undefined}
            />
          )}
        </motion.label>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Btn>
      </div>
    </form>
  );
}

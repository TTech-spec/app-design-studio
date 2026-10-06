import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  ClipboardCheck,
  ClipboardPlus,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Search,
  ShoppingBag,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent, type ReactNode } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";
import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/academy/data";
import { useAcademy, type Role } from "@/lib/academy/store";
import { Avatar, Logo } from "./ui";

type To = FileRouteTypes["to"];
type NavItem = { to: To; label: string; icon: LucideIcon; exact?: boolean; badge?: number };

const STUDENT_NAV: NavItem[] = [
  { to: "/student/feed", label: "Home", icon: Home },
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/student/explore", label: "Explore courses", icon: BookOpen },
  { to: "/student/quizzes", label: "Quizzes", icon: ClipboardCheck },
  { to: "/student/messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { to: "/student/store", label: "Store", icon: ShoppingBag },
  { to: "/student/profile", label: "Profile", icon: User },
];
const STUDENT_TABS: NavItem[] = [
  { to: "/student/feed", label: "Home", icon: Home },
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/student/search", label: "Search", icon: Search },
  { to: "/student/messages", label: "Chat", icon: MessageCircle },
  { to: "/student/profile", label: "Profile", icon: User },
];
const TUTOR_NAV: NavItem[] = [
  { to: "/tutor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tutor/quizzes/new", label: "Create quiz", icon: ClipboardPlus },
  { to: "/tutor/quizzes", label: "Quizzes & results", icon: TrendingUp },
  { to: "/tutor/messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { to: "/tutor/feed", label: "Tech feed", icon: Home },
  { to: "/tutor/profile", label: "Profile", icon: User },
];
const TUTOR_TABS: NavItem[] = [
  { to: "/tutor", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/tutor/quizzes/new", label: "Create", icon: ClipboardPlus },
  { to: "/tutor/quizzes", label: "Quizzes", icon: TrendingUp },
  { to: "/tutor/messages", label: "Chat", icon: MessageCircle },
  { to: "/tutor/profile", label: "Profile", icon: User },
];

function isActive(path: string, item: NavItem, all: NavItem[]) {
  if (item.exact) return path === item.to || path === `${item.to}/`;
  if (!(path === item.to || path.startsWith(`${item.to}/`))) return false;
  // prefer the most specific match (e.g. /tutor/quizzes/new over /tutor/quizzes)
  return !all.some(
    (o) =>
      o !== item && o.to.length > item.to.length && (path === o.to || path.startsWith(`${o.to}/`)),
  );
}

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { user, signOut } = useAcademy();
  const path = useLocation({ select: (l) => l.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const reduceMotion = useReducedMotion();
  const nav = role === "student" ? STUDENT_NAV : TUTOR_NAV;
  const tabs = role === "student" ? STUDENT_TABS : TUTOR_TABS;
  const name = user?.name ?? (role === "student" ? "Guest" : "Tutor");
  const initials = user ? initialsOf(user.name) : "G";
  const color = role === "student" ? "#EF4136" : "#1a3d72";

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/student/search", search: { q } });
  };

  return (
    <div className="academy min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <nav
        aria-label="Main"
        className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-primary px-4 py-6 text-white lg:flex"
      >
        <Link to={role === "student" ? "/student" : "/tutor"} className="px-2 pb-7">
          <Logo light />
        </Link>
        <p className="mb-2 px-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">
          {role} portal
        </p>
        <div className="flex flex-col gap-1">
          {nav.map((item) => {
            const on = isActive(path, item, nav);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm transition",
                  on
                    ? "bg-white/12 font-bold text-white"
                    : "font-medium text-white/80 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon size={20} />
                {item.label}
                {item.badge ? (
                  <span className="ml-auto flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#EF4136] px-1.5 text-[11px] font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
        <div className="flex-1" />
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/8 p-3">
          <Avatar initials={initials} color={color} size={38} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-bold">{name}</span>
            <span className="text-xs capitalize text-white/70">{role}</span>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/10"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="lg:pl-[248px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-white px-4 md:h-[72px] md:px-8">
          <Link to={role === "student" ? "/student" : "/tutor"} className="lg:hidden">
            <Logo />
          </Link>
          {role === "student" ? (
            <form onSubmit={onSearch} role="search" className="hidden w-full max-w-[460px] md:flex">
              <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-primary-soft bg-surface px-4 text-muted-foreground focus-within:border-primary">
                <Search size={18} />
                <span className="sr-only">Search</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search skills, materials and tutors"
                  className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
                />
              </label>
            </form>
          ) : (
            <span className="hidden text-sm font-semibold text-muted-foreground md:block">
              Tutor portal
            </span>
          )}
          <div className="flex-1" />
          {role === "student" && (
            <Link
              to="/student/search"
              search={{ q: "" }}
              aria-label="Search"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border md:hidden"
            >
              <Search size={20} />
            </Link>
          )}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white"
          >
            <Bell size={20} />
            <span className="absolute right-[11px] top-[10px] h-2 w-2 rounded-full bg-[#EF4136]" />
          </button>
          <Link
            to={role === "student" ? "/student/profile" : "/tutor/profile"}
            aria-label="Your profile"
            className="hidden md:block"
          >
            <Avatar initials={initials} color={color} size={40} />
          </Link>
        </header>

        {!user && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-primary-soft px-4 py-2.5 text-center text-sm">
            <span>You’re looking around as a guest.</span>
            <Link to="/join" className="font-bold text-[#D7372C] hover:underline">
              Create a free account
            </Link>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-5 md:px-8 md:pt-7 lg:pb-12">
          {/* Framer page transition: each page rises in as you move around the portal */}
          <motion.div
            key={path}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-white px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 lg:hidden"
      >
        {tabs.map((item) => {
          const on = isActive(path, item, tabs);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 text-[11px]",
                on ? "font-bold text-[#D7372C]" : "font-semibold text-muted-foreground",
              )}
            >
              <Icon size={22} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

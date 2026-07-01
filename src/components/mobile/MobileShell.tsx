import { Link, useParams } from "@tanstack/react-router";
import { Home, Search, PlusCircle, MessageCircle, User, ChevronLeft, Bell } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showBottomNav?: boolean;
  headerRight?: ReactNode;
  headerVariant?: "default" | "forest" | "transparent";
  contentClassName?: string;
  fullBleed?: boolean;
};

export function MobileShell({
  children,
  title,
  showBack = true,
  showBottomNav = true,
  headerRight,
  headerVariant = "default",
  contentClassName,
  fullBleed = false,
}: Props) {
  const params = useParams({ strict: false }) as { screen?: string };
  const active = params.screen ?? "home";

  const headerCls =
    headerVariant === "forest"
      ? "bg-forest text-forest-foreground"
      : headerVariant === "transparent"
      ? "bg-transparent"
      : "bg-card border-b border-border";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface">
      {(title || showBack) && (
        <header className={cn("flex items-center gap-3 px-4 pt-3 pb-3 shrink-0", headerCls)}>
          {showBack && (
            <Link
              to="/app"
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full transition",
                headerVariant === "forest" ? "hover:bg-white/10" : "hover:bg-muted"
              )}
              aria-label="Back to screen index"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="text-lg font-semibold tracking-tight truncate flex-1">{title}</h1>
          {headerRight}
        </header>
      )}
      <main
        className={cn(
          "flex-1 overflow-y-auto scrollbar-hide",
          fullBleed ? "" : "px-4 py-4",
          showBottomNav ? "pb-24" : "pb-4",
          contentClassName
        )}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav active={active} />}
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { slug: "home", label: "Home", icon: Home },
    { slug: "marketplace", label: "Market", icon: Search },
    { slug: "my-listings", label: "Sell", icon: PlusCircle, primary: true },
    { slug: "messages", label: "Chats", icon: MessageCircle },
    { slug: "farmer-dashboard", label: "Profile", icon: User },
  ];
  return (
    <nav className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur pb-safe">
      <div className="grid grid-cols-5 px-2 pt-2 pb-3">
        {items.map((it) => {
          const isActive = active === it.slug;
          const Icon = it.icon;
          if (it.primary) {
            return (
              <Link
                key={it.slug}
                to="/app/$screen"
                params={{ screen: it.slug }}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary shadow-glow text-primary-foreground -mt-4">
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">{it.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={it.slug}
              to="/app/$screen"
              params={{ screen: it.slug }}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon
                className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function NotificationBell({ count = 3 }: { count?: number }) {
  return (
    <Link
      to="/app/$screen"
      params={{ screen: "notifications" }}
      className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

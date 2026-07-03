import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck, MessageCircle, Eye, Sprout, Star, Bell, BellOff, Trash2,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { Chip } from "@/components/mobile/ui";
import { NOTIFICATIONS } from "@/lib/agricon-data";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Agricon NG — Notifications" }] }),
  component: NotificationsPage,
});

type NotifType = "verify" | "message" | "listing" | "harvest" | "review";

const TABS = ["All", "Inquiries", "Verification", "Listings", "System"] as const;
type Tab = (typeof TABS)[number];

// Extended notifications list
const ALL_NOTIFICATIONS = [
  ...NOTIFICATIONS,
  {
    id: "n6",
    type: "listing" as NotifType,
    title: "Price alert",
    body: "Cassava prices in Oyo State increased by 12% this week.",
    time: "3d ago",
    unread: false,
  },
  {
    id: "n7",
    type: "review" as NotifType,
    title: "New review",
    body: "Emeka Nwosu left a 5-star review on your Yam listing.",
    time: "4d ago",
    unread: false,
  },
  {
    id: "n8",
    type: "verify" as NotifType,
    title: "Document approved",
    body: "Your land title document has been verified by our team.",
    time: "1w ago",
    unread: false,
  },
];

function getIcon(type: string) {
  switch (type) {
    case "verify": return <ShieldCheck className="h-5 w-5" />;
    case "message": return <MessageCircle className="h-5 w-5" />;
    case "listing": return <Eye className="h-5 w-5" />;
    case "harvest": return <Sprout className="h-5 w-5" />;
    case "review": return <Star className="h-5 w-5" />;
    default: return <Bell className="h-5 w-5" />;
  }
}

function getIconColor(type: string) {
  switch (type) {
    case "verify": return "bg-primary-soft text-primary";
    case "harvest": return "bg-gold-soft text-gold-foreground";
    case "message": return "bg-info/20 text-info";
    case "review": return "bg-gold-soft text-gold-foreground";
    default: return "bg-secondary text-forest";
  }
}

function getRoute(type: string) {
  switch (type) {
    case "message": return "/chat";
    case "verify": return "/verification-status";
    case "listing": return "/marketplace";
    default: return "/home";
  }
}

function NotificationsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<Tab>("All");
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (tab === "All") return true;
    if (tab === "Inquiries") return n.type === "message";
    if (tab === "Verification") return n.type === "verify";
    if (tab === "Listings") return n.type === "listing" || n.type === "review";
    return true;
  });

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleTap(n: typeof notifications[0]) {
    // Mark as read
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
    );
    navigate({ to: getRoute(n.type) as never });
  }

  if (isMobile) {
    return (
      <MobileShell
        standalone
        title="Notifications"
        showBack
        backTo="/home"
        showBottomNav
        headerRight={
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-semibold text-primary disabled:text-muted-foreground"
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>
        }
      >
        <div className="space-y-4">
          {/* Tabs */}
          <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
            {TABS.map((t) => (
              <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
                {t === "All" && unreadCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary">
                    {unreadCount}
                  </span>
                )}
              </Chip>
            ))}
          </div>

          {/* Notification list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-muted-foreground">
                <BellOff className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">No notifications</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You're all caught up in this category.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className={`group relative flex items-start gap-3 rounded-2xl border p-4 transition ${
                    n.unread
                      ? "border-primary/30 bg-primary-soft/40"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${getIconColor(n.type)}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  {/* Content */}
                  <button
                    type="button"
                    onClick={() => handleTap(n)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-foreground leading-snug">{n.title}</p>
                      {n.unread && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{n.time}</p>
                  </button>

                  {/* Dismiss button (shown on hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(n.id);
                    }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-destructive transition"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Settings link */}
          <button
            type="button"
            onClick={() => navigate({ to: "/settings" })}
            className="flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" /> Manage notification preferences
          </button>
        </div>
      </MobileShell>
    );
  }

  // Desktop layout (matches provided HTML structure)
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
            <span className="text-xl font-bold font-headline-md text-primary">Agro-Farm</span>
          </div>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#"> 
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#"> 
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-medium">Inventory</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#"> 
              <span className="material-symbols-outlined">storefront</span>
              <span className="font-medium">Listings</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 bg-primary-container text-on-primary-fixed-variant rounded-lg" href="#"> 
              <span className="material-symbols-outlined">notifications</span>
              <span className="font-medium">Notifications</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#"> 
              <span className="material-symbols-outlined">analytics</span>
              <span className="font-medium">Reports</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#"> 
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium">Settings</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto p-4 pb-[20px] space-y-2">
          <button className="w-full bg-primary text-on-primary flex items-center justify-center gap-2 py-3 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-xl">add</span>
            New Request
          </button>
          <div className="pt-2">
            <a className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-secondary-container rounded-lg transition-colors" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-medium">Support</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container rounded-lg transition-colors" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-headline-lg text-on-surface">Notifications</h1>
              <p className="text-on-surface-variant mt-1">Stay updated with your farm activities and inquiries.</p>
            </div>
            <button onClick={markAllRead} className="text-primary font-medium flex items-center gap-2 hover:underline">
              <span className="material-symbols-outlined text-xl">done_all</span>
              Mark all read
            </button>
          </div>

          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full font-medium ${t === "All" ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant border border-outline-variant hover:bg-outline-variant"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((n) => (
              <div key={n.id} className={`p-5 rounded-xl flex gap-4 relative group transition-shadow ${n.type === 'verify' ? 'bg-primary-container/20 border border-primary/20' : n.type === 'message' ? 'bg-primary-container/10 border border-primary/10' : 'bg-surface-container border border-transparent'}`}>
                <div className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${n.type === 'verify' ? 'bg-primary-container' : n.type === 'message' ? 'bg-white border border-outline-variant' : 'bg-surface-variant'}`}>
                  <span className="material-symbols-outlined text-primary">{n.type === 'verify' ? 'verified_user' : n.type === 'message' ? 'chat_bubble' : n.type === 'listing' ? 'visibility' : n.type === 'harvest' ? 'potted_plant' : 'star'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-on-surface text-lg">{n.title}</h3>
                    <span className="text-on-surface-variant text-sm">{n.time}</span>
                  </div>
                  <p className="text-on-surface-variant mt-1">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

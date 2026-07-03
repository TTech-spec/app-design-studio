import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Sprout, Search, Bell, ShoppingCart, LogOut, Menu, Home as HomeIcon,
  Layers, MessageCircle, User as UserIcon, Settings as SettingsIcon,
  Package, TrendingUp, MapPin, ArrowRight,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { CROP_CATEGORIES, FARMS, CROPS } from "@/lib/agricon-data";
import { FarmCard, CropCard, Rating, VerificationBadge, Chip } from "@/components/mobile/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Agricon NG — Marketplace" }] }),
  component: HomePage,
});

const NAV_ITEMS = [
  { to: "/home", label: "Dashboard", icon: HomeIcon },
  { to: "/marketplace", label: "Marketplace", icon: Layers },
  { to: "/app/$screen", params: { screen: "categories" }, label: "Categories", icon: Package },
  { to: "/app/$screen", params: { screen: "messages" }, label: "Messages", icon: MessageCircle },
  { to: "/app/$screen", params: { screen: "notifications" }, label: "Notifications", icon: Bell },
  { to: "/buyer-profile", label: "Profile", icon: UserIcon },
  { to: "/app/$screen", params: { screen: "settings" }, label: "Settings", icon: SettingsIcon },
] as const;

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sprout className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight text-forest">Agricon</span>
        </div>
        <nav className="space-y-1 p-3">
          {NAV_ITEMS.map((it) => {
            const Icon = it.icon;
            const commonCls = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground/70 transition hover:bg-secondary hover:text-forest";
            const activeProps = { className: "!bg-primary-soft !text-primary" };
            if ("params" in it) {
              return (
                <Link key={it.label} to={it.to} params={it.params} onClick={onClose} className={commonCls} activeProps={activeProps}>
                  <Icon className="h-5 w-5" />
                  {it.label}
                </Link>
              );
            }
            return (
              <Link key={it.label} to={it.to} onClick={onClose} className={commonCls} activeProps={activeProps}>
                <Icon className="h-5 w-5" />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function TopBar({ onMenu, onSignOut }: { onMenu: () => void; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur-xl lg:px-8">
      <button type="button" onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden max-w-xl flex-1 md:block">
        <label className="flex h-11 items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search farms, crops, locations..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="hidden rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground md:inline">⌘K</span>
        </label>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link to="/app/$screen" params={{ screen: "notifications" }} className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">3</span>
        </Link>
        <Link to="/app/$screen" params={{ screen: "messages" }} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary">
          <MessageCircle className="h-5 w-5" />
        </Link>
        <button type="button" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary" aria-label="Cart">
          <ShoppingCart className="h-5 w-5" />
        </button>
        <div className="mx-2 hidden h-6 w-px bg-border md:block" />
        <Link to="/buyer-profile" className="hidden items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 text-sm font-semibold hover:bg-secondary md:flex">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-forest text-xs font-black text-white">AK</span>
          <span className="truncate">Adekunle</span>
        </Link>
        <button type="button" onClick={onSignOut} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-secondary" aria-label="Sign out">
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

function StatCard({ label, value, delta, icon }: { label: string; value: string; delta: string; icon: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-black text-forest">{value}</p>
          <p className="mt-1 text-xs font-semibold text-primary">{delta}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</span>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/signin" });
  }

  // Desktop view
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setSidebarOpen(true)} onSignOut={handleSignOut} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-10">
          {/* Hero band */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-primary to-forest p-6 text-white shadow-glow md:p-10">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">Welcome back</p>
              <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">Fresh, verified produce — from farm to your business.</h1>
              <p className="mt-3 text-sm text-white/80 md:text-base">Browse listings from 12,000+ verified farmers across Nigeria. Message directly, negotiate quantities, and secure delivery in days.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/marketplace" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-forest hover:bg-white/90">
                  Explore marketplace <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/app/$screen" params={{ screen: "categories" }} className="inline-flex h-11 items-center gap-2 rounded-2xl border-2 border-white/40 px-5 text-sm font-bold text-white hover:bg-white/10">
                  Browse categories
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 right-24 h-48 w-48 rounded-full bg-gold/30 blur-3xl" />
          </section>

          {/* Stats */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Verified farms" value="12,842" delta="+284 this week" icon={<Sprout className="h-5 w-5" />} />
            <StatCard label="Active listings" value="5,127" delta="+12% MoM" icon={<Package className="h-5 w-5" />} />
            <StatCard label="Avg. response" value="< 42 min" delta="Fastest in NG" icon={<MessageCircle className="h-5 w-5" />} />
            <StatCard label="Marketplace value" value="₦3.2B" delta="+18% YoY" icon={<TrendingUp className="h-5 w-5" />} />
          </section>

          {/* Categories */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-forest md:text-2xl">Shop by category</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose from Nigeria's most in-demand crop categories.</p>
              </div>
              <Link to="/app/$screen" params={{ screen: "categories" }} className="hidden text-sm font-semibold text-primary hover:underline md:inline">See all →</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All</Chip>
              {CROP_CATEGORIES.map((c) => (
                <Chip key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
                  <span className="mr-1">{c.icon}</span>{c.name}
                </Chip>
              ))}
            </div>
          </section>

          {/* Featured Farms */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-forest md:text-2xl">Featured verified farms</h2>
                <p className="mt-1 text-sm text-muted-foreground">Handpicked farms with excellent ratings and reliable delivery.</p>
              </div>
              <Link to="/app/$screen" params={{ screen: "featured-farms" }} className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {FARMS.map((farm) => <FarmCard key={farm.id} farm={farm} />)}
            </div>
          </section>

          {/* Trending Crops */}
          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-forest md:text-2xl">Trending produce</h2>
                <p className="mt-1 text-sm text-muted-foreground">In-season crops with the highest demand right now.</p>
              </div>
              <Link to="/marketplace" className="text-sm font-semibold text-primary hover:underline">Shop all →</Link>
            </div>
            <div className="mt-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {CROPS.map((crop) => <CropCard key={crop.id} crop={crop} />)}
            </div>
          </section>

          {/* Orders / Activity Table */}
          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-forest md:text-2xl">Recent inquiries</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your latest conversations with verified farmers.</p>
              </div>
              <Link to="/app/$screen" params={{ screen: "inquiry-history" }} className="text-sm font-semibold text-primary hover:underline">Full history →</Link>
            </div>
            <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="hidden grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.7fr_auto] gap-4 border-b border-border bg-secondary/50 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground md:grid">
                <span>Farm</span>
                <span>Crop</span>
                <span>Quantity</span>
                <span>Location</span>
                <span>Status</span>
                <span></span>
              </div>
              {FARMS.slice(0, 5).map((f, i) => (
                <Link
                  key={f.id}
                  to="/app/$screen"
                  params={{ screen: "chat" }}
                  className="grid grid-cols-1 gap-2 border-b border-border px-6 py-4 last:border-b-0 hover:bg-secondary/40 md:grid-cols-[1.4fr_1.2fr_0.9fr_0.9fr_0.7fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary font-black">
                      {f.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{f.name}</p>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        {f.verified && <VerificationBadge size="sm" />}
                        <Rating value={f.rating} compact />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-foreground/80">{f.crops.slice(0, 2).join(", ")}</span>
                  <span className="text-sm font-semibold text-foreground">{["2 tonnes", "40 bags", "1.5 tonnes", "18 baskets", "6 crates"][i]}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{f.location}</span>
                  <span>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold",
                      ["bg-primary-soft text-primary", "bg-gold-soft text-gold-foreground", "bg-blue-100 text-blue-700", "bg-primary-soft text-primary", "bg-secondary text-secondary-foreground"][i]
                    )}>
                      {["Confirmed", "Negotiating", "Awaiting", "Confirmed", "Delivered"][i]}
                    </span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 text-muted-foreground md:block" />
                </Link>
              ))}
            </div>
          </section>

          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}

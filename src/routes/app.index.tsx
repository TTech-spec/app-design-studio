import { createFileRoute, Link } from "@tanstack/react-router";
import { SCREENS } from "@/lib/agricon-data";
import { SCREEN_COMPONENTS } from "@/components/mobile/screens";
import { ArrowLeft, Sprout, ExternalLink, Zap } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Agricon NG — 50-Screen Mobile Prototype" },
      { name: "description", content: "Explore the complete 50-screen high-fidelity prototype for Agricon NG, Nigeria's trusted agricultural marketplace." },
    ],
  }),
  component: AppIndex,
});

/* ── Live functional pages wired to real routes ── */
const LIVE_PAGES: Record<string, {
  sections: Array<{ title: string; slug: string; route: string }>;
}> = {
  Marketplace: {
    sections: [
      { title: "Home",            slug: "home",           route: "/home" },
      { title: "Marketplace",     slug: "marketplace",    route: "/marketplace" },
      { title: "Categories",      slug: "categories",     route: "/categories" },
      { title: "Search",          slug: "search",         route: "/search" },
      { title: "Search Results",  slug: "search-results", route: "/search-results" },
      { title: "Filters",         slug: "filters",        route: "/filters" },
      { title: "Featured Farms",  slug: "featured-farms", route: "/featured-farms" },
      { title: "Seasonal",        slug: "seasonal",       route: "/seasonal" },
    ],
  },
  "Farm & Crop": {
    sections: [
      { title: "Farm Profile",      slug: "farm-profile",      route: "/farm-profile" },
      { title: "Farmer Profile",    slug: "farmer-profile",    route: "/farmer-profile" },
      { title: "Crop Details",      slug: "crop-details",      route: "/crop-details" },
      { title: "Photo Gallery",     slug: "photo-gallery",     route: "/photo-gallery" },
      { title: "Reviews",           slug: "reviews",           route: "/reviews" },
      { title: "Harvest Timeline",  slug: "harvest-timeline",  route: "/harvest-timeline" },
      { title: "Farm Map",          slug: "farm-map",          route: "/farm-map" },
      { title: "Contact Farmer",    slug: "contact-farmer",    route: "/contact-farmer" },
    ],
  },
  Communication: {
    sections: [
      { title: "Messages",     slug: "messages",     route: "/messages" },
      { title: "Chat",         slug: "chat",         route: "/chat" },
      { title: "Image Viewer", slug: "image-viewer", route: "/image-viewer" },
      { title: "Notifications",slug: "notifications",route: "/notifications" },
    ],
  },
  Settings: {
    sections: [
      { title: "Settings",         slug: "settings",         route: "/settings" },
      { title: "Help Center",      slug: "help-center",      route: "/help-center" },
      { title: "Contact Support",  slug: "contact-support",  route: "/contact-support" },
    ],
  },
};

function AppIndex() {
  const sections = Array.from(new Set(SCREENS.map((s) => s.section)));

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to landing
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-forest">AGRICON NG</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prototype + Live Pages</p>
            </div>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Clickable prototype · 50 screens
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-forest md:text-5xl">The complete mobile experience</h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Every screen from the AGRICON NG blueprint — authentication, onboarding, marketplace, farm profiles, communication, dashboards, and support. Tap any screen to explore the full user flow.
          </p>
        </div>

        {/* ── Live functional pages banner ── */}
        <div className="mb-14 rounded-3xl border-2 border-primary/30 bg-primary-soft px-6 py-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-white shadow-glow shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-forest">Live functional pages</h2>
              <p className="text-sm text-forest/70">Fully wired screens with real navigation, state, and interactions</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(LIVE_PAGES).map(([sectionName, { sections: pages }]) => (
              <div key={sectionName}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-forest/60">{sectionName}</p>
                <div className="space-y-1">
                  {pages.map((p) => {
                    const Component = SCREEN_COMPONENTS[p.slug];
                    return (
                      <Link
                        key={p.slug}
                        to={p.route as never}
                        className="group flex items-center gap-3 rounded-2xl border border-primary/20 bg-white/60 p-3 hover:border-primary hover:bg-white transition"
                      >
                        {/* Mini thumbnail */}
                        <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                          <div className="pointer-events-none origin-top-left absolute inset-0" style={{ transform: "scale(0.082)", width: "375px", transformOrigin: "0 0" }}>
                            {Component && <Component />}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-forest group-hover:text-primary truncate">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground">{p.route}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Original 50-screen prototype gallery ── */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-forest">Prototype gallery <span className="text-base font-semibold text-muted-foreground ml-2">50 screens</span></h2>
          <p className="mt-1 text-sm text-muted-foreground">Click any thumbnail to open the full screen in the phone-frame viewer</p>
        </div>

        {sections.map((section) => {
          const screens = SCREENS.filter((s) => s.section === section);
          const hasLive = section in LIVE_PAGES;
          const liveMap = hasLive
            ? Object.fromEntries(LIVE_PAGES[section].sections.map((p) => [p.slug, p.route]))
            : {};

          return (
            <section key={section} className="mb-14">
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight text-forest">{section}</h2>
                {hasLive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    <Zap className="h-2.5 w-2.5" /> Live
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-muted-foreground">{screens.length} screens</span>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {screens.map((s) => {
                  const Component = SCREEN_COMPONENTS[s.slug];
                  const liveRoute = liveMap[s.slug];
                  return (
                    <div key={s.slug} className="group relative">
                      {/* Prototype viewer link */}
                      <Link
                        to="/app/$screen"
                        params={{ screen: s.slug }}
                        className="block"
                      >
                        <div className="relative overflow-hidden rounded-[24px] border border-border bg-forest p-1.5 shadow-card transition group-hover:shadow-pop group-hover:-translate-y-1">
                          <div className="pointer-events-none overflow-hidden rounded-[18px] bg-surface" style={{ height: "320px" }}>
                            <div className="origin-top-left" style={{ transform: "scale(0.38)", width: "375px", height: "842px" }}>
                              {Component && <Component />}
                            </div>
                          </div>
                          {/* Live badge overlay */}
                          {liveRoute && (
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground shadow">
                                <Zap className="h-2 w-2" /> Live
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 px-1">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary">{s.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">/{s.slug}</p>
                        </div>
                      </Link>
                      {/* Live page shortcut */}
                      {liveRoute && (
                        <Link
                          to={liveRoute as never}
                          className="mt-1.5 flex items-center gap-1 rounded-xl border border-primary/30 bg-primary-soft px-2.5 py-1.5 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
                        >
                          <Zap className="h-2.5 w-2.5" /> Open live page
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

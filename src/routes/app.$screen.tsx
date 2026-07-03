import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SCREEN_COMPONENTS } from "@/components/mobile/screens";
import { SCREENS } from "@/lib/agricon-data";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";

/* Map prototype slugs → standalone functional route paths */
const LIVE_ROUTES: Record<string, string> = {
  home:             "/home",
  marketplace:      "/marketplace",
  categories:       "/categories",
  search:           "/search",
  "search-results": "/search-results",
  filters:          "/filters",
  "featured-farms": "/featured-farms",
  seasonal:         "/seasonal",
  "farm-profile":   "/farm-profile",
  "farmer-profile": "/farmer-profile",
  "crop-details":   "/crop-details",
  "photo-gallery":  "/photo-gallery",
  reviews:          "/reviews",
  "harvest-timeline": "/harvest-timeline",
  "farm-map":       "/farm-map",
  "contact-farmer": "/contact-farmer",
  messages:         "/messages",
  chat:             "/chat",
  "image-viewer":   "/image-viewer",
  notifications:    "/notifications",
  settings:         "/settings",
  "help-center":    "/help-center",
  "contact-support":"/contact-support",
};

export const Route = createFileRoute("/app/$screen")({
  component: ScreenView,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p>Screen not found.</p>
      <Link to="/app" className="text-primary font-semibold">Back to index</Link>
    </div>
  ),
});

function ScreenView() {
  const { screen } = Route.useParams();
  const Component = SCREEN_COMPONENTS[screen];
  if (!Component) throw notFound();

  const idx = SCREENS.findIndex((s) => s.slug === screen);
  const prev = idx > 0 ? SCREENS[idx - 1] : null;
  const next = idx < SCREENS.length - 1 ? SCREENS[idx + 1] : null;
  const current = SCREENS[idx];
  const liveRoute = LIVE_ROUTES[screen];

  return (
    <div className="min-h-screen w-full bg-[oklch(0.95_0.008_120)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 lg:flex-row lg:items-start lg:justify-center">
        {/* Left: prev button (desktop) */}
        <div className="hidden lg:block lg:pt-64">
          {prev ? (
            <Link
              to="/app/$screen"
              params={{ screen: prev.slug }}
              className="group flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-card hover:shadow-pop"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Previous</p>
                <p className="text-sm font-bold text-foreground">{prev.title}</p>
              </div>
            </Link>
          ) : <div className="w-40" />}
        </div>

        {/* Phone frame */}
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{current?.section}</p>
            <h2 className="text-lg font-black text-forest">{current?.title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Screen {idx + 1} of {SCREENS.length}</p>
          </div>

          <div className="relative">
            {/* Phone frame */}
            <div className="rounded-[52px] bg-forest p-[10px] shadow-pop">
              <div className="relative overflow-hidden rounded-[44px] bg-surface" style={{ width: "375px", height: "812px" }}>
                {/* Status bar */}
                <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-2 pb-1 text-[11px] font-bold text-foreground">
                  <span>9:41</span>
                  <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-forest" />
                  <div className="flex items-center gap-1">
                    <span>●●●●</span>
                    <span>􀛨</span>
                    <span>􀛪</span>
                  </div>
                </div>
                <div className="pt-6 h-full">
                  <Component />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to="/app" className="text-sm font-semibold text-primary underline underline-offset-4">
              View all 50 screens
            </Link>
            {/* Live page shortcut */}
            {liveRoute && (
              <Link
                to={liveRoute as never}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary bg-primary-soft px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition shadow-glow"
              >
                <Zap className="h-4 w-4" /> Open live functional page
              </Link>
            )}
          </div>
        </div>

        {/* Right: next button (desktop) */}
        <div className="hidden lg:block lg:pt-64">
          {next ? (
            <Link
              to="/app/$screen"
              params={{ screen: next.slug }}
              className="group flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-card hover:shadow-pop"
            >
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next</p>
                <p className="text-sm font-bold text-foreground">{next.title}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-primary" />
            </Link>
          ) : <div className="w-40" />}
        </div>

        {/* Mobile prev/next */}
        <div className="flex gap-3 lg:hidden">
          {prev && (
            <Link to="/app/$screen" params={{ screen: prev.slug }} className="flex items-center gap-1 rounded-2xl bg-card px-4 py-2 text-sm font-semibold shadow-card">
              <ChevronLeft className="h-4 w-4" /> Prev
            </Link>
          )}
          {next && (
            <Link to="/app/$screen" params={{ screen: next.slug }} className="flex items-center gap-1 rounded-2xl bg-card px-4 py-2 text-sm font-semibold shadow-card">
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

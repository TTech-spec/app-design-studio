import { createFileRoute, Link } from "@tanstack/react-router";
import { SCREENS } from "@/lib/agricon-data";
import { SCREEN_COMPONENTS } from "@/components/mobile/screens";
import { ArrowLeft, Sprout } from "lucide-react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Agricon NG — 50-Screen Mobile Prototype" },
      { name: "description", content: "Explore the complete 50-screen high-fidelity prototype for Agricon NG, Nigeria's trusted agricultural marketplace." },
    ],
  }),
  component: AppIndex,
});

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
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">50-Screen Prototype</p>
            </div>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Clickable prototype · 50 screens
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-forest md:text-5xl">The complete mobile experience</h1>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
            Every screen from the AGRICON NG blueprint — authentication, onboarding, marketplace, farm profiles, communication, dashboards, and support. Tap any screen to explore the full user flow.
          </p>
        </div>

        {sections.map((section) => {
          const screens = SCREENS.filter((s) => s.section === section);
          return (
            <section key={section} className="mb-14">
              <div className="mb-5 flex items-baseline justify-between">
                <h2 className="text-xl font-black tracking-tight text-forest">{section}</h2>
                <span className="text-xs font-semibold text-muted-foreground">{screens.length} screens</span>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {screens.map((s) => {
                  const Component = SCREEN_COMPONENTS[s.slug];
                  return (
                    <Link
                      key={s.slug}
                      to="/app/$screen"
                      params={{ screen: s.slug }}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-[24px] border border-border bg-forest p-1.5 shadow-card transition group-hover:shadow-pop group-hover:-translate-y-1">
                        <div className="pointer-events-none overflow-hidden rounded-[18px] bg-surface" style={{ height: "320px" }}>
                          <div className="origin-top-left" style={{ transform: "scale(0.38)", width: "375px", height: "842px" }}>
                            {Component && <Component />}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 px-1">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary">{s.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">/{s.slug}</p>
                      </div>
                    </Link>
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

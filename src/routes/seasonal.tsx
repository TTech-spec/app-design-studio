import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { CropCard, Chip } from "@/components/mobile/ui";
import { CROPS } from "@/lib/agricon-data";
import { Wheat, CloudSun, Sun, Calendar, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/seasonal")({
  head: () => ({ meta: [{ title: "Agricon NG — Seasonal Produce" }] }),
  component: SeasonalPage,
});

const SEASON_TABS = ["This week", "This month", "Next month", "Q1 2026"];

const SEASON_DESCRIPTIONS: Record<string, { title: string; body: string; icon: React.ReactNode }> = {
  "This week": {
    icon: <Wheat className="h-5 w-5" />,
    title: "Freshest this week",
    body: "Just-harvested produce from top farms across Nigeria.",
  },
  "This month": {
    icon: <CloudSun className="h-5 w-5" />,
    title: "Rainy season harvests",
    body: "Fresh cassava, plantain, and vegetables from top farms.",
  },
  "Next month": {
    icon: <Sun className="h-5 w-5" />,
    title: "Upcoming harvests",
    body: "Pre-order now and lock in the best prices.",
  },
  "Q1 2026": {
    icon: <Calendar className="h-5 w-5" />,
    title: "Q1 2026 outlook",
    body: "Plan your sourcing ahead of time with harvest forecasts.",
  },
};

function SeasonalPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("This month");

  const info = SEASON_DESCRIPTIONS[tab];

  // Cycle crops by tab offset for variety
  const tabIdx = SEASON_TABS.indexOf(tab);
  const crops = [...CROPS.slice(tabIdx), ...CROPS.slice(0, tabIdx)];

  return (
    <MobileShell standalone title="In season" showBack backTo="/marketplace" showBottomNav>
      <div className="space-y-4">
        {/* Season banner */}
        <div className="rounded-2xl gradient-gold p-5 text-gold-foreground">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            {info.icon} {tab}
          </p>
          <h2 className="mt-1 text-xl font-black">{info.title}</h2>
          <p className="mt-1 text-sm opacity-90">{info.body}</p>
        </div>

        {/* Tab selector */}
        <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {SEASON_TABS.map((t) => (
            <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Chip>
          ))}
        </div>

        {/* Harvest indicator legend */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-primary" />
            In season
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-gold" />
            Harvest ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-border" />
            Off season
          </span>
        </div>

        {/* Crop grid */}
        <div>
          <p className="mb-3 text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{crops.length}</span> crops available
          </p>
          <div className="grid grid-cols-2 gap-3">
            {crops.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate({ to: "/crop-details", search: { id: c.id } as never })}
              >
                <CropCard crop={c} />
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing tip */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4" /> Sourcing tip
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Reserve produce 4–6 weeks before harvest to secure best pricing and guaranteed
            availability.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}

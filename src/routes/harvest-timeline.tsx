import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { Chip } from "@/components/mobile/ui";

export const Route = createFileRoute("/harvest-timeline")({
  head: () => ({ meta: [{ title: "Agricon NG — Harvest Timeline" }] }),
  component: HarvestTimelinePage,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CROP_TIMELINES = [
  {
    crop: "Cassava",
    color: "gradient-primary",
    solidColor: "#4ade80",
    harvestMonths: [0, 1, 10, 11],
    plantMonths: [3, 4],
    description: "Thrives in rainy season. Primary harvest: Oct–Feb.",
  },
  {
    crop: "Maize",
    color: "bg-gold",
    solidColor: "#f59e0b",
    harvestMonths: [6, 7, 8],
    plantMonths: [3, 4],
    description: "Planted March–April, harvested July–September.",
  },
  {
    crop: "Yam",
    color: "bg-forest",
    solidColor: "#166534",
    harvestMonths: [9, 10, 11],
    plantMonths: [1, 2],
    description: "Long growing season. Best harvested Oct–Dec.",
  },
  {
    crop: "Vegetables",
    color: "bg-info",
    solidColor: "#3b82f6",
    harvestMonths: [3, 4, 5, 6, 7, 8],
    plantMonths: [2, 3],
    description: "Multiple harvests possible. Peak: April–September.",
  },
  {
    crop: "Rice",
    color: "bg-gold",
    solidColor: "#d97706",
    harvestMonths: [9, 10, 11],
    plantMonths: [5, 6],
    description: "Wet season crop. Harvested September–December.",
  },
  {
    crop: "Plantain",
    color: "gradient-gold",
    solidColor: "#f59e0b",
    harvestMonths: [0, 1, 2, 6, 7, 8],
    plantMonths: [3, 4, 5],
    description: "Year-round availability. Peak production twice per year.",
  },
];

function HarvestTimelinePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "calendar">("chart");

  const displayCrops =
    selected ? CROP_TIMELINES.filter((c) => c.crop === selected) : CROP_TIMELINES;

  return (
    <MobileShell
      standalone
      title="Harvest timeline"
      showBack
      backTo="/farm-profile"
      showBottomNav
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Plan sourcing around real harvest windows for Kolawole Family Farms.
        </p>

        {/* View mode toggle */}
        <div className="grid grid-cols-2 rounded-2xl border border-border bg-card p-1">
          {(["chart", "calendar"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setViewMode(v)}
              className={`rounded-xl py-2 text-sm font-semibold capitalize transition ${
                viewMode === v
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {v} view
            </button>
          ))}
        </div>

        {/* Crop filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
          <Chip active={selected === null} onClick={() => setSelected(null)}>
            All crops
          </Chip>
          {CROP_TIMELINES.map((c) => (
            <Chip
              key={c.crop}
              active={selected === c.crop}
              onClick={() => setSelected((s) => (s === c.crop ? null : c.crop))}
            >
              {c.crop}
            </Chip>
          ))}
        </div>

        {/* Chart view */}
        {viewMode === "chart" && (
          <div className="space-y-3">
            {displayCrops.map((c) => (
              <div key={c.crop} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-foreground">{c.crop}</p>
                  <span className="text-xs text-muted-foreground">
                    {c.harvestMonths.length} harvest months
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">{c.description}</p>
                <div className="grid grid-cols-12 gap-1">
                  {MONTHS.map((m, i) => {
                    const isHarvest = c.harvestMonths.includes(i);
                    const isPlant = c.plantMonths.includes(i);
                    return (
                      <div key={m} className="text-center">
                        <div
                          className={`h-8 rounded ${
                            isHarvest
                              ? c.color
                              : isPlant
                              ? "bg-gold-soft"
                              : "bg-secondary"
                          }`}
                          title={isHarvest ? "Harvest" : isPlant ? "Planting" : "Off season"}
                        />
                        <p className="mt-1 text-[9px] text-muted-foreground">{m[0]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar view */}
        {viewMode === "calendar" && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Month header */}
            <div className="grid grid-cols-12 border-b border-border bg-secondary px-3 py-2">
              {MONTHS.map((m) => (
                <p key={m} className="text-center text-[10px] font-semibold text-muted-foreground">
                  {m[0]}
                </p>
              ))}
            </div>
            {/* Crop rows */}
            <div className="divide-y divide-border">
              {displayCrops.map((c) => (
                <div key={c.crop} className="flex items-center gap-3 px-3 py-2">
                  <p className="w-20 shrink-0 text-xs font-semibold text-foreground">{c.crop}</p>
                  <div className="flex-1 grid grid-cols-12 gap-0.5">
                    {MONTHS.map((m, i) => {
                      const isHarvest = c.harvestMonths.includes(i);
                      const isPlant = c.plantMonths.includes(i);
                      return (
                        <div
                          key={m}
                          className={`h-5 rounded-sm ${
                            isHarvest ? c.color : isPlant ? "bg-gold-soft" : "bg-secondary"
                          }`}
                          title={`${c.crop} - ${m}: ${isHarvest ? "Harvest" : isPlant ? "Planting" : "Off season"}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-sm gradient-primary inline-block" />
            Harvest
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-sm bg-gold-soft inline-block" />
            Planting
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-sm bg-secondary inline-block" />
            Off season
          </span>
        </div>

        {/* Planning tip */}
        <div className="rounded-2xl border border-primary bg-primary-soft p-4">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-forest">Planning tip</p>
              <p className="mt-1 text-xs text-forest">
                Reserve produce 4–6 weeks before harvest to secure the best pricing and guaranteed
                availability from this farm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

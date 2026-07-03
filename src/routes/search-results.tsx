import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, X, Search, Sliders } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { FarmCard, CropCard, Chip } from "@/components/mobile/ui";
import { FARMS, CROPS, CROP_CATEGORIES } from "@/lib/agricon-data";

type SearchParams = {
  q?: string;
  category?: string;
  label?: string;
};

export const Route = createFileRoute("/search-results")({
  head: () => ({ meta: [{ title: "Agricon NG — Search Results" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    label: typeof s.label === "string" ? s.label : undefined,
  }),
  component: SearchResultsPage,
});

type ViewMode = "farms" | "crops";

function SearchResultsPage() {
  const { q, category, label } = Route.useSearch();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("farms");
  const [activeFilters, setActiveFilters] = useState<string[]>(["Verified"]);

  const pageTitle = label ?? q ?? (category ? CROP_CATEGORIES.find((c) => c.id === category)?.name : "Results") ?? "Results";

  const filteredFarms = FARMS.filter((f) => {
    if (activeFilters.includes("Verified") && !f.verified) return false;
    if (q) {
      const lq = q.toLowerCase();
      return (
        f.name.toLowerCase().includes(lq) ||
        f.location.toLowerCase().includes(lq) ||
        f.crops.some((c) => c.toLowerCase().includes(lq))
      );
    }
    if (category) {
      const cat = CROP_CATEGORIES.find((c) => c.id === category);
      if (cat) return f.crops.some((c) => cat.name.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(cat.name.split(" ")[0].toLowerCase()));
    }
    return true;
  });

  const filteredCrops = CROPS.filter((c) => {
    if (activeFilters.includes("In season") && !c.season.toLowerCase().includes("season")) return false;
    if (q) {
      const lq = q.toLowerCase();
      return c.name.toLowerCase().includes(lq) || c.farm.toLowerCase().includes(lq);
    }
    return true;
  });

  const filterOptions = ["Verified", "In season", "Top rated", "Wholesale", "Nearby"];

  function toggleFilter(f: string) {
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  return (
    <MobileShell
      standalone
      title={pageTitle}
      showBack
      backTo="/marketplace"
      showBottomNav
      headerRight={
        <button
          type="button"
          onClick={() => navigate({ to: "/filters" })}
          className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
          aria-label="Open filters"
        >
          <Sliders className="h-5 w-5" />
          {activeFilters.length > 0 && (
            <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {activeFilters.length}
            </span>
          )}
        </button>
      }
    >
      <div className="space-y-4">
        {/* Search bar */}
        <button
          type="button"
          onClick={() => navigate({ to: "/search" })}
          className="flex w-full h-12 items-center gap-2 rounded-2xl border-2 border-border bg-card px-4"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-left text-sm text-muted-foreground">{q || label || "Search..."}</span>
        </button>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <span className="font-bold text-foreground">{view === "farms" ? filteredFarms.length : filteredCrops.length}</span>{" "}
            results found
          </span>
          <Link to="/filters" className="inline-flex items-center gap-1 font-semibold text-primary">
            <Filter className="h-3 w-3" /> Filters ({activeFilters.length})
          </Link>
        </div>

        {/* Active filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
            >
              {f}
              <button type="button" onClick={() => toggleFilter(f)} aria-label={`Remove ${f} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filterOptions
            .filter((f) => !activeFilters.includes(f))
            .map((f) => (
              <Chip key={f} onClick={() => toggleFilter(f)}>
                {f}
              </Chip>
            ))}
        </div>

        {/* View toggle */}
        <div className="grid grid-cols-2 rounded-2xl border border-border bg-card p-1">
          {(["farms", "crops"] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-xl py-2 text-sm font-semibold transition ${
                view === v ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              {v === "farms" ? `Farms (${filteredFarms.length})` : `Crops (${filteredCrops.length})`}
            </button>
          ))}
        </div>

        {/* Results */}
        {view === "farms" ? (
          filteredFarms.length > 0 ? (
            <div className="space-y-3">
              {filteredFarms.map((f) => (
                <div key={f.id} onClick={() => navigate({ to: "/farm-profile", search: { id: f.id } as never })}>
                  <FarmCard farm={f} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No farms found. Try removing some filters.</p>
            </div>
          )
        ) : filteredCrops.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredCrops.map((c) => (
              <div key={c.id} onClick={() => navigate({ to: "/crop-details", search: { id: c.id } as never })}>
                <CropCard crop={c} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No crops found. Try different keywords.</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

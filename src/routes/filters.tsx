import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput, Chip } from "@/components/mobile/ui";
import { NIGERIA_STATES } from "@/lib/agricon-data";

export const Route = createFileRoute("/filters")({
  head: () => ({ meta: [{ title: "Agricon NG — Filters" }] }),
  component: FiltersPage,
});

function FiltersPage() {
  const navigate = useNavigate();

  const [state, setState] = useState("");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [priceRange, setPriceRange] = useState("₦10k-₦50k");
  const [rating, setRating] = useState(4);
  const [attrs, setAttrs] = useState({
    verified: true,
    inSeason: true,
    wholesale: false,
    organic: false,
    sameDay: false,
  });

  function toggleAttr(key: keyof typeof attrs) {
    setAttrs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setState("");
    setNearbyOnly(false);
    setPriceRange("₦10k-₦50k");
    setRating(4);
    setAttrs({ verified: true, inSeason: true, wholesale: false, organic: false, sameDay: false });
  }

  function apply() {
    navigate({ to: "/search-results", search: { q: "" } as never });
  }

  return (
    <MobileShell
      standalone
      title="Filters"
      showBack
      backTo="/search-results"
      showBottomNav={false}
      headerRight={
        <button type="button" onClick={reset} className="text-sm font-semibold text-primary">
          Reset
        </button>
      }
    >
      <div className="space-y-6">
        {/* Location */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Location</h3>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-[15px] text-foreground outline-none focus:border-primary"
            >
              <option value="">All states</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>
                  {s} State
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={nearbyOnly}
              onChange={(e) => setNearbyOnly(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-border text-primary"
            />
            Only farms within 100 km
          </label>
        </div>

        {/* Price range */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Price range (per unit)</h3>
          <div className="grid grid-cols-2 gap-3">
            <TextInput placeholder="Min ₦0" />
            <TextInput placeholder="Max ₦100,000" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Under ₦10k", "₦10k-₦50k", "₦50k-₦100k", "₦100k+"].map((r) => (
              <Chip key={r} active={priceRange === r} onClick={() => setPriceRange(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>

        {/* Farm attributes */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Farm attributes</h3>
          <div className="space-y-2">
            {[
              { key: "verified" as const, label: "Verified farms only" },
              { key: "inSeason" as const, label: "In season now" },
              { key: "wholesale" as const, label: "Wholesale available" },
              { key: "organic" as const, label: "Organic certified" },
              { key: "sameDay" as const, label: "Same-day delivery" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4"
              >
                <span className="text-sm font-medium text-foreground">{f.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={attrs[f.key]}
                  onClick={() => toggleAttr(f.key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    attrs[f.key] ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      attrs[f.key] ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum rating */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Minimum rating</h3>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5].map((r) => (
              <Chip key={r} active={rating === r} onClick={() => setRating(r)}>
                ⭐ {r}+
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 pb-6">
        <PrimaryButton variant="outline" onClick={() => navigate({ to: "/search-results", search: { q: "" } as never })}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={apply}>Apply filters</PrimaryButton>
      </div>
    </MobileShell>
  );
}

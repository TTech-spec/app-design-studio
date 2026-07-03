import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MoreVertical, ThumbsUp } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { Chip } from "@/components/mobile/ui";
import { REVIEWS, FARMS } from "@/lib/agricon-data";

type SearchParams = { farmId?: string };

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Agricon NG — Reviews & Ratings" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    farmId: typeof s.farmId === "string" ? s.farmId : undefined,
  }),
  component: ReviewsPage,
});

const FILTER_TABS = ["All", "5 star", "4 star", "With photos", "Recent"];

// Extended review list for a richer page
const EXTENDED_REVIEWS = [
  ...REVIEWS,
  {
    id: "r4",
    author: "Musa Ibrahim",
    rating: 5,
    time: "3 weeks ago",
    text: "Excellent produce. The farm was exactly as described and the delivery logistics were well-coordinated.",
  },
  {
    id: "r5",
    author: "Chinedu Okafor",
    rating: 4,
    time: "1 month ago",
    text: "Good quality yam and cassava. I would love to see more variety in the listing but overall satisfied.",
  },
];

function StarBar({ rating, percent }: { rating: number; percent: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 font-semibold text-right">{rating}</span>
      <Star className="h-3 w-3 fill-gold text-gold shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full bg-gold transition-all" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-8 text-right text-muted-foreground">{percent}%</span>
    </div>
  );
}

function ReviewsPage() {
  const { farmId } = Route.useSearch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});

  const farm = FARMS.find((f) => f.id === farmId) ?? FARMS[0];

  const filtered = EXTENDED_REVIEWS.filter((r) => {
    if (filter === "5 star") return r.rating === 5;
    if (filter === "4 star") return r.rating === 4;
    if (filter === "With photos") return false; // no photo reviews in sample data
    return true;
  });

  function toggleHelpful(id: string) {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <MobileShell
      standalone
      title="Reviews & ratings"
      showBack
      backTo="/farm-profile"
      showBottomNav
    >
      <div className="space-y-5">
        {/* Rating summary */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-forest">{farm.rating.toFixed(1)}</p>
              <div className="mt-1 flex justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{farm.reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              <StarBar rating={5} percent={82} />
              <StarBar rating={4} percent={14} />
              <StarBar rating={3} percent={3} />
              <StarBar rating={2} percent={1} />
              <StarBar rating={1} percent={0} />
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Quality", value: "Excellent" },
            { label: "Communication", value: "Very good" },
            { label: "Delivery", value: "On time" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-xs font-bold text-forest">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {FILTER_TABS.map((c) => (
            <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
            </Chip>
          ))}
        </div>

        {/* Review count */}
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> reviews
        </p>

        {/* Review cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No reviews match this filter.</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold">
                    {r.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">{r.author}</p>
                      <button aria-label="More options">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-foreground leading-relaxed">{r.text}</p>
                    <button
                      type="button"
                      onClick={() => toggleHelpful(r.id)}
                      className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                        helpfulMap[r.id] ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {helpfulMap[r.id] ? "Helpful!" : "Mark as helpful"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileShell>
  );
}

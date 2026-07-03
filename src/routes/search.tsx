import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { Chip } from "@/components/mobile/ui";
import { CROP_CATEGORIES } from "@/lib/agricon-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Agricon NG — Search" }] }),
  component: SearchPage,
});

const TRENDING = ["Cocoa beans", "Palm oil", "Ofada rice", "Yam tubers", "Plantain", "Cassava", "Tomato"];
const INITIAL_RECENT = ["Cassava wholesale", "Rice Kano", "Tomato Kaduna", "Fresh eggs Ogun"];

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(INITIAL_RECENT);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Auto-focus search input when page loads
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  function doSearch(q: string) {
    if (!q.trim()) return;
    if (!recent.includes(q)) {
      setRecent((prev) => [q, ...prev].slice(0, 8));
    }
    navigate({ to: "/search-results", search: { q } as never });
  }

  function removeRecent(item: string) {
    setRecent((prev) => prev.filter((r) => r !== item));
  }

  return (
    <MobileShell standalone showBack backTo="/marketplace" showBottomNav={false} title="Search">
      <div className="space-y-5">
        {/* Search input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch(query);
          }}
          className="flex items-center gap-2"
        >
          <div className="flex flex-1 h-13 min-h-[52px] items-center gap-2 rounded-2xl border-2 border-primary bg-card px-4 focus-within:shadow-glow transition">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crops, farms, distributors..."
              className="flex-1 min-w-0 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {query && (
            <button
              type="submit"
              className="h-13 min-h-[52px] px-4 rounded-2xl gradient-primary text-primary-foreground text-sm font-semibold"
            >
              Go
            </button>
          )}
        </form>

        {/* Live suggestions */}
        {query.length > 0 && (
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {[...TRENDING.filter((t) => t.toLowerCase().includes(query.toLowerCase())),
              ...CROP_CATEGORIES.map((c) => c.name).filter((n) => n.toLowerCase().includes(query.toLowerCase()))]
              .slice(0, 6)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => doSearch(suggestion)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary"
                >
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground">{suggestion}</span>
                </button>
              ))}
            {/* Always show a direct search option */}
            <button
              type="button"
              onClick={() => doSearch(query)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary"
            >
              <Search className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary">Search for "{query}"</span>
            </button>
          </div>
        )}

        {/* Recent searches */}
        {query.length === 0 && recent.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Recent searches</h3>
              <button
                type="button"
                onClick={() => setRecent([])}
                className="text-xs font-semibold text-primary"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-1">
              {recent.map((r) => (
                <div key={r} className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <button
                    type="button"
                    onClick={() => doSearch(r)}
                    className="flex-1 text-left text-sm text-foreground"
                  >
                    {r}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecent(r)}
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        {query.length === 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Trending now</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <Chip key={t} onClick={() => doSearch(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Browse categories */}
        {query.length === 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Browse categories</h3>
              <Link to="/categories" className="text-xs font-semibold text-primary">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {CROP_CATEGORIES.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigate({ to: "/search-results", search: { category: c.id, label: c.name } as never })}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 hover:border-primary/40 transition"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
                    {c.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

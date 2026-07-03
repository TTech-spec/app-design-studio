import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { TextInput } from "@/components/mobile/ui";
import { CROP_CATEGORIES } from "@/lib/agricon-data";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Agricon NG — Categories" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = CROP_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MobileShell
      standalone
      title="All categories"
      showBack
      backTo="/marketplace"
      showBottomNav
    >
      <div className="space-y-4">
        <TextInput
          placeholder="Search categories..."
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={setQuery}
        />

        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => navigate({ to: "/search-results", search: { category: c.id, label: c.name } as never })}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/40 transition"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {c.count.toLocaleString()} listings
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No categories match "{query}"</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

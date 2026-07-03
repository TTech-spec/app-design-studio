import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Grid, LayoutGrid } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { FarmImage } from "@/components/mobile/ui";

type SearchParams = { farmId?: string };

export const Route = createFileRoute("/photo-gallery")({
  head: () => ({ meta: [{ title: "Agricon NG — Photo Gallery" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    farmId: typeof s.farmId === "string" ? s.farmId : undefined,
  }),
  component: PhotoGalleryPage,
});

const TOTAL = 24;

function PhotoGalleryPage() {
  const { farmId } = Route.useSearch();
  const navigate = useNavigate();
  const [columns, setColumns] = useState<2 | 3>(3);
  const [selected, setSelected] = useState<number | null>(null);

  const seed = farmId ?? "gallery";

  return (
    <MobileShell
      standalone
      title={`Photos (${TOTAL})`}
      showBack
      backTo="/farm-profile"
      showBottomNav={false}
      headerRight={
        <button
          type="button"
          onClick={() => setColumns((c) => (c === 3 ? 2 : 3))}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
          aria-label="Toggle grid size"
        >
          {columns === 3 ? <LayoutGrid className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
        </button>
      }
    >
      {/* Lightbox overlay */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-sm px-4" onClick={(e) => e.stopPropagation()}>
            <FarmImage seed={`${seed}-${selected}`} className="aspect-square w-full rounded-2xl" />
            <div className="mt-4 flex justify-between text-white text-sm font-semibold">
              <button
                type="button"
                onClick={() => setSelected((s) => (s! > 0 ? s! - 1 : s))}
                className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-30"
                disabled={selected === 0}
              >
                ← Prev
              </button>
              <span className="py-2 text-xs opacity-70">
                {selected + 1} / {TOTAL}
              </span>
              <button
                type="button"
                onClick={() => setSelected((s) => (s! < TOTAL - 1 ? s! + 1 : s))}
                className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-30"
                disabled={selected === TOTAL - 1}
              >
                Next →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 text-white text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={`grid gap-1.5 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Photo ${i + 1}`}
          >
            <FarmImage
              seed={`${seed}-${i}`}
              className={columns === 3 ? "aspect-square" : "aspect-[4/3]"}
            />
          </button>
        ))}
      </div>
    </MobileShell>
  );
}

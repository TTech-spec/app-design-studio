import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, Sprout, ZoomIn, ZoomOut } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, FarmImage, VerificationBadge } from "@/components/mobile/ui";
import { FARMS } from "@/lib/agricon-data";

type SearchParams = { id?: string };

export const Route = createFileRoute("/farm-map")({
  head: () => ({ meta: [{ title: "Agricon NG — Farm Location" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: FarmMapPage,
});

function FarmMapPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);

  const farm = FARMS.find((f) => f.id === id) ?? FARMS[0];

  function handleGetDirections() {
    // Open Google Maps with farm location
    const query = encodeURIComponent(`${farm.name}, ${farm.location}, Nigeria`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  }

  return (
    <MobileShell
      standalone
      title="Farm location"
      showBack
      backTo="/farm-profile"
      fullBleed
      showBottomNav
    >
      <div className="relative h-full min-h-[calc(100vh-120px)]">
        {/* Map background — illustrative SVG terrain */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, #a8c99a 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, #c9d99a 0%, transparent 40%),
              radial-gradient(circle at 55% 25%, #b8d4a0 0%, transparent 30%),
              linear-gradient(135deg, #e8f0d8 0%, #d0e0b8 100%)`,
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Roads */}
            <path
              d="M0,200 Q100,180 200,220 T400,240"
              stroke="#8bb26a"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M0,400 Q120,380 240,420 T400,440"
              stroke="#8bb26a"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
            {/* Rivers */}
            <path
              d="M50,0 Q80,200 60,400 T80,800"
              stroke="#7ab8d4"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M280,0 Q320,300 300,600 T310,800"
              stroke="#7ab8d4"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            {/* Field patches */}
            <rect x="120" y="280" width="80" height="60" rx="8" fill="#a8c99a" opacity="0.4" />
            <rect x="220" y="320" width="60" height="45" rx="8" fill="#c9d99a" opacity="0.4" />
            <rect x="150" y="380" width="70" height="50" rx="8" fill="#b8d4a0" opacity="0.4" />
          </svg>

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card text-lg font-bold"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.5))}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card text-lg font-bold"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card"
              aria-label="My location"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>

          {/* Zoom level indicator */}
          <div className="absolute left-4 top-4 rounded-xl bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur">
            Zoom {Math.round(zoom * 10)}×
          </div>

          {/* Farm pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-primary/15 animate-ping" />
              <div className="absolute -inset-4 rounded-full bg-primary/10" />
              <div className="relative grid h-14 w-14 place-items-center rounded-full gradient-primary shadow-glow ring-4 ring-white">
                <Sprout className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Nearby marker */}
          <div className="absolute left-[35%] top-[40%]">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold shadow-card ring-2 ring-white">
              <MapPin className="h-4 w-4 text-gold-foreground" />
            </div>
          </div>
          <div className="absolute left-[65%] top-[55%]">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold shadow-card ring-2 ring-white">
              <MapPin className="h-4 w-4 text-gold-foreground" />
            </div>
          </div>
        </div>

        {/* Farm info card at bottom */}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-card shadow-pop p-4">
          <div className="flex items-start gap-3">
            <FarmImage seed={farm.img} className="h-16 w-16 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-foreground truncate">{farm.name}</p>
                {farm.verified && <VerificationBadge />}
              </div>
              <p className="text-xs text-muted-foreground">{farm.location}</p>
              <p className="mt-1 text-xs text-primary font-semibold flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {farm.size} · 3.2 km from town
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <PrimaryButton
              variant="outline"
              size="md"
              onClick={() => navigate({ to: "/farm-profile", search: { id: farm.id } as never })}
            >
              View farm
            </PrimaryButton>
            <PrimaryButton size="md" onClick={handleGetDirections}>
              Get directions
            </PrimaryButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, CheckCircle2, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { FarmCard, PrimaryButton, Rating, VerificationBadge } from "@/components/mobile/ui";
import { FARMS } from "@/lib/agricon-data";

type SearchParams = { farmerId?: string };

export const Route = createFileRoute("/farmer-profile")({
  head: () => ({ meta: [{ title: "Agricon NG — Farmer Profile" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    farmerId: typeof s.farmerId === "string" ? s.farmerId : undefined,
  }),
  component: FarmerProfilePage,
});

function FarmerProfilePage() {
  const { farmerId } = Route.useSearch();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);

  // Find farmer from farm data (owner field)
  const farm = FARMS.find((f) => f.id === farmerId) ?? FARMS[0];
  const ownerName = farm.owner;
  const initials = ownerName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const farmerFarms = FARMS.filter((f) => f.owner === farm.owner);

  return (
    <MobileShell
      standalone
      title="Farmer profile"
      showBack
      backTo="/marketplace"
      showBottomNav
    >
      {/* Avatar + name */}
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="grid h-28 w-28 place-items-center rounded-full gradient-primary text-white text-4xl font-black shadow-glow">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card">
            <CheckCircle2 className="h-6 w-6 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-black text-forest">{ownerName}</h1>
        <p className="text-sm text-muted-foreground">Owner · {farm.name}</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <Rating value={farm.rating} reviews={farm.reviews} />
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Member since 2022</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <VerificationBadge size="md" />
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-foreground">
            <Star className="h-3 w-3 fill-current" /> Top rated
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-4">
        {[
          { label: "Total sales", value: "₦42.8M" },
          { label: "Response rate", value: "98%" },
          { label: "Followers", value: "1.2k" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-lg font-black text-forest">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <PrimaryButton
          variant="outline"
          onClick={() =>
            navigate({ to: "/chat", search: { farmId: farm.id, farmName: farm.name } as never })
          }
        >
          <MessageCircle className="h-4 w-4" /> Message
        </PrimaryButton>
        <PrimaryButton
          variant={following ? "secondary" : "primary"}
          onClick={() => setFollowing((f) => !f)}
        >
          {following ? (
            <>
              <UserCheck className="h-4 w-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Follow
            </>
          )}
        </PrimaryButton>
      </div>

      {/* View farm button */}
      <div className="mt-3">
        <PrimaryButton
          variant="ghost"
          onClick={() => navigate({ to: "/farm-profile", search: { id: farm.id } as never })}
        >
          View farm profile →
        </PrimaryButton>
      </div>

      {/* Farms managed */}
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Farms managed</h3>
          <span className="text-xs text-muted-foreground">{farmerFarms.length} farm{farmerFarms.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="space-y-3">
          {farmerFarms.map((f) => (
            <div
              key={f.id}
              onClick={() => navigate({ to: "/farm-profile", search: { id: f.id } as never })}
            >
              <FarmCard farm={f} />
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground mb-2">About</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Experienced farmer with over 10 years in agricultural production in {farm.location}. 
          Specialises in {farm.crops.join(", ")} with a focus on quality and sustainable farming practices.
        </p>
      </div>
    </MobileShell>
  );
}

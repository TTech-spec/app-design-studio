import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  MapPin, Share2, Heart, MessageCircle, Star, CheckCircle2,
  ArrowRight, Phone,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import {
  FarmCard, CropCard, PrimaryButton, Rating, VerificationBadge, FarmImage,
} from "@/components/mobile/ui";
import { supabase } from "@/lib/supabase";

type SearchParams = { id?: string };

export const Route = createFileRoute("/farm-profile")({
  head: () => ({ meta: [{ title: "Agricon NG — Farm Profile" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: FarmProfilePage,
});

const TABS = ["Overview", "Crops", "Reviews", "Map"] as const;
type Tab = (typeof TABS)[number];

function FarmProfilePage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>("Overview");
  const [farm, setFarm] = useState<any>(null);
  const [farmProducts, setFarmProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmData() {
      if (!id) return;
      try {
        // Fetch farm profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch farm products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", id);
        
        if (productsError) throw productsError;
        
        setFarm(profileData);
        setFarmProducts(productsData || []);
      } catch (error) {
        console.error("Error loading farm data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFarmData();
  }, [id]);

  if (loading) {
    return (
      <MobileShell
        standalone
        showBack
        backTo="/marketplace"
        title="Farm Profile"
        showBottomNav
      >
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading farm profile...</p>
        </div>
      </MobileShell>
    );
  }

  if (!farm) {
    return (
      <MobileShell
        standalone
        showBack
        backTo="/marketplace"
        title="Farm Profile"
        showBottomNav
      >
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Farm not found.</p>
        </div>
      </MobileShell>
    );
  }

  const farmName = farm.farm_name || `${farm.first_name} ${farm.last_name}`;
  const farmLocation = farm.farm_state || "Nigeria";
  const farmCrops = farm.primary_crops || [];

  return (
    <MobileShell
      standalone
      showBack
      backTo="/marketplace"
      fullBleed
      showBottomNav
      title=""
      headerVariant="transparent"
      headerRight={
        <div className="flex gap-1">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"
            onClick={() => navigator.share?.({ title: farmName, url: window.location.href })}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"
            aria-label={saved ? "Unsave farm" : "Save farm"}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>
      }
    >
      {/* Hero image */}
      <div className="relative -mt-16">
        {farm.avatar_url ? (
          <img src={farm.avatar_url} alt={farmName} className="h-56 w-full object-cover" />
        ) : (
          <FarmImage seed={farm.id} className="h-56 w-full" />
        )}
      </div>

      {/* Content card */}
      <div className="relative -mt-6 rounded-t-[28px] bg-surface px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-forest">{farmName}</h1>
              {farm.verification_status === "verified" && <VerificationBadge />}
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {farmLocation}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm flex-wrap">
              <Rating value={4.5} reviews={12} />
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Verified Farmer</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-3">
          {[
            { label: "Response", value: "< 2 hrs" },
            { label: "Fulfilment", value: "98%" },
            { label: "Products", value: farmProducts.length.toString() },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-sm font-bold text-forest">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-4 border-b border-border overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold shrink-0 transition ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-5">
          {tab === "Overview" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-foreground">About</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {farm.about_me || "A verified farmer specializing in quality agricultural products."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">
                    Available crops ({farmProducts.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTab("Crops")}
                    className="text-xs font-semibold text-primary"
                  >
                    See all
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {farmProducts.slice(0, 2).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate({ to: "/crop-details", search: { id: product.id } as never })}
                    >
                      <CropCard crop={{
                        id: product.id,
                        name: product.name,
                        price: `₦${product.price?.toLocaleString()}`,
                        unit: product.unit || "per unit",
                        location: farmLocation,
                        image: product.image_url,
                        farmer: farmName,
                        rating: 4.5,
                        verified: true,
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">Photo gallery</h3>
                  <Link to="/photo-gallery" search={{ farmId: farm.id } as never} className="text-xs font-semibold text-primary">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <Link to="/photo-gallery" search={{ farmId: farm.id } as never} key={i}>
                      <FarmImage seed={farm.id + i} className="aspect-square rounded-2xl" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Crops" && (
            <div className="grid grid-cols-2 gap-3">
              {farmProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate({ to: "/crop-details", search: { id: product.id } as never })}
                >
                  <CropCard crop={{
                    id: product.id,
                    name: product.name,
                    price: `₦${product.price?.toLocaleString()}`,
                    unit: product.unit || "per unit",
                    location: farmLocation,
                    image: product.image_url,
                    farmer: farmName,
                    rating: 4.5,
                    verified: true,
                  }} />
                </div>
              ))}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-black text-forest">4.5</p>
                    <div className="mt-1 flex justify-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">12 reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[{ s: 5, p: 82 }, { s: 4, p: 14 }, { s: 3, p: 3 }, { s: 2, p: 1 }, { s: 1, p: 0 }].map((r) => (
                      <div key={r.s} className="flex items-center gap-2 text-xs">
                        <span className="w-3 font-semibold">{r.s}</span>
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-gold" style={{ width: `${r.p}%` }} />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{r.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                Reviews coming soon
              </div>
            </div>
          )}

          {tab === "Map" && (
            <div
              className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center"
              onClick={() => navigate({ to: "/farm-map", search: { id: farm.id } as never })}
            >
              <div>
                <MapPin className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-2 font-semibold text-foreground">View farm on map</p>
                <p className="mt-1 text-xs text-muted-foreground">{farmLocation}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex gap-3">
          <PrimaryButton
            variant="outline"
            onClick={() => navigate({ to: "/chat", search: { farmId: farm.id, farmName } as never })}
            fullWidth={false}
          >
            <MessageCircle className="h-4 w-4" /> Message
          </PrimaryButton>
          <div className="flex-1">
            <PrimaryButton
              onClick={() => navigate({ to: "/contact-farmer", search: { farmId: farm.id } as never })}
            >
              Request quote
            </PrimaryButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { FarmCard, Chip } from "@/components/mobile/ui";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/featured-farms")({
  head: () => ({ meta: [{ title: "Agricon NG — Featured Farms" }] }),
  component: FeaturedFarmsPage,
});

function FeaturedFarmsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<any[]>([]);

  const filterOptions = ["All", "Grains", "Tubers", "Vegetables", "Fruits", "Cash crops"];

  // Fetch verified farmers from Supabase
  useEffect(() => {
    async function fetchFarmers() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("verification_status", "verified")
          .eq("user_type", "farmer");
        
        if (error) throw error;
        setFarmers(data || []);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFarmers();
  }, []);

  const filtered = farmers.filter((f) => {
    if (activeFilter === "All") return true;
    const crops = f.primary_crops || [];
    return crops.some((c: string) =>
      c.toLowerCase().includes(activeFilter.toLowerCase()) ||
      activeFilter.toLowerCase().includes(c.toLowerCase())
    );
  });

  // Desktop view
  if (!isMobile) {
    return (
      <DesktopShell title="Featured Farms" activeNav="marketplace">
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-8">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#44483d] hover:text-[#154212] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>

          {/* Banner */}
          <div className="bg-[#154212] rounded-[32px] p-8 text-white mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-white/90" />
              <p className="text-lg font-bold">Handpicked verified farms</p>
            </div>
            <p className="mt-2 text-sm text-white/80">
              Every farm below is fully verified — real land, real crops, real trust.
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f
                    ? "bg-[#154212] text-white"
                    : "bg-[#f3f4ed] text-[#191c18] border-2 border-[#c2c9bb] hover:border-[#154212]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-sm text-[#44483d] mb-6">
            <span className="font-bold text-[#191c18]">{filtered.length}</span> featured farms
          </p>

          {/* Farm list */}
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#44483d]">Loading farms...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate({ to: "/farm-profile", search: { id: f.id } as never })}
                  className="bg-white border-2 border-[#c2c9bb] rounded-[28px] p-6 hover:border-[#154212] hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {f.first_name?.[0] || f.email?.[0] || "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#191c18]">{f.farm_name || `${f.first_name} ${f.last_name}`}</h3>
                      <p className="text-sm text-[#44483d]">{f.farm_state}, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(f.primary_crops || []).slice(0, 3).map((crop: string) => (
                      <span key={crop} className="px-3 py-1 bg-[#f3f4ed] text-[#191c18] rounded-full text-xs font-medium">
                        {crop}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#44483d]">
                    <ShieldCheck className="h-4 w-4 text-[#154212]" />
                    <span>Verified Farmer</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[#44483d]">No farms found for this filter.</p>
            </div>
          )}
        </div>
      </DesktopShell>
    );
  }

  // Mobile view
  return (
    <MobileShell
      standalone
      title="Featured farms"
      showBack
      backTo="/marketplace"
      showBottomNav
    >
      <div className="space-y-4">
        {/* Banner */}
        <div className="rounded-2xl gradient-primary p-4 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-white/90" />
            <p className="text-sm font-bold">Handpicked verified farms</p>
          </div>
          <p className="mt-1 text-xs text-white/80">
            Every farm below is fully verified — real land, real crops, real trust.
          </p>
        </div>

        {/* Filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
          {filterOptions.map((f) => (
            <Chip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{filtered.length}</span> featured farms
        </p>

        {/* Farm list */}
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Loading farms...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((f) => (
              <div
                key={f.id}
                onClick={() => navigate({ to: "/farm-profile", search: { id: f.id } as never })}
              >
                <FarmCard farm={{
                  id: f.id,
                  name: f.farm_name || `${f.first_name} ${f.last_name}`,
                  location: f.farm_state,
                  crops: f.primary_crops || [],
                  rating: 4.8,
                  reviews: 45,
                  verified: true,
                  image: f.avatar_url,
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No farms found for this filter.</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

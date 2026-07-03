import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Sliders, ShoppingCart, Filter, MapPin, Star } from "lucide-react";
import { MobileShell, NotificationBell } from "@/components/mobile/MobileShell";
import { FarmCard, CropCard, SectionHeader, Chip } from "@/components/mobile/ui";
import { DesktopShell } from "@/components/desktop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Agricon NG — Marketplace" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const navigate = useNavigate();
  const { getProducts } = useAuth();
  const [activeChip, setActiveChip] = useState("All");
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chips = ["All", "Verified", "In season", "Nearby", "Wholesale", "Top rated"];

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [getProducts]);

  // Mobile view
  if (isMobile) {
    return (
      <MobileShell
        standalone
        title="Marketplace"
        showBack={false}
        showBottomNav
        headerRight={<NotificationBell count={3} />}
      >
        <div className="space-y-5">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/search" })}
              className="flex flex-1 h-12 items-center gap-2 rounded-2xl border-2 border-border bg-card px-4"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-left text-sm text-muted-foreground">
                Search farms, crops...
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/filters" })}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"
              aria-label="Open filters"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>

          {/* Filter chips */}
          <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
            {chips.map((c) => (
              <Chip key={c} active={activeChip === c} onClick={() => setActiveChip(c)}>
                {c}
              </Chip>
            ))}
          </div>

          {/* Fresh listings */}
          <div>
            <SectionHeader
              title="Fresh listings"
              action="See all"
              actionHref="search-results"
            />
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No products available yet.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate({ to: "/crop-details", search: { id: product.id } as never })}
                  >
                    <CropCard crop={{
                      id: product.id,
                      name: product.name,
                      price: `₦${product.price?.toLocaleString()}`,
                      unit: product.unit || "per unit",
                      location: product.location || "Nigeria",
                      image: product.image_url,
                      farmer: product.seller_name || "Farmer",
                      rating: 4.5,
                      verified: true,
                    }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured farms */}
          <div>
            <SectionHeader title="Featured verified farms" action="See all" actionHref="featured-farms" />
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading farms...</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Featured farms coming soon.</div>
              )}
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  // Desktop view
  return (
    <DesktopShell title="Marketplace" activeNav="marketplace">
      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#44483d]" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#c2c9bb] rounded-full text-sm focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all"
              placeholder="Search farms, crops, products..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#154212] text-white rounded-full hover:bg-[#1a5a17] transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-3">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setActiveChip(c)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeChip === c
                  ? "bg-[#154212] text-white"
                  : "bg-white border border-[#c2c9bb] text-[#44483d] hover:bg-[#e7e9e1]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Browse by category */}
        <div>
          <h2 className="text-xl font-bold text-[#154212] mb-4">Browse by category</h2>
          <div className="text-sm text-[#44483d]">Categories coming soon</div>
        </div>

        {/* Fresh listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#154212]">Fresh listings</h2>
            <button
              onClick={() => navigate({ to: "/search-results" })}
              className="text-sm font-semibold text-[#154212] hover:underline"
            >
              See all
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-[#44483d]">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-[#44483d]">No products available yet.</div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate({ to: "/crop-details", search: { id: product.id } as never })}
                  className="bg-white border border-[#c2c9bb] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#154212] transition-all cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-6xl">🌾</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#191c18] mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-[#44483d] mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location || "Nigeria"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#154212]">₦{product.price?.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-[#44483d]">{product.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured farms */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#154212]">Featured verified farms</h2>
            <button
              onClick={() => navigate({ to: "/featured-farms" })}
              className="text-sm font-semibold text-[#154212] hover:underline"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {FARMS.slice(0, 3).map((f) => (
              <div
                key={f.id}
                onClick={() => navigate({ to: "/farm-profile", search: { id: f.id } as never })}
                className="bg-white border border-[#c2c9bb] rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#154212] transition-all cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-5xl text-[#154212]"><Wheat className="h-12 w-12" /></span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#191c18] mb-1">{f.name}</h3>
                  <p className="text-sm text-[#44483d] mb-2">{f.owner}</p>
                  <div className="flex items-center gap-2 text-sm text-[#44483d]">
                    <MapPin className="w-4 h-4" />
                    <span>{f.state}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-[#44483d]">{f.rating}</span>
                    <span className="text-xs text-[#44483d]">({f.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}

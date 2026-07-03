import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Home,
  LogOut,
  MapPin,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Sprout,
  TrendingUp,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { EmptyState } from "@/components/mobile/ui";
import { useAuth } from "@/lib/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Agricon NG — Home" }] }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { signOut, getProducts } = useAuth();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/signin" });
  }

  // Mobile view
  if (isMobile) {
    return (
      <MobileShell
        standalone
        showBack={false}
        showBottomNav={false}
        title="Agricon"
        headerRight={
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
          >
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </button>
        }
      >
        <EmptyState
          icon={<Sprout className="h-8 w-8" />}
          title="Marketplace coming soon"
          body="You're verified and ready to go — the marketplace, listings, and messaging are launching in the next phase of Agricon."
        />
      </MobileShell>
    );
  }

  // Desktop view
  return (
    <DesktopShell title="Dashboard" activeNav="home">
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <section className="hero-gradient rounded-[32px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#154212]/95 via-[#154212]/65 to-transparent" />
          <div className="relative z-10 p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Agro-Farm Connect</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              Empowering the Future of African Agriculture.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80">
              Connect directly with verified local farmers. Get real-time market prices and logistics tracking at your fingertips.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button 
                onClick={() => navigate({ to: "/marketplace" })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#154212] shadow-lg transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#154212]">Quick Actions</h2>
              <p className="text-sm text-[#44483d]">Fast access to the tools you use most.</p>
            </div>
            <Zap className="h-6 w-6 text-[#154212]" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => navigate({ to: "/marketplace" })}
              className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#f3f4ed] border border-[#c2c9bb] px-4 py-5 text-sm font-semibold text-[#191c18] transition hover:border-[#154212] hover:bg-[#d6e4c8]"
            >
              <MapPin className="h-6 w-6 text-[#154212]" />
              Find Farms
            </button>
            <button 
              onClick={() => navigate({ to: "/add-product" })}
              className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#f3f4ed] border border-[#c2c9bb] px-4 py-5 text-sm font-semibold text-[#191c18] transition hover:border-[#154212] hover:bg-[#d6e4c8]"
            >
              <ShoppingCart className="h-6 w-6 text-[#154212]" />
              List Crop
            </button>
            <button className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#f3f4ed] border border-[#c2c9bb] px-4 py-5 text-sm font-semibold text-[#191c18] transition hover:border-[#154212] hover:bg-[#d6e4c8]">
              <Star className="h-6 w-6 text-[#154212]" />
              Saved
            </button>
            <button 
              onClick={() => navigate({ to: "/messages" })}
              className="relative flex flex-col items-center justify-center gap-3 rounded-3xl bg-[#f3f4ed] border border-[#c2c9bb] px-4 py-5 text-sm font-semibold text-[#191c18] transition hover:border-[#154212] hover:bg-[#d6e4c8]"
            >
              <Bell className="h-6 w-6 text-[#154212]" />
              Chats
              <span className="absolute -top-2 right-3 grid h-3.5 w-3.5 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">•</span>
            </button>
          </div>
        </section>

        {/* In Season Crops */}
        <section className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#154212]">In Season Crops</h2>
            <button 
              onClick={() => navigate({ to: "/marketplace" })}
              className="text-sm font-semibold text-[#154212] hover:underline"
            >
              View all market
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-[#44483d]">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-[#44483d]">No products available yet.</div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group overflow-hidden rounded-[28px] border border-[#c2c9bb] bg-[#f3f4ed] shadow-sm transition hover:shadow-lg hover:border-[#154212] cursor-pointer">
                  <div className="h-44 bg-gradient-to-br from-[#154212]/10 via-[#f3f4ed] to-transparent p-4">
                    <div className="inline-flex rounded-full bg-[#154212] text-white px-3 py-1 text-[11px] font-bold tracking-[0.08em]">
                      {product.category || "IN STOCK"}
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-semibold text-[#191c18]">{product.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#44483d]">
                        <MapPin className="h-3.5 w-3.5" />
                        {product.location || "Nigeria"}
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[#154212] font-bold">₦{product.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-[#44483d]">{product.unit || "per unit"}</p>
                      </div>
                      <button className="rounded-2xl bg-[#f3f4ed] border border-[#c2c9bb] px-3 py-2 text-sm text-[#191c18] transition hover:border-[#154212] hover:bg-[#d6e4c8]">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#44483d]">
                      <CheckCircle2 className="h-4 w-4 text-[#154212]" />
                      <span>Available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Market Insights */}
        <section className="bg-white border border-[#c2c9bb] rounded-[32px] p-8 min-h-[300px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold text-[#154212]">Market Insights</h3>
              <p className="text-sm text-[#44483d]">Weekly performance and pricing trends.</p>
            </div>
            <select className="rounded-2xl border border-[#c2c9bb] bg-[#f3f4ed] px-4 py-2 text-sm text-[#191c18] outline-none focus:border-[#154212]">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="relative flex h-48 items-end gap-4">
            {[40, 65, 50, 90, 60, 74, 55].map((height, index) => (
              <div key={index} className={"relative flex-1 rounded-t-3xl " + (index === 3 ? "bg-[#154212]" : "bg-[#f3f4ed]") + " transition-colors duration-300 hover:bg-[#154212]/30"} style={{ height: `${height}%` }}>
                {index === 3 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-[#191c18] px-2 py-1 text-[10px] font-semibold text-white">
                    ₦28k
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 text-[10px] font-medium text-[#44483d]">
            {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day) => <span key={day} className="text-center">{day}</span>)}
          </div>
        </section>

        {/* Top Suppliers */}
        <section className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-[#154212]">Top Suppliers</h3>
            <button className="text-sm font-semibold text-[#154212] hover:underline">See More</button>
          </div>
          <div className="space-y-6">
            {[
              { name: 'Green Horizon Farms', stats: '452 Sales • 4.9 Rating', color: 'bg-[#154212]/10', featured: true },
              { name: 'AgroCore Limited', stats: '328 Sales • 4.7 Rating', color: 'bg-[#154212]/10' },
              { name: 'Bolu\'s Organic', stats: '195 Sales • 4.8 Rating', color: 'bg-[#154212]/10' },
            ].map((supplier) => (
              <div key={supplier.name} className="flex items-center gap-4 rounded-3xl border border-[#c2c9bb] bg-[#f3f4ed] p-4 transition hover:shadow-lg cursor-pointer">
                <div className={"flex h-12 w-12 items-center justify-center rounded-2xl " + supplier.color}>
                  <Users className="h-5 w-5 text-[#154212]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#191c18]">{supplier.name}</p>
                  <p className="text-xs text-[#44483d]">{supplier.stats}</p>
                </div>
                <span className="text-[#154212] text-sm">★</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DesktopShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Filter, MapPin, Sprout } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/lib/supabase";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Agricon NG — Marketplace" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const navigate = useNavigate();
  const { getProducts, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.crop_type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.crop_type === filter;
    return matchesSearch && matchesFilter;
  });

  const uniqueCrops = Array.from(new Set(products.map(p => p.crop_type)));

  return (
    <MobileShell
      standalone
      showBack={false}
      showBottomNav={true}
      title="Marketplace"
      headerRight={
        <button
          type="button"
          onClick={() => navigate({ to: "/add-product" })}
          aria-label="Add product"
          className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-white shadow-glow"
        >
          <Sprout className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-4">
        <TextInput 
          placeholder="Search crops, products..." 
          icon={<Search className="h-4 w-4" />} 
          value={search}
          onChange={setSearch}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            }`}
          >
            All
          </button>
          {uniqueCrops.slice(0, 8).map(crop => (
            <button
              key={crop}
              onClick={() => setFilter(crop)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                filter === crop ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sprout className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => navigate({ to: `/product/${product.id}` })}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft cursor-pointer hover:shadow-card transition"
              >
                {product.images.length > 0 && (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="h-32 w-full rounded-xl object-cover mb-3"
                  />
                )}
                <h3 className="font-bold text-forest">{product.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location_state}, {product.location_lga}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-forest">₦{product.price_per_unit.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/{product.unit}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.quantity} {product.unit} available
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Share2, Heart, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, ShoppingCart, Shield, Star } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, Rating, VerificationBadge, FarmImage } from "@/components/mobile/ui";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

type SearchParams = { id?: string };

export const Route = createFileRoute("/crop-details")({
  head: () => ({ meta: [{ title: "Agricon NG — Crop Details" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: CropDetailsPage,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CropDetailsPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [saved, setSaved] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const totalPhotos = 4;

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        
        if (productError) throw productError;
        
        // Fetch seller profile
        if (productData?.seller_id) {
          const { data: sellerData, error: sellerError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", productData.seller_id)
            .single();
          
          if (sellerError) throw sellerError;
          setSeller(sellerData);
        }
        
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Product not found.</p>
      </div>
    );
  }

  const crop = {
    id: product.id,
    name: product.name,
    price: `₦${product.price?.toLocaleString()}`,
    unit: product.unit || "per unit",
    season: "In Season",
    verified: seller?.verification_status === "verified",
    rating: 4.5,
    stock: `${product.quantity || "Available"}`,
    farm: seller?.farm_name || `${seller?.first_name} ${seller?.last_name}`,
    location: seller?.farm_state || "Nigeria",
  };

  if (isMobile) {
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
              onClick={() => navigator.share?.({ title: crop.name, url: window.location.href })}
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"
              aria-label={saved ? "Unsave" : "Save"}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>
        }
      >
        {/* Photo carousel */}
        <div className="relative -mt-16">
          <FarmImage seed={crop.id + crop.name + photoIdx} className="aspect-square w-full" />
          {/* Photo nav overlay */}
          <button
            type="button"
            onClick={() => setPhotoIdx((p) => Math.max(0, p - 1))}
            disabled={photoIdx === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 shadow disabled:opacity-30"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPhotoIdx((p) => Math.min(totalPhotos - 1, p + 1))}
            disabled={photoIdx === totalPhotos - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 shadow disabled:opacity-30"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex gap-1.5">
              {Array.from({ length: totalPhotos }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoIdx(i)}
                  className={`h-1.5 rounded-full transition ${i === photoIdx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
            <Link
              to="/photo-gallery"
              search={{ farmId: crop.id } as never}
              className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold"
            >
              {photoIdx + 1} / {totalPhotos} photos
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="relative -mt-6 rounded-t-[28px] bg-surface px-4 pt-6 pb-8">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-foreground">
              {crop.season}
            </span>
            {crop.verified && <VerificationBadge />}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
              <Rating value={crop.rating} compact />
            </span>
          </div>

          {/* Title & farm */}
          <h1 className="mt-3 text-2xl font-black text-forest">{crop.name}</h1>
          <button
            type="button"
            onClick={() => navigate({ to: "/farm-profile" })}
            className="mt-1 flex items-center gap-2 text-sm text-primary font-semibold"
          >
            {crop.farm} <ArrowRight className="h-3 w-3" />
          </button>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-forest">{crop.price}</span>
            <span className="text-sm text-muted-foreground">{crop.unit}</span>
          </div>
          <p className="mt-1 text-sm text-primary font-semibold">✓ {crop.stock} available</p>

          {/* Quick specs */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "Harvest", value: "Nov 2025" },
              { label: "Min. order", value: "1 tonne" },
              { label: "Delivery", value: "3–5 days" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-3 text-center">
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-sm font-bold text-forest">{s.value}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="mt-5">
            <h3 className="text-sm font-bold text-foreground">About this listing</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Premium grade {crop.name.toLowerCase()}, freshly harvested. Ideal for direct consumption
              and industrial processing. Bulk discounts available for orders above 10 tonnes.
            </p>
          </div>

          {/* Specifications */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Specifications</h3>
            <div className="space-y-2 text-sm">
              {[
                ["Variety", "Improved variety"],
                ["Grade", "Premium A"],
                ["Packaging", "Jute sacks, 100 kg"],
                ["Origin", "Nigeria"],
                ["Moisture", "62–65%"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Harvest timeline */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Harvest timeline</h3>
              <Link to="/harvest-timeline" className="text-xs font-semibold text-primary">
                View full
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-12 gap-1">
                {MONTHS.map((m, i) => (
                  <div key={m} className="text-center">
                    <div
                      className={`h-10 rounded ${[10, 11, 0, 1].includes(i) ? "gradient-primary" : "bg-secondary"}`}
                    />
                    <p className="mt-1 text-[9px] text-muted-foreground">{m[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-3">
            <PrimaryButton
              variant="outline"
              fullWidth={false}
              onClick={() =>
                navigate({ to: "/chat", search: { farmId: "f1", farmName: crop.farm } as never })
              }
            >
              <MessageCircle className="h-4 w-4" />
            </PrimaryButton>
            <div className="flex-1">
              <PrimaryButton
                onClick={() => navigate({ to: "/contact-farmer", search: { cropId: crop.id } as never })}
              >
                Request quote
              </PrimaryButton>
            </div>
          </div>
        </div>
      </MobileShell>
    );
  }

  return <DesktopCropDetails crop={crop} quantity={quantity} setQuantity={setQuantity} saved={saved} setSaved={setSaved} photoIdx={photoIdx} setPhotoIdx={setPhotoIdx} />;
}

interface DesktopCropDetailsProps {
  crop: typeof CROPS[0];
  quantity: number;
  setQuantity: (q: number) => void;
  saved: boolean;
  setSaved: (s: boolean) => void;
  photoIdx: number;
  setPhotoIdx: (idx: number) => void;
}

function DesktopCropDetails({
  crop,
  quantity,
  setQuantity,
  saved,
  setSaved,
  photoIdx,
  setPhotoIdx,
}: DesktopCropDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold text-primary">Agro-Farm Connect</div>
          <div className="hidden md:flex items-center space-x-6">
            <a className="font-semibold text-primary border-b-2 border-primary pb-1 hover:text-primary transition-colors" href="#">
              Find a Farm
            </a>
            <a className="font-semibold text-gray-700 hover:text-primary transition-colors" href="#">
              Shop Produce
            </a>
            <a className="font-semibold text-gray-700 hover:text-primary transition-colors" href="#">
              Community
            </a>
            <a className="font-semibold text-gray-700 hover:text-primary transition-colors" href="#">
              About Us
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Search farms..." type="text" />
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all duration-150">
              Join Now
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center space-x-2 text-gray-600 text-sm">
          <a className="hover:text-primary" href="#">
            Market
          </a>
          <span>›</span>
          <a className="hover:text-primary" href="#">
            Tubers
          </a>
          <span>›</span>
          <span className="text-primary font-bold">{crop.name}</span>
        </nav>

        <div className="grid grid-cols-12 gap-10">
          {/* Left: Hero Image Section */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden aspect-video group shadow-lg">
              <FarmImage seed={crop.id + crop.name + photoIdx} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {crop.season}
                </span>
                {crop.verified && (
                  <span className="bg-green-200 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                {photoIdx + 1} / 4 photos
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className={`rounded-lg overflow-hidden h-24 shadow-sm border-2 cursor-pointer transition-colors ${
                    i === photoIdx ? "border-primary" : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {i < 3 ? (
                    <FarmImage seed={crop.id + crop.name + i} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-primary">+</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Ratings & Reviews Section */}
            <div className="pt-10 border-t border-gray-300 mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div className="md:col-span-1 space-y-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-primary">4.8</span>
                    <span className="text-gray-600 font-medium">out of 5</span>
                  </div>
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on 124 verified purchases</p>
                  <div className="space-y-2">
                    {[
                      { stars: "5 star", percentage: 85 },
                      { stars: "4 star", percentage: 10 },
                      { stars: "3 star", percentage: 3 },
                    ].map((item) => (
                      <div key={item.stars} className="flex items-center text-sm">
                        <span className="w-12">{item.stars}</span>
                        <div className="flex-1 h-2 bg-gray-300 rounded-full mx-2 overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className="w-8 text-right">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-2 space-y-6">
                  {[
                    {
                      name: "Musa A.",
                      date: "Oct 12, 2023",
                      rating: 5,
                      text: "Excellent quality cassava. The starch content is exactly as described, perfect for our processing needs. Delivery was prompt and the packaging kept everything fresh.",
                    },
                    {
                      name: "Chidi O.",
                      date: "Sep 28, 2023",
                      rating: 4,
                      text: "Very satisfied with the purchase. The tubers were clean and of consistent size. Will definitely be ordering from Kolawole Family Farms again.",
                    },
                  ].map((review, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-300">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-gray-900">{review.name}</span>
                          <span className="ml-2 bg-green-100 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <div className="flex text-primary mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-primary" : ""}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.text}</p>
                    </div>
                  ))}
                  <button className="text-primary font-bold text-sm hover:underline flex items-center">
                    Read all 124 reviews →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Detail Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{crop.name}</h1>
              <button onClick={() => navigate({ to: "/farm-profile" })} className="flex items-center space-x-2 text-primary font-bold group cursor-pointer">
                <span className="underline decoration-2 underline-offset-4 group-hover:text-primary-container">{crop.farm}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-primary">₦{crop.price?.split("/")[0] || "48,000"}</span>
                <span className="text-gray-600 font-medium">{crop.unit || "per tonne"}</span>
              </div>
              <div className="flex items-center text-primary font-medium text-sm">
                ✓ {crop.stock} available
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Harvest", value: "Nov 2025" },
                { label: "Min. order", value: "1 tonne" },
                { label: "Delivery", value: "3-5 days" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-4 rounded-xl border border-gray-300 flex flex-col items-center text-center">
                  <span className="text-xs text-gray-600 uppercase mb-1">{item.label}</span>
                  <span className="text-primary font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Primary Action */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-400 rounded-lg bg-white px-2 py-1">
                  <button className="p-2 text-primary hover:bg-gray-100 rounded" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    −
                  </button>
                  <input className="w-16 text-center border-none focus:ring-0 font-bold text-primary bg-transparent" type="number" value={quantity} readOnly />
                  <button className="p-2 text-primary hover:bg-gray-100 rounded" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
                <button
                  onClick={() => navigate({ to: "/contact-farmer", search: { cropId: crop.id } as never })}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Start Order</span>
                </button>
              </div>
              <button onClick={() => navigate({ to: "/chat", search: { farmId: crop.id, farmName: crop.farm } as never })} className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                Contact Farmer
              </button>
            </div>

            {/* Description Section */}
            <div className="pt-6 border-t border-gray-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this product</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sourced directly from the fertile soils of {crop.farm}, our Premium {crop.name} is renowned for its high starch content and pristine quality. Harvested at the peak of maturity, each tuber undergoes rigorous quality checks to ensure optimal freshness.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-lg">♻</span>
                  <span className="text-sm text-gray-700">100% Organic farming practices, free from synthetic fertilizers.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 text-lg">✓</span>
                  <span className="text-sm text-gray-700">Fully traceable supply chain from field to delivery.</span>
                </li>
              </ul>
            </div>

            {/* Trust Badge */}
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4 border border-gray-300">
              <div className="bg-primary-container p-3 rounded-full">
                <Shield className="text-white h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Secure Transaction</h4>
                <p className="text-xs text-gray-600">Funds are held in escrow until you confirm delivery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Other Produce from this Farm</h2>
              <p className="text-gray-600">Fresh arrivals from {crop.farm}</p>
            </div>
            <button className="text-primary font-bold flex items-center hover:underline">
              View Farm Profile <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Export Quality Yellow Yam", price: "₦62,000", desc: "Fresh yams" },
              { name: "Organic Dried Maize", price: "₦35,500", desc: "Quality maize" },
              { name: "Large Sweet Potatoes", price: "₦28,000", desc: "Sweet potatoes" },
            ].map((product, idx) => (
              <div key={idx} className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 relative">
                  <FarmImage seed={crop.id + product.name + idx} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-primary font-bold text-base">{product.price} / tonne</p>
                  <button className="mt-4 w-full text-xs font-bold border border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                    Quick View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 w-full py-8 px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="col-span-1">
            <div className="text-xl font-bold text-primary mb-4">Agro-Farm Connect</div>
            <p className="text-sm text-gray-600 mb-6">© 2026 Agro-Farm Connect. Cultivating transparency.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">
                  Contact Us
                </a>
              </li>
              <li>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4">Newsletter</h4>
            <p className="text-xs text-gray-600 mb-4">Get the latest harvest updates.</p>
            <div className="flex">
              <input className="bg-white border-gray-400 rounded-l-lg p-2 w-full focus:ring-primary focus:border-primary" placeholder="Enter email" type="email" />
              <button className="bg-primary text-white px-4 rounded-r-lg">
                →
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

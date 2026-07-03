import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, Send, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { PrimaryButton, TextInput, FarmImage } from "@/components/mobile/ui";
import { FARMS, CROPS } from "@/lib/agricon-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type SearchParams = { farmId?: string; cropId?: string };

export const Route = createFileRoute("/contact-farmer")({
  head: () => ({ meta: [{ title: "Agricon NG — Request Quote" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    farmId: typeof s.farmId === "string" ? s.farmId : undefined,
    cropId: typeof s.cropId === "string" ? s.cropId : undefined,
  }),
  component: ContactFarmerPage,
});

function ContactFarmerPage() {
  const { farmId, cropId } = Route.useSearch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const farm = FARMS.find((f) => f.id === farmId) ?? FARMS[0];
  const crop = CROPS.find((c) => c.id === cropId) ?? CROPS[0];

  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(
    `Hi, I'm interested in your ${crop.name}. Could you share more details on availability and bulk pricing?`
  );
  const [wantsDeliveryQuote, setWantsDeliveryQuote] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!quantity.trim()) {
      toast.error("Please enter the quantity you need.");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Inquiry sent! The farmer will respond within 2 hours.");
    setTimeout(() => navigate({ to: "/chat", search: { farmId: farm.id, farmName: farm.name } as never }), 1500);
  }

  // Desktop view
  if (!isMobile) {
    if (sent) {
      return (
        <DesktopShell title="Request sent" activeNav="marketplace">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="grid h-32 w-32 place-items-center rounded-full bg-[#e8f0d8]">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[#154212] text-white">
                <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="mt-8 text-3xl font-black text-[#154212]">Inquiry sent!</h1>
            <p className="mt-3 max-w-md text-base text-[#44483d]">
              {farm.owner} from {farm.name} will typically respond within 2 hours.
            </p>
            <div className="mt-10 flex gap-4">
              <PrimaryButton
                onClick={() =>
                  navigate({ to: "/chat", search: { farmId: farm.id, farmName: farm.name } as never })
                }
              >
                Open conversation
              </PrimaryButton>
              <PrimaryButton variant="outline" onClick={() => navigate({ to: "/marketplace" })}>
                Back to marketplace
              </PrimaryButton>
            </div>
          </div>
        </DesktopShell>
      );
    }

    return (
      <DesktopShell title="Request quote" activeNav="marketplace">
        <div className="max-w-4xl mx-auto p-8">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
            {/* Left: Farm/Crop Info */}
            <div className="space-y-6">
              <div className="bg-white border border-[#c2c9bb] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#154212] mb-4">Listing details</h2>
                <div className="flex items-center gap-4 mb-4">
                  <FarmImage seed={crop.id + crop.name} className="h-20 w-20 rounded-xl shrink-0" />
                  <div>
                    <p className="text-lg font-bold text-[#191c18]">{crop.name}</p>
                    <p className="text-sm text-[#44483d]">{farm.name}</p>
                    <p className="text-lg font-bold text-[#154212] mt-1">{crop.price}/{crop.unit.replace("per ", "")}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#44483d]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{crop.verified ? "Verified farm" : "Unverified farm"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Location:</span>
                    <span>{farm.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Rating:</span>
                    <span>{farm.rating} ({farm.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#e8f0d8] border border-[#c2c9bb] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-[#154212] mb-2">About this farm</h3>
                <p className="text-sm text-[#44483d]">
                  {farm.name} is a verified farm specializing in {farm.crops.join(", ")}. 
                  Located in {farm.location}, they have been serving customers across Nigeria with quality produce.
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white border border-[#c2c9bb] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#154212] mb-6">Send inquiry</h2>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#191c18]">
                    Quantity needed *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 tonnes"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#c2c9bb] rounded-xl text-sm text-[#191c18] outline-none focus:border-[#154212] transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#191c18]">
                    Delivery location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#44483d]" />
                    <input
                      type="text"
                      placeholder="City / State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#c2c9bb] rounded-xl text-sm text-[#191c18] outline-none focus:border-[#154212] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#191c18]">
                    Preferred delivery date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#44483d]" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#c2c9bb] rounded-xl text-sm text-[#191c18] outline-none focus:border-[#154212] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#191c18]">
                    Message to farmer
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your requirements..."
                    className="w-full px-4 py-3 border-2 border-[#c2c9bb] rounded-xl text-sm text-[#191c18] outline-none focus:border-[#154212] resize-none transition-all"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-[#191c18]">
                  <input
                    type="checkbox"
                    checked={wantsDeliveryQuote}
                    onChange={(e) => setWantsDeliveryQuote(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-[#c2c9bb] text-[#154212]"
                  />
                  I'd like to receive a delivery quote too
                </label>

                {/* Estimated price preview */}
                {quantity && (
                  <div className="bg-[#e8f0d8] border border-[#154212] rounded-xl p-4">
                    <p className="text-sm font-bold text-[#154212] mb-1">Estimated total</p>
                    <p className="text-sm text-[#44483d]">
                      Based on {quantity} @ {crop.price}/{crop.unit.replace("per ", "")} — actual quote
                      may vary with bulk discounts.
                    </p>
                  </div>
                )}

                <PrimaryButton onClick={handleSend} loading={loading} icon={<Send className="h-4 w-4" />}>
                  Send inquiry
                </PrimaryButton>
                <p className="text-center text-xs text-[#44483d]">
                  Response typically within 2 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // Mobile view

  if (sent) {
    return (
      <MobileShell standalone title="Request sent" showBack={false} showBottomNav={false}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-black text-forest">Inquiry sent!</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {farm.owner} from {farm.name} will typically respond within 2 hours.
          </p>
          <div className="mt-8 w-full space-y-3">
            <PrimaryButton
              onClick={() =>
                navigate({ to: "/chat", search: { farmId: farm.id, farmName: farm.name } as never })
              }
            >
              Open conversation
            </PrimaryButton>
            <PrimaryButton variant="outline" onClick={() => navigate({ to: "/marketplace" })}>
              Back to marketplace
            </PrimaryButton>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      standalone
      title="Request quote"
      showBack
      backTo="/crop-details"
      showBottomNav={false}
    >
      <div className="space-y-5">
        {/* Listing summary */}
        <div className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
          <FarmImage seed={crop.id + crop.name} className="h-12 w-12 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">{crop.name}</p>
            <p className="text-xs text-muted-foreground">
              {farm.name} · {crop.price}/{crop.unit.replace("per ", "")}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <TextInput
            label="Quantity needed"
            placeholder="e.g. 5 tonnes"
            value={quantity}
            onChange={setQuantity}
          />
          <TextInput
            label="Delivery location"
            placeholder="City / State"
            icon={<MapPin className="h-4 w-4" />}
            value={location}
            onChange={setLocation}
          />
          <TextInput
            label="Preferred delivery date"
            placeholder="Select date"
            type="date"
            icon={<Calendar className="h-4 w-4" />}
            value={date}
            onChange={setDate}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Message to farmer
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your requirements..."
              className="w-full rounded-2xl border-2 border-border bg-card p-4 text-sm text-foreground outline-none focus:border-primary resize-none"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={wantsDeliveryQuote}
              onChange={(e) => setWantsDeliveryQuote(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-border text-primary"
            />
            I'd like to receive a delivery quote too
          </label>
        </div>

        {/* Estimated price preview */}
        {quantity && (
          <div className="rounded-2xl border border-primary bg-primary-soft p-4">
            <p className="text-xs font-bold text-forest mb-1">Estimated total</p>
            <p className="text-sm text-forest/80">
              Based on {quantity} @ {crop.price}/{crop.unit.replace("per ", "")} — actual quote
              may vary with bulk discounts.
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="space-y-2 pb-6">
          <PrimaryButton onClick={handleSend} loading={loading} icon={<Send className="h-4 w-4" />}>
            Send inquiry
          </PrimaryButton>
          <p className="text-center text-xs text-muted-foreground">
            Response typically within 2 hours
          </p>
        </div>
      </div>
    </MobileShell>
  );
}

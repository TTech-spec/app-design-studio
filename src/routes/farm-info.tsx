import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, MapPin, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { PrimaryButton, TextInput, OnboardingProgress, Chip } from "@/components/mobile/ui";
import { NIGERIA_STATES, PRIMARY_CROPS } from "@/lib/agricon-data";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/farm-info")({
  head: () => ({ meta: [{ title: "Agricon NG — Farm information" }] }),
  component: FarmInfoPage,
});

function FarmInfoPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const isMobile = useIsMobile();
  const [farmName, setFarmName] = useState(profile?.farm_name ?? "");
  const [farmSize, setFarmSize] = useState(profile?.farm_size_hectares?.toString() ?? "");
  const [farmState, setFarmState] = useState(profile?.farm_state ?? "Oyo");
  const [farmLga, setFarmLga] = useState(profile?.farm_lga ?? "");
  const [crops, setCrops] = useState<string[]>(profile?.primary_crops ?? PRIMARY_CROPS.slice(0, 3));
  const [loading, setLoading] = useState(false);

  function toggleCrop(c: string) {
    setCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({
        farm_name: farmName,
        farm_size_hectares: farmSize ? Number(farmSize) : null,
        farm_state: farmState,
        farm_lga: farmLga,
        primary_crops: crops,
      });
      navigate({ to: "/document-upload" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // Desktop view
  if (!isMobile) {
    return (
      <DesktopShell title="Farm Information" activeNav="profile">
        <div className="max-w-3xl mx-auto p-8">
          <div className="mb-8">
            <Link
              to="/profile-photo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#44483d] hover:text-[#154212] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="bg-white border border-[#c2c9bb] rounded-[32px] p-8">
            <h1 className="text-2xl font-bold text-[#154212] mb-2">Farm Information</h1>
            <p className="text-sm text-[#44483d] mb-8">Tell us about your farm. This appears on your public profile.</p>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Farm name</label>
                <input
                  type="text"
                  placeholder="e.g. Kolawole Family Farms"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Farm size (hectares)</label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Farm state</label>
                <div className="relative">
                  <select
                    value={farmState}
                    onChange={(e) => setFarmState(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] px-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  >
                    {NIGERIA_STATES.map((s) => (
                      <option key={s} value={s}>{s} State</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#44483d]" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">LGA / Nearest town</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#44483d]" />
                  <input
                    type="text"
                    placeholder="e.g. Ibarapa Central"
                    value={farmLga}
                    onChange={(e) => setFarmLga(e.target.value)}
                    className="w-full rounded-2xl border-2 border-[#c2c9bb] bg-[#f3f4ed] pl-11 pr-4 py-3 text-sm text-[#191c18] outline-none focus:border-[#154212] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191c18]">Primary crops (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {PRIMARY_CROPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCrop(c)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        crops.includes(c)
                          ? "bg-[#154212] text-white"
                          : "bg-[#f3f4ed] text-[#191c18] border-2 border-[#c2c9bb] hover:border-[#154212]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleContinue}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#154212] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0f2a20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
              <Link
                to="/document-upload"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-[#c2c9bb] px-6 py-3 text-sm font-semibold text-[#44483d] hover:bg-[#f3f4ed] transition-all"
              >
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // Mobile view
  return (
    <MobileShell standalone title="Farm information" showBottomNav={false} backTo="/profile-photo">
      <OnboardingProgress step={4} />
      <p className="text-sm text-muted-foreground mb-6">Tell us about your farm. This appears on your public profile.</p>
      <div className="space-y-4">
        <TextInput label="Farm name" placeholder="e.g. Kolawole Family Farms" value={farmName} onChange={setFarmName} />
        <TextInput label="Farm size (hectares)" placeholder="e.g. 42" type="number" value={farmSize} onChange={setFarmSize} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Farm state</label>
          <div className="relative">
            <select
              value={farmState}
              onChange={(e) => setFarmState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <TextInput label="LGA / Nearest town" placeholder="e.g. Ibarapa Central" icon={<MapPin className="h-4 w-4" />} value={farmLga} onChange={setFarmLga} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Primary crops (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_CROPS.map((c) => (
              <Chip key={c} active={crops.includes(c)} onClick={() => toggleCrop(c)}>{c}</Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

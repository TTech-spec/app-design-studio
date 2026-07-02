import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, MapPin } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput, OnboardingProgress, Chip } from "@/components/mobile/ui";
import { NIGERIA_STATES, PRIMARY_CROPS } from "@/lib/agricon-data";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/farm-info")({
  head: () => ({ meta: [{ title: "Agricon NG — Farm information" }] }),
  component: FarmInfoPage,
});

function FarmInfoPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
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

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/business-info")({
  head: () => ({ meta: [{ title: "Agricon NG — Business information" }] }),
  component: BusinessInfoPage,
});

const BUSINESS_TYPES = ["Wholesale distributor", "Food processor", "Export company", "Retailer / Market seller"];

function BusinessInfoPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [businessName, setBusinessName] = useState(profile?.business_name ?? "");
  const [businessType, setBusinessType] = useState(profile?.business_type ?? BUSINESS_TYPES[0]);
  const [rcNumber, setRcNumber] = useState(profile?.rc_number ?? "");
  const [years, setYears] = useState(profile?.years_in_operation?.toString() ?? "");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({
        business_name: businessName,
        business_type: businessType,
        rc_number: rcNumber || null,
        years_in_operation: years ? Number(years) : null,
      });
      navigate({ to: "/document-upload" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="Business information" showBottomNav={false} backTo="/profile-photo">
      <OnboardingProgress step={4} />
      <p className="text-sm text-muted-foreground mb-6">Tell us about your distribution business.</p>
      <div className="space-y-4">
        <TextInput
          label="Business name"
          placeholder="e.g. Lagos Fresh Distributors Ltd."
          icon={<Building2 className="h-4 w-4" />}
          value={businessName}
          onChange={setBusinessName}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Business type</label>
          <div className="space-y-2">
            {BUSINESS_TYPES.map((t) => {
              const active = businessType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBusinessType(t)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}
                >
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                    {active && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{t}</span>
                </button>
              );
            })}
          </div>
        </div>
        <TextInput
          label="RC / Business number"
          placeholder="RC 1234567"
          hint="Optional but recommended for verification"
          value={rcNumber}
          onChange={setRcNumber}
        />
        <TextInput
          label="Years in operation"
          placeholder="e.g. 8"
          type="number"
          value={years}
          onChange={setYears}
        />
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

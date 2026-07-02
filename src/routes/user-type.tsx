import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sprout, Truck, ShoppingBag, Info, Check } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, OnboardingProgress } from "@/components/mobile/ui";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/user-type")({
  head: () => ({ meta: [{ title: "Agricon NG — Choose your role" }] }),
  component: UserTypePage,
});

function UserTypePage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [selected, setSelected] = useState<"farmer" | "distributor" | "buyer">(profile?.user_type ?? "farmer");
  const [loading, setLoading] = useState(false);

  const types = [
    { id: "farmer" as const, title: "I'm a Farmer", body: "List your crops, receive inquiries, and grow your business.", icon: <Sprout className="h-7 w-7" /> },
    { id: "distributor" as const, title: "I'm a Distributor", body: "Discover verified farms, source produce, and manage inquiries.", icon: <Truck className="h-7 w-7" /> },
    { id: "buyer" as const, title: "I'm a Buyer", body: "Browse products, connect with sellers, and purchase agricultural produce.", icon: <ShoppingBag className="h-7 w-7" /> },
  ];

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ user_type: selected });
      navigate({ to: "/personal-info" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell standalone title="Who are you?" showBottomNav={false} backTo="/create-password">
      <OnboardingProgress step={1} />
      <p className="text-sm text-muted-foreground mb-6">Choose your role to personalise your experience. You can add more later.</p>
      <div className="space-y-3">
        {types.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-forest"}`}>
                  {t.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                </div>
                {active && <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" strokeWidth={3} /></div>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-gold bg-gold-soft p-4">
        <div className="flex gap-2">
          <Info className="h-5 w-5 shrink-0 text-gold-foreground" />
          <p className="text-xs text-gold-foreground"><span className="font-semibold">Tip:</span> Farmers get listing tools and verification. Distributors get sourcing tools. Buyers get browsing and purchasing features.</p>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>
          Continue as {selected === "farmer" ? "Farmer" : selected === "distributor" ? "Distributor" : "Buyer"}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}

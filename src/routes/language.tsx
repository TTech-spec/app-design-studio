import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";
import { LANGUAGES } from "@/lib/agricon-data";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/language")({
  head: () => ({ meta: [{ title: "Agricon NG — Choose your language" }] }),
  component: LanguagePage,
});

function LanguagePage() {
  const { locale, setLocale } = useLocale();
  return (
    <MobileShell standalone title="Choose your language" showBottomNav={false} backTo="/welcome">
      <p className="text-sm text-muted-foreground mb-6">Pick your preferred language. You can change this anytime in Settings.</p>
      <div className="space-y-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${locale === l.code ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}
          >
            <span className="text-2xl">{l.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{l.name}</div>
              <div className="text-xs text-muted-foreground">{l.native}</div>
            </div>
            {locale === l.code && <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" strokeWidth={3} /></div>}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <PrimaryButton to="/signup">Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

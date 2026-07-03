import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/verification-submitted")({
  head: () => ({ meta: [{ title: "Agricon NG — Verification submitted" }] }),
  component: VerificationSubmittedPage,
});

function VerificationSubmittedPage() {
  return (
    <MobileShell standalone showBack={false} showBottomNav={false}>
      <div className="flex h-full flex-col items-center justify-center text-center pb-20">
        <div className="relative">
          <div className="grid h-32 w-32 place-items-center rounded-full bg-primary-soft">
            <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary shadow-glow">
              <ShieldCheck className="h-10 w-10 text-white" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-black text-forest">You're all set!</h1>
        <p className="mt-3 max-w-xs text-[15px] text-muted-foreground">Your verification documents are being reviewed. This usually takes 24-48 hours.</p>
        <div className="mt-6 w-full rounded-2xl border border-border bg-card p-4 text-left shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft">
              <Clock className="h-5 w-5 text-gold-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated review time</p>
              <p className="text-xs text-muted-foreground">24-48 hours · You'll get a notification</p>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton to="/onboarding-1">Continue</PrimaryButton>
          <Link to="/verification-status" className="block text-center text-sm font-semibold text-primary py-2">Check verification status</Link>
        </div>
      </div>
    </MobileShell>
  );
}

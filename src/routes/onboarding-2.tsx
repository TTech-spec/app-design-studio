import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";
import farmGrains from "@/assets/farm-grains.jpg";

export const Route = createFileRoute("/onboarding-2")({
  head: () => ({ meta: [{ title: "Agricon NG — Support Local Farmers" }] }),
  component: OnboardingTwoPage,
});

function OnboardingTwoPage() {
  return (
    <MobileShell standalone showBack={false} showBottomNav={false} fullBleed>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-16">
        <div className="relative order-1 lg:order-1">
          <img
            src={farmGrains}
            alt="Farmers with grains and produce"
            className="h-64 w-full object-cover sm:h-80 lg:h-[520px] lg:rounded-[36px] lg:shadow-card"
          />
        </div>
        <div className="order-2 flex flex-1 flex-col p-6 lg:order-2 lg:p-0">
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-xs font-bold text-muted-foreground">Step 2 of 3</span>
            <Link to="/home" className="text-sm font-semibold text-muted-foreground">Skip</Link>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Step 2 of 3</span>
            <Link to="/home" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Skip</Link>
          </div>
          <div className="mt-6 flex-1 lg:mt-10">
            <h1 className="text-3xl font-black leading-tight text-forest lg:text-5xl">Support Local Farmers</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground lg:mt-6 lg:text-lg">
              Connect with verified farmers, compare products, and grow local agriculture together.
            </p>
          </div>
          <div className="mb-2 flex justify-center gap-1.5 lg:justify-start lg:mt-10">
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-6 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
          <div className="mt-4 flex flex-col gap-3 lg:mt-6 lg:flex-row">
            <PrimaryButton to="/onboarding-3">Next</PrimaryButton>
            <Link
              to="/home"
              className="inline-flex h-13 min-h-[52px] w-full items-center justify-center rounded-2xl border-2 border-border bg-card px-5 text-[15px] font-semibold text-foreground hover:bg-secondary lg:w-auto lg:px-8"
            >
              Skip
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

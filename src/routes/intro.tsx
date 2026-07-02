import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/intro")({
  head: () => ({ meta: [{ title: "Agricon NG — Discover trusted farms" }] }),
  component: IntroPage,
});

function IntroPage() {
  return (
    <MobileShell standalone showBack={false} showBottomNav={false} fullBleed>
      <div className="flex h-full flex-col">
        <div className="relative flex-1 gradient-mesh">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-32 w-32 place-items-center rounded-[36px] bg-primary text-primary-foreground shadow-glow">
              <Sprout className="h-16 w-16" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <div className="p-6 pb-8">
          <div className="flex justify-center gap-1.5 mb-6">
            <span className="h-1.5 w-6 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-forest">
            Discover Nigeria's most trusted farms
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            AGRICON connects verified farmers and distributors so you can source produce with total confidence.
          </p>
          <div className="mt-8 space-y-3">
            <PrimaryButton to="/welcome">Get started</PrimaryButton>
            <Link to="/signin" className="block text-center text-sm font-semibold text-primary py-2">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

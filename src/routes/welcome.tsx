import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, MessageCircle, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Agricon NG — Welcome" }] }),
  component: WelcomePage,
});

function WelcomePage() {
  const slides = [
    { title: "Verified farmers only", body: "Every farm is verified — real land, real produce, real trust.", icon: <ShieldCheck className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
    { title: "Chat directly, transact securely", body: "Message farmers, discuss quantities, arrange delivery — all in one place.", icon: <MessageCircle className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
    { title: "Grown with intelligence", body: "Seasonal insights and harvest timelines help you plan smarter.", icon: <TrendingUp className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
  ];
  return (
    <MobileShell standalone showBack={false} showBottomNav={false} fullBleed>
      <div className="flex h-full flex-col p-6">
        <div className="flex justify-end">
          <Link to="/signin" className="text-sm font-semibold text-muted-foreground">Skip</Link>
        </div>
        <div className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide flex -mx-6 px-6">
          {slides.map((s, i) => (
            <div key={i} className="snap-center shrink-0 w-full flex flex-col items-center justify-center text-center px-2">
              <div className="grid h-40 w-40 place-items-center rounded-[36px] bg-primary-soft">
                {s.icon}
              </div>
              <h2 className="mt-8 text-2xl font-black text-forest">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-xs">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-1.5 mb-6">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
        <div className="space-y-3">
          <PrimaryButton to="/language">Continue</PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}

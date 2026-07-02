import { createFileRoute } from "@tanstack/react-router";
import { Check, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/verification-status")({
  head: () => ({ meta: [{ title: "Agricon NG — Verification status" }] }),
  component: VerificationStatusPage,
});

function VerificationStatusPage() {
  const steps = [
    { label: "Documents submitted", status: "done", time: "Today, 2:14 PM" },
    { label: "ID verified", status: "done", time: "Today, 3:02 PM" },
    { label: "Farm verification in progress", status: "active", time: "Estimated: 12 hrs" },
    { label: "Approval & profile activation", status: "pending" },
  ];
  return (
    <MobileShell standalone title="Verification status" showBottomNav={false} backTo="/verification-submitted">
      <div className="rounded-2xl gradient-primary p-5 text-white shadow-glow">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-80">Status</p>
            <p className="text-lg font-bold">In review · 67% complete</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/20">
          <div className="h-full w-2/3 rounded-full bg-white" />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-bold text-foreground mb-4">Progress</h3>
        <div className="relative space-y-4 pl-4">
          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />
          {steps.map((s, i) => (
            <div key={i} className="relative flex items-start gap-3">
              <div className={`absolute -left-4 grid h-5 w-5 place-items-center rounded-full ring-4 ring-surface ${s.status === "done" ? "bg-primary" : s.status === "active" ? "bg-gold" : "bg-border"}`}>
                {s.status === "done" && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
              <div className="ml-4 flex-1 rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                {s.time && <p className="text-xs text-muted-foreground">{s.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton to="/home" variant="secondary">Back to home</PrimaryButton>
      </div>
    </MobileShell>
  );
}

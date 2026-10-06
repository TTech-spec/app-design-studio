import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Infinity as InfinityIcon, Lock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { naira, PLUS_PERKS, PLUS_PRICE, plusAnnualSaving, TRIAL_DAYS } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Field, selectCls } from "@/components/academy/auth";
import { PublicHeader } from "@/components/academy/public-header";
import { btn, Pill } from "@/components/academy/ui";

type Billing = "monthly" | "annual";

export const Route = createFileRoute("/plus/trial")({
  validateSearch: (s: Record<string, unknown>): { plan?: Billing } =>
    s.plan === "monthly" || s.plan === "annual" ? { plan: s.plan } : {},
  head: () => ({ meta: [{ title: `Start your ${TRIAL_DAYS}-day free trial · DarlTech Plus` }] }),
  component: StartTrial,
});

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i).slice(2));

const priceLabel = (b: Billing) => {
  const p = PLUS_PRICE[b];
  return p ? `${naira(p)} / ${b === "monthly" ? "month" : "year"}` : "Price coming soon";
};
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function StartTrial() {
  const { plan: initial } = Route.useSearch();
  const { user, plus, startTrial, cancelPlus } = useAcademy();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<Billing>(initial ?? "monthly");
  const [card, setCard] = useState({ name: user?.name ?? "", number: "", mm: "", yy: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // the saved account loads after first render; fill the cardholder name once it does
  useEffect(() => {
    if (user?.name) setCard((c) => (c.name ? c : { ...c, name: user.name }));
  }, [user?.name]);
  const [busy, setBusy] = useState(false);

  const today = new Date();
  const reminder = new Date(today.getTime() + (TRIAL_DAYS - 2) * 86400000);
  const charge = new Date(today.getTime() + TRIAL_DAYS * 86400000);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!card.name.trim()) err.name = "Enter the name on your card.";
    if (card.number.replace(/\s/g, "").length < 16) err.number = "Enter the 16-digit card number.";
    if (!card.mm || !card.yy) err.exp = "Choose the expiry month and year.";
    if (!/^\d{3,4}$/.test(card.cvv)) err.cvv = "3 or 4 digits.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    window.setTimeout(() => {
      startTrial(billing);
      toast.success(`Your ${TRIAL_DAYS}-day Plus trial has started. Enjoy unlimited learning!`);
      navigate({ to: "/catalog", search: { q: "", plus: true } });
    }, 800);
  };

  const steps = [
    { title: "Today", body: "Full access to Plus. You pay ₦0.", color: "#16794a" },
    {
      title: `Day ${TRIAL_DAYS - 2} · ${fmtDate(reminder)}`,
      body: "We email you a reminder before your trial ends.",
      color: "#0E2A54",
    },
    {
      title: `Day ${TRIAL_DAYS} · ${fmtDate(charge)}`,
      body: PLUS_PRICE[billing]
        ? `Your plan starts at ${priceLabel(billing)}. Cancel before then and pay nothing.`
        : "Your plan starts at the published Plus price. Cancel before then and pay nothing.",
      color: "#D7372C",
    },
  ];

  const sideCards = (
    <aside className="flex flex-col gap-5">
      <section className="rounded-2xl border border-border bg-white p-6 md:p-7">
        <h2 className="mb-5 text-xl font-extrabold">How your trial works</h2>
        <ol>
          {steps.map((st, i) => (
            <li key={st.title} className="flex gap-3.5">
              <span className="flex flex-col items-center">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: st.color }} />
                {i < steps.length - 1 && <span className="min-h-10 w-0.5 flex-1 bg-border" />}
              </span>
              <span className="flex flex-col gap-0.5 pb-5">
                <span className="text-[15px] font-extrabold">{st.title}</span>
                <span className="text-sm text-muted-foreground">{st.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col gap-3 rounded-2xl bg-[#0A1F3F] p-6 text-white md:p-7">
        <span className="flex items-center gap-2 text-base font-extrabold">
          <InfinityIcon size={20} className="text-[#ff8a80]" strokeWidth={2.4} /> With Plus you get
        </span>
        {PLUS_PERKS.map((f) => (
          <span key={f} className="flex gap-2.5 text-sm text-white/90">
            <Check size={16} className="mt-0.5 shrink-0 text-[#4ade80]" strokeWidth={2.8} /> {f}
          </span>
        ))}
      </section>
    </aside>
  );

  let main;
  if (plus) {
    main = (
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 md:p-10">
        <Pill tone="green">Plus is active</Pill>
        <h1 className="text-[28px] font-extrabold md:text-[32px]">
          You’re on DarlTech Plus {plus.billing === "annual" ? "Annual" : "Monthly"}
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Trial started {fmtDate(new Date(plus.startedAt))}. Your first payment is on{" "}
          {fmtDate(new Date(plus.startedAt + TRIAL_DAYS * 86400000))}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/catalog" search={{ q: "", plus: true }} className={btn.primary + " h-12"}>
            Browse Plus courses
          </Link>
          <button
            type="button"
            onClick={() => {
              cancelPlus();
              toast("Your Plus trial was cancelled. You won’t be charged.");
            }}
            className={btn.outline + " h-12"}
          >
            Cancel trial
          </button>
        </div>
      </section>
    );
  } else if (!user) {
    main = (
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 md:p-10">
        <h1 className="text-[28px] font-extrabold md:text-[32px]">
          Start your {TRIAL_DAYS}-day free trial
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Create a free DarlTech account or log in first. Then come back here to start your Plus
          trial.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/join/student" className={btn.primary + " h-12 px-6"}>
            Create a free account
          </Link>
          <Link to="/login" className={btn.outline + " h-12 px-6"}>
            Log in
          </Link>
        </div>
      </section>
    );
  } else {
    main = (
      <form
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 md:p-10"
      >
        <h1 className="text-[26px] font-extrabold md:text-[32px]">
          Start your {TRIAL_DAYS}-day free trial
        </h1>
        <div role="radiogroup" aria-label="Plan" className="grid gap-3 sm:grid-cols-2">
          {(["monthly", "annual"] as const).map((b) => {
            const on = billing === b;
            return (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setBilling(b)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl p-4 text-left",
                  on
                    ? "border-2 border-primary bg-[#f3f6fb]"
                    : "border border-border bg-white hover:bg-surface",
                )}
              >
                <span className="flex items-center justify-between gap-2 text-[15px] font-extrabold">
                  Plus {b === "monthly" ? "Monthly" : "Annual"}
                  {b === "annual" && (
                    <Pill tone="green">
                      {plusAnnualSaving ? `Save ${plusAnnualSaving}%` : "Best value"}
                    </Pill>
                  )}
                </span>
                <span className="text-sm text-muted-foreground">{priceLabel(b)} after trial</span>
              </button>
            );
          })}
        </div>
        <Field
          id="t-name"
          label="Name on card"
          autoComplete="cc-name"
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })}
          error={errors.name}
        />
        <Field
          id="t-card"
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          value={card.number}
          onChange={(e) =>
            setCard({
              ...card,
              number: e.target.value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim(),
            })
          }
          error={errors.number}
        />
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="t-mm" className="text-sm font-semibold">
              Expiry date
            </label>
            <div className="flex gap-2">
              <select
                id="t-mm"
                aria-label="Expiry month"
                value={card.mm}
                onChange={(e) => setCard({ ...card, mm: e.target.value })}
                className={selectCls}
              >
                <option value="">MM</option>
                {MONTHS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                aria-label="Expiry year"
                value={card.yy}
                onChange={(e) => setCard({ ...card, yy: e.target.value })}
                className={selectCls}
              >
                <option value="">YY</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            {errors.exp && <p className="text-xs font-semibold text-[#D7372C]">{errors.exp}</p>}
          </div>
          <Field
            id="t-cvv"
            label="CVV"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="•••"
            className="w-[110px]"
            value={card.cvv}
            onChange={(e) =>
              setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            error={errors.cvv}
          />
        </div>
        <button type="submit" disabled={busy} className={btn.big}>
          {busy ? "Starting your trial…" : "Start free trial"}
        </button>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          You won’t be charged today. After {TRIAL_DAYS} days you’ll pay{" "}
          {PLUS_PRICE[billing] ? priceLabel(billing) : "the Plus price"} until you cancel. Cancel
          anytime from this page.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={14} /> Demo checkout: no real payment is taken yet
        </p>
      </form>
    );
  }

  return (
    <div className="academy min-h-screen bg-surface">
      <PublicHeader />
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 md:px-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-10">
        {main}
        {sideCards}
      </div>
    </div>
  );
}

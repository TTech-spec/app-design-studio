import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { courseById, naira, SCHOLARSHIP_FEE } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Field, selectCls } from "@/components/academy/auth";
import { btn, Card, CourseTile } from "@/components/academy/ui";

type Plan = "full" | "scholarship";

export const Route = createFileRoute("/student/checkout/$courseId")({
  validateSearch: (s: Record<string, unknown>): { plan: Plan } => ({
    plan: s.plan === "scholarship" ? "scholarship" : "full",
  }),
  loader: ({ params }) => {
    if (!courseById(params.courseId)) throw notFound();
    return { courseId: params.courseId };
  },
  head: () => ({ meta: [{ title: "Checkout · DarlTech Academy" }] }),
  component: Checkout,
});

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i).slice(2));

function Checkout() {
  const { courseId } = Route.useLoaderData();
  const { plan: initial } = Route.useSearch();
  const course = courseById(courseId)!;
  const { enroll, user } = useAcademy();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan>(initial);
  const [card, setCard] = useState({ name: user?.name ?? "", number: "", mm: "", yy: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // the saved account loads after first render; fill the cardholder name once it does
  useEffect(() => {
    if (user?.name) setCard((c) => (c.name ? c : { ...c, name: user.name }));
  }, [user?.name]);
  const [paying, setPaying] = useState(false);
  const amount = plan === "full" ? course.fee : SCHOLARSHIP_FEE;

  const pay = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!card.name.trim()) err.name = "Enter the name on your card.";
    if (card.number.replace(/\s/g, "").length < 16) err.number = "Enter the 16-digit card number.";
    if (!card.mm || !card.yy) err.exp = "Choose the expiry month and year.";
    if (!/^\d{3,4}$/.test(card.cvv)) err.cvv = "3 or 4 digits.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setPaying(true);
    window.setTimeout(() => {
      enroll(course.id, plan);
      toast.success(
        plan === "full"
          ? `You’re enrolled in ${course.name}!`
          : "Scholarship application submitted!",
      );
      navigate({ to: "/student" });
    }, 900);
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold">Checkout</h1>
      <Card className="flex items-center gap-3 p-4">
        <CourseTile course={course} size={44} radius={10} />
        <span className="flex flex-1 flex-col">
          <span className="text-[15px] font-bold">{course.name}</span>
          <span className="text-xs text-muted-foreground">
            {course.kind} · {course.duration}
          </span>
        </span>
        <span className="text-[15px] font-bold">{naira(amount)}</span>
      </Card>
      <div role="radiogroup" aria-label="Payment option" className="flex flex-col gap-2">
        {[
          {
            id: "full" as const,
            title: "Pay full course fee",
            sub: `${naira(course.fee)} · instant access`,
          },
          {
            id: "scholarship" as const,
            title: "Apply for a scholarship",
            sub: `${naira(SCHOLARSHIP_FEE)} acceptance fee · admin reviews your application`,
          },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={plan === o.id}
            onClick={() => setPlan(o.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl p-3.5 text-left",
              plan === o.id
                ? "border-2 border-primary bg-[#f3f6fb]"
                : "border border-border bg-white",
            )}
          >
            <span
              className={cn(
                "h-[22px] w-[22px] shrink-0 rounded-full",
                plan === o.id ? "border-[7px] border-primary" : "border-2 border-border",
              )}
            />
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold">{o.title}</span>
              <span className="text-xs text-muted-foreground">{o.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <form onSubmit={pay} noValidate className="flex flex-col gap-4">
        <Field
          id="c-name"
          label="Name on card"
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })}
          error={errors.name}
          autoComplete="cc-name"
        />
        <Field
          id="c-num"
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
            <label htmlFor="c-mm" className="text-sm font-semibold">
              Expiry date
            </label>
            <div className="flex gap-2">
              <select
                id="c-mm"
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
            id="c-cvv"
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
        <button type="submit" disabled={paying} className={cn(btn.big, "mt-2")}>
          {paying ? "Processing…" : `Pay ${naira(amount)}`}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={14} /> Demo checkout: no real payment is taken yet
        </p>
      </form>
    </div>
  );
}

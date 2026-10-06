import { Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowRight,
  Award,
  Check,
  Infinity as InfinityIcon,
  Minus,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { COURSES, PLUS_PRICE, plusAnnualSaving, TRIAL_DAYS, tutorById } from "@/lib/academy/data";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const annualSaving = plusAnnualSaving;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

type Billing = "monthly" | "annual";

type Plan = {
  id: "single" | Billing;
  name: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  cta: string;
  href: string;
};

const PLANS: Plan[] = [
  {
    id: "single",
    name: "Single programme",
    price: "From ₦150,000",
    period: "one-off",
    note: "Or apply for a scholarship with a ₦30,000 acceptance fee",
    features: [
      "Short courses: ₦150,000 – ₦250,000",
      "Full programmes: ₦300,000 – ₦800,000",
      "Live classes and tutor chat",
      "Projects, quizzes and progress dashboard",
      "Certificate for that programme",
    ],
    cta: "Browse programmes",
    href: "/catalog",
  },
  {
    id: "monthly",
    name: "Plus Monthly",
    price: PLUS_PRICE.monthly ? naira(PLUS_PRICE.monthly) : "Coming soon",
    period: PLUS_PRICE.monthly ? "/ month" : "",
    note: `${TRIAL_DAYS}-day free trial · cancel anytime`,
    features: [
      "Every short course in the catalogue",
      "Unlimited certificates",
      "All course materials in the store",
      "Live classes, tutor chat and community",
      "Cancel anytime",
    ],
    cta: `Start ${TRIAL_DAYS}-day free trial`,
    href: "/plus/trial?plan=monthly",
  },
  {
    id: "annual",
    name: "Plus Annual",
    price: PLUS_PRICE.annual ? naira(PLUS_PRICE.annual) : "Coming soon",
    period: PLUS_PRICE.annual ? "/ year" : "",
    note: PLUS_PRICE.annual
      ? `Works out to ${naira(Math.round(PLUS_PRICE.annual / 12))} / month`
      : "Our best-value plan",
    features: [
      "Everything in Plus Monthly",
      annualSaving
        ? `Save ${annualSaving}% compared with monthly`
        : "Lower price than paying monthly",
      "Priority seats at live events",
      "Career support: CV and portfolio review",
    ],
    cta: "Get Plus Annual",
    href: "/plus/trial?plan=annual",
  },
];

const INCLUDED = [
  {
    icon: InfinityIcon,
    title: "Unlimited learning",
    body: "Every short course in the catalogue, at no extra cost.",
  },
  {
    icon: Award,
    title: "Unlimited certificates",
    body: "Earn as many DarlTech certificates as you like and share them on LinkedIn.",
  },
  {
    icon: ShoppingBag,
    title: "All course materials",
    body: "E-books, templates and project files from the store, included.",
  },
  {
    icon: Users,
    title: "Live classes & community",
    body: "Weekly live sessions, tutor chat and your cohort group.",
  },
];

type Cell = boolean | string;
const COMPARE: { label: string; free: Cell; single: Cell; plus: Cell }[] = [
  { label: "Browse courses and the tech feed", free: true, single: true, plus: true },
  { label: "Free preview lessons and quizzes", free: true, single: true, plus: true },
  { label: "Full course access", free: false, single: "One programme", plus: "Every short course" },
  { label: "Certificates", free: false, single: "One", plus: "Unlimited" },
  {
    label: "Course materials store",
    free: "Pay per item",
    single: "Pay per item",
    plus: "Included",
  },
  { label: "Live classes and tutor chat", free: false, single: true, plus: true },
  { label: "Career support", free: false, single: false, plus: "Annual plan" },
];

const TICK_STEP = 0.11;

/**
 * A comparison cell. Ticks draw themselves in (circle pops, then the check mark is stroked)
 * one after another in reading order once the table is on screen; `i` is the cell's position.
 */
function CellValue({ v, i, show }: { v: Cell; i: number; show: boolean }) {
  const reduce = useReducedMotion();
  const delay = 0.15 + i * TICK_STEP;
  const on = reduce || show;
  if (v === true)
    return (
      <span role="img" aria-label="Included" className="mx-auto inline-grid">
        <motion.span
          className="grid h-7 w-7 place-items-center rounded-full bg-[#16794a]/12"
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={on ? { scale: [0, 1.25, 1], opacity: 1 } : undefined}
          transition={{ duration: 0.45, delay, times: [0, 0.6, 1] }}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="#16794a"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={on ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.35, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>
        </motion.span>
      </span>
    );
  const fade = {
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: on ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.35, delay },
  } as const;
  if (v === false)
    return (
      <motion.span {...fade} className="mx-auto inline-flex" role="img" aria-label="Not included">
        <Minus className="h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
      </motion.span>
    );
  return (
    <motion.span {...fade} className="inline-block text-sm font-semibold text-forest">
      {v}
    </motion.span>
  );
}

/** Short courses are the ones a Plus subscription unlocks; full programmes stay pay-per-programme. */
const PLUS_COURSES = COURSES.filter((c) => c.kind === "Short course");

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("annual");
  const compareMobileRef = useRef<HTMLDivElement>(null);
  const compareTableRef = useRef<HTMLDivElement>(null);
  const compareMobileInView = useInView(compareMobileRef, { once: true, margin: "-80px" });
  const compareTableInView = useInView(compareTableRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* CHOOSE HOW YOU WANT TO LEARN */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div data-animate="stagger" className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <InfinityIcon className="h-4 w-4" /> Pricing · DarlTech Plus
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">
            Choose how you want to learn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pay for one programme, apply for a scholarship, or learn without limits with Plus. No
            hidden fees.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Plus billing"
            className="inline-flex rounded-full bg-secondary p-1"
          >
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold transition",
                  billing === b
                    ? "bg-forest text-white shadow-soft"
                    : "text-forest hover:bg-white/60",
                )}
              >
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && (
                  <span className="rounded-full bg-[#4ade80] px-2 py-0.5 text-[11px] font-black text-[#0A1F3F]">
                    {annualSaving ? `Save ${annualSaving}%` : "Best value"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => {
            const selected = p.id === billing;
            const best = p.id === "annual";
            return (
              <motion.div
                key={p.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "relative flex flex-col gap-5 rounded-3xl border-2 bg-card p-8 transition",
                  selected ? "border-primary shadow-pop" : "border-border shadow-soft",
                )}
              >
                {best && (
                  <span className="absolute -top-3 left-8 rounded-full gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-glow">
                    Best value
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-black text-forest">{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-forest md:text-4xl">{p.price}</span>
                    {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      best ? "font-semibold text-[#16794a]" : "text-muted-foreground",
                    )}
                  >
                    {p.note}
                  </p>
                </div>
                <a
                  href={p.href}
                  className={cn(
                    "flex h-12 w-full items-center justify-center rounded-2xl text-sm font-bold",
                    selected
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "border-2 border-forest text-forest hover:bg-secondary",
                  )}
                >
                  {p.cta}
                </a>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prices in Naira. Full programmes like Data Analysis and Cybersecurity stay
          pay-per-programme, with scholarships available.
        </p>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-primary-soft/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div data-animate="stagger" className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              DarlTech Plus
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-forest md:text-4xl">
              What’s included
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-black text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR WITH PLUS LEARNERS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div data-animate="fade-up" className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-black tracking-tight text-forest md:text-4xl">
            Popular with Plus learners
          </h2>
          <Link
            to="/catalog"
            search={{ q: "", plus: true }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Explore the catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLUS_COURSES.map((c, i) => {
            const Icon = c.icon;
            const tutor = tutorById(c.tutorId);
            return (
              <motion.div
                key={c.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/student/courses/$courseId"
                  params={{ courseId: c.id }}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div
                    className="relative grid h-36 place-items-center text-white"
                    style={{ background: c.color }}
                  >
                    <Icon className="h-11 w-11" strokeWidth={1.5} />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-[11px] font-black text-forest">
                      <InfinityIcon className="h-3.5 w-3.5 text-gold" /> Included with Plus
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="grid h-5 w-5 place-items-center rounded bg-forest text-[10px] font-black text-white">
                        D
                      </span>
                      DarlTech{tutor ? ` · ${tutor.name}` : ""}
                    </span>
                    <span className="text-lg font-black text-forest group-hover:underline">
                      {c.name}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      <b className="text-forest">Skills you’ll gain:</b>{" "}
                      {c.skills.slice(0, 3).join(", ")}
                    </span>
                    <span className="mt-auto pt-2 text-xs text-muted-foreground">
                      Beginner · Short course · {c.duration}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* COMPARE YOUR OPTIONS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
          <h2 className="text-3xl font-black tracking-tight text-forest md:text-4xl">
            Compare your options
          </h2>
          <div ref={compareMobileRef} className="mt-6 md:hidden">
            <div className="grid grid-cols-3 gap-1.5 pb-2 text-center text-[11px] font-black text-muted-foreground">
              <span>Free</span>
              <span>Single</span>
              <span className="text-gold">Plus</span>
            </div>
            {COMPARE.map((r, row) => (
              <div key={r.label} className="border-t border-border py-3">
                <p className="mb-2 text-sm font-semibold text-foreground">{r.label}</p>
                <div className="grid grid-cols-3 gap-1.5 text-center [&_span]:text-xs">
                  {[r.free, r.single, r.plus].map((v, k) => (
                    <div
                      key={k}
                      className={cn(
                        "flex min-h-9 items-center justify-center rounded-lg px-1",
                        k === 2 ? "bg-primary-soft" : "bg-secondary",
                      )}
                    >
                      <CellValue v={v} i={row * 3 + k} show={compareMobileInView} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div ref={compareTableRef} className="mt-8 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th scope="col" className="w-[40%]" />
                  <th scope="col" className="px-4 py-4 text-base font-black text-forest">
                    Free account
                  </th>
                  <th scope="col" className="px-4 py-4 text-base font-black text-forest">
                    Single programme
                  </th>
                  <th
                    scope="col"
                    className="rounded-t-2xl bg-primary-soft px-4 py-4 text-base font-black text-gold"
                  >
                    DarlTech Plus
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, row) => (
                  <tr key={r.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="py-4 pr-4 text-left text-sm font-semibold text-foreground"
                    >
                      {r.label}
                    </th>
                    <td className="px-4 text-center">
                      <CellValue v={r.free} i={row * 3} show={compareTableInView} />
                    </td>
                    <td className="px-4 text-center">
                      <CellValue v={r.single} i={row * 3 + 1} show={compareTableInView} />
                    </td>
                    <td className="bg-primary-soft px-4 text-center">
                      <CellValue v={r.plus} i={row * 3 + 2} show={compareTableInView} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-forest px-6 py-5 text-white">
            <span className="text-base font-bold">
              Not sure yet? Create a free account and look around first.
            </span>
            <a
              href="/join"
              className="inline-flex h-11 items-center gap-2 rounded-2xl gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

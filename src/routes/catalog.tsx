import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Filter, Infinity as InfinityIcon, Search, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CATALOG,
  courseById,
  PLUS_PRICE,
  TRIAL_DAYS,
  TUTORS,
  tutorById,
  naira,
  type CatalogItem,
  type LearningType,
  type Subject,
} from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { PublicHeader } from "@/components/academy/public-header";
import { btn, EmptyState } from "@/components/academy/ui";

const SUBJECTS: Subject[] = ["Design", "Data", "AI", "Security", "Programming"];
const TYPES: LearningType[] = ["Programme", "Course", "Guided project"];
const LEVELS = ["Beginner", "Intermediate"] as const;
const DURATIONS = [
  { id: "short", label: "Less than 5 hours", test: (h: number) => h < 5 },
  { id: "weeks", label: "1–4 weeks", test: (h: number) => h >= 5 && h <= 25 },
  { id: "months", label: "1–4 months", test: (h: number) => h > 25 && h <= 160 },
  { id: "long", label: "6+ months", test: (h: number) => h > 160 },
] as const;
const SORTS = ["Best match", "Shortest first", "Longest first", "A–Z"] as const;
type Sort = (typeof SORTS)[number];

type Search = {
  q: string;
  plus?: boolean;
  subject?: string[];
  type?: string[];
  level?: string[];
  duration?: string[];
  tutor?: string[];
  sort?: Sort;
};

const list = (v: unknown) =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : typeof v === "string" && v
      ? v.split(",")
      : undefined;

export const Route = createFileRoute("/catalog")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : "",
    ...(s.plus === true || s.plus === "true" ? { plus: true } : {}),
    ...(list(s.subject)?.length ? { subject: list(s.subject) } : {}),
    ...(list(s.type)?.length ? { type: list(s.type) } : {}),
    ...(list(s.level)?.length ? { level: list(s.level) } : {}),
    ...(list(s.duration)?.length ? { duration: list(s.duration) } : {}),
    ...(list(s.tutor)?.length ? { tutor: list(s.tutor) } : {}),
    ...(SORTS.includes(s.sort as Sort) ? { sort: s.sort as Sort } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Explore courses and programmes · DarlTech Academy" },
      {
        name: "description",
        content:
          "Browse DarlTech programmes, short courses and guided projects in design, data, AI, security and programming.",
      },
    ],
  }),
  component: Catalog,
});

const matches = (item: CatalogItem, q: string) => {
  if (!q) return true;
  const hay = [
    item.title,
    item.subject,
    item.type,
    ...item.skills,
    tutorById(item.tutorId)?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
};

function CatalogCard({ item }: { item: CatalogItem }) {
  const course = courseById(item.courseId)!;
  const Icon = course.icon;
  const tutor = tutorById(item.tutorId);
  return (
    <Link
      to="/student/courses/$courseId"
      params={{ courseId: item.courseId }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div
        className="relative flex h-32 items-center justify-center text-white md:h-36"
        style={{ background: course.color }}
      >
        <Icon size={44} strokeWidth={1.4} />
        {item.plus && (
          <span className="absolute left-3 top-3 inline-flex h-[26px] items-center gap-1 rounded-md bg-white px-2.5 text-[11px] font-extrabold text-primary">
            <InfinityIcon size={14} className="text-[#D7372C]" strokeWidth={2.4} /> Included with
            Plus
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-3.5">
        <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-primary text-[11px] font-extrabold text-white">
            D
          </span>
          DarlTech{tutor ? ` · ${tutor.name}` : ""}
        </span>
        <span className="text-[17px] font-extrabold leading-snug group-hover:underline">
          {item.title}
        </span>
        <span className="text-[13px] leading-snug text-muted-foreground">
          <b className="text-primary">Skills you’ll gain:</b> {item.skills.join(", ")}
        </span>
        <span className="flex-1" />
        <span className="pt-1 text-[13px] text-muted-foreground">
          {item.level} · {item.type} · {item.length}
        </span>
      </div>
    </Link>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string; count: number }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="border-0 border-t border-border p-0 py-4">
      <legend className="float-left mb-3 w-full text-[15px] font-extrabold">{title}</legend>
      <div className="clear-both flex flex-col gap-2.5">
        {options.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(o.id)}
              onChange={() => onToggle(o.id)}
              className="h-[18px] w-[18px] accent-[#0E2A54]"
            />
            <span className="flex-1">{o.label}</span>
            <span className="text-muted-foreground">{o.count}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Catalog() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });
  const { plus: myPlus } = useAcademy();
  const [sheet, setSheet] = useState(false);

  const set = (patch: Partial<Search>) =>
    navigate({
      search: (prev: Search) => {
        const next: Search = { ...prev, ...patch };
        (Object.keys(next) as (keyof Search)[]).forEach((k) => {
          const v = next[k];
          if (v === undefined || v === false || (Array.isArray(v) && v.length === 0))
            delete next[k];
        });
        return { ...next, q: next.q ?? "" };
      },
      replace: true,
    });
  const toggle = (key: "subject" | "type" | "level" | "duration" | "tutor", id: string) => {
    const cur = s[key] ?? [];
    set({ [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  };

  // items matching everything except one facet, so each facet's counts stay meaningful
  const base = (skip?: keyof Search) =>
    CATALOG.filter(
      (i) =>
        matches(i, s.q) &&
        (skip === "plus" || !s.plus || i.plus) &&
        (skip === "subject" || !s.subject?.length || s.subject.includes(i.subject)) &&
        (skip === "type" || !s.type?.length || s.type.includes(i.type)) &&
        (skip === "level" || !s.level?.length || s.level.includes(i.level)) &&
        (skip === "duration" ||
          !s.duration?.length ||
          DURATIONS.some((d) => s.duration!.includes(d.id) && d.test(i.hours))) &&
        (skip === "tutor" || !s.tutor?.length || s.tutor.includes(i.tutorId)),
    );
  const results = useMemo(() => {
    const r = base();
    const sort = s.sort ?? "Best match";
    if (sort === "Shortest first") r.sort((a, b) => a.hours - b.hours);
    if (sort === "Longest first") r.sort((a, b) => b.hours - a.hours);
    if (sort === "A–Z") r.sort((a, b) => a.title.localeCompare(b.title));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s]);
  const plusItems = results.filter((i) => i.plus);
  const otherItems = results.filter((i) => !i.plus);
  const count = (skip: keyof Search, pred: (i: CatalogItem) => boolean) =>
    base(skip).filter(pred).length;

  const chips: { label: string; clear: () => void }[] = [
    ...(s.plus ? [{ label: "Included with Plus", clear: () => set({ plus: undefined }) }] : []),
    ...(s.subject ?? []).map((x) => ({ label: x, clear: () => toggle("subject", x) })),
    ...(s.type ?? []).map((x) => ({ label: x, clear: () => toggle("type", x) })),
    ...(s.level ?? []).map((x) => ({ label: x, clear: () => toggle("level", x) })),
    ...(s.duration ?? []).map((x) => ({
      label: DURATIONS.find((d) => d.id === x)?.label ?? x,
      clear: () => toggle("duration", x),
    })),
    ...(s.tutor ?? []).map((x) => ({
      label: tutorById(x)?.name ?? x,
      clear: () => toggle("tutor", x),
    })),
  ];
  const clearAll = () => navigate({ search: { q: s.q }, replace: true });

  const filters: ReactNode = (
    <>
      <div className="flex items-center justify-between pb-3.5">
        <span className="text-lg font-extrabold">Filter by</span>
        {chips.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="h-10 text-[13px] font-bold text-[#D7372C] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="mb-1 flex items-center gap-3 rounded-xl bg-[#fdecea] p-3.5 text-sm font-extrabold">
        <InfinityIcon size={18} className="text-[#D7372C]" strokeWidth={2.4} />
        <span className="flex-1">Included with Plus</span>
        <button
          type="button"
          role="switch"
          aria-checked={!!s.plus}
          aria-label="Only show courses included with Plus"
          onClick={() => set({ plus: s.plus ? undefined : true })}
          className={cn(
            "relative h-[26px] w-11 shrink-0 rounded-full transition",
            s.plus ? "bg-[#16794a]" : "bg-[#c9d1e2]",
          )}
        >
          <span
            className={cn(
              "absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all",
              s.plus ? "left-[21px]" : "left-[3px]",
            )}
          />
        </button>
      </div>
      <FilterGroup
        title="Subject"
        options={SUBJECTS.map((x) => ({
          id: x,
          label: x,
          count: count("subject", (i) => i.subject === x),
        }))}
        selected={s.subject ?? []}
        onToggle={(id) => toggle("subject", id)}
      />
      <FilterGroup
        title="Learning type"
        options={TYPES.map((x) => ({ id: x, label: x, count: count("type", (i) => i.type === x) }))}
        selected={s.type ?? []}
        onToggle={(id) => toggle("type", id)}
      />
      <FilterGroup
        title="Level"
        options={LEVELS.map((x) => ({
          id: x,
          label: x,
          count: count("level", (i) => i.level === x),
        }))}
        selected={s.level ?? []}
        onToggle={(id) => toggle("level", id)}
      />
      <FilterGroup
        title="Duration"
        options={DURATIONS.map((d) => ({
          id: d.id,
          label: d.label,
          count: count("duration", (i) => d.test(i.hours)),
        }))}
        selected={s.duration ?? []}
        onToggle={(id) => toggle("duration", id)}
      />
      <FilterGroup
        title="Tutor"
        options={TUTORS.map((t) => ({
          id: t.id,
          label: t.name,
          count: count("tutor", (i) => i.tutorId === t.id),
        }))}
        selected={s.tutor ?? []}
        onToggle={(id) => toggle("tutor", id)}
      />
    </>
  );

  const plusBanner = !myPlus && (
    <section className="flex flex-col gap-4 rounded-2xl bg-[#0A1F3F] p-6 text-white md:flex-row md:items-center md:gap-6 md:px-8">
      <InfinityIcon size={40} className="shrink-0 text-[#ff8a80]" strokeWidth={2} />
      <div className="flex-1">
        <div className="text-xl font-extrabold">Get every short course with DarlTech Plus</div>
        <div className="text-sm text-white/80">
          {TRIAL_DAYS} days free
          {PLUS_PRICE.monthly ? `, then ${naira(PLUS_PRICE.monthly)}/month` : ""}. Unlimited
          certificates. Cancel anytime.
        </div>
      </div>
      <Link to="/plus/trial" search={{}} className={btn.primary + " h-12 px-6"}>
        Start free trial
      </Link>
    </section>
  );

  return (
    <div className="academy min-h-screen bg-white">
      <PublicHeader initialQuery={s.q} onSearch={(q) => set({ q })} />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
        <section className="pt-6 md:pt-8">
          <span className="text-sm text-muted-foreground">
            <Link to="/" className="font-bold text-[#D7372C] hover:underline">
              Home
            </Link>{" "}
            / Explore
          </span>
          <h1 className="mt-2.5 text-[28px] font-extrabold md:text-4xl">
            {s.q ? `Results for “${s.q}”` : "Explore courses and programmes"}
          </h1>
          <form
            role="search"
            className="mt-4 md:hidden"
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: String(new FormData(e.currentTarget).get("q") ?? "").trim() });
            }}
          >
            <label className="flex h-12 items-center gap-2.5 rounded-full border border-[#b9c3d8] px-4">
              <Search size={18} className="text-muted-foreground" />
              <span className="sr-only">Search</span>
              <input
                name="q"
                type="search"
                defaultValue={s.q}
                placeholder="What do you want to learn?"
                className="w-full bg-transparent text-[15px] outline-none"
              />
            </label>
          </form>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:mt-5 md:flex-wrap md:px-0">
            {SUBJECTS.map((x) => {
              const on = s.subject?.includes(x);
              return (
                <button
                  key={x}
                  type="button"
                  aria-pressed={!!on}
                  onClick={() => toggle("subject", x)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold",
                    on
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white hover:bg-surface",
                  )}
                >
                  {x}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-10 pt-6 md:pt-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside aria-label="Filters" className="hidden lg:block">
            {filters}
          </aside>
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-extrabold text-white lg:hidden"
              >
                <Filter size={16} /> Filters{chips.length ? ` · ${chips.length}` : ""}
              </button>
              <span className="text-base font-extrabold" aria-live="polite">
                {results.length} {results.length === 1 ? "result" : "results"}
              </span>
              <div className="hidden flex-1 flex-wrap gap-2 md:flex">
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex h-[34px] items-center gap-1 rounded-full bg-primary-soft pl-3.5 pr-1.5 text-[13px] font-bold"
                  >
                    {c.label}
                    <button
                      type="button"
                      aria-label={`Remove ${c.label}`}
                      onClick={c.clear}
                      className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white"
                    >
                      <X size={14} strokeWidth={2.4} />
                    </button>
                  </span>
                ))}
              </div>
              <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                Sort by
                <select
                  value={s.sort ?? "Best match"}
                  onChange={(e) =>
                    set({
                      sort: e.target.value === "Best match" ? undefined : (e.target.value as Sort),
                    })
                  }
                  className="h-10 rounded-lg border border-border px-2.5 text-sm font-bold text-primary"
                >
                  {SORTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="No matches"
                body="Try fewer filters or a different search, like “design”, “python” or “excel”."
                action={
                  <button
                    type="button"
                    onClick={() => navigate({ search: { q: "" }, replace: true })}
                    className={btn.primary}
                  >
                    Show everything
                  </button>
                }
              />
            ) : (
              <>
                {plusItems.length > 0 && (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {plusItems.map((i) => (
                      <CatalogCard key={i.id} item={i} />
                    ))}
                  </div>
                )}
                {plusBanner}
                {otherItems.length > 0 && (
                  <section className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold md:text-2xl">
                        Full programmes · pay once or apply for a scholarship
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        8-month programmes aren’t part of Plus. Scholarships have a ₦30,000
                        acceptance fee.
                      </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {otherItems.map((i) => (
                        <CatalogCard key={i.id} item={i} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
            <Link
              to="/student/explore"
              className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-[#D7372C] hover:underline"
            >
              Already enrolled? Go to your learning portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      {sheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="academy fixed inset-0 z-50 flex items-end bg-primary/60 lg:hidden"
          onClick={() => setSheet(false)}
        >
          <div
            className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {filters}
            <button
              type="button"
              onClick={() => setSheet(false)}
              className={btn.big + " sticky bottom-0 mt-2"}
            >
              Show {results.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

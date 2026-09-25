import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { COURSES, MATERIALS, POSTS, TRENDING_SKILLS, TUTORS } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import {
  Card,
  ChipTabs,
  CourseCard,
  EmptyState,
  MaterialCard,
  Pill,
  PostCard,
  SectionTitle,
  TutorRow,
} from "@/components/academy/ui";

export const Route = createFileRoute("/student/search")({
  validateSearch: (s: Record<string, unknown>): { q: string } => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  head: () => ({ meta: [{ title: "Search · DarlTech Academy" }] }),
  component: SearchPage,
});

const TABS = ["All", "Courses & skills", "Tutors", "Materials", "Posts"] as const;
type Tab = (typeof TABS)[number];
const has = (hay: string, q: string) => hay.toLowerCase().includes(q);

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/student/search" });
  const { quizById } = useAcademy();
  const [text, setText] = useState(q);
  const [tab, setTab] = useState<Tab>("All");
  useEffect(() => setText(q), [q]);

  const term = q.trim().toLowerCase();
  const courses = term
    ? COURSES.filter((c) => has([c.name, c.kind, c.summary, ...c.skills].join(" "), term))
    : [];
  const tutors = term
    ? TUTORS.filter((t) => has([t.name, t.role, t.headline, ...t.skills].join(" "), term))
    : [];
  const materials = term
    ? MATERIALS.filter((m) =>
        has(
          [m.title, m.type, COURSES.find((c) => c.id === m.courseId)?.name ?? ""].join(" "),
          term,
        ),
      )
    : [];
  const posts = term ? POSTS.filter((p) => has([p.text, p.topic, p.author].join(" "), term)) : [];
  const skills = term
    ? Array.from(new Set(COURSES.flatMap((c) => c.skills).filter((s) => has(s, term))))
    : [];
  const total = courses.length + tutors.length + materials.length + posts.length;
  const show = (t: Tab) => tab === "All" || tab === t;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: text.trim() } });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-5">
        <form onSubmit={submit} role="search">
          <label className="flex h-[52px] items-center gap-2.5 rounded-2xl border border-border bg-white px-4 focus-within:border-primary">
            <Search size={20} className="text-muted-foreground" />
            <span className="sr-only">Search</span>
            <input
              autoFocus
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Search skills, courses, materials and tutors"
              className="w-full bg-transparent text-[15px] outline-none"
            />
            <button
              type="submit"
              className="h-10 rounded-[10px] bg-primary px-4 text-sm font-bold text-white"
            >
              Search
            </button>
          </label>
        </form>
        {term ? (
          <>
            <div>
              <h1 className="text-2xl font-extrabold">Results for “{q}”</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {total} results across courses, tutors, materials and posts
              </p>
            </div>
            <ChipTabs items={TABS} value={tab} onChange={setTab} label="Result type" />
            {total === 0 && (
              <EmptyState
                title="Nothing found"
                body="Try a skill like “design”, “python” or “data”, or a tutor’s name."
              />
            )}
            {show("Courses & skills") && (courses.length > 0 || skills.length > 0) && (
              <section>
                <SectionTitle title="Courses & skills" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {courses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
                {skills.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <Link key={s} to="/student/search" search={{ q: s }}>
                        <Pill tone="white" className="h-9 px-3.5">
                          {s}
                        </Pill>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}
            {show("Tutors") && tutors.length > 0 && (
              <Card>
                <SectionTitle title="Tutors" />
                <div className="grid gap-4 md:grid-cols-2">
                  {tutors.map((t) => (
                    <TutorRow key={t.id} tutor={t} />
                  ))}
                </div>
              </Card>
            )}
            {show("Materials") && materials.length > 0 && (
              <section>
                <SectionTitle
                  title="Materials"
                  action={<Link to="/student/store">Visit the store</Link>}
                />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  {materials.map((m) => (
                    <Link key={m.id} to="/student/store" className="flex">
                      <MaterialCard material={m} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {show("Posts") && posts.length > 0 && (
              <section className="flex flex-col gap-4">
                <SectionTitle title="Posts" className="mb-0" />
                {posts.map((p) => (
                  <PostCard key={p.id} post={p} quiz={p.quizId ? quizById(p.quizId) : undefined} />
                ))}
              </section>
            )}
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold">Find skills, materials and tutors</h1>
            <div className="flex flex-wrap gap-2">
              {["design", "python", "data", "AI", "security", "Tunde"].map((s) => (
                <Link key={s} to="/student/search" search={{ q: s }}>
                  <Pill tone="white" className="h-9 px-3.5">
                    {s}
                  </Pill>
                </Link>
              ))}
            </div>
            <section>
              <SectionTitle title="Tutors" />
              <div className="grid gap-4 md:grid-cols-2">
                {TUTORS.map((t) => (
                  <Card key={t.id} className="p-4">
                    <TutorRow tutor={t} />
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <aside className="flex flex-col gap-4">
        <Card>
          <SectionTitle title="Popular skills to learn" />
          <div className="flex flex-col gap-3">
            {TRENDING_SKILLS.map((s) => (
              <Link
                key={s.name}
                to="/student/search"
                search={{ q: s.name.split(" ")[0] }}
                className="flex items-center gap-3 rounded-xl hover:bg-surface"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-soft">
                  <TrendingUp size={16} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.topic} · searches {s.growth}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

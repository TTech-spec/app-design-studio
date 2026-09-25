import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Play,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  COURSES,
  FEATURES,
  MATERIALS,
  POSTS,
  TESTIMONIALS,
  SCHOLARSHIP_FEE,
  naira,
} from "@/lib/academy/data";
import { firstName, useAcademy } from "@/lib/academy/store";
import {
  Avatar,
  btn,
  Card,
  ChipTabs,
  CourseCard,
  MaterialCard,
  Pill,
  SectionTitle,
  SuccessArt,
} from "@/components/academy/ui";

export const Route = createFileRoute("/student/explore")({
  head: () => ({ meta: [{ title: "Explore courses · DarlTech Academy" }] }),
  component: Explore,
});

const KINDS = ["All courses", "Short courses", "Full programmes"] as const;
const FEATURE_ICONS = [ShieldCheck, BookOpen, Award, TrendingUp, MessageCircle, GraduationCap];

function Explore() {
  const { user } = useAcademy();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All courses");
  const courses = COURSES.filter(
    (c) =>
      kind === "All courses" ||
      (kind === "Short courses" ? c.kind === "Short course" : c.kind === "Full programme"),
  );
  return (
    <div className="flex flex-col gap-9">
      <section className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-white md:flex-row md:items-center md:p-10">
        <div className="flex flex-1 flex-col gap-3.5">
          <Pill tone="navy" className="w-fit bg-white/12">
            Free account · pay only when you enroll
          </Pill>
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
            {user ? `${firstName(user)}, what` : "What"} will you learn first?
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/80">
            Preview lessons, read the tech feed and browse course materials. You only pay when you
            enroll.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <a href="#courses" className={btn.primary + " h-12"}>
              Browse courses
            </a>
            <Link
              to="/tour"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-primary"
            >
              <Play size={16} /> Take the app tour
            </Link>
          </div>
        </div>
        <div className="hidden w-[320px] shrink-0 rounded-2xl bg-white py-5 md:block">
          <SuccessArt className="max-w-[280px]" />
        </div>
      </section>

      <section>
        <SectionTitle
          title="What’s new in tech"
          action={<Link to="/student/feed">Open the tech feed</Link>}
        />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {POSTS.slice(1, 5).map((p) => (
            <Link
              key={p.id}
              to="/student/feed"
              className="flex w-[260px] shrink-0 flex-col gap-3 rounded-2xl border border-border bg-white p-4 md:w-auto"
            >
              <Pill className="w-fit">{p.topic}</Pill>
              <span className="line-clamp-3 flex-1 text-[15px] font-bold leading-snug">
                {p.text}
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar initials={p.initials} color={p.color} size={26} />
                {p.author} · {p.time}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="courses" className="scroll-mt-24">
        <SectionTitle title="Courses you can join" />
        <div className="mb-4">
          <ChipTabs items={KINDS} value={kind} onChange={setKind} label="Course type" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Course materials"
          action={<Link to="/student/store">Visit the store</Link>}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {MATERIALS.slice(0, 4).map((m) => (
            <Link key={m.id} to="/student/store" className="flex">
              <MaterialCard material={m} />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Why DarlTech" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
          {FEATURES.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div
                key={f.title}
                className="flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-4 md:p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                  <Icon size={20} />
                </span>
                <span className="text-[15px] font-bold">{f.title}</span>
                <span className="text-[13px] leading-relaxed text-muted-foreground">{f.body}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="Loved by students across Nigeria" />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:px-0">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex w-[300px] shrink-0 flex-col gap-3.5 rounded-2xl border border-border bg-white p-5 md:w-auto"
            >
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#c98a1a] text-[#c98a1a]" />
                ))}
              </span>
              <blockquote className="flex-1 text-sm leading-relaxed">“{t.text}”</blockquote>
              <figcaption className="flex items-center gap-2.5">
                <Avatar initials={t.initials} color={t.color} size={36} />
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-4 border-0 bg-[#fdecea] md:flex-row md:items-center md:p-7">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D7372C] text-white">
          <GraduationCap size={28} />
        </span>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold">
            Can’t pay the full fee? Apply for a scholarship.
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Choose any course and pay a {naira(SCHOLARSHIP_FEE)} acceptance fee. Our team reviews
            every application.
          </p>
        </div>
        <Link
          to="/student/courses/$courseId"
          params={{ courseId: "ui-ux-design" }}
          className={btn.primary}
        >
          Apply for a scholarship
        </Link>
      </Card>
    </div>
  );
}

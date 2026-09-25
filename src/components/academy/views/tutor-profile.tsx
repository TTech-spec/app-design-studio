import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Briefcase,
  ChevronRight,
  ClipboardCheck,
  MessageCircle,
  Pencil,
  Plus,
  Share2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { courseById, type Tutor } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, btn, Card, CourseCard, Pill, SectionTitle } from "../ui";

const REVIEWS = [
  {
    initials: "IO",
    color: "#1f6b5e",
    name: "Ifeoma O.",
    text: "Explains things slowly and clearly, and the feedback on my work was detailed and kind.",
  },
  {
    initials: "CE",
    color: "#0E2A54",
    name: "Chidi E.",
    text: "The weekly live classes and quick replies in chat kept me on track the whole course.",
  },
];

export function TutorProfileView({
  tutor,
  own = false,
  onEdit,
}: {
  tutor: Tutor;
  own?: boolean;
  onEdit?: () => void;
}) {
  const { follows, toggleFollow, allQuizzes, user } = useAcademy();
  const following = follows.includes(tutor.id);
  const quizzes = allQuizzes.filter((q) => q.tutorId === tutor.id && q.openToAll);
  const name = own && user?.name ? user.name : tutor.name;
  const bio = own && user?.bio ? user.bio : tutor.bio;
  const skills = own && user?.skills.length ? user.skills : tutor.skills;
  const share = () => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/student/tutors/${tutor.id}` : "";
    navigator.clipboard?.writeText(url);
    toast.success("Profile link copied");
  };
  const stats = [
    { v: tutor.rating, l: "Rating" },
    { v: tutor.students, l: "Students taught" },
    { v: tutor.courseIds.length, l: "Courses" },
    { v: quizzes.length, l: "Free quizzes" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="h-24 md:h-32" style={{ background: tutor.color }} />
        <div className="flex flex-col gap-4 px-4 pb-5 md:flex-row md:items-end md:px-7">
          <span className="-mt-12 flex w-fit rounded-full border-4 border-white">
            <Avatar initials={tutor.initials} color={tutor.color} size={96} />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold">{name}</h1>
              <Pill tone="green">
                <BadgeCheck size={13} className="mr-1" />
                {own && user?.status === "pending" ? "Verification pending" : "Verified tutor"}
              </Pill>
            </div>
            <span className="text-sm text-muted-foreground">
              {tutor.role} · {tutor.headline.split(" · ")[0]} · {tutor.location}
            </span>
          </div>
          <div className="flex gap-2.5">
            {own ? (
              <>
                <button type="button" onClick={share} className={btn.outline}>
                  <Share2 size={16} /> Share profile
                </button>
                <button type="button" onClick={onEdit} className={btn.primary}>
                  <Pencil size={16} /> Edit profile
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/student/messages"
                  search={{ c: tutor.id === "ada-nwankwo" ? "ada" : "tunde" }}
                  className={btn.outline}
                >
                  <MessageCircle size={16} /> Message
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFollow(tutor.id)}
                  aria-pressed={following}
                  className={following ? btn.navy : btn.primary}
                >
                  {following ? (
                    "Following"
                  ) : (
                    <>
                      <Plus size={16} /> Follow
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-border">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={cn(
                "flex flex-col items-center gap-0.5 py-3",
                i && "border-l border-border",
              )}
            >
              <span className="font-display text-lg font-extrabold md:text-xl">{s.v}</span>
              <span className="text-center text-[11px] text-muted-foreground md:text-xs">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <SectionTitle title="About" />
            <p className="text-sm leading-relaxed">{bio}</p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Courses taught" />
            <div className="grid gap-4 sm:grid-cols-2">
              {tutor.courseIds.map((id) => {
                const c = courseById(id);
                return c ? <CourseCard key={id} course={c} /> : null;
              })}
            </div>
          </Card>
          <Card>
            <SectionTitle
              title="Reviews"
              action={
                <span className="flex items-center gap-1 text-primary">
                  <Star size={14} className="fill-[#c98a1a] text-[#c98a1a]" />
                  {tutor.rating} · {tutor.reviews} reviews
                </span>
              }
            />
            {REVIEWS.map((r) => (
              <div key={r.name} className="flex flex-col gap-2 border-t border-border py-3.5">
                <div className="flex items-center gap-2">
                  <Avatar initials={r.initials} color={r.color} size={30} />
                  <span className="text-sm font-bold">{r.name}</span>
                  <span className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-[#c98a1a] text-[#c98a1a]" />
                    ))}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </Card>
        </div>
        <div className="flex flex-col gap-5">
          <Card>
            <SectionTitle title={`Free quizzes by ${name.split(" ")[0]}`} />
            {quizzes.length ? (
              quizzes.map((q) => (
                <Link
                  key={q.id}
                  to="/q/$quizId"
                  params={{ quizId: q.id }}
                  className="flex items-center gap-3 border-t border-border py-3 hover:bg-surface"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdecea] text-[#D7372C]">
                    <ClipboardCheck size={18} />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-bold">{q.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {q.questions.length} questions · open to all
                    </span>
                  </span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No public quizzes yet.</p>
            )}
          </Card>
          <Card>
            <SectionTitle title="Experience" />
            <div className="flex flex-col gap-3.5">
              {tutor.experience.map((e) => (
                <div key={e.title + e.place} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft">
                    <Briefcase size={16} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold">{e.title}</span>
                    <span className="text-xs text-muted-foreground">{e.place}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Office hours" />
            <div className="flex flex-col gap-2.5">
              {tutor.officeHours.map((d) => (
                <div key={d} className="flex justify-between text-sm">
                  <span className="font-semibold">{d}</span>
                  <span className="text-muted-foreground">6:00 – 8:00 pm</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

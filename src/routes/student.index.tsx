import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  MessageCircle,
  Play,
  TrendingUp,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES, POSTS, TUTORS, courseById, tutorById } from "@/lib/academy/data";
import { firstName, useAcademy } from "@/lib/academy/store";
import { PortalDashboard } from "@/components/academy/portal-dashboard";
import {
  Avatar,
  btn,
  Card,
  CourseCard,
  PageTitle,
  Progress,
  QuizPromo,
  SectionTitle,
  StatTile,
  TutorRow,
} from "@/components/academy/ui";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Dashboard · DarlTech Academy" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { enrollments } = useAcademy();
  return (
    <>
      <div className="hidden lg:block">
        <PortalDashboard />
      </div>
      <div className="lg:hidden">
        {enrollments.length ? <LearningDashboard /> : <NewDashboard />}
      </div>
    </>
  );
}

function CheckItem({
  done,
  title,
  sub,
  to,
}: {
  done: boolean;
  title: string;
  sub: string;
  to?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 border-t border-border py-3">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          done ? "bg-[#16794a] text-white" : "border-2 border-[#c9d1e2]",
        )}
      >
        {done && <Check size={16} strokeWidth={3} />}
      </span>
      <span className="flex flex-1 flex-col">
        <span className={cn("text-sm font-bold", done && "text-muted-foreground line-through")}>
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{done ? "Done" : sub}</span>
      </span>
      {!done && to}
    </div>
  );
}

function NewDashboard() {
  const { user, tourDone, profileDone, previewWatched, allQuizzes } = useAcademy();
  const interests = user?.interests.length ? user.interests : ["ui-ux-design", "ai-automation"];
  const picked = interests
    .map((id) => courseById(id))
    .filter(Boolean)
    .slice(0, 4) as typeof COURSES;
  const steps = [!!user, tourDone, profileDone, previewWatched, false];
  const doneCount = steps.filter(Boolean).length;
  const go = (_label: string, node: ReactNode) => node;
  const quiz = allQuizzes.find((q) => q.openToAll)!;
  const first = picked[0] ?? COURSES[1];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-w-0 flex-col gap-6">
        <PageTitle
          title={
            user
              ? `Welcome, ${firstName(user)}! Let’s get you started.`
              : "Welcome! Let’s get you started."
          }
          sub="This is your dashboard. Your courses, quizzes and progress will show up here."
        />
        <Card>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold">Get started</h2>
            <span className="text-[13px] font-bold text-muted-foreground">
              {doneCount} of 5 done
            </span>
          </div>
          <Progress value={doneCount * 20} color="#16794a" className="h-1.5" />
          <div className="mt-2">
            <CheckItem
              done={!!user}
              title="Create your account"
              sub="It’s free"
              to={go(
                "",
                <Link to="/join" className="text-[13px] font-bold text-[#D7372C]">
                  Sign up
                </Link>,
              )}
            />
            <CheckItem
              done={tourDone}
              title="Take the app tour"
              sub="1 minute"
              to={
                <Link to="/tour" aria-label="Take the tour">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              }
            />
            <CheckItem
              done={profileDone}
              title="Complete your profile"
              sub="Add a short bio and your skills"
              to={
                <Link to="/student/profile" aria-label="Complete your profile">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              }
            />
            <CheckItem
              done={previewWatched}
              title="Watch a free preview lesson"
              sub={`${first.name} · Lesson 1.1`}
              to={
                <Link
                  to="/student/courses/$courseId"
                  params={{ courseId: first.id }}
                  aria-label="Watch a preview"
                >
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              }
            />
            <CheckItem
              done={false}
              title="Enroll in your first course"
              sub="Pay the fee or apply for a scholarship"
              to={
                <Link to="/student/explore" aria-label="Browse courses">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              }
            />
          </div>
        </Card>
        <section>
          <SectionTitle
            title="Picked for you"
            action={<Link to="/student/explore">Explore all courses</Link>}
          />
          <p className="-mt-2 mb-3.5 text-[13px] text-muted-foreground">
            Based on your interests: {picked.map((c) => c.name).join(" and ")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {picked.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      </div>
      <aside className="flex flex-col gap-4">
        <Card>
          <SectionTitle title="Try a free quiz" />
          <QuizPromo quiz={quiz} />
          <p className="mt-2.5 text-xs text-muted-foreground">
            Shared by {tutorById(quiz.tutorId)?.name} on the tech feed
          </p>
        </Card>
        <Card>
          <SectionTitle
            title="Tutors to follow"
            action={
              <Link to="/student/search" search={{ q: "" }}>
                Search tutors
              </Link>
            }
          />
          <div className="flex flex-col gap-3.5">
            {TUTORS.slice(0, 3).map((t) => (
              <TutorRow key={t.id} tutor={t} />
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle
            title="Trending on your feed"
            action={<Link to="/student/feed">Open</Link>}
          />
          <div className="flex flex-col gap-3">
            {POSTS.slice(1, 4).map((p) => (
              <Link key={p.id} to="/student/feed" className="flex flex-col gap-1 hover:underline">
                <span className="text-xs font-bold text-[#D7372C]">{p.topic}</span>
                <span className="line-clamp-2 text-sm font-semibold leading-snug">{p.text}</span>
              </Link>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function LearningDashboard() {
  const { user, enrollments, attempts, allQuizzes } = useAcademy();
  const current = enrollments[enrollments.length - 1];
  const course = courseById(current.courseId)!;
  const tutor = tutorById(course.tutorId)!;
  const progress = current.progress;
  const moduleIdx = Math.min(
    course.modules.length - 1,
    Math.floor((progress / 100) * course.modules.length),
  );
  const passed = attempts.filter(
    (a) => a.score >= (allQuizzes.find((q) => q.id === a.quizId)?.passMark ?? 70),
  ).length;
  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)
    : null;
  const courseQuiz = allQuizzes.find((q) => q.courseId === course.id) ?? allQuizzes[0];
  const recommended = COURSES.filter((c) => !enrollments.some((e) => e.courseId === c.id)).slice(
    0,
    3,
  );
  const Icon = course.icon;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-5">
        <PageTitle
          title={`Good to see you, ${firstName(user)}`}
          sub={
            current.plan === "scholarship"
              ? "Your scholarship application is under review. You can start the free lessons now."
              : `You’re ${progress}% through ${course.name}. Keep going!`
          }
        />
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="relative flex h-36 shrink-0 items-center justify-center rounded-xl text-white sm:w-56"
              style={{ background: course.color }}
            >
              <Icon size={44} strokeWidth={1.5} />
              <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
                <Play size={18} />
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D7372C]">
                Continue learning
              </span>
              <span className="font-display text-xl font-extrabold">
                {course.modules[moduleIdx].title}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {course.name} · Module {moduleIdx + 1} of {course.modules.length}
              </span>
              <div className="flex items-center gap-3">
                <Progress value={progress} className="flex-1" />
                <span className="text-[13px] font-bold">{progress}%</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/student/courses/$courseId"
                  params={{ courseId: course.id }}
                  className={btn.primary}
                >
                  <Play size={16} /> Resume lesson
                </Link>
                <Link to="/student/store" className={btn.outline}>
                  <FileText size={16} /> Course materials
                </Link>
              </div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatTile
            label="Course progress"
            value={`${progress}%`}
            sub={`Module ${moduleIdx + 1} of ${course.modules.length}`}
            icon={<TrendingUp size={16} />}
          />
          <StatTile
            label="Quizzes passed"
            value={`${passed}`}
            sub={`${attempts.length} taken`}
            icon={<ClipboardCheck size={16} />}
          />
          <StatTile
            label="Average score"
            value={avg === null ? "—" : `${avg}%`}
            sub="Pass mark is 70%"
            icon={<BarChart3 size={16} />}
          />
          <StatTile
            label="Enrolled"
            value={enrollments.length}
            sub={enrollments.length === 1 ? "course" : "courses"}
            icon={<CalendarDays size={16} />}
            tint="red"
          />
        </div>
        {recommended.length > 0 && (
          <section>
            <SectionTitle
              title="Recommended for you"
              action={<Link to="/student/explore">Browse all courses</Link>}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        )}
      </div>
      <aside className="flex flex-col gap-4">
        <Card>
          <SectionTitle title="Your tutor" />
          <div className="flex items-center gap-3">
            <Avatar initials={tutor.initials} color={tutor.color} size={48} />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold">{tutor.name}</span>
              <span className="text-[13px] text-muted-foreground">{tutor.role}</span>
            </div>
          </div>
          <div className="mt-3.5 flex gap-2">
            <Link
              to="/student/messages"
              search={{ c: "tunde" }}
              className={cn(btn.primary, "h-10 px-4")}
            >
              <MessageCircle size={16} /> Message
            </Link>
            <Link
              to="/student/tutors/$tutorId"
              params={{ tutorId: tutor.id }}
              className={cn(btn.outline, "h-10 px-4")}
            >
              View profile
            </Link>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Coming up" />
          <div className="flex flex-col gap-3">
            <Link
              to="/quiz/$quizId"
              params={{ quizId: courseQuiz.id }}
              className="flex items-center gap-3 rounded-xl hover:bg-surface"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdecea] text-[#D7372C]">
                <ClipboardCheck size={18} />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-bold">{courseQuiz.title}</span>
                <span className="text-xs text-muted-foreground">
                  {courseQuiz.questions.length} questions · due {courseQuiz.due}
                </span>
              </span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <Video size={18} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-bold">Weekly live class</span>
                <span className="text-xs text-muted-foreground">Thursday · 6:00 pm</span>
              </span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

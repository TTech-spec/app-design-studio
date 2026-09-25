import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download, LogOut, Pencil, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { courseById, initialsOf, materialById, naira } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { textareaCls } from "@/components/academy/auth";
import {
  Avatar,
  btn,
  Card,
  CourseTile,
  EmptyState,
  Pill,
  Progress,
  SectionTitle,
} from "@/components/academy/ui";

export const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "Profile · DarlTech Academy" }] }),
  component: Profile,
});

function Profile() {
  const { user, enrollments, attempts, owned, allQuizzes, updateUser, signOut } = useAcademy();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [skills, setSkills] = useState((user?.skills ?? []).join(", "));
  const name = user?.name ?? "Guest";

  if (!user)
    return (
      <EmptyState
        title="Create a free account to get a profile"
        body="Save your progress, quiz scores and purchases."
        action={
          <Link to="/join" className={btn.primary}>
            Create account
          </Link>
        }
      />
    );

  const save = () => {
    updateUser({
      bio: bio.trim(),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditing(false);
    toast.success("Profile saved");
  };
  const interestNames = user.interests.map((i) => courseById(i)?.name).filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="h-24 bg-primary md:h-28" />
        <div className="flex flex-col gap-4 px-4 pb-5 md:flex-row md:items-end md:px-7">
          <span className="-mt-12 flex w-fit rounded-full border-4 border-white">
            <Avatar initials={initialsOf(name)} color="#EF4136" size={96} />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <h1 className="text-2xl font-extrabold">{name}</h1>
            <span className="text-sm text-muted-foreground">
              {enrollments.length
                ? `${courseById(enrollments[0].courseId)?.name} student`
                : "Exploring DarlTech"}{" "}
              · {user.level || "Beginner"}
            </span>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Profile link copied");
              }}
              className={btn.outline}
            >
              <Share2 size={16} /> Share
            </button>
            <button type="button" onClick={() => setEditing(true)} className={btn.primary}>
              <Pencil size={16} /> Edit profile
            </button>
          </div>
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <SectionTitle title="About" />
            {editing ? (
              <div className="flex flex-col gap-3">
                <label htmlFor="p-bio" className="text-sm font-semibold">
                  Short bio
                </label>
                <textarea
                  id="p-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={textareaCls}
                  placeholder="What you do and what you want to learn"
                />
                <label htmlFor="p-skills" className="text-sm font-semibold">
                  Skills (comma separated)
                </label>
                <input
                  id="p-skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="h-12 rounded-xl border border-primary-soft bg-surface px-4 text-[15px] outline-none focus:border-primary"
                  placeholder="Figma, Excel, Python"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={save} className={btn.primary}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className={btn.outline}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed">
                  {user.bio || "Add a short bio so tutors and classmates know a bit about you."}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {[...user.skills, ...interestNames].map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </>
            )}
          </Card>
          <Card>
            <SectionTitle title="Enrolled courses" />
            {enrollments.length ? (
              <div className="flex flex-col gap-4">
                {enrollments.map((e) => {
                  const c = courseById(e.courseId)!;
                  return (
                    <Link
                      key={e.courseId}
                      to="/student/courses/$courseId"
                      params={{ courseId: c.id }}
                      className="flex items-center gap-3.5"
                    >
                      <CourseTile course={c} size={52} />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span className="text-[15px] font-bold">{c.name}</span>
                          <span className="text-[13px] font-bold">
                            {e.plan === "scholarship" ? "Under review" : `${e.progress}%`}
                          </span>
                        </div>
                        <Progress value={e.progress} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No courses yet"
                body="Enroll in a course to track your progress here."
                action={
                  <Link to="/student/explore" className="font-bold text-[#D7372C]">
                    Browse courses
                  </Link>
                }
              />
            )}
          </Card>
        </div>
        <div className="flex flex-col gap-5">
          <Card>
            <SectionTitle title="Quiz history" />
            {attempts.length ? (
              attempts.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between border-t border-border py-2.5 text-sm"
                >
                  <span className="font-semibold">
                    {allQuizzes.find((q) => q.id === a.quizId)?.title}
                  </span>
                  <Pill tone={a.score >= 70 ? "green" : "red"}>{a.score}%</Pill>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No quizzes yet.{" "}
                <Link to="/student/quizzes" className="font-bold text-[#D7372C]">
                  Try one
                </Link>
              </p>
            )}
          </Card>
          <Card>
            <SectionTitle title="My materials" />
            {owned.length ? (
              owned.map((id) => {
                const m = materialById(id)!;
                return (
                  <div key={id} className="flex items-center gap-3 border-t border-border py-2.5">
                    <span className="flex flex-1 flex-col">
                      <span className="text-sm font-bold">{m.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.type} · {naira(m.price)}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Download ${m.title}`}
                      title="Download link coming soon"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing yet.{" "}
                <Link to="/student/store" className="font-bold text-[#D7372C]">
                  Visit the store
                </Link>
              </p>
            )}
          </Card>
          <Card>
            <SectionTitle title="Account" />
            {[
              ["Email", user.email],
              ["Phone", user.phone || "—"],
              ["Level", user.level || "—"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 border-t border-border py-2.5 text-sm"
              >
                <span className="text-muted-foreground">{k}</span>
                <span className="truncate font-semibold">{v}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="mt-2 flex h-12 w-full items-center gap-2.5 border-t border-border text-[15px] font-semibold text-[#D7372C]"
            >
              <LogOut size={18} /> Log out
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

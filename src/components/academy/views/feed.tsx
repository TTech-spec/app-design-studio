import { Link } from "@tanstack/react-router";
import { Code2, Image as ImageIcon, Link2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { EVENTS, POSTS, TRENDING_SKILLS, initialsOf, type Post } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, btn, Card, ChipTabs, EmptyState, PageTitle, PostCard, SectionTitle } from "../ui";

const TOPICS = ["All", "AI", "Design", "Data", "Security", "Jobs", "Events"] as const;
type Topic = (typeof TOPICS)[number];

export function FeedView({ role }: { role: "student" | "tutor" }) {
  const { user, posts, addPost, quizById } = useAcademy();
  const [topic, setTopic] = useState<Topic>("All");
  const [draft, setDraft] = useState("");
  const [draftTopic, setDraftTopic] = useState<Post["topic"]>("Design");
  const all = [...posts, ...POSTS];
  const shown =
    topic === "All" ? all : all.filter((p) => p.topic === topic || (topic === "Events" && p.event));
  const name = user?.name ?? "Guest";

  const publish = () => {
    if (!draft.trim()) return;
    addPost({
      author: name,
      initials: initialsOf(name),
      color: role === "tutor" ? "#1a3d72" : "#EF4136",
      role: role === "tutor" ? "Tutor" : "Student",
      topic: draftTopic,
      text: draft.trim(),
    });
    setDraft("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        <PageTitle
          title="Home"
          sub="Tech news, new skills to learn and updates from tutors and students."
        />
        <Card className="p-4">
          <div className="flex gap-3">
            <Avatar
              initials={initialsOf(name)}
              color={role === "tutor" ? "#1a3d72" : "#EF4136"}
              size={44}
            />
            <label className="flex flex-1">
              <span className="sr-only">New post</span>
              <textarea
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a tech update, a win or a question…"
                className="w-full resize-none py-2.5 text-[15px] leading-relaxed outline-none placeholder:text-[#8a97b3]"
              />
            </label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
            {[
              { icon: ImageIcon, label: "Image" },
              { icon: Code2, label: "Code" },
              { icon: Link2, label: "Link" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-surface px-3 text-[13px] font-semibold"
                title="Coming soon"
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <label className="ml-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span className="sr-only">Topic</span>
              <select
                value={draftTopic}
                onChange={(e) => setDraftTopic(e.target.value as Post["topic"])}
                className="h-10 rounded-[10px] border border-border bg-white px-2 text-[13px] font-semibold text-primary"
              >
                {TOPICS.filter((t) => t !== "All").map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <div className="flex-1" />
            <button
              type="button"
              onClick={publish}
              disabled={!draft.trim()}
              className={btn.primary + " h-10"}
            >
              Post
            </button>
          </div>
        </Card>
        <ChipTabs items={TOPICS} value={topic} onChange={setTopic} label="Filter posts" />
        {shown.length ? (
          shown.map((p) => (
            <PostCard key={p.id} post={p} quiz={p.quizId ? quizById(p.quizId) : undefined} />
          ))
        ) : (
          <EmptyState
            title="No posts here yet"
            body="Be the first to share something on this topic."
          />
        )}
      </div>
      <aside className="flex flex-col gap-4">
        <Card>
          <SectionTitle
            title="New skills to learn"
            action={role === "student" ? <Link to="/student/explore">Explore</Link> : undefined}
          />
          <div className="flex flex-col gap-3">
            {TRENDING_SKILLS.map((s) => (
              <Link
                key={s.name}
                to="/student/search"
                search={{ q: s.name }}
                className="flex items-center gap-3 rounded-xl hover:bg-surface"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-soft">
                  <TrendingUp size={16} />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{s.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.topic} · searches {s.growth} this month
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle title="Upcoming events" />
          <div className="flex flex-col gap-3.5">
            {EVENTS.map((e) => (
              <div key={e.title} className="flex items-center gap-3">
                <span className="flex h-[52px] w-12 flex-col items-center justify-center rounded-xl bg-primary-soft">
                  <span className="text-[11px] font-bold text-[#D7372C]">{e.month}</span>
                  <span className="text-lg font-extrabold leading-none">{e.day}</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{e.title}</span>
                  <span className="text-xs text-muted-foreground">{e.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

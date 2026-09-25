import {
  Link as LinkIcon,
  Check,
  Home,
  Linkedin,
  Mail,
  MessageCircle,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { COHORTS, encodeQuiz, isBuiltInQuiz, type Quiz } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { btn } from "./ui";

export function quizLink(quiz: Quiz, origin: string, via?: string) {
  const params = new URLSearchParams();
  if (via) params.set("via", via);
  if (!isBuiltInQuiz(quiz.id)) params.set("d", encodeQuiz(quiz));
  const qs = params.toString();
  return `${origin}/q/${quiz.id}${qs ? `?${qs}` : ""}`;
}

export function ShareQuizDialog({
  quiz,
  open,
  onClose,
  justPublished = false,
}: {
  quiz: Quiz;
  open: boolean;
  onClose: () => void;
  justPublished?: boolean;
}) {
  const { setShare, addPost, user } = useAcademy();
  const [cohorts, setCohorts] = useState<string[]>(quiz.cohorts);
  const [openToAll, setOpenToAll] = useState(quiz.openToAll);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  useEffect(() => {
    if (!open) return;
    setCohorts(quiz.cohorts);
    setOpenToAll(quiz.openToAll);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, quiz, onClose]);

  if (!open) return null;

  const persist = (c = cohorts, o = openToAll) => setShare(quiz.id, { cohorts: c, openToAll: o });
  const toggleCohort = (id: string) => {
    const next = cohorts.includes(id) ? cohorts.filter((x) => x !== id) : [...cohorts, id];
    setCohorts(next);
    persist(next, openToAll);
  };
  const toggleOpen = () => {
    setOpenToAll(!openToAll);
    persist(cohorts, !openToAll);
  };
  const text = `Try my free quiz on DarlTech Academy: ${quiz.title}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quizLink(quiz, origin));
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn’t copy. Select the link and copy it manually.");
    }
  };
  const channels = [
    {
      label: "Tech feed",
      icon: Home,
      primary: true,
      onClick: () => {
        addPost({
          author: user?.name ?? "Tunde Bakare",
          initials: (user?.name ?? "Tunde Bakare")
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join(""),
          color: "#1a3d72",
          role: "Tutor",
          topic: "Design",
          text: `New free quiz: ${quiz.title}. ${quiz.questions.length} questions — take it and share your score!`,
          quizId: quiz.id,
        });
        toast.success("Posted to the tech feed");
      },
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${quizLink(quiz, origin, "WhatsApp")}`)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(quizLink(quiz, origin, "LinkedIn"))}`,
    },
    {
      label: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(quizLink(quiz, origin, "X"))}`,
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(quiz.title)}&body=${encodeURIComponent(`${text}\n\n${quizLink(quiz, origin, "Email")}`)}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      className="academy fixed inset-0 z-50 flex items-end justify-center bg-primary/60 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 md:max-w-[680px] md:rounded-3xl md:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-[#c9d1e2] md:hidden" />
        <div className="flex items-start gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e3f3ea] text-[#16794a]">
            <Check size={24} strokeWidth={3} />
          </span>
          <div className="flex-1">
            <h2 id="share-title" className="text-xl font-extrabold md:text-[22px]">
              {justPublished ? "Quiz published. Now share it." : "Share this quiz"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {quiz.title} · {quiz.module}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-sm font-bold">Send to your students</legend>
          <div className="flex flex-col gap-2">
            {COHORTS.map((c) => {
              const on = cohorts.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5",
                    on ? "border-primary bg-[#f3f6fb]" : "border-border",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleCohort(c.id)}
                    className="h-5 w-5 accent-[#0E2A54]"
                  />
                  <span className="flex-1 text-sm font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.students} students</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 flex items-start gap-3.5 rounded-2xl bg-surface p-4">
          <div className="flex-1">
            <p id="open-label" className="text-sm font-bold">
              Open to online learners
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Anyone with the link can take this quiz, even if they aren’t enrolled. They’re invited
              to join DarlTech free to save their score.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={openToAll}
            aria-labelledby="open-label"
            onClick={toggleOpen}
            className={cn(
              "relative h-[30px] w-[52px] shrink-0 rounded-full transition",
              openToAll ? "bg-[#16794a]" : "bg-[#c9d1e2]",
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] h-6 w-6 rounded-full bg-white transition-all",
                openToAll ? "left-[25px]" : "left-[3px]",
              )}
            />
          </button>
        </div>

        <div
          className={cn("mt-5", !openToAll && "pointer-events-none opacity-50")}
          aria-disabled={!openToAll}
        >
          <p className="mb-2.5 text-sm font-bold">Share the link</p>
          <div className="flex gap-2">
            <label className="flex flex-1">
              <span className="sr-only">Quiz link</span>
              <input
                readOnly
                value={quizLink(quiz, origin)}
                onFocus={(e) => e.currentTarget.select()}
                className="h-12 w-full rounded-xl border border-primary-soft bg-surface px-3.5 text-sm outline-none"
              />
            </label>
            <button type="button" onClick={copy} className={cn(btn.primary, "h-12 shrink-0")}>
              {copied ? <Check size={16} /> : <LinkIcon size={16} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-5 gap-2">
            {channels.map((c) => {
              const Icon = c.icon;
              const cls = cn(
                "flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-xl border text-[11px] font-bold md:text-xs",
                c.primary
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white hover:bg-surface",
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                >
                  <Icon size={20} />
                  {c.label}
                </a>
              ) : (
                <button key={c.label} type="button" onClick={c.onClick} className={cls}>
                  <Icon size={20} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-border pt-4">
          <button type="button" onClick={onClose} className={btn.primary}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

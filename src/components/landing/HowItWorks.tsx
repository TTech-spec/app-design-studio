import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Check,
  ChevronLeft,
  CreditCard,
  Download,
  PartyPopper,
  PlayCircle,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/*
 * "How it works" in the style of the blueprint-ui "/ 02 the ease of buying tickets" rows:
 * numbered copy with a highlighted heading next to a tinted tile holding a phone mockup.
 * The floating cards behave like phone notifications: they pop up from below one after
 * another, stack, then clear and pop up again while the tile is on screen.
 */

type Note = { icon: LucideIcon; title: string; body: string; tone?: "red" | "navy" | "green" };

type Step = {
  n: string;
  mark: string;
  rest: string;
  body: string;
  cta: string;
  href: string;
  screen: ReactNode;
  notes: Note[];
};

const STEPS: Step[] = [
  {
    n: "01",
    mark: "creating your account",
    rest: "takes less than two minutes",
    body: "Sign up free as a student, pick the skills you care about and set up your profile. You only pay when you enroll in a course.",
    cta: "Create free account",
    href: "/join",
    screen: <SignUpScreen />,
    notes: [
      { icon: PartyPopper, title: "Welcome to DarlTech!", body: "Your free student account is ready.", tone: "red" },
      { icon: UserRound, title: "Profile complete", body: "Interests: UI/UX Design, Data Analysis", tone: "navy" },
      { icon: Bell, title: "New post from Ada N.", body: "5 Figma tips for beginners", tone: "navy" },
    ],
  },
  {
    n: "02",
    mark: "enrolling in a course",
    rest: "gives you instant access to everything",
    body: "Browse in-demand tech programmes, preview free lessons, then pay your course fee to unlock every module, material and quiz.",
    cta: "Explore the catalogue",
    href: "/catalog",
    screen: <CourseScreen />,
    notes: [
      { icon: CreditCard, title: "Payment received", body: "UI/UX Design · ₦150,000", tone: "green" },
      { icon: BookOpen, title: "You're enrolled!", body: "7 modules unlocked. Start lesson 1.", tone: "red" },
      { icon: Bell, title: "Message from your tutor", body: "Welcome to Cohort 2, see you Monday!", tone: "navy" },
    ],
  },
  {
    n: "03",
    mark: "learning and getting certified",
    rest: "happens at your own pace",
    body: "Watch lessons, take quizzes from your tutors, submit projects and download a certificate you can share on LinkedIn.",
    cta: "Take the tour",
    href: "/tour",
    screen: <ProgressScreen />,
    notes: [
      { icon: Trophy, title: "Quiz passed: 92%", body: "Wireframing basics · Tutor quiz", tone: "green" },
      { icon: BadgeCheck, title: "Course completed", body: "UI/UX Design · 7 of 7 modules", tone: "navy" },
      { icon: Award, title: "Certificate ready", body: "Download or share on LinkedIn", tone: "red" },
    ],
  },
];

const TONES = {
  red: "bg-[#EF4136]/12 text-[#D7372C]",
  navy: "bg-[#e8edf5] text-[#0E2A54]",
  green: "bg-[#16a34a]/12 text-[#15803d]",
};

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-24 bg-white text-[#0E2A54]">
      <div className="mx-auto max-w-[1040px] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p data-animate="fade-up" className="text-xs font-bold uppercase tracking-widest text-[#EF4136]">
            How it works
          </p>
          <h2 data-animate="fade-up" id="how-title" className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Three simple steps to start learning
          </h2>
          <p data-animate="fade-up" className="mt-4 text-lg text-[#5a6a8a]">
            Whether you're a complete beginner or upskilling, DarlTech gets you started in minutes.
          </p>
        </div>

        <div className="mt-16 grid gap-20 md:mt-24 md:gap-28">
          {STEPS.map((step, i) => (
            <StepRow key={step.n} step={step} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepRow({ step, reverse }: { step: Step; reverse: boolean }) {
  const reduce = useReducedMotion();
  return (
    <article
      className={`grid items-center gap-10 md:gap-20 ${reverse ? "md:grid-cols-[1fr_1.08fr]" : "md:grid-cols-[1.08fr_1fr]"}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`min-w-0 px-1 ${reverse ? "md:order-2" : ""}`}
      >
        <span className="mb-5 block text-base font-semibold text-[#EF4136] md:mb-6 md:text-lg">
          / {step.n}
        </span>
        <h3 className="mb-5 text-[26px] font-bold leading-[1.45] md:text-[30px]">
          <HighlightMark text={step.mark} /> {step.rest}
        </h3>
        <p className="mb-6 max-w-[400px] text-sm leading-[1.8] text-[#5a6a8a]">{step.body}</p>
        <a
          href={step.href}
          className="inline-flex h-10 items-center rounded-full border border-[#dde3ef] px-5 text-[13px] font-semibold transition hover:border-[#0E2A54] hover:bg-[#0E2A54] hover:text-white"
        >
          {step.cta}
        </a>
      </motion.div>
      <PhoneTile screen={step.screen} notes={step.notes} reverse={reverse} />
    </article>
  );
}

/** Red highlighter that sweeps across the words when the heading scrolls into view. */
function HighlightMark({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.mark
      className="bg-transparent bg-no-repeat px-[3px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{ backgroundImage: "linear-gradient(#EF4136, #EF4136)" }}
      initial={reduce ? false : { backgroundSize: "0% 100%", color: "#0E2A54" }}
      whileInView={{ backgroundSize: "100% 100%", color: "#FFFFFF" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
    >
      {text}
    </motion.mark>
  );
}

const NOTE_GAP_MS = 900;
const HOLD_MS = 3200;

function PhoneTile({ screen, notes, reverse }: { screen: ReactNode; notes: Note[]; reverse: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  // how many notifications are currently showing; cycles 0 → notes.length → 0 while on screen
  const [shown, setShown] = useState(reduce ? notes.length : 0);

  useEffect(() => {
    if (reduce) {
      setShown(notes.length);
      return;
    }
    if (!inView) return;
    const t = setTimeout(
      () => setShown((s) => (s >= notes.length ? 0 : s + 1)),
      shown === 0 ? 500 : shown >= notes.length ? HOLD_MS : NOTE_GAP_MS,
    );
    return () => clearTimeout(t);
  }, [inView, shown, notes.length, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative isolate mx-auto flex aspect-square w-full max-w-[410px] items-end justify-center overflow-hidden rounded-[24px] bg-[#c9d4ea] md:rounded-[32px] ${reverse ? "md:order-1" : ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[20%] left-[37%] -z-10 h-[140%] w-[100px] rotate-[24deg] bg-white opacity-30"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-[#EF4136] opacity-15"
      />

      {/* phone */}
      <div className="relative mb-[-6%] h-[94%] w-[66%] rounded-[34px] border-[7px] border-[#0E2A54] bg-white px-3 pb-4 pt-5 text-[#0E2A54] shadow-[0_12px_26px_rgba(14,42,84,0.18)]">
        <span className="absolute left-[28%] top-[-1px] h-4 w-[44%] rounded-b-xl bg-[#0E2A54]" />
        <div className="mb-3 flex justify-between text-[8px] font-semibold">
          <span>9:41</span>
          <span>▮▮▮ ▰</span>
        </div>
        {screen}
      </div>

      {/* notification stack: newest pops up from below, older ones slide up */}
      <div className="absolute inset-x-[5%] bottom-[5%] flex flex-col gap-2" aria-live="off">
        <AnimatePresence initial={false}>
          {notes.slice(0, shown).map((note) => (
            <motion.div
              key={note.title}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 70, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <NoteCard note={note} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const Icon = note.icon;
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/70 bg-white/95 p-2.5 shadow-[0_12px_26px_rgba(14,42,84,0.16)] backdrop-blur md:p-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${TONES[note.tone ?? "navy"]}`}>
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-[12px] font-bold md:text-[13px]">{note.title}</strong>
        <small className="block truncate text-[10px] text-[#5a6a8a] md:text-[11px]">{note.body}</small>
      </span>
      <span className="self-start text-[9px] font-medium text-[#8a97b3]">now</span>
    </div>
  );
}

/* ---------- small phone screens ---------- */

function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <ChevronLeft size={13} />
      <strong>{title}</strong>
      <span>•••</span>
    </div>
  );
}

function SignUpScreen() {
  return (
    <div>
      <ScreenHeader title="Create account" />
      <p className="mb-3 mt-1.5 text-center text-[7px] text-[#8a97b3]">Step 1 of 3 · It's free</p>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-[#e8edf5]">
        <div className="h-full w-1/3 rounded-full bg-[#0E2A54]" />
      </div>
      {["Full name", "Email address", "Phone number"].map((label) => (
        <div key={label} className="mb-2">
          <p className="mb-1 text-[7px] font-semibold">{label}</p>
          <div className="h-5 rounded border border-[#dde3ef] bg-[#f4f6fb]" />
        </div>
      ))}
      <div className="mt-3 rounded bg-[#D7372C] py-2 text-center text-[8px] font-semibold text-white">
        Continue
      </div>
    </div>
  );
}

function CourseScreen() {
  return (
    <div>
      <ScreenHeader title="UI/UX Design" />
      <div className="mt-2 flex h-14 items-center justify-center gap-2 rounded bg-[#e8edf5] text-[9px] font-bold">
        <PlayCircle size={20} className="text-[#EF4136]" /> Free preview
      </div>
      <p className="mt-3 text-[8px] font-bold">What you'll learn</p>
      {["Design thinking", "Wireframing", "Prototyping in Figma"].map((m) => (
        <div key={m} className="mt-1.5 flex items-center gap-1.5 rounded border border-[#dde3ef] px-1.5 py-1.5 text-[7px]">
          <Check size={9} className="text-[#EF4136]" /> {m}
        </div>
      ))}
      <div className="mt-3 flex justify-between text-[8px]">
        <span>Course fee</span>
        <strong>₦150,000</strong>
      </div>
      <div className="mt-2 rounded bg-[#D7372C] py-2 text-center text-[8px] font-semibold text-white">
        Enroll now
      </div>
    </div>
  );
}

function ProgressScreen() {
  return (
    <div>
      <ScreenHeader title="My learning" />
      <div className="mt-3 rounded bg-[#0E2A54] p-2 text-white">
        <p className="text-[7px] text-white/70">UI/UX Design</p>
        <p className="text-[9px] font-bold">Module 7 · Usability testing</p>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[92%] rounded-full bg-[#EF4136]" />
        </div>
      </div>
      {[
        ["Prototyping in Figma", "Done"],
        ["Tutor quiz", "92%"],
        ["Final project", "Passed"],
      ].map(([a, b]) => (
        <div key={a} className="mt-1.5 flex justify-between rounded border border-[#dde3ef] px-1.5 py-1.5 text-[7px]">
          {a} <strong className="text-[#D7372C]">{b}</strong>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-center gap-1 rounded bg-[#D7372C] py-2 text-[8px] font-semibold text-white">
        <Download size={9} /> Download certificate
      </div>
    </div>
  );
}

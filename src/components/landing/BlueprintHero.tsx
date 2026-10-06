import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, Play, Star } from "lucide-react";
import student from "@/assets/hero-student.webp";

/*
 * Landing hero in the style of the blueprint-ui repo: a centred headline on a faint grid,
 * pill buttons, social proof, and a student photo in a circle with floating cards.
 * Colours are DarlTech's navy and red instead of the blueprint's lime.
 */

const AVATARS = [
  { init: "AO", color: "#0E2A54" },
  { init: "FA", color: "#EF4136" },
  { init: "CN", color: "#1a3d72" },
  { init: "MI", color: "#1f6b5e" },
];

const pill =
  "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition md:h-12 md:text-[15px]";

export function BlueprintHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-white font-display text-[#0E2A54]"
      style={{
        backgroundImage:
          "linear-gradient(#f1f3f8 1px, transparent 1px), linear-gradient(90deg, #f1f3f8 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 pt-14 sm:px-8 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#e8edf5] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#5a6a8a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4136]" /> LEARN · BUILD · GET HIRED
          </span>
          <h1
            id="hero-title"
            className="mx-auto mb-4 mt-5 max-w-[820px] font-display text-[32px] font-bold leading-[1.2] tracking-tight sm:text-[40px] md:text-[48px]"
          >
            Do Extraordinary Things with
            <br className="hidden sm:block" /> In‑Demand Tech Skills
          </h1>
          <p className="mx-auto max-w-[620px] text-sm leading-[1.9] text-[#5a6a8a] md:text-base">
            Learn from expert instructors, build real projects and earn certificates you can share —
            from anywhere in Nigeria.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/join" className={`${pill} bg-[#D7372C] text-white hover:bg-[#b52d24]`}>
              Get started free <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/catalog"
              search={{ q: "" }}
              className={`${pill} border border-[#dde3ef] bg-[#f3f6fb] text-[#0E2A54] hover:bg-[#e8edf5]`}
            >
              Browse courses
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0E2A54]/40">
                <Play className="h-2.5 w-2.5" />
              </span>
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2.5 text-xs text-[#5a6a8a] md:text-[13px]">
            <div className="flex pl-1.5">
              {AVATARS.map((a) => (
                <span
                  key={a.init}
                  aria-hidden="true"
                  className="-ml-1.5 grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white"
                  style={{ background: a.color }}
                >
                  {a.init}
                </span>
              ))}
            </div>
            <span>
              Rated <b className="text-[#0E2A54]">4.9</b> from 1,800+ student reviews
            </span>
          </div>
        </motion.div>

        {/* Student scene */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto mt-10 h-[360px] max-w-[860px] overflow-hidden sm:h-[480px] md:mt-12 md:h-[565px]"
        >
          <div className="absolute left-1/2 top-4 h-[290px] w-[290px] -translate-x-1/2 rounded-full bg-[#e8edf5] sm:h-[400px] sm:w-[400px] md:h-[480px] md:w-[480px]" />
          <img
            src={student}
            alt="Smiling DarlTech student with a backpack checking her course on her phone"
            width={720}
            height={720}
            fetchPriority="high"
            className="absolute bottom-3.5 left-1/2 h-[325px] w-[325px] -translate-x-1/2 object-contain sm:bottom-6 sm:h-[440px] sm:w-[440px] md:h-[510px] md:w-[510px]"
          />

          {/* Floating cards */}
          <div className="absolute left-0 top-[80px] z-10 flex items-center gap-2 rounded-md border border-[#dde3ef] bg-white p-2 text-[10px] leading-tight shadow-[0_5px_24px_rgba(14,42,84,0.08)] sm:left-[60px] sm:top-[120px] sm:p-2.5 md:left-[135px] md:top-[130px] md:text-xs">
            <GraduationCap className="h-5 w-5 text-[#1a3d72] md:h-7 md:w-7" strokeWidth={1.4} />
            <span>
              Get
              <br />
              <strong>Certified</strong>
            </span>
          </div>

          <div className="absolute left-0 top-[250px] z-10 flex items-center gap-2 rounded-md border border-[#dde3ef] bg-white px-2 py-1.5 shadow-[0_5px_24px_rgba(14,42,84,0.08)] sm:left-[20px] sm:top-[330px] md:left-[74px] md:top-[379px] md:px-3 md:py-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0E2A54] text-sm font-black text-white md:h-9 md:w-9 md:text-lg">
              D
            </span>
            <span className="flex flex-col">
              <span className="flex text-[#c98a1a]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-2.5 w-2.5 fill-current md:h-3 md:w-3" />
                ))}
              </span>
              <span className="text-[8px] text-[#5a6a8a] md:text-[10px]">Student reviews</span>
              <strong className="text-[9px] md:text-xs">4.9 average rating</strong>
            </span>
          </div>

          <div className="absolute right-0 top-[165px] z-10 w-[118px] rounded-md border border-[#dde3ef] bg-white p-2.5 shadow-[0_5px_24px_rgba(14,42,84,0.08)] sm:w-[190px] md:right-[28px] md:top-[228px] md:w-[222px] md:p-3.5">
            <div className="flex items-center justify-between text-[8px] text-[#5a6a8a] md:text-[10px]">
              <span>My course progress</span>
              <span className="rounded-full bg-[#0E2A54] px-1.5 py-0.5 text-[7px] font-semibold text-white md:text-[9px]">
                UI/UX
              </span>
            </div>
            <div className="mb-2 mt-1.5 text-base font-bold md:mb-3 md:mt-2.5 md:text-[22px]">
              62%<span className="hidden sm:inline"> complete</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#eef1f8]">
              <div className="h-full w-[62%] rounded-full bg-[#EF4136]" />
            </div>
            <div className="mt-2 flex justify-between gap-1 text-[7px] text-[#5a6a8a] md:mt-3 md:text-[10px]">
              <span className="flex items-center gap-1">
                <BookOpen className="h-2.5 w-2.5 md:h-3 md:w-3" /> Lessons
              </span>
              <span className="flex items-center gap-1">
                <ClipboardCheck className="h-2.5 w-2.5 md:h-3 md:w-3" /> Quizzes
              </span>
              <span>•••</span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-4 rounded-md bg-[#e8edf5] sm:h-7" />
        </motion.div>
      </div>
    </section>
  );
}

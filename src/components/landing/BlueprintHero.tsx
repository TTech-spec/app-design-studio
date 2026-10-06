import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, Play, Star } from "lucide-react";
import { Fragment, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import student from "@/assets/hero-student.webp";

/*
 * Landing hero in the style of the blueprint-ui repo: a centred headline on a faint grid,
 * pill buttons, social proof, and a student photo in a circle with floating cards.
 * Colours are DarlTech's navy and red instead of the blueprint's lime.
 *
 * Motion: a GSAP timeline builds the hero (eyebrow, headline word by word, copy, buttons,
 * circle, photo), then Framer Motion pops the three floating cards in one after another
 * and keeps them gently floating.
 */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const AVATARS = [
  { init: "AO", color: "#0E2A54" },
  { init: "FA", color: "#EF4136" },
  { init: "CN", color: "#1a3d72" },
  { init: "MI", color: "#1f6b5e" },
];

const HEADLINE: string[][] = [
  ["Do", "Extraordinary", "Things", "with"],
  ["In‑Demand", "Tech", "Skills"],
];

const pill =
  "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition md:h-12 md:text-[15px]";

/** When each floating card pops in (seconds), after the GSAP intro has placed the photo. */
const CARD_DELAYS = [1.25, 1.55, 1.85];

function PopCard({
  index,
  className,
  children,
}: {
  index: number;
  className: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const delay = reduce ? 0 : CARD_DELAYS[index];
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 0.4, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay }}
      whileHover={{ scale: 1.06 }}
    >
      <motion.div
        className="rounded-md border border-[#dde3ef] bg-white shadow-[0_8px_28px_rgba(14,42,84,0.12)]"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{
          duration: 4 + index * 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.8,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function BlueprintHero() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-hero='eyebrow']", { y: -14, opacity: 0, duration: 0.5 })
          .from(
            "[data-hero='word']",
            { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.07 },
            "-=0.15",
          )
          .from("[data-hero='copy']", { y: 18, opacity: 0, duration: 0.6 }, "-=0.35")
          .from(
            "[data-hero='actions'] > *",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.3",
          )
          .from("[data-hero='proof']", { opacity: 0, duration: 0.5 }, "-=0.2")
          .from(
            "[data-hero='circle']",
            { scale: 0.3, opacity: 0, duration: 0.9, ease: "back.out(1.5)" },
            0.35,
          )
          .from("[data-hero='photo']", { y: 80, opacity: 0, duration: 0.9 }, 0.55)
          .from(
            "[data-hero='base']",
            { scaleX: 0, duration: 0.8, transformOrigin: "50% 50%" },
            0.6,
          );
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-white font-display text-[#0E2A54]"
      style={{
        backgroundImage:
          "linear-gradient(#f1f3f8 1px, transparent 1px), linear-gradient(90deg, #f1f3f8 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 pt-14 sm:px-8 md:pt-20">
        <div className="text-center">
          <span
            data-hero="eyebrow"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#e8edf5] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#5a6a8a]"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#EF4136]" /> LEARN · BUILD ·
            GET HIRED
          </span>
          <h1
            id="hero-title"
            className="mx-auto mb-4 mt-5 max-w-[820px] font-display text-[32px] font-bold leading-[1.2] tracking-tight sm:text-[40px] md:text-[48px]"
          >
            {HEADLINE.map((line, li) => (
              <Fragment key={li}>
                {li > 0 && <br className="hidden sm:block" />}
                {line.map((w, wi) => (
                  <Fragment key={w}>
                    <span className="inline-block overflow-hidden pb-1 align-bottom">
                      <span data-hero="word" className="inline-block">
                        {w}
                      </span>
                    </span>
                    {(wi < line.length - 1 || li < HEADLINE.length - 1) && " "}
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </h1>
          <p
            data-hero="copy"
            className="mx-auto max-w-[620px] text-sm leading-[1.9] text-[#5a6a8a] md:text-base"
          >
            Learn from expert instructors, build real projects and earn certificates you can share —
            from anywhere in Nigeria.
          </p>
          <div data-hero="actions" className="mt-7 flex flex-wrap justify-center gap-3">
            <motion.a
              href="/join"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`${pill} bg-[#D7372C] text-white shadow-[0_10px_24px_-10px_rgba(215,55,44,0.7)] hover:bg-[#b52d24]`}
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
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
            </motion.div>
          </div>
          <div
            data-hero="proof"
            className="mt-6 flex items-center justify-center gap-2.5 text-xs text-[#5a6a8a] md:text-[13px]"
          >
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
        </div>

        {/* Student scene */}
        <div className="relative mx-auto mt-10 h-[360px] max-w-[860px] overflow-hidden sm:h-[480px] md:mt-12 md:h-[565px]">
          <div
            data-hero="circle"
            className="absolute left-1/2 top-4 h-[290px] w-[290px] -translate-x-1/2 rounded-full bg-[#e8edf5] sm:h-[400px] sm:w-[400px] md:h-[480px] md:w-[480px]"
          />
          <img
            data-hero="photo"
            src={student}
            alt="Smiling DarlTech student with a backpack checking her course on her phone"
            width={720}
            height={720}
            fetchPriority="high"
            className="absolute bottom-3.5 left-1/2 h-[325px] w-[325px] -translate-x-1/2 object-contain sm:bottom-6 sm:h-[440px] sm:w-[440px] md:h-[510px] md:w-[510px]"
          />

          {/* Floating cards — pop in one by one, then float */}
          <PopCard
            index={0}
            className="left-0 top-[80px] sm:left-[60px] sm:top-[120px] md:left-[135px] md:top-[130px]"
          >
            <div className="flex items-center gap-2 p-2 text-[10px] leading-tight sm:p-2.5 md:text-xs">
              <GraduationCap className="h-5 w-5 text-[#1a3d72] md:h-7 md:w-7" strokeWidth={1.4} />
              <span>
                Get
                <br />
                <strong>Certified</strong>
              </span>
            </div>
          </PopCard>

          <PopCard
            index={1}
            className="left-0 top-[250px] sm:left-[20px] sm:top-[330px] md:left-[74px] md:top-[379px]"
          >
            <div className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0E2A54] text-sm font-black text-white md:h-9 md:w-9 md:text-lg">
                D
              </span>
              <span className="flex flex-col">
                <span className="flex text-[#c98a1a]" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      initial={reduce ? false : { scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 14,
                        delay: CARD_DELAYS[1] + 0.25 + i * 0.08,
                      }}
                    >
                      <Star className="h-2.5 w-2.5 fill-current md:h-3 md:w-3" />
                    </motion.span>
                  ))}
                </span>
                <span className="text-[8px] text-[#5a6a8a] md:text-[10px]">Student reviews</span>
                <strong className="text-[9px] md:text-xs">4.9 average rating</strong>
              </span>
            </div>
          </PopCard>

          <PopCard
            index={2}
            className="right-0 top-[165px] w-[118px] sm:w-[190px] md:right-[28px] md:top-[228px] md:w-[222px]"
          >
            <div className="p-2.5 md:p-3.5">
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
                <motion.div
                  className="h-full rounded-full bg-[#EF4136]"
                  initial={reduce ? false : { width: "0%" }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: CARD_DELAYS[2] + 0.3 }}
                />
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
          </PopCard>

          <div
            data-hero="base"
            className="absolute inset-x-0 bottom-0 h-4 rounded-md bg-[#e8edf5] sm:h-7"
          />
        </div>
      </div>
    </section>
  );
}

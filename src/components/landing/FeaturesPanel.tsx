import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  GraduationCap,
  MessageCircle,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

/*
 * "Why Choose DarlTech Academy?" in the style of the blueprint-ui "OUR FEATURES" panel:
 * a tinted rounded panel with angled background shapes and white feature cards,
 * each with an outlined icon, title, text and a small pill button.
 */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const FEATURES: { icon: LucideIcon; title: string; body: string; cta: string; href: string }[] = [
  {
    icon: Users,
    title: "Expert Instructors",
    body: "Learn directly from industry practitioners with real-world experience in their field.",
    cta: "Browse courses",
    href: "/catalog",
  },
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    body: "Every course follows a focused, module-by-module structure designed to take you from zero to job-ready.",
    cta: "See the catalogue",
    href: "/catalog",
  },
  {
    icon: Award,
    title: "Industry Certificates",
    body: "Earn a recognized DarlTech Academy certificate upon completion — downloadable and shareable on LinkedIn.",
    cta: "Get started",
    href: "/join",
  },
  {
    icon: TrendingUp,
    title: "Progress Dashboard",
    body: "Track your completion, upcoming deadlines, and quiz scores all from one clean student dashboard.",
    cta: "Take the tour",
    href: "/tour",
  },
  {
    icon: MessageCircle,
    title: "Discussion Threads",
    body: "Ask questions, share ideas, and collaborate with fellow students through in-course discussion boards.",
    cta: "Join the community",
    href: "/join",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Program",
    body: "Apply for financial aid on any course. Pay a ₦30,000 acceptance fee and let our team review your application.",
    cta: "Apply now",
    href: "/join/student",
  },
];

export function FeaturesPanel() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="mx-auto max-w-[1200px] scroll-mt-24 px-4 py-16 font-display sm:px-8 md:py-24"
    >
      <div className="relative overflow-hidden rounded-[18px] bg-[#e8edf5] px-6 py-9 text-[#0E2A54] md:rounded-3xl md:px-14 md:py-20">
        {/* angled background shapes */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div data-parallax="0.25" className="absolute inset-0">
            <span className="absolute -right-60 top-[120px] h-[900px] w-[340px] -skew-y-[20deg] rounded-[48px] bg-[#c9d4ea] opacity-60 md:-right-40 md:h-[440px]" />
          </div>
          <div data-parallax="0.12" className="absolute inset-0">
            <span className="absolute right-[120px] top-[360px] h-[440px] w-[340px] -skew-y-[20deg] rounded-[48px] bg-[#c9d4ea] opacity-60 md:right-[205px] md:top-[215px]" />
          </div>
          <div data-parallax="0.4" className="absolute inset-0">
            <span className="absolute right-10 top-[70px] h-[440px] w-[180px] skew-y-[20deg] rounded-[48px] bg-[#f5b5ae] opacity-30 md:right-[225px]" />
          </div>
        </div>

        <span
          data-animate="fade-up"
          className="relative inline-flex items-center gap-1.5 rounded-md bg-[#EF4136]/12 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#5a6a8a]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#EF4136]" /> OUR FEATURES
        </span>
        <h2
          data-animate="fade-up"
          id="features-title"
          className="relative mb-8 mt-5 font-display text-[25px] font-bold tracking-tight md:mb-14 md:mt-6 md:text-[34px]"
        >
          Why Choose DarlTech Academy?
        </h2>

        <div className="relative grid gap-4 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body, cta, href }, i) => (
            <motion.article
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="flex min-h-[230px] flex-col items-start rounded-lg bg-white p-6 md:min-h-[281px] md:px-6 md:py-7"
            >
              <Icon
                className="h-9 w-8 text-[#EF4136]"
                strokeWidth={1.5}
                style={{ filter: "drop-shadow(1px 1px 0 #0E2A54)" }}
                aria-hidden="true"
              />
              <h3 className="mb-3 mt-4 font-display text-base font-bold md:mb-4 md:mt-6">
                {title}
              </h3>
              <p className="mb-6 text-[13px] leading-[1.9] text-[#5a6a8a]">{body}</p>
              <a
                href={href}
                className="mt-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-[#D7372C] px-4 text-xs font-semibold text-white transition hover:bg-[#b52d24]"
              >
                {cta} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

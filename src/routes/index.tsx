import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  FileText,
  FolderKanban,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Instagram,
  Laptop,
  Linkedin,
  Menu,
  MessageCircle,
  MessageSquare,
  Monitor,
  Palette,
  PenTool,
  Play,
  Plus,
  Search,
  Server,
  ShieldCheck,
  Star,
  Terminal,
  Users,
  UserCheck,
  Award,
  X,
  Cpu,
} from "lucide-react";
import heroStudent from "@/assets/hero-student.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DarlTech Academy — Do Extraordinary Things" },
      {
        name: "description",
        content:
          "DarlTech Academy provides practical, hands-on tech education to help you gain real skills, build projects, and unlock new opportunities in the digital economy.",
      },
      { property: "og:title", content: "DarlTech Academy — Build In-Demand Tech Skills" },
      {
        property: "og:description",
        content:
          "Apply for Cohort 2. Expert mentors, project-based learning and certificates of completion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const RED = "#E1251B";
const NAVY = "#0B1F4D";

const IMG = {
  hero: heroStudent,
  why: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
  scholarship:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=70",
  cohort:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=70",
};

const NAV = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#tracks" },
  { label: "Scholarship", href: "#scholarship" },
  { label: "About", href: "#why" },
  { label: "Resources", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const TRACKS = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Build modern websites and web applications.",
    level: "Beginner",
    weeks: 12,
  },
  {
    icon: Server,
    title: "Backend Development",
    desc: "Develop scalable server-side applications.",
    level: "Intermediate",
    weeks: 12,
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    desc: "Design intuitive and beautiful user experiences.",
    level: "Beginner",
    weeks: 10,
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    desc: "Turn data into actionable insights.",
    level: "Beginner",
    weeks: 10,
  },
  {
    icon: Database,
    title: "Data Science",
    desc: "Build models and solve real-world problems.",
    level: "Intermediate",
    weeks: 12,
  },
  {
    icon: Cpu,
    title: "AI Automation",
    desc: "Automate tasks with AI tools and workflows.",
    level: "Intermediate",
    weeks: 10,
  },
  {
    icon: Cloud,
    title: "DevOps & Cloud Computing",
    desc: "Deploy, manage and scale apps in the cloud.",
    level: "Intermediate",
    weeks: 12,
  },
  {
    icon: ShieldCheck,
    title: "Cyber Security",
    desc: "Protect systems and defend against threats.",
    level: "Intermediate",
    weeks: 12,
  },
  {
    icon: Terminal,
    title: "Python Development",
    desc: "Build versatile applications with Python.",
    level: "Beginner",
    weeks: 10,
  },
  {
    icon: FolderKanban,
    title: "Product Management",
    desc: "Turn ideas into successful products.",
    level: "Intermediate",
    weeks: 10,
  },
  {
    icon: Palette,
    title: "Graphics Design",
    desc: "Create stunning visual content and brands.",
    level: "Beginner",
    weeks: 8,
  },
  {
    icon: Bot,
    title: "Robotics Engineering",
    desc: "Build and program robotic systems.",
    level: "Advanced",
    weeks: 12,
  },
];

const ADVANTAGES = [
  {
    icon: Briefcase,
    title: "Practical, Project-Based Learning",
    desc: "Work on real-world projects from day one.",
  },
  {
    icon: UserCheck,
    title: "Expert-Led Training",
    desc: "Learn from experienced industry professionals.",
  },
  { icon: Globe2, title: "Flexible Learning", desc: "Study at your own pace, from anywhere." },
  {
    icon: HeartHandshake,
    title: "Mentorship & Support",
    desc: "Get guidance and feedback at every step.",
  },
  {
    icon: Users,
    title: "Community Access",
    desc: "Join a growing network of learners and alumni.",
  },
  {
    icon: FileText,
    title: "Career Support",
    desc: "Get help with your CV, portfolio and job readiness.",
  },
];

const STEPS = [
  { title: "Choose a Track", desc: "Explore our courses and pick the one that fits your goals." },
  {
    title: "Apply or Enrol",
    desc: "Complete the application and make your commitment payment (if eligible).",
  },
  { title: "Learn & Build", desc: "Access your courses, join live sessions and work on projects." },
  { title: "Get Certified", desc: "Complete the programme and receive your certificate." },
];

const TESTIMONIALS = [
  {
    name: "Emmanuel Okafor",
    role: "Web Development Graduate",
    quote:
      "DarlTech Academy gave me the confidence and skills I needed to switch careers. The hands-on projects and mentor support were game changers!",
  },
  {
    name: "Aisha Bello",
    role: "Data Analytics Graduate",
    quote:
      "The learning experience is well structured and easy to follow. I went from a beginner to building real projects in just a few months!",
  },
  {
    name: "Samuel Adeyemi",
    role: "Cybersecurity Graduate",
    quote:
      "The tutors are amazing and always available to help. I'm now working on real-world projects and feel ready for the job market!",
  },
  {
    name: "Chiamaka Eze",
    role: "UI/UX Design Graduate",
    quote:
      "I built a full portfolio during the programme and landed my first freelance clients before I even graduated.",
  },
];

const FAQS = [
  {
    q: "Can I apply if I have no prior tech experience?",
    a: "Yes. Many of our tracks are beginner-friendly and start from the fundamentals.",
  },
  {
    q: "What is the duration of each course?",
    a: "Most tracks run between 8 and 12 weeks, depending on the track and level.",
  },
  {
    q: "How much does the Cohort 2 scholarship cost?",
    a: "Scholarship recipients pay a ₦50,000 commitment fee. The scholarship covers your tuition for the selected track.",
  },
  {
    q: "Is the ₦50,000 commitment fee refundable?",
    a: "No. The commitment fee is non-refundable and secures your slot in the programme.",
  },
  {
    q: "Do you provide certificates?",
    a: "Yes. You receive a certificate of completion after finishing the programme and its projects.",
  },
];

function useLandingAnimations(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-img]", { scale: 1.15, opacity: 0, duration: 1.6 })
        .from("[data-hero] > *", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.2);
      // Slow parallax on the hero photo
      gsap.to("[data-hero-img]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-img]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // Section headings and grids reveal on scroll
      gsap.utils.toArray<HTMLElement>("main section").forEach((sec) => {
        const kids = sec.querySelectorAll(".grid > *, h2, [data-reveal]");
        if (!kids.length || sec.querySelector("[data-hero]")) return;
        gsap.from(kids, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: sec, start: "top 80%", once: true },
        });
      });
      // Big money figure counts up
      const fee = el.querySelector<HTMLElement>("[data-count]");
      if (fee) {
        const o = { n: 0 };
        gsap.to(o, {
          n: 50000,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: fee, start: "top 85%", once: true },
          onUpdate: () => {
            fee.textContent = `₦${Math.round(o.n).toLocaleString()}`;
          },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [root]);
}

function Landing() {
  const root = useRef<HTMLDivElement>(null);
  useLandingAnimations(root);
  return (
    <div ref={root} className="min-h-screen bg-white text-slate-900 antialiased">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Tracks />
        <Why />
        <Scholarship />
        <Steps />
        <Testimonials />
        <CohortBanner />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- shared bits ---------- */

function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: RED }}>
      {children}
    </p>
  );
}

function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-2 text-2xl font-extrabold sm:text-3xl ${className}`} style={{ color: NAVY }}>
      {children}
    </h2>
  );
}

function PrimaryBtn({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 ${className}`}
      style={{ backgroundColor: RED }}
    >
      {children}
    </a>
  );
}

function OutlineBtn({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <a
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-6 text-sm font-semibold transition ${light ? "border-white/60 text-white hover:bg-white/10" : "border-[#0B1F4D] text-[#0B1F4D] hover:bg-slate-50"}`}
    >
      {children}
    </a>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-2 shrink-0">
      <span
        className="grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white"
        style={{ backgroundColor: RED }}
      >
        DT
      </span>
      <span
        className={`text-sm font-extrabold leading-tight ${light ? "text-white" : ""}`}
        style={light ? undefined : { color: NAVY }}
      >
        DarlTech
        <br />
        Academy
      </span>
      <span
        className={`ml-2 hidden border-l pl-3 text-xs sm:inline ${light ? "border-white/30 text-white/70" : "border-slate-200 text-slate-500"}`}
      >
        Do Extraordinary Things
      </span>
    </a>
  );
}

function Script({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -8, scale: 0.8 }}
      whileInView={{ opacity: 1, rotate: -4, scale: 1 }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        default: { duration: 0.8 },
      }}
      viewport={{ once: true }}
      className={`font-serif italic leading-tight text-white drop-shadow ${className}`}
      style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
    >
      Learn
      <br />
      &nbsp;&nbsp;Build
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;Grow
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-1 h-1 w-16 origin-left rounded-full"
        style={{ backgroundColor: RED }}
      />
    </motion.div>
  );
}

/* ---------- header ---------- */

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium transition hover:text-[#E1251B] ${i === 0 ? "text-[#E1251B] underline decoration-2 underline-offset-8" : "text-slate-700"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="/student/search"
            aria-label="Search"
            className="text-slate-600 hover:text-slate-900"
          >
            <Search className="h-5 w-5" />
          </a>
          <PrimaryBtn href="/join" className="h-10">
            Apply for Cohort 2
          </PrimaryBtn>
        </div>
        <button className="lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <PrimaryBtn href="/join" className="mt-2">
              Apply for Cohort 2
            </PrimaryBtn>
          </Container>
        </div>
      )}
    </motion.header>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY }}>
      <img
        data-hero-img
        src={IMG.hero}
        alt="Student learning on a laptop"
        className="absolute inset-0 h-full w-full object-cover object-right opacity-90"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY}ee 38%, ${NAVY}66 65%, transparent 100%)`,
        }}
      />
      <Container className="relative grid min-h-[560px] items-center py-16 lg:grid-cols-2">
        <div data-hero className="max-w-xl text-white">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
            style={{ backgroundColor: RED }}
          >
            Cohort 2 <ArrowRight className="h-3 w-3" /> Applications Open
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            Build In-Demand Tech Skills for a Brighter Future
          </h1>
          <p className="mt-5 text-base text-white/85 sm:text-lg">
            DarlTech Academy provides practical, hands-on tech education to help you gain real
            skills, build projects, and unlock new opportunities in the digital economy.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-4 text-xs text-white/90 sm:grid-cols-4">
            {[
              [Monitor, "100% Online Learning"],
              [Laptop, "Practical Projects"],
              [Users, "Expert Mentors"],
              [Award, "Certificate of Completion"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Monitor;
              return (
                <div key={label as string} className="flex items-center gap-2">
                  <I className="h-5 w-5 shrink-0" /> <span>{label as string}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryBtn href="/join">
              Explore Cohort 2 <ArrowRight className="h-4 w-4" />
            </PrimaryBtn>
            <OutlineBtn href="#tracks" light>
              View Our Courses
            </OutlineBtn>
          </div>
        </div>
        <Script className="absolute right-10 top-12 hidden text-4xl lg:block" />
      </Container>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { icon: GraduationCap, v: "1,500+", l: "Graduates & Counting" },
    { icon: Star, v: "4.8/5", l: "Average Student Rating" },
    { icon: Briefcase, v: "100%", l: "Project Based Learning" },
    { icon: Users, v: "Multiple", l: "Career Opportunities" },
  ];
  return (
    <Container className="relative z-10 -mt-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
        <p className="text-sm font-bold" style={{ color: NAVY }}>
          Trusted by Aspiring Tech Professionals
        </p>
        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100"
                style={{ color: NAVY }}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold" style={{ color: NAVY }}>
                  {s.v}
                </p>
                <p className="text-xs text-slate-500">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

/* ---------- tracks ---------- */

function Tracks() {
  return (
    <section id="tracks" className="scroll-mt-20 py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Course Catalogue</Eyebrow>
            <H2>Our Tech Tracks</H2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Choose from a range of in-demand tech skills and start your journey towards a
              future-ready career.
            </p>
          </div>
          <a
            href="/student/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: NAVY }}
          >
            View all courses <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t) => (
            <a
              key={t.title}
              href="/student/explore"
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-lg bg-red-50"
                style={{ color: RED }}
              >
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold" style={{ color: NAVY }}>
                {t.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{t.desc}</p>
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {t.level} &nbsp;•&nbsp; {t.weeks} Weeks
              </p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- why ---------- */

function Why() {
  return (
    <section id="why" className="scroll-mt-20 bg-slate-50 py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow>The DarlTech Advantage</Eyebrow>
          <H2>Why Learn With DarlTech?</H2>
          <p className="mt-2 text-sm text-slate-600">
            We provide the tools, support and structure you need to succeed in the tech industry.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((a) => (
              <div key={a.title}>
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg bg-red-50"
                  style={{ color: RED }}
                >
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold" style={{ color: NAVY }}>
                  {a.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={IMG.why}
            alt="Student learning online with headphones"
            className="h-[420px] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg sm:right-auto">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: NAVY }}
            >
              <Play className="h-4 w-4 fill-white text-white" />
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: NAVY }}>
                Learn from anywhere
              </p>
              <p className="text-xs text-slate-500">
                Flexible, accessible, and designed for your success.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- scholarship ---------- */

function Scholarship() {
  const points = [
    {
      t: "Eligibility & Selection",
      d: "Open to motivated individuals with a passion for tech. Selection is based on your application, attitude and potential.",
    },
    {
      t: "What the Scholarship Covers",
      d: "Covers your tuition for the selected track. Some additional costs may apply (e.g. certification, materials).",
    },
    {
      t: "Commitment Fee Terms",
      d: "₦50,000 is due upon acceptance. It is non-refundable and secures your slot in the programme.",
    },
  ];
  return (
    <section id="scholarship" className="scroll-mt-20 py-20">
      <Container>
        <div className="overflow-hidden rounded-3xl text-white" style={{ backgroundColor: NAVY }}>
          <div className="grid items-center lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: RED }}
              >
                Scholarship Programme
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                DarlTech Academy Cohort 2 Scholarship
              </h2>
              <p className="mt-4 text-white/80">
                We're committed to empowering the next generation of tech talent. Our scholarship
                programme helps deserving individuals access quality tech education and build
                brighter futures.
              </p>
              <div className="mt-7 max-w-sm rounded-xl bg-white p-5 text-slate-900">
                <p className="text-xs font-bold uppercase" style={{ color: RED }}>
                  Commitment Fee
                </p>
                <p data-count className="mt-1 text-4xl font-extrabold" style={{ color: RED }}>
                  ₦50,000
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Cohort 2 fee. Review the terms, eligibility criteria and payment instructions
                  before applying.
                </p>
              </div>
            </div>
            <div className="relative h-72 lg:h-full lg:min-h-[460px]">
              <img
                src={IMG.scholarship}
                alt="Smiling scholarship student"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <Script className="absolute right-8 top-8 text-3xl" />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-lg font-bold" style={{ color: NAVY }}>
              What You Should Know
            </h3>
            <div className="mt-5 space-y-5">
              {points.map((p) => (
                <div key={p.t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-green-600 text-white" />
                  <div>
                    <p className="font-semibold" style={{ color: NAVY }}>
                      {p.t}
                    </p>
                    <p className="text-sm text-slate-600">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <a
            href="/join"
            className="flex items-center gap-4 self-end rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-50"
              style={{ color: RED }}
            >
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: RED }}>
                Read Full Scholarship Details <ArrowRight className="inline h-4 w-4" />
              </p>
              <p className="text-xs text-slate-500">
                Get complete information on eligibility, selection process, terms and how to apply.
              </p>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}

/* ---------- steps ---------- */

function Steps() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <Eyebrow>How It Works</Eyebrow>
        <H2>Your Path to Success</H2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: NAVY }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold" style={{ color: NAVY }}>
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <PrimaryBtn href="/join" className="px-10">
            Apply for Cohort 2 <ArrowRight className="h-4 w-4" />
          </PrimaryBtn>
        </div>
      </Container>
    </section>
  );
}

/* ---------- testimonials ---------- */

function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(TESTIMONIALS.length / perPage);
  const shown = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);
  return (
    <section className="py-20">
      <Container>
        <Eyebrow>Student Stories</Eyebrow>
        <H2>What Our Students Say</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {shown.map((t) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: NAVY }}
              >
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <blockquote className="mt-4 flex-1 text-sm text-slate-700">"{t.quote}"</blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-bold" style={{ color: NAVY }}>
                  {t.name}
                </p>
                <p className="text-xs text-slate-500">{t.role}</p>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E1251B] text-[#E1251B]" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              aria-label="Previous"
              onClick={() => setPage((p) => (p - 1 + pages) % pages)}
              className="text-slate-400 hover:text-slate-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                aria-label={`Page ${i + 1}`}
                onClick={() => setPage(i)}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: i === page ? RED : "#CBD5E1" }}
              />
            ))}
            <button
              aria-label="Next"
              onClick={() => setPage((p) => (p + 1) % pages)}
              className="text-slate-400 hover:text-slate-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ---------- cohort banner ---------- */

function CohortBanner() {
  return (
    <section>
      <Container>
        <div className="relative overflow-hidden rounded-3xl" style={{ backgroundColor: NAVY }}>
          <img
            src={IMG.cohort}
            alt="Students learning together"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${NAVY} 10%, ${NAVY}99 55%, transparent)`,
            }}
          />
          <div className="relative max-w-lg p-8 text-white sm:p-12">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              style={{ backgroundColor: RED }}
            >
              Join Cohort 2
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Turn Your Potential Into Real Skills
            </h2>
            <p className="mt-3 text-white/80">
              Join DarlTech Academy and get started on your journey to becoming a skilled tech
              professional.
            </p>
            <PrimaryBtn href="/join" className="mt-7">
              Apply Now <ArrowRight className="h-4 w-4" />
            </PrimaryBtn>
          </div>
          <Script className="absolute right-10 top-10 hidden text-4xl md:block" />
        </div>
      </Container>
    </section>
  );
}

/* ---------- faq ---------- */

function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <Container className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <Eyebrow>Frequently Asked Questions</Eyebrow>
          <H2>Have Questions? We've Got Answers</H2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rounded-lg border border-slate-200 bg-white">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium"
                  style={{ color: NAVY }}
                  aria-expanded={open === i}
                >
                  {f.q}
                  <Plus
                    className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-45" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden px-5 pb-4 text-sm text-slate-600"
                    >
                      {f.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        <div id="contact" className="scroll-mt-20 self-end rounded-2xl bg-slate-50 p-8">
          <MessageSquare className="h-8 w-8" style={{ color: NAVY }} />
          <h3 className="mt-4 text-lg font-bold" style={{ color: NAVY }}>
            Still have questions?
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Our team is here to help you with any questions you may have.
          </p>
          <PrimaryBtn href="/help-center" className="mt-5">
            Contact Us <ArrowRight className="h-4 w-4" />
          </PrimaryBtn>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600"
          >
            <MessageCircle className="h-4 w-4" /> or WhatsApp Us
          </a>
        </div>
      </Container>
    </section>
  );
}

/* ---------- final cta ---------- */

function FinalCta() {
  return (
    <section className="pb-20">
      <Container>
        <div className="grid items-center gap-8 rounded-3xl bg-slate-50 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Your Future in Tech</Eyebrow>
            <H2>Ready to Take the Next Step?</H2>
            <p className="mt-2 text-sm text-slate-600">
              Join DarlTech Academy Cohort 2 and gain the skills, support and opportunities to build
              a successful career in tech.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryBtn href="/join">
                Apply for Cohort 2 <ArrowRight className="h-4 w-4" />
              </PrimaryBtn>
              <OutlineBtn href="#tracks">Browse All Courses</OutlineBtn>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div
              className="font-serif text-2xl italic leading-tight"
              style={{ color: NAVY, fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            >
              Better
              <br />
              &nbsp;&nbsp;Skills
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;Bigger <span style={{ color: RED }}>Opportunities</span>
            </div>
            <Laptop className="ml-6 h-28 w-28" style={{ color: NAVY }} strokeWidth={1} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: NAVY }}>
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo light />
        <nav className="flex flex-wrap gap-6 text-sm text-white/80">
          {NAV.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex gap-4 text-white/80">
          <a href="#" aria-label="LinkedIn" className="hover:text-white">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="#" aria-label="X" className="hover:text-white">
            <X className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="WhatsApp" className="hover:text-white">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} DarlTech Academy. All rights reserved.</p>
          <p>Online technology education for learners across Nigeria.</p>
        </Container>
      </div>
    </footer>
  );
}

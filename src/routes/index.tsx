import { createFileRoute } from "@tanstack/react-router";
import {
  MapPin, ArrowRight, Star, Phone, Mail, ChevronDown, Menu, X,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import gsap from "gsap";
// SCREEN_COMPONENTS removed (PhonePreview no longer used)
import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { BlueprintHero } from "@/components/landing/BlueprintHero";
import { FeaturesPanel } from "@/components/landing/FeaturesPanel";
// SplashVisual removed
// StoreBadges removed
import { cn } from "@/lib/utils";

/** Reveal-on-scroll variant shared across sections below. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DarlTech Academy — Do Extraordinary Things" },
      { name: "description", content: "Learn in-demand tech skills from expert instructors. Get certified and launch your career in tech with DarlTech Academy." },
      { property: "og:title", content: "DarlTech Academy — Do Extraordinary Things" },
      { property: "og:description", content: "Nigeria's leading tech academy. Expert instructors, structured courses, and industry-recognized certificates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

// PhonePreview removed (no longer used)

const SCREENSHOT_IMAGES = [
  "/ChatGPT Image Jul 14, 2026, 07_21_16 AM.png",
  "/ChatGPT Image Jul 14, 2026, 07_25_47 AM.png",
  "/ChatGPT Image Jul 14, 2026, 07_29_52 AM.png",
  "/ChatGPT Image Jul 20, 2026, 08_09_10 AM.png",
  "/ChatGPT Image Jul 20, 2026, 03_22_23 PM.png",
  "/ChatGPT Image Jul 14, 2026, 07_21_16 AM.png",
  "/ChatGPT Image Jul 14, 2026, 07_25_47 AM.png",
  "/ChatGPT Image Jul 14, 2026, 07_29_52 AM.png",
];

function ScreenshotMarquee() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 36,
      ease: "none",
      repeat: -1,
    });
    tweenRef.current = tween;
    return () => {
      tween.kill();
    };
  }, []);

  const slides = [...SCREENSHOT_IMAGES, ...SCREENSHOT_IMAGES];

  return (
    <div
      className="mt-12 -mx-6 overflow-hidden px-6 pb-4"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className="flex w-max gap-8">
        {slides.map((src, i) => (
          <div key={i} className="shrink-0">
            <PhoneFrame width={300} height={620}>
              <div className="h-full w-full overflow-hidden rounded-[42px]">
                <img
                  src={src}
                  alt="DarlTech Academy screen"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </PhoneFrame>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Generic gsap-driven infinite scroller — duplicates `items` once so the loop is seamless. */
function Marquee<T>({
  items,
  renderItem,
  direction = "left",
  speed = 34,
  gapClassName = "gap-6",
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  direction?: "left" | "right";
  speed?: number;
  gapClassName?: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    if (direction === "right") {
      gsap.set(trackRef.current, { xPercent: -50 });
      tweenRef.current = gsap.to(trackRef.current, { xPercent: 0, duration: speed, ease: "none", repeat: -1 });
    } else {
      tweenRef.current = gsap.to(trackRef.current, { xPercent: -50, duration: speed, ease: "none", repeat: -1 });
    }
    return () => {
      tweenRef.current?.kill();
    };
  }, [direction, speed]);

  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className
      )}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className={cn("flex w-max", gapClassName)}>
        {doubled.map((item, i) => (
          <div key={i} className="shrink-0">
            {renderItem(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSplash] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#features");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const INK = "#0E2A54";
  const CREAM = "#0E2A54";
  const PILL_BG = "#1a3d72";
  const GREEN = "#EF4136";
  const GREEN_DARK = "#c73229";

  // splash removed

  // Navbar mount + scroll
  useEffect(() => {
    const raf = requestAnimationFrame(() => setNavMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Hover indicator position
  useEffect(() => {
    if (hoveredIdx === null) { setIndicator((p) => ({ ...p, opacity: 0 })); return; }
    const el = linkRefs.current[hoveredIdx];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [hoveredIdx]);


  const navLinks = [
    { label: "Courses", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <style>{`
        @keyframes navFadeSlideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileLinkIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* splash removed */}

      {/* NAVBAR — flat before scroll, floating pill after scroll */}
      <div className="w-full sticky top-0 z-50">

        {/* === BEFORE SCROLL: original full-width flat nav === */}
        <motion.header
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -8 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ pointerEvents: scrolled ? "none" : "auto", position: scrolled ? "absolute" : "relative" }}
        >
          <div className="border-b border-white/10" style={{backgroundColor:"#0E2A54"}}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
              <a href="/" className="flex items-center gap-2.5">
                <img src="/PHOTO-2026-07-02-04-10-58.jpg" alt="DarlTech Academy" className="h-12 w-auto rounded-lg object-contain" />
              </a>
              <nav className="hidden items-center gap-8 md:flex">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm font-semibold transition" style={{color:"rgba(255,255,255,0.85)"}} onMouseEnter={e=>(e.currentTarget.style.color="#ffffff")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.85)")}>{l.label}</a>
                ))}
              </nav>
              <div className="hidden items-center gap-3 md:flex">
                <a href="#features" className="text-sm font-semibold" style={{color:"rgba(255,255,255,0.85)"}}>View Courses</a>
                <a href="/login" className="text-sm font-semibold" style={{color:"rgba(255,255,255,0.85)"}}>Log In</a>
                <a href="/join" className="inline-flex h-11 items-center gap-2 rounded-2xl gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-glow">
                  Get Started <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            {menuOpen && !scrolled && (
              <div className="border-t border-border bg-card p-4 md:hidden">
                <div className="space-y-1">
                  {navLinks.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-secondary">{l.label}</a>
                  ))}
                  <a href="/join" className="block rounded-xl px-4 py-3 text-sm font-semibold" style={{color:"#EF4136"}}>Get Started →</a>
                  <a href="#features" className="block rounded-xl px-4 py-3 text-sm font-semibold" style={{color:"#EF4136"}}>View Courses →</a>
                </div>
              </div>
            )}
          </div>
        </motion.header>

        {/* === AFTER SCROLL: floating pill nav === */}
        <motion.div
          className="w-full flex justify-center px-4 sm:px-6 pt-3"
          initial={{ opacity: 0, y: -24, scale: 0.97 }}
          animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -16, scale: scrolled ? 1 : 0.97 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: scrolled ? "auto" : "none", position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <nav
            className="w-full max-w-6xl flex items-center justify-between gap-3 rounded-full border py-3 px-5 shadow-xl"
            style={{ backgroundColor: CREAM, borderColor: "rgba(0,0,0,0.06)" }}
          >
            <a href="/" className="flex items-center gap-2 shrink-0 select-none">
              <img src="/PHOTO-2026-07-02-04-10-58.jpg" alt="DarlTech Academy" className="h-10 w-auto rounded-lg object-contain" />
            </a>

            {/* Center link pill */}
            <div
              className="hidden md:flex relative items-center rounded-full px-1.5 py-1.5"
              style={{ backgroundColor: PILL_BG }}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className="absolute top-1.5 bottom-1.5 rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity, backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              />
              {navLinks.map((link, idx) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    ref={(el) => { linkRefs.current[idx] = el; }}
                    href={link.href}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setActiveHref(link.href)}
                    className="relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200"
                    style={{ color: isActive ? INK : "#5B5F58" }}
                  >
                    {link.label}
                    <span
                      className="absolute left-1/2 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ease-out"
                      style={{ backgroundColor: GREEN, width: isActive ? "60%" : "0%", transform: "translateX(-50%)" }}
                    />
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/join"
                className="hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5"
                style={{ backgroundColor: GREEN, boxShadow: "0 2px 10px rgba(239,65,54,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GREEN)}
              >
                Get Started
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 active:scale-90"
                style={{ backgroundColor: PILL_BG, color: INK }}
              >
                <span style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)", display: "inline-flex", transition: "transform 0.3s" }}>
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </span>
              </button>
            </div>
          </nav>

          {/* Pill mobile dropdown */}
          <AnimatePresence>
            {scrolled && menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-2 md:hidden"
              >
                <div className="mx-auto max-w-6xl rounded-3xl border p-3 shadow-lg" style={{ backgroundColor: CREAM, borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex flex-col">
                    {navLinks.map((link, idx) => (
                      <motion.a
                        key={link.href}
                        href={link.href}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => { setActiveHref(link.href); setMenuOpen(false); }}
                        className="px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200 hover:bg-black/5"
                        style={{ color: activeHref === link.href ? INK : "#5B5F58" }}
                      >
                        {link.label}
                      </motion.a>
                    ))}
                    <a
                      href="/join"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 text-center rounded-full px-5 py-3 text-sm font-semibold text-white"
                      style={{ backgroundColor: GREEN }}
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    <div className="min-h-screen bg-surface">
      {/* HERO — blueprint-ui style */}
      <BlueprintHero />

      {/* Trust / logo strip — auto-scrolling marquee */}
      <section className="border-y border-border bg-card py-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Our graduates work at top companies across Nigeria</p>
        <div className="mt-6">
          <Marquee
            items={["Google", "Microsoft", "Andela", "Paystack", "Flutterwave", "Kuda Bank", "Access Bank", "MTN Nigeria", "Jumia", "Sterling Bank"]}
            direction="left"
            speed={32}
            renderItem={(n) => (
              <span className="rounded-2xl border border-border bg-surface px-6 py-3 text-sm font-black tracking-tight text-forest shadow-soft">{n}</span>
            )}
          />
        </div>
      </section>

      {/* FEATURES — blueprint-ui "Our features" panel */}
      <FeaturesPanel />

      {/* HOW IT WORKS */}
      <section id="how" className="bg-forest text-forest-foreground">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">How it works</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Three simple steps to start learning</h2>
              <p className="mt-4 text-lg text-forest-foreground/70">Whether you're a complete beginner or upskilling, DarlTech gets you started in minutes.</p>
              <div className="mt-10 space-y-6">
                {[
                  { n: "01", title: "Create your account", body: "Sign up as a student in under 2 minutes. Choose your role and set up your profile." },
                  { n: "02", title: "Enroll in a course", body: "Browse 10 in-demand tech programs. Pay your course fee and gain instant access to all materials." },
                  { n: "03", title: "Learn, complete & get certified", body: "Watch lessons, take quizzes, submit assignments, and download your certificate when done." },
                ].map((s, i) => (
                  <motion.div
                    key={s.n}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.12 }}
                    className="flex gap-5"
                  >
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground text-lg font-black shadow-glow">{s.n}</div>
                    <div>
                      <h3 className="text-xl font-black">{s.title}</h3>
                      <p className="mt-1 text-forest-foreground/70">{s.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
              >
                <img 
                  src="/ChatGPT_Image_Jul_9__2026__02_26_53_PM-removebg-preview.png" 
                  alt="DarlTech Academy student portal on mobile"
                  className="h-auto max-h-[1200px] w-full max-w-full object-contain drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section id="screenshots" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Screenshots</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">A closer look at your student portal</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every screen is designed with clarity and ease of use in mind. Explore the full learning experience.</p>
        </div>
        <ScreenshotMarquee />
        <div className="mt-10 text-center">
          <a href="/student/explore" className="inline-flex items-center gap-2 rounded-2xl border-2 border-forest bg-card px-6 py-3 text-sm font-bold text-forest hover:bg-secondary">
            Explore the Portal <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-primary-soft/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Loved by students across Nigeria</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Adebayo Okafor", role: "Frontend Developer · Lagos", text: "DarlTech Academy completely changed my career. I went from zero coding knowledge to landing a frontend dev role in 8 months.", init: "AO", color: "#0E2A54" },
              { name: "Fatima Aliyu", role: "Data Analyst · Abuja", text: "The Data Analysis course was incredibly well-structured. The instructors are knowledgeable and the dashboard made tracking my progress so easy.", init: "FA", color: "#EF4136" },
              { name: "Chukwuemeka Nwosu", role: "UI/UX Designer · Port Harcourt", text: "I applied for the scholarship and got in. DarlTech believed in me when I couldn't afford the full fee. Now I'm working at a top design agency.", init: "CN", color: "#1a3d72" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card"
              >
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full text-sm font-black text-white" style={{ background: t.color }}>{t.init}</div>
                  <div>
                    <p className="text-sm font-bold text-forest">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING · Choose how you want to learn, what’s included, popular with Plus, compare */}
      <PricingPlans />

      {/* FAQ */}
      <section id="faq" className="bg-card">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Frequently asked questions</h2>
          </div>
          <div className="mt-12 space-y-3">
            {[
              { q: "How do I enroll in a course?", a: "Browse our course catalog, select your preferred course, create an account, and complete payment to gain immediate access to your learning portal." },
              { q: "What is the scholarship program?", a: "Our scholarship program provides financial aid for eligible students. You apply for a specific course, pay a ₦30,000 acceptance fee to confirm your application, and our admin team reviews and approves or declines your application." },
              { q: "Is the ₦30,000 acceptance fee refundable?", a: "This is currently an open question being finalized by the DarlTech Academy team. Contact us for the latest policy." },
              { q: "What certificate do I get?", a: "Upon completing a course, you receive an industry-recognized DarlTech Academy completion certificate that you can download and share on LinkedIn." },
              { q: "Can I learn at my own pace?", a: "Yes — all course content is accessible 24/7 through your student portal. Progress through lessons, quizzes, and assignments at your own schedule." },
              { q: "How is DarlTech different from other platforms?", a: "We're the only platform combining structured Nigerian tech education, scholarship access, a real student portal with progress tracking, and industry-recognized certificates — all in one place." },
            ].map((f, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="font-bold text-foreground">{f.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT + NEWSLETTER */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Talk to our team</h2>
            <p className="mt-4 text-lg text-muted-foreground">Questions about courses, scholarships, or enrollment? We'd love to hear from you.</p>
            <div className="mt-8 space-y-4">
              {[
                { icon: <Phone className="h-5 w-5" />, label: "Call us", value: "+234 708 116 4457", href: "tel:+2347081164457" },
                { icon: <Mail className="h-5 w-5" />, label: "Email", value: "darltechacademy@gmail.com", href: "mailto:darltechacademy@gmail.com" },
                { icon: <MapPin className="h-5 w-5" />, label: "Head office", value: "DarlTech Academy, Lagos, Nigeria" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">{c.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-bold text-forest hover:text-primary">{c.value}</a>
                    ) : (
                      <p className="text-sm font-bold text-forest">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="text-xl font-black text-forest">Send us a message</h3>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">First name</label>
                  <input className="h-12 w-full rounded-2xl border-2 border-border bg-surface px-4 text-sm outline-none focus:border-primary" placeholder="Adekunle" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last name</label>
                  <input className="h-12 w-full rounded-2xl border-2 border-border bg-surface px-4 text-sm outline-none focus:border-primary" placeholder="Kolawole" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <input className="h-12 w-full rounded-2xl border-2 border-border bg-surface px-4 text-sm outline-none focus:border-primary" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                <textarea rows={4} className="w-full rounded-2xl border-2 border-border bg-surface p-4 text-sm outline-none focus:border-primary" placeholder="How can we help?" />
              </div>
              <a
                href="/join"
                className="flex h-13 min-h-[52px] w-full items-center justify-center rounded-2xl gradient-primary text-sm font-bold text-primary-foreground shadow-glow"
              >
                Send message
              </a>
            </div>
          </form>
        </div>

        {/* Newsletter */}
        <div id="download" className="mt-24 overflow-hidden rounded-[36px] gradient-primary p-6 sm:p-10 md:p-16 text-primary-foreground shadow-glow">
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">Get started. Learn with DarlTech Academy.</h2>
              <p className="mt-3 text-sm sm:text-base opacity-90">Enroll in a course today and join thousands of students building careers in tech across Nigeria.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/student/explore" className="inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-white bg-white/10 px-6 text-sm font-bold text-white">Browse Courses <ArrowRight className="h-4 w-4" /></a>
                <a href="/join/student" className="inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-white bg-white/10 px-6 text-sm font-bold text-white">Apply for Scholarship</a>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 sm:p-6 backdrop-blur-xl">
              <p className="text-sm font-bold">Subscribe to our newsletter</p>
              <p className="mt-1 text-xs opacity-80">Monthly updates on new courses, scholarship openings, and career tips for Nigerian tech professionals.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input className="h-12 flex-1 min-w-0 rounded-2xl bg-white/95 px-4 text-sm text-foreground outline-none" placeholder="your@email.com" />
                <a href="/join" className="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-gold px-5 text-sm font-bold text-gold-foreground">Subscribe</a>
              </div>
              <p className="mt-3 text-[11px] opacity-70">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-forest text-forest-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <img src="/PHOTO-2026-07-02-04-10-58.jpg" alt="DarlTech Academy" className="h-14 w-auto rounded-lg object-contain" />
              </div>
              <p className="mt-4 max-w-sm text-sm opacity-70">Do Extraordinary Things. Nigeria's leading tech academy — expert instructors, structured courses, and industry-recognized certificates.</p>
              <div className="mt-6 flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/student/explore" className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 text-xs font-bold text-white">Browse Courses</a>
                <a href="/join" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#EF4136] px-4 text-xs font-bold text-white">Get Started</a>
              </div>
            </div>
            {[
              { title: "Courses", links: ["Data Analysis", "Cybersecurity", "AI Automation", "Frontend/Backend Dev", "Python Development"] },
              { title: "Academy", links: [{ label: "About us" }, { label: "Scholarship", href: "/join/student" }, { label: "Contact", href: "#contact" }, { label: "Blog" }] },
              { title: "Support", links: [{ label: "Help center" }, { label: "FAQ", href: "#faq" }, { label: "Sign Up", href: "/join" }, { label: "Log In", href: "/login" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-black uppercase tracking-wider" style={{color:"#EF4136"}}>{col.title}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => {
                    const label = typeof l === "string" ? l : l.label;
                    const href = typeof l === "string" ? "#" : (l.href ?? "#");
                    const external = href.startsWith("http");
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="text-sm opacity-70 hover:opacity-100"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs opacity-70">
            <p>© 2026 DarlTech Academy. All rights reserved. Made with ❤️ in Nigeria.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="hover:opacity-100">Privacy Policy</a>
              <a href="#" className="hover:opacity-100">Terms of Service</a>
              <a href="#" className="hover:opacity-100">Cookie Policy</a>
              <a href="#" className="hover:opacity-100">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

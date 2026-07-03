import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout, ShieldCheck, MessageCircle, TrendingUp, MapPin, Sparkles, Search, Users,
  BarChart3, ArrowRight, Check, Star, Phone, Mail, ChevronDown, Menu, X,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Play,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import gsap from "gsap";
import { SCREEN_COMPONENTS } from "@/components/mobile/screens";
import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { SplashVisual } from "@/components/landing/SplashVisual";
import { AppStoreBadge, GooglePlayBadge } from "@/components/landing/StoreBadges";
import { cn } from "@/lib/utils";

/** Reveal-on-scroll variant shared across sections below. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const HERO_SLIDES = [
  {
    image: "/IMG_4213-removebg-preview.png",
    heading: "Nigeria's most trusted agricultural marketplace.",
    subheading: "Agricon connects verified farmers and distributors across Nigeria. Discover premium produce, chat directly, and transact with total confidence — all from one beautiful app.",
  },
  {
    image: "/ChatGPT_Image_Jul_2__2026__05_31_53_PM-removebg-preview.png",
    heading: "Connect With Farmers. Communicate in Any Language.",
    subheading: "Connect directly with verified farmers across Nigeria. Communicate in any language, source quality produce, and grow your agribusiness all in one app.",
  },
  {
    image: "/ChatGPT_Image_Jul_2__2026__04_28_04_PM-removebg-preview.png",
    heading: "Know Exactly Where Your Produce Comes From",
    subheading: "See verified farm locations, size, and distance before you buy — full transparency, every time.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agricon NG — Nigeria's Trusted Agricultural Marketplace" },
      { name: "description", content: "Agricon NG connects verified farmers and distributors across Nigeria. Discover premium produce, chat directly, and transact with total confidence." },
      { property: "og:title", content: "Agricon NG — Nigeria's Trusted Agricultural Marketplace" },
      { property: "og:description", content: "Verified farmers, secure conversations, seamless sourcing. The mobile app powering Nigerian agriculture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function PhonePreview({ slug, scale = 0.55, height = 460 }: { slug: string; scale?: number; height?: number }) {
  const Component = SCREEN_COMPONENTS[slug];
  const width = 375 * scale;
  return (
    <PhoneFrame width={width} height={height}>
      <div className="origin-top-left" style={{ transform: `scale(${scale})`, width: "375px", height: `${height / scale}px` }}>
        {Component && <Component />}
      </div>
    </PhoneFrame>
  );
}

const SCREENSHOT_SLUGS = ["home", "farm-profile", "crop-details", "chat", "farmer-dashboard", "messages", "marketplace", "notifications"];

function ScreenshotMarquee() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });
    tweenRef.current = tween;
    return () => {
      tween.kill();
    };
  }, []);

  const slides = [...SCREENSHOT_SLUGS, ...SCREENSHOT_SLUGS];

  return (
    <div
      className="mt-12 -mx-6 overflow-hidden px-6 pb-4"
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className="flex w-max gap-8">
        {slides.map((s, i) => (
          <div key={`${s}-${i}`} className="shrink-0">
            <PhonePreview slug={s} scale={0.72} height={620} />
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
  const [showSplash, setShowSplash] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [navMounted, setNavMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#features");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const INK = "#1F2A22";
  const CREAM = "#FBF8F2";
  const PILL_BG = "#F0ECE2";
  const GREEN = "#1B4332";
  const GREEN_DARK = "#0F2A20";

  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(t);
  }, [showSplash]);

  // Cycle hero images every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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

  const activeSlide = HERO_SLIDES[heroImageIndex];

  const navLinks = [
    { label: "Features", href: "#features" },
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

      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <SplashVisual onSkip={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="border-b border-border/70 bg-surface/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
              <Link to="/" className="flex items-center gap-2.5">
                <img src="/agricon_logo.png" alt="Agricon logo" className="h-14 w-auto" />
              </Link>
              <nav className="hidden items-center gap-8 md:flex">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} className="text-sm font-semibold text-foreground/70 hover:text-primary transition">{l.label}</a>
                ))}
              </nav>
              <div className="hidden items-center gap-3 md:flex">
                <Link to="/app" className="text-sm font-semibold text-foreground/70 hover:text-primary">View prototype</Link>
                <Link to="/signin" className="text-sm font-semibold text-foreground/70 hover:text-primary">Sign in</Link>
                <a href="#download" className="inline-flex h-11 items-center gap-2 rounded-2xl gradient-primary px-5 text-sm font-bold text-primary-foreground shadow-glow">
                  Download app <ArrowRight className="h-4 w-4" />
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
                  <Link to="/signin" className="block rounded-xl px-4 py-3 text-sm font-semibold text-primary">Sign in →</Link>
                  <Link to="/app" className="block rounded-xl px-4 py-3 text-sm font-semibold text-primary">View prototype →</Link>
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
            <Link to="/" className="flex items-center gap-2 shrink-0 select-none">
              <img src="/agricon_logo.png" alt="Agricon logo" className="h-12 w-auto" />
            </Link>

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
                    ref={(el) => (linkRefs.current[idx] = el)}
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
              <Link
                to="/signin"
                className="hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5"
                style={{ backgroundColor: GREEN, boxShadow: "0 2px 10px rgba(27,67,50,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GREEN)}
              >
                Sign in
              </Link>
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
                    <Link
                      to="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 text-center rounded-full px-5 py-3 text-sm font-semibold text-white"
                      style={{ backgroundColor: GREEN }}
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    <div className="min-h-screen bg-surface">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-24 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Now live · 12,000+ verified farmers
            </span>
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeSlide.heading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-forest md:text-6xl lg:text-7xl"
              >
                {activeSlide.heading}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSlide.subheading}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70"
              >
                {activeSlide.subheading}
              </motion.p>
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#download" className="inline-flex h-13 min-h-[52px] items-center gap-2 rounded-2xl gradient-primary px-6 text-sm font-bold text-primary-foreground shadow-glow">
                Get the app <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/splash" className="inline-flex h-13 min-h-[52px] items-center gap-2 rounded-2xl border-2 border-forest bg-card px-6 text-sm font-bold text-forest hover:bg-secondary">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> KYC-verified farmers</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Zero listing fees</div>
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> In-app secure chat</div>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["#c98a1a", "#2f7d3a", "#8b5a2b", "#1f6b5e"].map((c, i) => (
                  <div key={i} className="grid h-10 w-10 place-items-center rounded-full ring-4 ring-surface text-xs font-bold text-white" style={{ background: c }}>
                    {["AK", "FB", "CO", "MI"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                  <span className="ml-1 text-sm font-bold text-foreground">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">from 2,400+ reviews across NG</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt="Verified farmer holding fresh produce"
                  className="h-auto max-h-[850px] w-full max-w-3xl object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.96, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -30 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust / logo strip — auto-scrolling marquee */}
      <section className="border-y border-border bg-card py-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Trusted by farms and distributors across all 36 states</p>
        <div className="mt-6">
          <Marquee
            items={["Sahel Grains", "Green Delta", "Kolawole Farms", "Northern Harvest", "Cross River Cocoa", "Ogun Estates", "Ogun Poultry Estate", "Kaduna Tomato Union", "Enugu Cassava Growers", "Jos Plateau Produce"]}
            direction="left"
            speed={32}
            renderItem={(n) => (
              <span className="rounded-2xl border border-border bg-surface px-6 py-3 text-sm font-black tracking-tight text-forest shadow-soft">{n}</span>
            )}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Built for the way Nigeria farms and trades</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every feature is designed around trust, speed, and clarity — from verification to conversation to closing the deal.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <ShieldCheck className="h-6 w-6" />, title: "Verified farms only", body: "Every farm undergoes KYC, land-title checks, and photo verification. Trade with total confidence." },
            { icon: <Search className="h-6 w-6" />, title: "Smart discovery", body: "Filter by crop, location, season, and rating. Find exactly what you need in seconds." },
            { icon: <MessageCircle className="h-6 w-6" />, title: "Secure in-app chat", body: "Message farmers directly. Share photos, negotiate quantities, arrange delivery — all in one thread." },
            { icon: <TrendingUp className="h-6 w-6" />, title: "Seasonal insights", body: "Real harvest timelines help you plan sourcing months ahead and lock in the best pricing." },
            { icon: <MapPin className="h-6 w-6" />, title: "Farm location maps", body: "See every farm on a map with GPS coordinates, size, and directions." },
            { icon: <BarChart3 className="h-6 w-6" />, title: "Analytics dashboards", body: "Track listings, inquiries, response rates, and top-performing crops with beautiful charts." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">{f.icon}</div>
              <h3 className="mt-5 text-lg font-black text-forest">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-forest text-forest-foreground">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">How it works</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Three simple steps to start trading</h2>
              <p className="mt-4 text-lg text-forest-foreground/70">Whether you're a farmer listing produce or a distributor sourcing, Agricon gets you started in minutes.</p>
              <div className="mt-10 space-y-6">
                {[
                  { n: "01", title: "Verify your identity", body: "Upload your ID and farm documents. Our team reviews and approves within 24-48 hours." },
                  { n: "02", title: "Set up your profile", body: "Add photos, describe your farm or business, and select the crops you produce or source." },
                  { n: "03", title: "Discover and connect", body: "Browse verified partners, message directly, request quotes, and close deals — all in the app." },
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
                  src="/ChatGPT_Image_Jul_2__2026__09_53_57_AM-removebg-preview.png" 
                  alt="Agricon app interface showing user verification and profile setup"
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
          <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">A closer look at every screen</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every screen is designed with the same attention to spacing, color, and hierarchy. Explore 50 pixel-perfect designs.</p>
        </div>
        <ScreenshotMarquee />
        <div className="mt-10 text-center">
          <Link to="/app" className="inline-flex items-center gap-2 rounded-2xl border-2 border-forest bg-card px-6 py-3 text-sm font-bold text-forest hover:bg-secondary">
            View all 50 screens <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-primary-soft/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Loved by farmers and distributors</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Adekunle Kolawole", role: "Cassava farmer · Oyo State", text: "Since joining Agricon, we've tripled our distributor network. The verification badge alone changed how buyers see us.", init: "AK", color: "#2f7d3a" },
              { name: "Fatima Bello", role: "Grains farmer · Kano State", text: "The chat feature makes negotiations painless. I close deals with distributors in Lagos without ever leaving my farm.", init: "FB", color: "#c98a1a" },
              { name: "Emeka Nwosu", role: "Distributor · Lagos", text: "Sourcing used to take weeks of calls. Now I find verified farms, chat, and get quotes in under an hour. Game-changing.", init: "EN", color: "#1f6b5e" },
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

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when you're ready to grow.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { name: "Starter", price: "Free", body: "Perfect for new farmers just getting started.", features: ["Up to 3 crop listings", "Verified farm badge", "In-app chat", "Basic analytics"], cta: "Get started free", highlight: false },
            { name: "Grower", price: "₦4,500", period: "/month", body: "For active farmers building a real business.", features: ["Unlimited listings", "Priority in search", "Advanced analytics", "Harvest timeline tools", "Featured farm badge"], cta: "Start free trial", highlight: true },
            { name: "Enterprise", price: "Custom", body: "For distributors, co-ops, and processors.", features: ["Everything in Grower", "Multi-farm management", "Team accounts", "Dedicated account manager", "API access"], cta: "Contact sales", highlight: false },
          ].map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl border-2 p-8 ${p.highlight ? "border-primary bg-card shadow-pop" : "border-border bg-card shadow-soft"}`}
            >
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-glow">Most popular</span>}
              <h3 className="text-xl font-black text-forest">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-forest">{p.price}</span>
                {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-8 h-12 w-full rounded-2xl text-sm font-bold ${p.highlight ? "gradient-primary text-primary-foreground shadow-glow" : "border-2 border-forest text-forest hover:bg-secondary"}`}>
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-card">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-forest md:text-5xl">Frequently asked questions</h2>
          </div>
          <div className="mt-12 space-y-3">
            {[
              { q: "How does farm verification work?", a: "We verify every farmer's identity via NIN or government ID, confirm land ownership through title documents or community letters, and require photos of the actual farm. Verification typically completes in 24-48 hours." },
              { q: "Is Agricon free to use?", a: "Yes — our Starter plan is completely free and includes up to 3 listings, verified badge, and in-app chat. Upgrade to Grower or Enterprise when you're ready to scale." },
              { q: "How do payments work?", a: "Payments happen directly between farmer and distributor via bank transfer or agreed method. We're rolling out Agricon Pay (escrow) in Q2 2026 for secure in-app settlements." },
              { q: "Which crops are supported?", a: "All of them — grains, tubers, vegetables, fruits, legumes, cash crops, livestock, and poultry. If you grow or source it, you can list or find it on Agricon." },
              { q: "Do I need a smartphone?", a: "Yes, Agricon is a mobile-first app. It works on any Android or iOS smartphone and uses very little data — designed to work well on 3G." },
              { q: "How is Agricon different from other agri platforms?", a: "We're the only platform combining strict verification, in-app chat, harvest timelines, and Nigerian-first design. Every screen is built for how Nigerians actually farm and trade." },
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
            <p className="mt-4 text-lg text-muted-foreground">Questions about pricing, partnerships, or how Agricon can help your co-op? We'd love to hear from you.</p>
            <div className="mt-8 space-y-4">
              {[
                { icon: <Phone className="h-5 w-5" />, label: "Call us", value: "+234 (0)800 AGRICON" },
                { icon: <Mail className="h-5 w-5" />, label: "Email", value: "hello@agricon.ng" },
                { icon: <MapPin className="h-5 w-5" />, label: "Head office", value: "Plot 42, Adeola Odeku, Victoria Island, Lagos" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">{c.icon}</div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                    <p className="text-sm font-bold text-forest">{c.value}</p>
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
              <button type="button" className="h-13 min-h-[52px] w-full rounded-2xl gradient-primary text-sm font-bold text-primary-foreground shadow-glow">Send message</button>
            </div>
          </form>
        </div>

        {/* Newsletter */}
        <div id="download" className="mt-24 overflow-hidden rounded-[36px] gradient-primary p-6 sm:p-10 md:p-16 text-primary-foreground shadow-glow">
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">Get the app. Grow with Agricon.</h2>
              <p className="mt-3 text-sm sm:text-base opacity-90">Download Agricon NG on iOS and Android. Join 12,000+ verified farmers and distributors trading with confidence.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AppStoreBadge />
                <GooglePlayBadge />
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 sm:p-6 backdrop-blur-xl">
              <p className="text-sm font-bold">Subscribe to our newsletter</p>
              <p className="mt-1 text-xs opacity-80">Monthly insights on Nigerian agriculture, seasonal produce, and product updates.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input className="h-12 flex-1 min-w-0 rounded-2xl bg-white/95 px-4 text-sm text-foreground outline-none" placeholder="your@email.com" />
                <button className="h-12 shrink-0 rounded-2xl bg-gold px-5 text-sm font-bold text-gold-foreground">Subscribe</button>
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
                <img src="/agricon_logo.png" alt="Agricon logo" className="h-11 w-auto" />
              </div>
              <p className="mt-4 max-w-sm text-sm opacity-70">Nigeria's most trusted agricultural marketplace. Verified farmers, secure conversations, seamless sourcing.</p>
              <div className="mt-6 flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <AppStoreBadge className="px-4 py-2" />
                <GooglePlayBadge className="px-4 py-2" />
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
              { title: "Company", links: ["About us", "Careers", "Press", "Partners", "Blog"] },
              { title: "Support", links: ["Help center", "Contact", "Community", "Status", "API docs"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-black uppercase tracking-wider text-gold">{col.title}</h4>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-sm opacity-70 hover:opacity-100">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs opacity-70">
            <p>© 2026 Agricon NG Ltd. All rights reserved. Made with 💚 in Lagos.</p>
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

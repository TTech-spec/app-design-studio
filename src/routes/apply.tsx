import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Loader2, Lock } from "lucide-react";
import academyLogo from "@/assets/portal/darltech-academy-logo.png";
import heroStudent from "@/assets/hero-student.webp";
import { supabase } from "@/lib/supabase";
import { TRACKS, isConfigured, naira } from "@/lib/admin/api";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for Cohort 2 · DarlTech Academy" },
      {
        name: "description",
        content: "Apply to DarlTech Academy Cohort 2 and the scholarship programme.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    track: typeof s.track === "string" ? s.track : "",
  }),
  component: ApplyPage,
});

const NAVY = "#0B1F4D";
const RED = "#E1251B";

type PublicSettings = { cohort_name: string; applications_open: boolean; commitment_fee: number };

type Form = {
  full_name: string;
  email: string;
  phone: string;
  track: string;
  scholarship: boolean;
  motivation: string;
  agree: boolean;
};

const STEPS = ["Your details", "Your track", "Why you"] as const;

function ApplyPage() {
  const { track } = Route.useSearch();
  const [settings, setSettings] = useState<PublicSettings>({
    cohort_name: "Cohort 2",
    applications_open: true,
    commitment_fee: 50000,
  });
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [f, setF] = useState<Form>({
    full_name: "",
    email: "",
    phone: "",
    track: TRACKS.includes(track) ? track : "",
    scholarship: true,
    motivation: "",
    agree: false,
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const panel = useRef<HTMLDivElement>(null);

  // Cohort name, fee and open/closed come from the admin Settings page.
  useEffect(() => {
    if (!isConfigured) return;
    supabase
      .from("academy_settings")
      .select("cohort_name, applications_open, commitment_fee")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setSettings({ ...data, commitment_fee: Number(data.commitment_fee) } as PublicSettings);
      });
  }, []);

  useEffect(() => {
    if (!panel.current) return;
    const t = gsap.fromTo(
      panel.current.querySelectorAll("[data-in]"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
    );
    return () => {
      t.kill();
    };
  }, []);

  const valid = [
    f.full_name.trim().length > 1 &&
      /^\S+@\S+\.\S+$/.test(f.email) &&
      f.phone.replace(/\D/g, "").length >= 10,
    Boolean(f.track),
    f.motivation.trim().length >= 20 && f.agree,
  ];

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setError("");
    setStep(n);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (valid[step]) go(step + 1);
      else
        setError(
          step === 0
            ? "Please enter your full name, a valid email and phone number."
            : "Please choose a track.",
        );
      return;
    }
    if (!valid[2]) {
      setError("Tell us a bit more (at least 20 characters) and accept the terms.");
      return;
    }
    if (!isConfigured) {
      setError("Applications aren't connected yet. Please try again later.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.from("academy_applications").insert({
      full_name: f.full_name.trim(),
      email: f.email.trim().toLowerCase(),
      phone: f.phone.trim(),
      track: f.track,
      cohort: settings.cohort_name,
      scholarship: f.scholarship,
      motivation: f.motivation.trim(),
    });
    setBusy(false);
    if (err) {
      setError("We couldn't submit your application. Please check your connection and try again.");
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] lg:grid lg:grid-cols-[1fr_1.1fr]">
      {/* Left: brand panel */}
      <div className="relative hidden overflow-hidden lg:block" style={{ backgroundColor: NAVY }}>
        <img
          src={heroStudent}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${NAVY}cc, ${NAVY})` }}
        />
        <div className="relative flex h-full flex-col p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={academyLogo}
              alt=""
              className="h-11 w-11 rounded-full bg-white object-contain p-0.5"
            />
            <span className="text-lg font-extrabold leading-tight">
              DarlTech
              <br />
              Academy
            </span>
          </Link>
          <div className="mt-auto max-w-md">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
              style={{ backgroundColor: RED }}
            >
              {settings.cohort_name} · Applications {settings.applications_open ? "open" : "closed"}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">
              Turn your potential into real tech skills.
            </h1>
            <ul className="mt-6 space-y-3 text-white/85">
              {[
                "Practical, project-based learning",
                "Expert mentors and live sessions",
                "Certificate of completion",
                `Scholarship: ${naira(settings.commitment_fee)} commitment fee on acceptance`,
              ].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" /> {t}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div ref={panel} className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div data-in className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <img src={academyLogo} alt="" className="h-9 w-9 rounded-full object-contain" />
            </Link>
          </div>

          <div data-in className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            {!settings.applications_open ? (
              <Closed cohort={settings.cohort_name} />
            ) : done ? (
              <Success
                name={f.full_name.split(" ")[0]}
                email={f.email}
                fee={settings.commitment_fee}
                scholarship={f.scholarship}
              />
            ) : (
              <>
                <h2 className="text-2xl font-extrabold" style={{ color: NAVY }}>
                  Apply for {settings.cohort_name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">Takes about 3 minutes.</p>

                {/* progress */}
                <div className="mt-6 flex gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      disabled={i > step && !valid.slice(0, i).every(Boolean)}
                      onClick={() =>
                        i !== step && (i < step || valid.slice(0, i).every(Boolean)) && go(i)
                      }
                      className="flex-1 text-left disabled:cursor-not-allowed"
                    >
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: RED }}
                          initial={false}
                          animate={{ width: i <= step ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <p
                        className={`mt-2 text-xs font-semibold ${i === step ? "" : "text-slate-400"}`}
                        style={i === step ? { color: NAVY } : undefined}
                      >
                        {i + 1}. {s}
                      </p>
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="mt-6" noValidate>
                  <div className="relative min-h-[300px] overflow-hidden">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={step}
                        custom={dir}
                        initial={{ x: dir * 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: dir * -60, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="space-y-4"
                      >
                        {step === 0 && (
                          <>
                            <Field label="Full name">
                              <input
                                autoFocus
                                autoComplete="name"
                                value={f.full_name}
                                onChange={(e) => set("full_name", e.target.value)}
                                className={input}
                                placeholder="e.g. Ada Okafor"
                              />
                            </Field>
                            <Field label="Email address">
                              <input
                                type="email"
                                autoComplete="email"
                                value={f.email}
                                onChange={(e) => set("email", e.target.value)}
                                className={input}
                                placeholder="you@example.com"
                              />
                            </Field>
                            <Field label="Phone / WhatsApp number">
                              <input
                                type="tel"
                                autoComplete="tel"
                                value={f.phone}
                                onChange={(e) => set("phone", e.target.value)}
                                className={input}
                                placeholder="+234 801 234 5678"
                              />
                            </Field>
                          </>
                        )}
                        {step === 1 && (
                          <>
                            <p className="text-sm font-semibold text-slate-600">
                              Which track do you want to join?
                            </p>
                            <div className="grid max-h-[280px] grid-cols-1 gap-2 overflow-y-auto p-0.5 pr-1 sm:grid-cols-2">
                              {TRACKS.map((t) => (
                                <motion.button
                                  key={t}
                                  type="button"
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => set("track", t)}
                                  className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${f.track === t ? "border-transparent text-white shadow-md" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}
                                  style={f.track === t ? { backgroundColor: NAVY } : undefined}
                                >
                                  {t}
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )}
                        {step === 2 && (
                          <>
                            <Field label="Why do you want to join this track?">
                              <textarea
                                rows={5}
                                value={f.motivation}
                                onChange={(e) => set("motivation", e.target.value)}
                                className={`${input} h-auto py-3`}
                                placeholder="Tell us about your goals and any experience you have (none is fine)."
                              />
                              <span className="mt-1 block text-right text-xs text-slate-400">
                                {f.motivation.trim().length}/20 min
                              </span>
                            </Field>
                            <Toggle
                              checked={f.scholarship}
                              onChange={(v) => set("scholarship", v)}
                              title="Apply for the scholarship"
                              text={`Covers your tuition. ${naira(settings.commitment_fee)} non-refundable commitment fee is due on acceptance.`}
                            />
                            <label className="flex items-start gap-3 text-sm text-slate-600">
                              <input
                                type="checkbox"
                                checked={f.agree}
                                onChange={(e) => set("agree", e.target.checked)}
                                className="mt-0.5 h-5 w-5 accent-[#E1251B]"
                              />
                              I confirm my details are correct and agree to be contacted about my
                              application.
                            </label>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", x: [0, -6, 6, -3, 0] }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => go(step - 1)}
                        className="inline-flex h-11 items-center gap-1 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    ) : (
                      <span />
                    )}
                    <motion.button
                      type="submit"
                      disabled={busy}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-lg shadow-red-200 disabled:opacity-60"
                      style={{ backgroundColor: RED }}
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step < 2 ? (
                        <>
                          Continue <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Submit application <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5" /> Your details are only shared with the DarlTech
                  admissions team.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const input =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none ring-blue-200 transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  text,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 rounded-xl bg-slate-50 p-4 text-left"
    >
      <GraduationCap className="h-6 w-6 shrink-0" style={{ color: NAVY }} />
      <span className="flex-1">
        <span className="block text-sm font-semibold" style={{ color: NAVY }}>
          {title}
        </span>
        <span className="text-xs text-slate-500">{text}</span>
      </span>
      <span
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${checked ? "justify-end bg-green-500" : "justify-start bg-slate-300"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
          className="h-5 w-5 rounded-full bg-white shadow"
        />
      </span>
    </button>
  );
}

function Success({
  name,
  email,
  fee,
  scholarship,
}: {
  name: string;
  email: string;
  fee: number;
  scholarship: boolean;
}) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const len = p.getTotalLength();
    const t = gsap.fromTo(
      p,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.8, delay: 0.3, ease: "power2.out" },
    );
    return () => {
      t.kill();
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-50"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path ref={ref} d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </motion.div>
      <h2 className="mt-6 text-2xl font-extrabold" style={{ color: NAVY }}>
        Application received{name ? `, ${name}` : ""}!
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Our admissions team will review it and contact you at <b>{email}</b>.
        {scholarship && (
          <>
            {" "}
            If you're accepted for the scholarship, the {naira(fee)} commitment fee secures your
            slot.
          </>
        )}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white"
        style={{ backgroundColor: RED }}
      >
        Back to home <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}

function Closed({ cohort }: { cohort: string }) {
  return (
    <div className="py-6 text-center">
      <GraduationCap className="mx-auto h-12 w-12" style={{ color: NAVY }} />
      <h2 className="mt-4 text-2xl font-extrabold" style={{ color: NAVY }}>
        Applications for {cohort} are closed
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Thank you for your interest. Follow us for news about the next cohort.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white"
        style={{ backgroundColor: RED }}
      >
        Back to home
      </Link>
    </div>
  );
}

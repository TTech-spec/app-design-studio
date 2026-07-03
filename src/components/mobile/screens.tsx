import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sprout, Mail, Lock, Phone, ChevronRight, Search, MapPin, TrendingUp, Filter,
  ArrowRight, Camera, Upload, FileCheck2, ShieldCheck, Building2, User as UserIcon,
  Star, Heart, MessageCircle, MoreVertical, Send, Paperclip, Mic, Image as ImageIcon,
  Bell, CheckCircle2, XCircle, Clock, TrendingDown, Eye as EyeIcon, ChevronRight as Chev,
  Settings, HelpCircle, LogOut, Globe, ShieldAlert, Info, ExternalLink, Package,
  Users, DollarSign, ArrowUpRight, Calendar, Layers, X, Check, PlusCircle,
  ChevronDown, Sliders, BarChart3, MessageSquare, FileText, Headphones, Truck,
  ArrowLeft, Share2, Flag, Play, Loader2, Wheat, CreditCard,
} from "lucide-react";
import { MobileShell, NotificationBell } from "./MobileShell";
import { FarmCard, CropCard, SectionHeader, PrimaryButton, TextInput, EmptyState, Chip, VerificationBadge, Rating, FarmImage } from "./ui";
import { CROP_CATEGORIES, FARMS, CROPS, MESSAGES, NOTIFICATIONS, REVIEWS, HARVEST_TIMELINE, LANGUAGES, NIGERIA_STATES, PRIMARY_CROPS } from "@/lib/agricon-data";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

/* ==================================================================
   A. LAUNCH & AUTHENTICATION
   ================================================================== */

export function Splash() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gradient-mesh overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-white/15 backdrop-blur-lg ring-2 ring-white/20">
          <Sprout className="h-12 w-12 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white">AGRICON</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Nigeria</p>
        <p className="mt-8 max-w-[240px] text-center text-sm text-white/90">
          Nigeria's most trusted agricultural marketplace
        </p>
      </div>
      <div className="absolute bottom-14 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
        <Link to="/app/$screen" params={{ screen: "intro" }} className="text-xs font-semibold text-white/80 underline underline-offset-4">
          Skip intro →
        </Link>
      </div>
    </div>
  );
}

export function Intro() {
  return (
    <MobileShell showBack={false} showBottomNav={false} fullBleed>
      <div className="flex h-full flex-col">
        <div className="relative flex-1 gradient-mesh">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-32 w-32 place-items-center rounded-[36px] bg-primary text-primary-foreground shadow-glow">
              <Sprout className="h-16 w-16" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <div className="p-6 pb-8">
          <div className="flex justify-center gap-1.5 mb-6">
            <span className="h-1.5 w-6 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-forest">
            Discover Nigeria's most trusted farms
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            AGRICON connects verified farmers and distributors so you can source produce with total confidence.
          </p>
          <div className="mt-8 space-y-3">
            <PrimaryButton href="welcome">Get started</PrimaryButton>
            <Link to="/app/$screen" params={{ screen: "login" }} className="block text-center text-sm font-semibold text-primary py-2">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function Welcome() {
  const slides = [
    { title: "Verified farmers only", body: "Every farm is verified — real land, real produce, real trust.", icon: <ShieldCheck className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
    { title: "Chat directly, transact securely", body: "Message farmers, discuss quantities, arrange delivery — all in one place.", icon: <MessageCircle className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
    { title: "Grown with intelligence", body: "Seasonal insights and harvest timelines help you plan smarter.", icon: <TrendingUp className="h-14 w-14 text-primary" strokeWidth={2.2} /> },
  ];
  return (
    <MobileShell showBack={false} showBottomNav={false} fullBleed>
      <div className="flex h-full flex-col p-6">
        <div className="flex justify-end">
          <Link to="/app/$screen" params={{ screen: "login" }} className="text-sm font-semibold text-muted-foreground">Skip</Link>
        </div>
        <div className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide flex -mx-6 px-6">
          {slides.map((s, i) => (
            <div key={i} className="snap-center shrink-0 w-full flex flex-col items-center justify-center text-center px-2">
              <div className="grid h-40 w-40 place-items-center rounded-[36px] bg-primary-soft">
                {s.icon}
              </div>
              <h2 className="mt-8 text-2xl font-black text-forest">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground max-w-xs">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-1.5 mb-6">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
        </div>
        <div className="space-y-3">
          <PrimaryButton href="language">Continue</PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}

export function Language() {
  return (
    <MobileShell title="Choose your language" showBottomNav={false}>
      <p className="text-sm text-muted-foreground mb-6">Pick your preferred language. You can change this anytime in Settings.</p>
      <div className="space-y-2">
        {LANGUAGES.map((l, i) => (
          <button key={l.code} type="button" className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${i === 0 ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}>
            <span className="text-2xl">{l.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground">{l.name}</div>
              <div className="text-xs text-muted-foreground">{l.native}</div>
            </div>
            {i === 0 && <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" strokeWidth={3} /></div>}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <PrimaryButton href="login">Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithPassword(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/app/$screen", params: { screen: "home" } });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell showBack={false} showBottomNav={false} fullBleed>
      <div className="flex h-full flex-col p-6">
        <div className="grid h-14 w-14 place-items-center rounded-[18px] gradient-primary shadow-glow">
          <Sprout className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="mt-8">
          <h1 className="text-3xl font-black tracking-tight text-forest">Welcome back</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Sign in to your Agricon account</p>
        </div>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            error={error ?? undefined}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-2 border-border text-primary" defaultChecked />
              Remember me
            </label>
            <Link to="/app/$screen" params={{ screen: "forgot-password" }} className="text-sm font-semibold text-primary">Forgot password?</Link>
          </div>
          <div className="space-y-3 pt-4">
            <PrimaryButton type="submit" loading={loading}>Sign in</PrimaryButton>
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-surface px-3 text-xs text-muted-foreground">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="h-12 rounded-2xl border-2 border-border bg-card text-sm font-semibold hover:border-primary/40">Google</button>
              <button type="button" className="h-12 rounded-2xl border-2 border-border bg-card text-sm font-semibold hover:border-primary/40">Apple</button>
            </div>
          </div>
        </form>
        <p className="mt-auto pt-6 text-center text-sm text-muted-foreground">
          New to Agricon?{" "}
          <Link to="/app/$screen" params={{ screen: "signup" }} className="font-semibold text-primary">Create an account</Link>
        </p>
      </div>
    </MobileShell>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { signUpWithOtp } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in every field to continue.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUpWithOtp({ email, firstName, lastName, phone });
      toast.success("Verification code sent to " + email);
      navigate({ to: "/app/$screen", params: { screen: "otp" } });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Create your account" showBottomNav={false}>
      <p className="text-sm text-muted-foreground mb-6">Join thousands of verified farmers and distributors.</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="First name" placeholder="Adekunle" value={firstName} onChange={setFirstName} />
          <TextInput label="Last name" placeholder="Kolawole" value={lastName} onChange={setLastName} />
        </div>
        <TextInput label="Email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} autoComplete="email" />
        <TextInput label="Phone" placeholder="+234 800 000 0000" icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} error={error ?? undefined} />
        <label className="flex items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-2 border-border text-primary"
          />
          <span>I agree to the <span className="font-semibold text-primary">Terms of Service</span> and <span className="font-semibold text-primary">Privacy Policy</span></span>
        </label>
        <div className="mt-4 space-y-3">
          <PrimaryButton type="submit" loading={loading}>Continue</PrimaryButton>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/app/$screen" params={{ screen: "login" }} className="font-semibold text-primary">Sign in</Link>
          </p>
        </div>
      </form>
    </MobileShell>
  );
}

export function Otp() {
  const navigate = useNavigate();
  const { pendingEmail, pendingFlow, verifyOtp, resendOtp } = useAuth();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  function updateDigit(i: number, val: string) {
    const clean = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(code);
      toast.success("Verified!");
      navigate({ to: "/app/$screen", params: { screen: "create-password" } });
    } catch (err) {
      setError(authErrorMessage(err));
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendOtp();
      toast.success("Code resent to " + pendingEmail);
      setSeconds(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  return (
    <MobileShell title={pendingFlow === "recovery" ? "Verify it's you" : "Verify your email"} showBottomNav={false}>
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-6">
        <Mail className="h-8 w-8" strokeWidth={2.2} />
      </div>
      <h2 className="text-2xl font-black text-forest">Enter the 6-digit code</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a code to <span className="font-semibold text-foreground">{pendingEmail ?? "your email"}</span>
      </p>
      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 flex justify-between gap-2"
      >
        {digits.map((v, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            value={v}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            maxLength={1}
            className={`grid h-14 flex-1 place-items-center rounded-2xl border-2 bg-card text-center text-2xl font-bold outline-none transition ${v ? "border-primary bg-primary-soft text-forest" : "border-border text-muted-foreground"}`}
          />
        ))}
      </motion.div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Didn't receive it?</span>
        <button
          type="button"
          disabled={seconds > 0 || resending}
          onClick={handleResend}
          className="font-semibold text-primary disabled:text-muted-foreground"
        >
          {resending ? "Sending..." : seconds > 0 ? `Resend in 0:${seconds.toString().padStart(2, "0")}` : "Resend code"}
        </button>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleVerify} loading={loading}>Verify</PrimaryButton>
      </div>
    </MobileShell>
  );
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

export function CreatePassword() {
  const navigate = useNavigate();
  const { pendingFlow, setNewPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const score = passwordStrength(password);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Strong", "Very strong"][score];
  const hasMinLength = password.length >= 8;
  const hasCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  async function handleSubmit() {
    if (!hasMinLength) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    const flow = pendingFlow;
    try {
      await setNewPassword(password);
      toast.success(flow === "recovery" ? "Password updated!" : "Account created!");
      navigate({
        to: "/app/$screen",
        params: { screen: flow === "recovery" ? "password-reset-success" : "user-type" },
      });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Create password" showBottomNav={false}>
      <p className="text-sm text-muted-foreground mb-6">Choose a strong password to secure your account.</p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          label="New password"
          placeholder="At least 8 characters"
          type="password"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <TextInput
          label="Confirm password"
          placeholder="Re-enter password"
          type="password"
          icon={<Lock className="h-4 w-4" />}
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          error={error ?? undefined}
        />
        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Password strength: <span className="text-primary">{password ? strengthLabel : "—"}</span></p>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasMinLength ? "text-primary" : "text-border"}`} /> At least 8 characters</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasCase ? "text-primary" : "text-border"}`} /> Contains uppercase & lowercase</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasNumber ? "text-primary" : "text-border"}`} /> Contains a number</li>
          </ul>
        </div>
        <div className="mt-4">
          <PrimaryButton type="submit" loading={loading}>
            {pendingFlow === "recovery" ? "Reset password" : "Create account"}
          </PrimaryButton>
        </div>
      </form>
    </MobileShell>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) {
      setError("Enter the email associated with your account.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Reset code sent to " + email);
      navigate({ to: "/app/$screen", params: { screen: "otp" } });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Reset your password" showBottomNav={false}>
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-6">
        <Lock className="h-8 w-8" strokeWidth={2.2} />
      </div>
      <h2 className="text-2xl font-black text-forest">Forgot password?</h2>
      <p className="mt-2 text-sm text-muted-foreground">Enter the email associated with your account and we'll send you a reset code.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput label="Email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} error={error ?? undefined} autoComplete="email" />
        <div className="mt-4 space-y-3">
          <PrimaryButton type="submit" loading={loading}>Send reset code</PrimaryButton>
          <Link to="/app/$screen" params={{ screen: "login" }} className="block text-center text-sm font-semibold text-primary py-2">Back to sign in</Link>
        </div>
      </form>
    </MobileShell>
  );
}

export function PasswordResetSuccess() {
  return (
    <MobileShell showBack={false} showBottomNav={false}>
      <div className="flex h-full flex-col items-center justify-center text-center pb-20">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-black text-forest">All set!</h1>
        <p className="mt-3 max-w-xs text-[15px] text-muted-foreground">Your password has been reset successfully. Sign in with your new password.</p>
        <div className="mt-8 w-full">
          <PrimaryButton href="login">Continue to sign in</PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   B. USER ONBOARDING
   ================================================================== */

function OnboardingProgress({ step }: { step: number }) {
  const total = 5;
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-forest">Step {step} of {total}</span>
        <span className="text-muted-foreground">{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
    </div>
  );
}

export function UserType() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [selected, setSelected] = useState<"farmer" | "distributor">(profile?.user_type ?? "farmer");
  const [loading, setLoading] = useState(false);

  const types = [
    { id: "farmer" as const, title: "I'm a Farmer", body: "List your crops, receive inquiries, and grow your business.", icon: <Sprout className="h-7 w-7" /> },
    { id: "distributor" as const, title: "I'm a Distributor", body: "Discover verified farms, source produce, and manage inquiries.", icon: <Truck className="h-7 w-7" /> },
  ];

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ user_type: selected });
      navigate({ to: "/app/$screen", params: { screen: "personal-info" } });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Who are you?" showBottomNav={false}>
      <OnboardingProgress step={1} />
      <p className="text-sm text-muted-foreground mb-6">Choose your role to personalise your experience. You can add more later.</p>
      <div className="space-y-3">
        {types.map((t) => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={`w-full rounded-2xl border-2 p-5 text-left transition ${active ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-forest"}`}>
                  {t.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                </div>
                {active && <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" strokeWidth={3} /></div>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-gold bg-gold-soft p-4">
        <div className="flex gap-2">
          <Info className="h-5 w-5 shrink-0 text-gold-foreground" />
          <p className="text-xs text-gold-foreground"><span className="font-semibold">Tip:</span> Farmers get access to listing tools and verification. Distributors get sourcing tools and saved farm lists.</p>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>
          Continue as {selected === "farmer" ? "Farmer" : "Distributor"}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function PersonalInfo() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "Male");
  const [state, setState] = useState(profile?.state ?? "Oyo");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, date_of_birth: dob || null, gender, state });
      navigate({ to: "/app/$screen", params: { screen: "contact-info" } });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Personal information" showBottomNav={false}>
      <OnboardingProgress step={2} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="First name" placeholder="Adekunle" value={firstName} onChange={setFirstName} />
          <TextInput label="Last name" placeholder="Kolawole" value={lastName} onChange={setLastName} />
        </div>
        <TextInput label="Date of birth" placeholder="DD / MM / YYYY" type="date" icon={<Calendar className="h-4 w-4" />} value={dob} onChange={setDob} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`h-12 rounded-2xl border-2 text-sm font-semibold transition ${gender === g ? "border-primary bg-primary-soft text-forest" : "border-border bg-card"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">State of residence</label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function ContactInfo() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [email, setEmail] = useState(profile?.email ?? user?.email ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({ phone, whatsapp: whatsapp || phone, address });
      navigate({ to: "/app/$screen", params: { screen: "profile-photo" } });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Contact information" showBottomNav={false}>
      <OnboardingProgress step={2} />
      <p className="text-sm text-muted-foreground mb-6">How can we and other Agricon users reach you?</p>
      <div className="space-y-4">
        <TextInput label="Primary phone" placeholder="+234 806 •••• 4823" icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} />
        <TextInput label="WhatsApp number" placeholder="Same as phone" icon={<MessageCircle className="h-4 w-4" />} hint="Buyers often prefer WhatsApp — highly recommended." value={whatsapp} onChange={setWhatsapp} />
        <TextInput label="Email address" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} disabled />
        <TextInput label="Home address" placeholder="Street, city" icon={<MapPin className="h-4 w-4" />} value={address} onChange={setAddress} />
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function ProfilePhoto() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Your name";
  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "AK";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  const nextScreen = profile?.user_type === "distributor" ? "business-info" : "farm-info";

  return (
    <MobileShell title="Profile photo" showBottomNav={false}>
      <OnboardingProgress step={3} />
      <p className="text-sm text-muted-foreground mb-6">A clear headshot builds trust. Verified farms with photos get 3× more inquiries.</p>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          {preview ? (
            <img src={preview} alt="Profile preview" className="h-40 w-40 rounded-full object-cover shadow-glow" />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-full gradient-primary text-white text-5xl font-black shadow-glow">
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="absolute bottom-2 right-2 grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground shadow-card"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold text-foreground">{fullName}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-5 hover:border-primary"
        >
          <Camera className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">Take photo</span>
        </button>
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-5 hover:border-primary"
        >
          <Upload className="h-6 w-6 text-primary" />
          <span className="text-sm font-semibold text-foreground">Upload</span>
        </button>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
        <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="mt-8 space-y-3">
        <PrimaryButton onClick={() => navigate({ to: "/app/$screen", params: { screen: nextScreen } })}>Save & continue</PrimaryButton>
        <Link to="/app/$screen" params={{ screen: nextScreen }} className="block text-center text-sm font-semibold text-muted-foreground py-2">Skip for now</Link>
      </div>
    </MobileShell>
  );
}

export function FarmInfo() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [farmName, setFarmName] = useState(profile?.farm_name ?? "");
  const [farmSize, setFarmSize] = useState(profile?.farm_size_hectares?.toString() ?? "");
  const [farmState, setFarmState] = useState(profile?.farm_state ?? "Oyo");
  const [farmLga, setFarmLga] = useState(profile?.farm_lga ?? "");
  const [crops, setCrops] = useState<string[]>(profile?.primary_crops ?? PRIMARY_CROPS.slice(0, 3));
  const [loading, setLoading] = useState(false);

  function toggleCrop(c: string) {
    setCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleContinue() {
    setLoading(true);
    try {
      await updateProfile({
        farm_name: farmName,
        farm_size_hectares: farmSize ? Number(farmSize) : null,
        farm_state: farmState,
        farm_lga: farmLga,
        primary_crops: crops,
      });
      navigate({ to: "/app/$screen", params: { screen: "document-upload" } });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileShell title="Farm information" showBottomNav={false}>
      <OnboardingProgress step={4} />
      <p className="text-sm text-muted-foreground mb-6">Tell us about your farm. This appears on your public profile.</p>
      <div className="space-y-4">
        <TextInput label="Farm name" placeholder="e.g. Kolawole Family Farms" value={farmName} onChange={setFarmName} />
        <TextInput label="Farm size (hectares)" placeholder="e.g. 42" type="number" value={farmSize} onChange={setFarmSize} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Farm state</label>
          <div className="relative">
            <select
              value={farmState}
              onChange={(e) => setFarmState(e.target.value)}
              className="flex h-13 min-h-[52px] w-full appearance-none items-center rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] text-foreground outline-none focus:border-primary"
            >
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <TextInput label="LGA / Nearest town" placeholder="e.g. Ibarapa Central" icon={<MapPin className="h-4 w-4" />} value={farmLga} onChange={setFarmLga} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Primary crops (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_CROPS.map((c) => (
              <Chip key={c} active={crops.includes(c)} onClick={() => toggleCrop(c)}>{c}</Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton onClick={handleContinue} loading={loading}>Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function BusinessInfo() {
  return (
    <MobileShell title="Business information" showBottomNav={false}>
      <OnboardingProgress step={4} />
      <p className="text-sm text-muted-foreground mb-6">Tell us about your distribution business.</p>
      <div className="space-y-4">
        <TextInput label="Business name" placeholder="e.g. Lagos Fresh Distributors Ltd." icon={<Building2 className="h-4 w-4" />} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Business type</label>
          <div className="space-y-2">
            {[
              { label: "Wholesale distributor", active: true },
              { label: "Food processor", active: false },
              { label: "Export company", active: false },
              { label: "Retailer / Market seller", active: false },
            ].map((t) => (
              <button key={t.label} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${t.active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${t.active ? "border-primary bg-primary" : "border-border"}`}>
                  {t.active && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="text-sm font-semibold text-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <TextInput label="RC / Business number" placeholder="RC 1234567" hint="Optional but recommended for verification" />
        <TextInput label="Years in operation" placeholder="e.g. 8" type="number" />
      </div>
      <div className="mt-8">
        <PrimaryButton href="document-upload">Continue</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function DocumentUpload() {
  const docs = [
    { title: "Government-issued ID", body: "NIN, driver's license, or international passport", status: "uploaded", file: "NIN-slip.pdf" },
    { title: "Proof of farm ownership", body: "Land title, C of O, or community letter", status: "uploaded", file: "Land-title.jpg" },
    { title: "Farm photos (min. 3)", body: "Clear photos showing crops and land", status: "progress", count: 2 },
    { title: "Business registration (optional)", body: "CAC certificate or business permit", status: "empty" },
  ];
  return (
    <MobileShell title="Document upload" showBottomNav={false}>
      <OnboardingProgress step={5} />
      <p className="text-sm text-muted-foreground mb-6">Upload the following to complete verification. Documents are reviewed within 24-48 hours.</p>
      <div className="space-y-3">
        {docs.map((d) => (
          <div key={d.title} className="rounded-2xl border-2 border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${d.status === "uploaded" ? "bg-primary-soft text-primary" : d.status === "progress" ? "bg-gold-soft text-gold-foreground" : "bg-secondary text-muted-foreground"}`}>
                {d.status === "uploaded" ? <FileCheck2 className="h-5 w-5" /> : d.status === "progress" ? <Upload className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-foreground">{d.title}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{d.body}</p>
                {d.status === "uploaded" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <CheckCircle2 className="h-3 w-3" /> {d.file}
                  </div>
                )}
                {d.status === "progress" && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">{d.count}/3 uploaded</span><span className="font-semibold text-gold-foreground">67%</span></div>
                    <div className="h-1.5 rounded-full bg-border"><div className="h-full w-2/3 rounded-full bg-gold" /></div>
                  </div>
                )}
                <button className="mt-3 text-xs font-semibold text-primary">
                  {d.status === "empty" ? "Upload document →" : "Update"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <PrimaryButton href="verification-submitted">Submit for verification</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function VerificationSubmitted() {
  return (
    <MobileShell showBack={false} showBottomNav={false}>
      <div className="flex h-full flex-col items-center justify-center text-center pb-20">
        <div className="relative">
          <div className="grid h-32 w-32 place-items-center rounded-full bg-primary-soft">
            <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary shadow-glow">
              <ShieldCheck className="h-10 w-10 text-white" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-black text-forest">You're all set!</h1>
        <p className="mt-3 max-w-xs text-[15px] text-muted-foreground">Your verification documents are being reviewed. This usually takes 24-48 hours.</p>
        <div className="mt-6 w-full rounded-2xl border border-border bg-card p-4 text-left shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-soft">
              <Clock className="h-5 w-5 text-gold-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated review time</p>
              <p className="text-xs text-muted-foreground">24-48 hours · You'll get a notification</p>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full space-y-3">
          <PrimaryButton href="home">Continue to marketplace</PrimaryButton>
          <Link to="/app/$screen" params={{ screen: "verification-status" }} className="block text-center text-sm font-semibold text-primary py-2">Check verification status</Link>
        </div>
      </div>
    </MobileShell>
  );
}

export function VerificationStatus() {
  const steps = [
    { label: "Documents submitted", status: "done", time: "Today, 2:14 PM" },
    { label: "ID verified", status: "done", time: "Today, 3:02 PM" },
    { label: "Farm verification in progress", status: "active", time: "Estimated: 12 hrs" },
    { label: "Approval & profile activation", status: "pending" },
  ];
  return (
    <MobileShell title="Verification status" showBottomNav={false}>
      <div className="rounded-2xl gradient-primary p-5 text-white shadow-glow">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-80">Status</p>
            <p className="text-lg font-bold">In review · 67% complete</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/20">
          <div className="h-full w-2/3 rounded-full bg-white" />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-bold text-foreground mb-4">Progress</h3>
        <div className="relative space-y-4 pl-4">
          <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border" />
          {steps.map((s, i) => (
            <div key={i} className="relative flex items-start gap-3">
              <div className={`absolute -left-4 grid h-5 w-5 place-items-center rounded-full ring-4 ring-surface ${s.status === "done" ? "bg-primary" : s.status === "active" ? "bg-gold" : "bg-border"}`}>
                {s.status === "done" && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
              <div className="ml-4 flex-1 rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                {s.time && <p className="text-xs text-muted-foreground">{s.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PrimaryButton href="home" variant="secondary">Back to home</PrimaryButton>
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   C. MARKETPLACE
   ================================================================== */

export function Home() {
  return (
    <MobileShell
      title=""
      showBack={false}
      headerVariant="transparent"
      headerRight={<NotificationBell count={3} />}
    >
      <div className="-mt-8 -mx-4 gradient-primary px-4 pt-6 pb-12 text-white rounded-b-[28px]">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20 backdrop-blur text-white font-bold">AK</div>
          <div>
            <p className="text-xs opacity-80">Good afternoon,</p>
            <p className="font-bold flex items-center gap-1.5">Adekunle <VerificationBadge /></p>
          </div>
        </div>
        <Link to="/app/$screen" params={{ screen: "search" }} className="mt-5 flex h-12 items-center gap-2 rounded-2xl bg-white px-4 text-foreground">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search farms, crops, distributors...</span>
        </Link>
      </div>

      <div className="-mt-6 grid grid-cols-4 gap-2 rounded-2xl bg-card p-3 shadow-card">
        {[
          { icon: <Search className="h-5 w-5" />, label: "Find farms", href: "marketplace" },
          { icon: <PlusCircle className="h-5 w-5" />, label: "List crop", href: "my-listings" },
          { icon: <Heart className="h-5 w-5" />, label: "Saved", href: "saved-farms" },
          { icon: <MessageCircle className="h-5 w-5" />, label: "Chats", href: "messages" },
        ].map((a) => (
          <Link key={a.label} to="/app/$screen" params={{ screen: a.href }} className="flex flex-col items-center gap-1.5 rounded-xl p-2 hover:bg-secondary">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">{a.icon}</span>
            <span className="text-[11px] font-semibold text-foreground">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <SectionHeader title={<span className="flex items-center gap-2"><Wheat className="h-4 w-4" /> In season now</span>} action="See all" actionHref="seasonal" />
        <div className="-mx-4 flex gap-3 overflow-x-auto scrollbar-hide px-4">
          {CROPS.slice(0, 4).map((c) => (
            <div key={c.id} className="w-40 shrink-0"><CropCard crop={c} /></div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SectionHeader title="Featured verified farms" action="See all" actionHref="featured-farms" />
        <div className="space-y-3">
          {FARMS.slice(0, 2).map((f) => <FarmCard key={f.id} farm={f} />)}
        </div>
      </div>

      <div className="mt-6 rounded-2xl gradient-gold p-5 text-gold-foreground">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Farmer tip</p>
        <p className="mt-1 font-bold">List your first crop to get 3× more inquiries</p>
        <Link to="/app/$screen" params={{ screen: "my-listings" }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
          Get started <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6">
        <SectionHeader title="Recently viewed" />
        <div className="grid grid-cols-2 gap-3">
          {CROPS.slice(2, 4).map((c) => <CropCard key={c.id} crop={c} />)}
        </div>
      </div>
    </MobileShell>
  );
}

export function Marketplace() {
  return (
    <MobileShell title="Marketplace" showBack={false} headerRight={<NotificationBell count={3} />}>
      <Link to="/app/$screen" params={{ screen: "search" }} className="flex h-12 items-center gap-2 rounded-2xl border-2 border-border bg-card px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search farms, crops...</span>
        <Link to="/app/$screen" params={{ screen: "filters" }} className="ml-auto grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary" onClick={(e) => e.stopPropagation()}>
          <Sliders className="h-4 w-4" />
        </Link>
      </Link>

      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["All", "Verified", "In season", "Nearby", "Wholesale", "Top rated"].map((c, i) => (
          <Chip key={c} active={i === 0}>{c}</Chip>
        ))}
      </div>

      <div className="mt-5">
        <SectionHeader title="Browse by category" action="View all" actionHref="categories" />
        <div className="grid grid-cols-4 gap-2">
          {CROP_CATEGORIES.slice(0, 8).map((c) => (
            <Link to="/app/$screen" params={{ screen: "search-results" }} key={c.id} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 hover:border-primary/40">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{c.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <SectionHeader title="Fresh listings" action="See all" actionHref="search-results" />
        <div className="grid grid-cols-2 gap-3">
          {CROPS.map((c) => <CropCard key={c.id} crop={c} />)}
        </div>
      </div>
    </MobileShell>
  );
}

export function Categories() {
  return (
    <MobileShell title="All categories">
      <div className="space-y-2">
        {CROP_CATEGORIES.map((c) => (
          <Link to="/app/$screen" params={{ screen: "search-results" }} key={c.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-3xl">{c.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{c.name}</h3>
              <p className="text-xs text-muted-foreground">{c.count.toLocaleString()} listings</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

export function SearchScreen() {
  const recent = ["Cassava wholesale", "Rice Kano", "Tomato Kaduna", "Fresh eggs Ogun"];
  const trending = ["Cocoa beans", "Palm oil", "Ofada rice", "Yam tubers", "Plantain"];
  return (
    <MobileShell title="Search" showBottomNav={false}>
      <TextInput placeholder="Search crops, farms, distributors..." icon={<Search className="h-4 w-4" />} />
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Recent searches</h3>
          <button className="text-xs font-semibold text-primary">Clear all</button>
        </div>
        <div className="space-y-1">
          {recent.map((r) => (
            <Link to="/app/$screen" params={{ screen: "search-results" }} key={r} className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground">{r}</span>
              <X className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-foreground">Trending now</h3>
        <div className="flex flex-wrap gap-2">
          {trending.map((t) => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
    </MobileShell>
  );
}

export function SearchResults() {
  return (
    <MobileShell title="Cassava · Oyo State">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span><span className="font-bold text-foreground">142</span> results found</span>
        <Link to="/app/$screen" params={{ screen: "filters" }} className="inline-flex items-center gap-1 font-semibold text-primary">
          <Filter className="h-3 w-3" /> Filters (2)
        </Link>
      </div>
      <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["Verified", "In season", "≤ ₦50k", "Oyo State", "Rating 4+"].map((c, i) => (
          <span key={c} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            {c} <X className="h-3 w-3" />
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {FARMS.slice(0, 4).map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
    </MobileShell>
  );
}

export function Filters() {
  return (
    <MobileShell title="Filters" showBottomNav={false} headerRight={<button className="text-sm font-semibold text-primary">Reset</button>}>
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Location</h3>
          <TextInput placeholder="All states" icon={<MapPin className="h-4 w-4" />} suffix={<ChevronDown className="h-4 w-4" />} />
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-2 border-border text-primary" defaultChecked />
            Only farms within 100km
          </label>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Price range (per unit)</h3>
          <div className="grid grid-cols-2 gap-3">
            <TextInput placeholder="Min ₦0" />
            <TextInput placeholder="Max ₦100,000" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Under ₦10k", "₦10k-₦50k", "₦50k-₦100k", "₦100k+"].map((r, i) => (
              <Chip key={r} active={i === 1}>{r}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Farm attributes</h3>
          <div className="space-y-2">
            {[
              { label: "Verified farms only", active: true },
              { label: "In season now", active: true },
              { label: "Wholesale available", active: false },
              { label: "Organic certified", active: false },
              { label: "Same-day delivery", active: false },
            ].map((f) => (
              <label key={f.label} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <span className="text-sm font-medium text-foreground">{f.label}</span>
                <span className={`relative h-6 w-11 rounded-full transition ${f.active ? "bg-primary" : "bg-border"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${f.active ? "right-0.5" : "left-0.5"}`} />
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">Minimum rating</h3>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5].map((r, i) => (
              <Chip key={r} active={i === 2}>⭐ {r}+</Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" href="search-results">Cancel</PrimaryButton>
        <PrimaryButton href="search-results">Apply (142)</PrimaryButton>
      </div>
    </MobileShell>
  );
}

export function FeaturedFarms() {
  return (
    <MobileShell title="Featured farms">
      <p className="text-sm text-muted-foreground mb-4">Handpicked verified farms delivering exceptional quality.</p>
      <div className="space-y-3">
        {FARMS.map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
    </MobileShell>
  );
}

export function Seasonal() {
  return (
    <MobileShell title={<span className="flex items-center gap-2"><Wheat className="h-4 w-4" /> In season</span>}>
      <div className="rounded-2xl gradient-gold p-5 text-gold-foreground">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">This month</p>
        <h2 className="mt-1 text-xl font-black">Rainy season harvests</h2>
        <p className="mt-1 text-sm">Fresh cassava, plantain, and vegetables from top farms.</p>
      </div>
      <div className="mt-5 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["This week", "This month", "Next month", "Q1 2026"].map((c, i) => (
          <Chip key={c} active={i === 1}>{c}</Chip>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {CROPS.map((c) => <CropCard key={c.id} crop={c} />)}
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   D. FARM & CROP DETAILS
   ================================================================== */

export function FarmProfile() {
  const farm = FARMS[0];
  return (
    <MobileShell showBack fullBleed showBottomNav headerVariant="transparent" title="" headerRight={
      <div className="flex gap-1">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"><Share2 className="h-4 w-4" /></button>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"><Heart className="h-4 w-4" /></button>
      </div>
    }>
      <div className="relative -mt-16">
        <FarmImage seed={farm.img} className="h-56 w-full" />
      </div>
      <div className="relative -mt-6 rounded-t-[28px] bg-surface px-4 pt-6 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-forest">{farm.name}</h1>
              {farm.verified && <VerificationBadge />}
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {farm.location} · {farm.size}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <Rating value={farm.rating} reviews={farm.reviews} />
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Est. 2011</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-3">
          {[
            { label: "Response", value: "< 2 hrs" },
            { label: "Fulfilment", value: "98%" },
            { label: "Repeat buyers", value: "76%" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-sm font-bold text-forest">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-4 border-b border-border">
          {["Overview", "Crops", "Reviews", "Map"].map((t, i) => (
            <button key={t} className={`pb-3 text-sm font-semibold ${i === 0 ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-foreground">About</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A third-generation family farm specialising in premium cassava, yam, and maize. We supply major processors across Nigeria with over 500 tonnes shipped this year.
          </p>

          <div className="mt-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Available crops (8)</h3>
            <Link to="/app/$screen" params={{ screen: "my-listings" }} className="text-xs font-semibold text-primary">See all</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {CROPS.slice(0, 4).map((c) => <CropCard key={c.id} crop={c} />)}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Photo gallery</h3>
              <Link to="/app/$screen" params={{ screen: "photo-gallery" }} className="text-xs font-semibold text-primary">View all</Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Link to="/app/$screen" params={{ screen: "photo-gallery" }} key={i}>
                  <FarmImage seed={farm.img + i} className="aspect-square rounded-2xl" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-4 mt-8 flex gap-3">
          <PrimaryButton variant="outline" href="messages" fullWidth={false}>
            <MessageCircle className="h-4 w-4" /> Message
          </PrimaryButton>
          <div className="flex-1">
            <PrimaryButton href="contact-farmer">Request quote</PrimaryButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function FarmerProfile() {
  return (
    <MobileShell title="Farmer profile" showBottomNav>
      <div className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="grid h-28 w-28 place-items-center rounded-full gradient-primary text-white text-4xl font-black shadow-glow">AK</div>
          <div className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-white shadow-card">
            <CheckCircle2 className="h-6 w-6 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-black text-forest">Adekunle Kolawole</h1>
        <p className="text-sm text-muted-foreground">Owner · Kolawole Family Farms</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <Rating value={4.9} reviews={214} />
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Member since 2022</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <VerificationBadge size="md" />
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-foreground">
            <Star className="h-3 w-3 fill-current" /> Top rated
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-4">
        {[
          { label: "Total sales", value: "₦42.8M" },
          { label: "Response rate", value: "98%" },
          { label: "Followers", value: "1.2k" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-lg font-black text-forest">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <PrimaryButton variant="outline" href="messages">
          <MessageCircle className="h-4 w-4" /> Message
        </PrimaryButton>
        <PrimaryButton href="farm-profile">View farm</PrimaryButton>
      </div>
      <SectionHeader title="Farms managed" action="View all" actionHref="my-farms" />
      <div className="space-y-3">
        {FARMS.slice(0, 2).map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
    </MobileShell>
  );
}

export function CropDetails() {
  const crop = CROPS[0];
  return (
    <MobileShell showBack fullBleed showBottomNav title="" headerVariant="transparent" headerRight={
      <div className="flex gap-1">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"><Share2 className="h-4 w-4" /></button>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft"><Heart className="h-4 w-4" /></button>
      </div>
    }>
      <div className="relative -mt-16">
        <FarmImage seed={crop.id + crop.name} className="aspect-square w-full" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition ${i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />
            ))}
          </div>
          <Link to="/app/$screen" params={{ screen: "photo-gallery" }} className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold">
            1 / 4 photos
          </Link>
        </div>
      </div>
      <div className="relative -mt-6 rounded-t-[28px] bg-surface px-4 pt-6 pb-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-foreground">{crop.season}</span>
          {crop.verified && <VerificationBadge />}
        </div>
        <h1 className="mt-3 text-2xl font-black text-forest">{crop.name}</h1>
        <Link to="/app/$screen" params={{ screen: "farm-profile" }} className="mt-1 flex items-center gap-2 text-sm text-primary font-semibold">
          <span>{crop.farm}</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-forest">{crop.price}</span>
          <span className="text-sm text-muted-foreground">{crop.unit}</span>
        </div>
        <p className="mt-1 text-sm text-primary font-semibold">✓ {crop.stock} available</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Harvest", value: "Nov 2025" },
            { label: "Min. order", value: "1 tonne" },
            { label: "Delivery", value: "3-5 days" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-sm font-bold text-forest">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-bold text-foreground">About this listing</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Premium grade white cassava, freshly harvested from our Oyo farms. Ideal for garri, fufu, and industrial starch processing. Bulk discounts available for orders above 10 tonnes.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Specifications</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Variety", "TMS 30572 (Improved)"],
              ["Moisture", "62-65%"],
              ["Grade", "Premium A"],
              ["Packaging", "Jute sacks, 100kg"],
              ["Origin", "Oyo State, Nigeria"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold text-foreground">{v}</span></div>
            ))}
          </div>
        </div>

        <SectionHeader title="Harvest timeline" action="View full" actionHref="harvest-timeline" />
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex justify-between gap-2">
            {HARVEST_TIMELINE.slice(0, 6).map((h) => (
              <div key={h.month} className="flex-1 text-center">
                <div className={`h-16 rounded-lg ${h.status === "harvesting" ? "gradient-primary" : h.status === "planting" ? "bg-gold-soft" : "bg-secondary"}`} />
                <p className="mt-1 text-[10px] font-semibold">{h.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-4 mt-8 flex gap-3">
          <PrimaryButton variant="outline" href="chat" fullWidth={false}><MessageCircle className="h-4 w-4" /></PrimaryButton>
          <div className="flex-1">
            <PrimaryButton href="contact-farmer">Request quote</PrimaryButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function PhotoGallery() {
  return (
    <MobileShell title="Photos (24)" showBottomNav={false}>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <Link to="/app/$screen" params={{ screen: "image-viewer" }} key={i}>
            <FarmImage seed={`gallery-${i}`} className="aspect-square rounded-lg" />
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

export function Reviews() {
  return (
    <MobileShell title="Reviews & ratings">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-black text-forest">4.9</p>
            <div className="mt-1 flex justify-center">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-gold text-gold" />)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">214 reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[
              { s: 5, p: 82 },
              { s: 4, p: 14 },
              { s: 3, p: 3 },
              { s: 2, p: 1 },
              { s: 1, p: 0 },
            ].map((r) => (
              <div key={r.s} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-semibold">{r.s}</span>
                <Star className="h-3 w-3 fill-gold text-gold" />
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${r.p}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{r.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["All", "5 star", "4 star", "With photos", "Recent"].map((c, i) => (
          <Chip key={c} active={i === 0}>{c}</Chip>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {REVIEWS.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary font-bold">{r.author.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{r.author}</p>
                  <button><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{r.time}</span>
                </div>
                <p className="mt-2 text-sm text-foreground leading-relaxed">{r.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

export function HarvestTimeline() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <MobileShell title="Harvest timeline">
      <p className="text-sm text-muted-foreground">Plan sourcing around real harvest windows for Kolawole Family Farms.</p>
      <div className="mt-5 space-y-3">
        {[
          { crop: "Cassava", color: "bg-primary", months: [0, 1, 10, 11] },
          { crop: "Maize", color: "bg-gold", months: [6, 7, 8] },
          { crop: "Yam", color: "bg-forest", months: [9, 10, 11] },
          { crop: "Vegetables", color: "bg-info", months: [3, 4, 5, 6, 7, 8] },
        ].map((c) => (
          <div key={c.crop} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground">{c.crop}</p>
              <span className="text-xs text-muted-foreground">{c.months.length} harvest months</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {months.map((m, i) => (
                <div key={m} className="text-center">
                  <div className={`h-8 rounded ${c.months.includes(i) ? c.color : "bg-secondary"}`} />
                  <p className="mt-1 text-[9px] text-muted-foreground">{m[0]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-primary bg-primary-soft p-4">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-forest">Planning tip</p>
            <p className="mt-1 text-xs text-forest">Reserve produce 4-6 weeks before harvest to secure best pricing.</p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function FarmMap() {
  return (
    <MobileShell title="Farm location" fullBleed showBottomNav>
      <div className="relative h-full">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 40%, #a8c99a 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, #c9d99a 0%, transparent 40%),
            linear-gradient(135deg, #e8f0d8 0%, #d0e0b8 100%)`,
        }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 800" preserveAspectRatio="none">
            <path d="M0,200 Q100,180 200,220 T400,240" stroke="#8bb26a" strokeWidth="3" fill="none" />
            <path d="M0,400 Q120,380 240,420 T400,440" stroke="#8bb26a" strokeWidth="3" fill="none" />
            <path d="M50,0 Q80,200 60,400 T80,800" stroke="#a8c99a" strokeWidth="2" fill="none" />
            <path d="M280,0 Q320,300 300,600 T310,800" stroke="#a8c99a" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-primary/20 animate-ping" />
            <div className="relative grid h-14 w-14 place-items-center rounded-full gradient-primary shadow-glow ring-4 ring-white">
              <Sprout className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card">+</button>
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card">−</button>
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card"><MapPin className="h-4 w-4" /></button>
        </div>
        <div className="absolute bottom-24 left-4 right-4 rounded-2xl bg-card shadow-pop p-4">
          <div className="flex items-start gap-3">
            <FarmImage seed="farm-lush-greens" className="h-16 w-16 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground truncate">Kolawole Family Farms</p>
                <VerificationBadge />
              </div>
              <p className="text-xs text-muted-foreground">Ibarapa Central, Oyo State</p>
              <p className="mt-1 text-xs text-primary font-semibold flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 42 hectares · 3.2km from town
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <PrimaryButton variant="outline" size="md" href="farm-profile">View farm</PrimaryButton>
            <PrimaryButton size="md" href="contact-farmer">Get directions</PrimaryButton>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

export function ContactFarmer() {
  return (
    <MobileShell title="Request quote" showBottomNav={false}>
      <div className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
        <FarmImage seed="farm-lush-greens" className="h-12 w-12 rounded-xl shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">Kolawole Family Farms</p>
          <p className="text-xs text-muted-foreground">Premium White Cassava · ₦48,000/tonne</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <TextInput label="Quantity needed" placeholder="e.g. 5 tonnes" />
        <TextInput label="Delivery location" placeholder="City / State" icon={<MapPin className="h-4 w-4" />} />
        <TextInput label="Preferred delivery date" placeholder="Select date" icon={<Calendar className="h-4 w-4" />} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Message to farmer</label>
          <textarea
            rows={4}
            placeholder="Hi, I'm interested in your cassava. Could you share more details on..."
            className="w-full rounded-2xl border-2 border-border bg-card p-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-2 border-border text-primary" defaultChecked />
          I'd like to receive delivery quote too
        </label>
      </div>
      <div className="mt-8 space-y-3">
        <PrimaryButton href="chat" icon={<Send className="h-4 w-4" />}>Send inquiry</PrimaryButton>
        <p className="text-center text-xs text-muted-foreground">Response typically within 2 hours</p>
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   E. COMMUNICATION
   ================================================================== */

export function Messages() {
  return (
    <MobileShell title="Messages" showBack={false} headerRight={<NotificationBell count={3} />}>
      <TextInput placeholder="Search conversations..." icon={<Search className="h-4 w-4" />} />
      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["All", "Unread", "Inquiries", "Sales", "Archived"].map((c, i) => (
          <Chip key={c} active={i === 0}>{c}</Chip>
        ))}
      </div>
      <div className="mt-4 space-y-1">
        {MESSAGES.map((m) => (
          <Link to="/app/$screen" params={{ screen: "chat" }} key={m.id} className="flex items-center gap-3 rounded-2xl p-3 hover:bg-secondary">
            <div className="relative shrink-0">
              <div className="grid h-12 w-12 place-items-center rounded-full gradient-primary text-white font-bold">
                {m.from.split(" ").map((n) => n[0]).join("")}
              </div>
              {m.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${m.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>{m.from}</p>
                <span className={`text-[11px] shrink-0 ${m.unread > 0 ? "font-bold text-primary" : "text-muted-foreground"}`}>{m.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{m.farm}</p>
              <p className={`mt-0.5 text-xs truncate ${m.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{m.last}</p>
            </div>
            {m.unread > 0 && (
              <div className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{m.unread}</div>
            )}
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

export function Chat() {
  const messages = [
    { from: "them", text: "Hello! Thanks for your interest in our premium cassava.", time: "10:24" },
    { from: "me", text: "Hi Adekunle! I'm looking to source 5 tonnes for our processing plant in Lagos.", time: "10:26" },
    { from: "them", text: "Perfect — we currently have 24 tonnes available at ₦48,000/tonne. Bulk discount applies for 10+ tonnes.", time: "10:28" },
    { from: "them", text: "", image: true, time: "10:28" },
    { from: "me", text: "Great quality! Can you deliver to Lagos next week?", time: "10:32" },
    { from: "them", text: "Yes, we can arrange delivery to Lagos next week.", time: "10:34" },
  ];
  return (
    <MobileShell
      showBottomNav={false}
      title=""
      headerVariant="default"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><Phone className="h-4 w-4" /></button>
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><MoreVertical className="h-4 w-4" /></button>
        </div>
      }
    >
      <Link to="/app/$screen" params={{ screen: "farmer-profile" }} className="-mt-2 -mx-4 flex items-center gap-3 border-b border-border bg-card px-4 py-3 -translate-y-4">
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-white font-bold">AK</div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5"><p className="text-sm font-bold text-foreground">Adekunle Kolawole</p><VerificationBadge /></div>
          <p className="text-[11px] text-primary">Active now · Typically replies in 2 hrs</p>
        </div>
      </Link>

      <div className="space-y-3 -mt-4 pt-2">
        <div className="text-center"><span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">Today</span></div>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "gradient-primary text-white rounded-br-md" : "bg-card border border-border text-foreground rounded-bl-md"}`}>
              {m.image ? (
                <Link to="/app/$screen" params={{ screen: "image-viewer" }} className="block">
                  <FarmImage seed="cassava-photo" className="h-40 w-52 rounded-xl" />
                </Link>
              ) : (
                <p className="text-sm">{m.text}</p>
              )}
              <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky -bottom-4 -mx-4 mt-4 border-t border-border bg-card px-3 py-3">
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"><Paperclip className="h-5 w-5" /></button>
          <div className="flex-1 min-w-0 flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5">
            <input placeholder="Type a message..." className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <button><ImageIcon className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-primary text-white shadow-glow">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

export function ImageViewer() {
  return (
    <div className="relative h-full w-full bg-forest">
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pt-4 pb-8">
        <Link to="/app/$screen" params={{ screen: "chat" }} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur text-white">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center text-white">
          <p className="text-sm font-semibold">Adekunle Kolawole</p>
          <p className="text-[11px] opacity-70">Photo 2 of 4</p>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur text-white">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      <div className="flex h-full items-center justify-center px-4">
        <FarmImage seed="cassava-full-view" className="aspect-square w-full max-w-md rounded-2xl" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent px-4 pb-6 pt-10">
        <div className="flex items-center justify-around text-white">
          {[Share2, Heart, MessageCircle, Flag].map((I, i) => (
            <button key={i} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"><I className="h-5 w-5" /></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Notifications() {
  return (
    <MobileShell title="Notifications" headerRight={<button className="text-xs font-semibold text-primary">Mark all read</button>}>
      <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4 mb-4">
        {["All", "Inquiries", "Verification", "Listings", "System"].map((c, i) => (
          <Chip key={c} active={i === 0}>{c}</Chip>
        ))}
      </div>
      <div className="space-y-2">
        {NOTIFICATIONS.map((n) => {
          const icon = n.type === "verify" ? <ShieldCheck className="h-5 w-5" /> :
            n.type === "message" ? <MessageCircle className="h-5 w-5" /> :
            n.type === "listing" ? <EyeIcon className="h-5 w-5" /> :
            n.type === "harvest" ? <Sprout className="h-5 w-5" /> :
            <Star className="h-5 w-5" />;
          const colorCls = n.type === "verify" ? "bg-primary-soft text-primary" :
            n.type === "harvest" ? "bg-gold-soft text-gold-foreground" :
            "bg-secondary text-forest";
          return (
            <div key={n.id} className={`flex items-start gap-3 rounded-2xl border p-4 ${n.unread ? "border-primary/30 bg-primary-soft/40" : "border-border bg-card"}`}>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${colorCls}`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{n.title}</p>
                  {n.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   F. DASHBOARDS
   ================================================================== */

export function FarmerDashboard() {
  return (
    <MobileShell title="Dashboard" showBack={false} headerRight={<NotificationBell count={3} />}>
      <div className="rounded-2xl gradient-primary p-5 text-white shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider">This month</p>
            <p className="mt-1 text-3xl font-black">₦4.28M</p>
            <p className="text-xs opacity-80">Total inquiry value</p>
          </div>
          <div className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> +18%
          </div>
        </div>
        <div className="mt-4 h-16">
          <svg viewBox="0 0 200 60" className="h-full w-full">
            <polyline points="0,40 25,35 50,42 75,28 100,32 125,20 150,25 175,15 200,10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <polyline points="0,40 25,35 50,42 75,28 100,32 125,20 150,25 175,15 200,10 200,60 0,60" fill="white" fillOpacity="0.15" />
          </svg>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Listings", value: "12", icon: <Layers className="h-4 w-4" /> },
          { label: "Inquiries", value: "48", icon: <MessageSquare className="h-4 w-4" /> },
          { label: "Views", value: "1.2k", icon: <EyeIcon className="h-4 w-4" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">{s.icon}</div>
            <p className="mt-2 text-xl font-black text-forest">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionHeader title="Quick actions" />
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "New listing", icon: <PlusCircle className="h-5 w-5" />, href: "my-listings" },
          { label: "My farms", icon: <Sprout className="h-5 w-5" />, href: "my-farms" },
          { label: "Performance", icon: <BarChart3 className="h-5 w-5" />, href: "listing-performance" },
          { label: "Reviews", icon: <Star className="h-5 w-5" />, href: "reviews" },
        ].map((a) => (
          <Link to="/app/$screen" params={{ screen: a.href }} key={a.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">{a.icon}</span>
            <span className="text-sm font-bold text-foreground">{a.label}</span>
          </Link>
        ))}
      </div>

      <SectionHeader title="Recent inquiries" action="See all" actionHref="inquiry-history" />
      <div className="space-y-2">
        {MESSAGES.slice(0, 3).map((m) => (
          <Link to="/app/$screen" params={{ screen: "chat" }} key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary/40">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-bold">
              {m.from.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{m.from}</p>
              <p className="text-xs text-muted-foreground truncate">{m.last}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

export function MyFarms() {
  return (
    <MobileShell title="My farms" headerRight={<button className="text-sm font-semibold text-primary">+ Add</button>}>
      <div className="rounded-2xl border border-primary bg-primary-soft p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-forest">All farms verified</p>
            <p className="text-xs text-forest/80">2 farms · 106 hectares total</p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {FARMS.slice(0, 2).map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-6 text-sm font-semibold text-primary hover:border-primary">
        <PlusCircle className="h-5 w-5" /> Add another farm
      </button>
    </MobileShell>
  );
}

export function MyListings() {
  return (
    <MobileShell title="My crop listings" headerRight={<button className="text-sm font-semibold text-primary">+ New</button>}>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Active", value: "12", active: true },
          { label: "Draft", value: "3" },
          { label: "Sold out", value: "5" },
        ].map((t) => (
          <button key={t.label} className={`rounded-2xl border-2 p-3 text-left ${t.active ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>
            <p className={`text-2xl font-black ${t.active ? "text-primary" : "text-foreground"}`}>{t.value}</p>
            <p className="text-[11px] text-muted-foreground">{t.label}</p>
          </button>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {CROPS.slice(0, 4).map((c) => <CropCard key={c.id} crop={c} />)}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-8 text-sm font-semibold text-primary hover:border-primary">
        <PlusCircle className="h-6 w-6" /> Create new listing
      </button>
    </MobileShell>
  );
}

export function ListingPerformance() {
  return (
    <MobileShell title="Listing performance">
      <div className="rounded-2xl border border-border bg-card p-3 flex items-center gap-3">
        <FarmImage seed="cassava-perf" className="h-14 w-14 rounded-xl" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Premium White Cassava</p>
          <p className="text-xs text-muted-foreground">₦48,000/tonne · 24 tonnes</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">Live</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { label: "Views (30d)", value: "1,284", delta: "+12%", up: true },
          { label: "Inquiries", value: "42", delta: "+28%", up: true },
          { label: "Save rate", value: "8.4%", delta: "-2%", up: false },
          { label: "Response rate", value: "98%", delta: "+4%", up: true },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-forest">{s.value}</p>
            <div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${s.up ? "text-primary" : "text-destructive"}`}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Views over time" />
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="h-32">
          <svg viewBox="0 0 300 100" className="h-full w-full">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="oklch(0.62 0.17 152)" stopOpacity="0.3" />
                <stop offset="1" stopColor="oklch(0.62 0.17 152)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points="0,80 40,65 80,72 120,50 160,60 200,35 240,45 280,25 300,20" fill="none" stroke="oklch(0.62 0.17 152)" strokeWidth="2.5" strokeLinecap="round" />
            <polyline points="0,80 40,65 80,72 120,50 160,60 200,35 240,45 280,25 300,20 300,100 0,100" fill="url(#g1)" />
          </svg>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {["W1", "W2", "W3", "W4", "W5"].map((w) => <span key={w}>{w}</span>)}
        </div>
      </div>

      <SectionHeader title="Where views come from" />
      <div className="space-y-2">
        {[
          { src: "Search", pct: 42, count: 542 },
          { src: "Recommended", pct: 28, count: 361 },
          { src: "Category browse", pct: 18, count: 232 },
          { src: "Direct link", pct: 12, count: 149 },
        ].map((s) => (
          <div key={s.src} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-foreground">{s.src}</span>
              <span className="text-muted-foreground">{s.count} views · {s.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full gradient-primary" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

export function DistributorDashboard() {
  return (
    <MobileShell title="Distributor" showBack={false} headerRight={<NotificationBell count={3} />}>
      <div className="rounded-2xl bg-forest p-5 text-forest-foreground">
        <p className="text-xs opacity-80 uppercase tracking-wider">Sourcing this quarter</p>
        <p className="mt-1 text-3xl font-black">142 tonnes</p>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div><p className="opacity-70">Farms</p><p className="font-bold">28 active</p></div>
          <div><p className="opacity-70">Inquiries</p><p className="font-bold">64 sent</p></div>
          <div><p className="opacity-70">Deals</p><p className="font-bold">18 closed</p></div>
        </div>
      </div>

      <SectionHeader title="Quick actions" />
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Discover farms", icon: <Search className="h-5 w-5" />, href: "marketplace" },
          { label: "Saved farms", icon: <Heart className="h-5 w-5" />, href: "saved-farms" },
          { label: "Inquiry history", icon: <FileText className="h-5 w-5" />, href: "inquiry-history" },
          { label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "analytics" },
        ].map((a) => (
          <Link to="/app/$screen" params={{ screen: a.href }} key={a.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">{a.icon}</span>
            <span className="text-sm font-bold text-foreground">{a.label}</span>
          </Link>
        ))}
      </div>

      <SectionHeader title="Recommended farms" action="See all" actionHref="featured-farms" />
      <div className="space-y-3">
        {FARMS.slice(0, 2).map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
    </MobileShell>
  );
}

export function SavedFarms() {
  return (
    <MobileShell title="Saved farms">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground"><span className="font-bold text-foreground">6</span> saved farms</span>
        <button className="font-semibold text-primary">Manage</button>
      </div>
      <div className="mt-4 space-y-3">
        {FARMS.map((f) => <FarmCard key={f.id} farm={f} />)}
      </div>
    </MobileShell>
  );
}

export function InquiryHistory() {
  const inquiries = [
    { farm: "Kolawole Family Farms", crop: "Premium White Cassava", qty: "5 tonnes", value: "₦240,000", status: "responded", date: "Today" },
    { farm: "Sahel Grains Co.", crop: "Ofada Rice", qty: "180 bags", value: "₦9.36M", status: "closed", date: "Yesterday" },
    { farm: "Northern Harvest Co-op", crop: "Roma Tomatoes", qty: "20 baskets", value: "₦560,000", status: "pending", date: "3d ago" },
    { farm: "Green Delta Farms", crop: "Sweet Plantain", qty: "50 bunches", value: "₦925,000", status: "responded", date: "5d ago" },
  ];
  const statusStyle = (s: string) =>
    s === "responded" ? "bg-primary-soft text-primary" :
    s === "closed" ? "bg-gold-soft text-gold-foreground" :
    "bg-secondary text-muted-foreground";
  return (
    <MobileShell title="Inquiry history">
      <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["All", "Pending", "Responded", "Closed"].map((c, i) => (
          <Chip key={c} active={i === 0}>{c}</Chip>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {inquiries.map((inq, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{inq.crop}</p>
                <p className="text-xs text-muted-foreground truncate">{inq.farm}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusStyle(inq.status)}`}>{inq.status}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <div>
                <p className="text-muted-foreground">Qty · Value</p>
                <p className="font-semibold text-foreground">{inq.qty} · {inq.value}</p>
              </div>
              <p className="text-muted-foreground">{inq.date}</p>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

export function Analytics() {
  return (
    <MobileShell title="Analytics">
      <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
        {["7 days", "30 days", "90 days", "This year"].map((c, i) => (
          <Chip key={c} active={i === 1}>{c}</Chip>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { label: "Farms sourced", value: "28", delta: "+6" },
          { label: "Total volume", value: "142t", delta: "+22t" },
          { label: "Avg response", value: "1.8h", delta: "-0.4h" },
          { label: "Deal close rate", value: "68%", delta: "+4%" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-forest">{s.value}</p>
            <p className="text-xs font-semibold text-primary">{s.delta} vs prev</p>
          </div>
        ))}
      </div>

      <SectionHeader title="Volume by category" />
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        {[
          { cat: "Grains", pct: 42, color: "gradient-primary" },
          { cat: "Tubers", pct: 28, color: "bg-forest" },
          { cat: "Vegetables", pct: 18, color: "bg-gold" },
          { cat: "Fruits", pct: 12, color: "bg-info" },
        ].map((c) => (
          <div key={c.cat}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-foreground">{c.cat}</span>
              <span className="text-muted-foreground">{c.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={c.color + " h-full"} style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Top farms" />
      <div className="space-y-2">
        {FARMS.slice(0, 3).map((f, i) => (
          <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold-soft text-gold-foreground text-sm font-black">{i + 1}</div>
            <FarmImage seed={f.img} className="h-11 w-11 rounded-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-forest">{(50 - i * 12)}t</p>
              <p className="text-[10px] text-muted-foreground">this qtr</p>
            </div>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   G. SETTINGS & SUPPORT
   ================================================================== */

export function SettingsScreen() {
  const groups = [
    {
      title: "Account",
      items: [
        { icon: <UserIcon className="h-5 w-5" />, label: "Personal information", href: "personal-info" },
        { icon: <ShieldCheck className="h-5 w-5" />, label: "Verification status", value: "Verified", href: "verification-status" },
        { icon: <Lock className="h-5 w-5" />, label: "Privacy & security", href: "settings" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: <Bell className="h-5 w-5" />, label: "Notifications", href: "settings" },
        { icon: <Globe className="h-5 w-5" />, label: "Language", value: "English", href: "language" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle className="h-5 w-5" />, label: "Help center", href: "help-center" },
        { icon: <Headphones className="h-5 w-5" />, label: "Contact support", href: "contact-support" },
        { icon: <Info className="h-5 w-5" />, label: "About Agricon", href: "settings" },
      ],
    },
  ];
  return (
    <MobileShell title="Settings">
      <Link to="/app/$screen" params={{ screen: "farmer-profile" }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-white text-xl font-black">AK</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-foreground truncate">Adekunle Kolawole</p>
            <VerificationBadge />
          </div>
          <p className="text-xs text-muted-foreground truncate">adekunle@kolawolefarms.ng</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {groups.map((g) => (
        <div key={g.title} className="mt-5">
          <h3 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g.title}</h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {g.items.map((it, i) => (
              <Link to="/app/$screen" params={{ screen: it.href }} key={it.label} className={`flex items-center gap-3 p-4 hover:bg-secondary ${i < g.items.length - 1 ? "border-b border-border" : ""}`}>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">{it.icon}</span>
                <span className="flex-1 text-sm font-semibold text-foreground">{it.label}</span>
                {("value" in it && it.value) && <span className="text-xs text-muted-foreground">{it.value}</span>}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 text-sm font-bold text-destructive hover:bg-destructive/10">
        <LogOut className="h-5 w-5" /> Sign out
      </button>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">Agricon NG · v1.0.4 · Made in Nigeria 🇳🇬</p>
    </MobileShell>
  );
}

export function HelpCenter() {
  const topics = [
    { icon: <Sprout className="h-6 w-6" />, title: "Getting started", body: "Onboarding, verification, and setup" },
    { icon: <Lock className="h-6 w-6" />, title: "Account & security", body: "Password, 2FA, and privacy" },
    { icon: <Bell className="h-6 w-6" />, title: "Listing crops", body: "Best practices and visibility" },
    { icon: <MessageCircle className="h-6 w-6" />, title: "Inquiries & chats", body: "Managing conversations" },
    { icon: <Truck className="h-6 w-6" />, title: "Delivery & logistics", body: "Shipping and fulfilment" },
    { icon: <CreditCard className="h-6 w-6" />, title: "Payments", body: "How payments work on Agricon" },
  ];
  const faqs = [
    "How does farm verification work?",
    "What documents do I need for verification?",
    "How long does verification take?",
    "Can I list crops before verification?",
  ];
  return (
    <MobileShell title="Help center">
      <TextInput placeholder="Search articles..." icon={<Search className="h-4 w-4" />} />
      <SectionHeader title="Browse topics" />
      <div className="grid grid-cols-2 gap-3">
        {topics.map((t) => (
          <button key={t.title} className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/40">
            <div className="text-[#154212] mb-2">{t.icon}</div>
            <p className="text-sm font-bold text-foreground">{t.title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t.body}</p>
          </button>
        ))}
      </div>
      <SectionHeader title="Popular questions" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {faqs.map((q, i) => (
          <button key={q} className={`flex w-full items-center gap-3 p-4 text-left hover:bg-secondary ${i < faqs.length - 1 ? "border-b border-border" : ""}`}>
            <HelpCircle className="h-4 w-4 text-primary shrink-0" />
            <span className="flex-1 text-sm font-semibold text-foreground">{q}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl gradient-primary p-5 text-white">
        <p className="font-bold">Still need help?</p>
        <p className="text-sm opacity-90">Our support team responds within 2 hours.</p>
        <Link to="/app/$screen" params={{ screen: "contact-support" }} className="mt-3 inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary">
          Contact support <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </MobileShell>
  );
}

export function ContactSupport() {
  return (
    <MobileShell title="Contact support" showBottomNav={false}>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <MessageCircle className="h-6 w-6" />, label: "Live chat", body: "Online now", href: "chat", color: "bg-primary text-primary-foreground" },
          { icon: <Phone className="h-6 w-6" />, label: "Call us", body: "Mon-Sat 8am-8pm", href: "contact-support", color: "bg-card border border-border text-foreground" },
          { icon: <Mail className="h-6 w-6" />, label: "Email", body: "help@agricon.ng", href: "contact-support", color: "bg-card border border-border text-foreground" },
          { icon: <MessageSquare className="h-6 w-6" />, label: "WhatsApp", body: "Fast response", href: "contact-support", color: "bg-card border border-border text-foreground" },
        ].map((c) => (
          <Link to="/app/$screen" params={{ screen: c.href }} key={c.label} className={`rounded-2xl p-4 ${c.color}`}>
            {c.icon}
            <p className="mt-2 text-sm font-bold">{c.label}</p>
            <p className="mt-0.5 text-xs opacity-80">{c.body}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-bold text-foreground mb-3">Send us a message</h3>
        <div className="space-y-3">
          <TextInput label="Subject" placeholder="What can we help with?" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
            <button className="flex h-13 min-h-[52px] w-full items-center justify-between rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px]">
              <span className="text-muted-foreground">Select category</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
            <textarea rows={5} placeholder="Describe your issue..." className="w-full rounded-2xl border-2 border-border bg-card p-4 text-sm outline-none focus:border-primary" />
          </div>
          <button className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-3 text-sm text-muted-foreground w-full">
            <Paperclip className="h-4 w-4" /> Attach screenshot (optional)
          </button>
        </div>
        <div className="mt-6">
          <PrimaryButton>Send message</PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}

/* ==================================================================
   REGISTRY
   ================================================================== */

export const SCREEN_COMPONENTS: Record<string, React.ComponentType> = {
  splash: Splash,
  intro: Intro,
  welcome: Welcome,
  language: Language,
  login: Login,
  signup: Signup,
  otp: Otp,
  "create-password": CreatePassword,
  "forgot-password": ForgotPassword,
  "password-reset-success": PasswordResetSuccess,
  "user-type": UserType,
  "personal-info": PersonalInfo,
  "contact-info": ContactInfo,
  "profile-photo": ProfilePhoto,
  "farm-info": FarmInfo,
  "business-info": BusinessInfo,
  "document-upload": DocumentUpload,
  "verification-submitted": VerificationSubmitted,
  "verification-status": VerificationStatus,
  home: Home,
  marketplace: Marketplace,
  categories: Categories,
  search: SearchScreen,
  "search-results": SearchResults,
  filters: Filters,
  "featured-farms": FeaturedFarms,
  seasonal: Seasonal,
  "farm-profile": FarmProfile,
  "farmer-profile": FarmerProfile,
  "crop-details": CropDetails,
  "photo-gallery": PhotoGallery,
  reviews: Reviews,
  "harvest-timeline": HarvestTimeline,
  "farm-map": FarmMap,
  "contact-farmer": ContactFarmer,
  messages: Messages,
  chat: Chat,
  "image-viewer": ImageViewer,
  notifications: Notifications,
  "farmer-dashboard": FarmerDashboard,
  "my-farms": MyFarms,
  "my-listings": MyListings,
  "listing-performance": ListingPerformance,
  "distributor-dashboard": DistributorDashboard,
  "saved-farms": SavedFarms,
  "inquiry-history": InquiryHistory,
  analytics: Analytics,
  settings: SettingsScreen,
  "help-center": HelpCenter,
  "contact-support": ContactSupport,
};

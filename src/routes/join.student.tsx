import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { academySignUp } from "@/lib/academy/auth";
import {
  AuthLayout,
  emailOk,
  Field,
  passwordOk,
  StepHeader,
  StepTitle,
} from "@/components/academy/auth";
import { btn, CourseTile, SuccessArt } from "@/components/academy/ui";

export const Route = createFileRoute("/join/student")({
  head: () => ({ meta: [{ title: "Student sign-up · DarlTech Academy" }] }),
  component: StudentSignUp,
});

const LEVELS = ["Beginner", "Some basics", "Intermediate"];

function StudentSignUp() {
  const navigate = useNavigate();
  const { signUp } = useAcademy();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState("Beginner");

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().split(/\s+/).length < 2) err.name = "Enter your first and last name.";
    if (!emailOk(form.email)) err.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) err.phone = "Enter a valid phone number.";
    if (!passwordOk(form.password)) err.password = "Use at least 8 characters, with a number.";
    setErrors(err);
    if (Object.keys(err).length === 0) setStep(2);
  };

  const finish = async () => {
    if (loading) return;
    const user = {
      role: "student" as const,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+234 ${form.phone.trim()}`,
      interests,
      level,
      bio: "",
      skills: [],
    };
    setLoading(true);
    setSubmitError(null);
    try {
      const { needsConfirmation } = await academySignUp(user, form.password);
      signUp(user);
      setNeedsConfirm(needsConfirmation);
      setStep(3);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <AuthLayout>
        <StepHeader step={1} total={1} />
        <div className="flex flex-1 flex-col justify-center gap-7 py-8">
          <SuccessArt />
          <div className="flex flex-col gap-2.5 text-center">
            <h1 className="text-[26px] font-extrabold">
              Welcome to DarlTech, {form.name.split(" ")[0]}!
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your free account is ready. Browse courses, materials and the tech feed. You only pay
              when you enroll in a course.
            </p>
            {needsConfirm && (
              <p className="text-sm font-semibold text-[#0E2A54]">
                We sent a confirmation link to {form.email} — confirm it before logging in next
                time.
              </p>
            )}
          </div>
        </div>
        <button type="button" className={btn.big} onClick={() => navigate({ to: "/tour" })}>
          Take a quick tour
        </button>
        <Link
          to="/student"
          className="mt-2 flex h-12 items-center justify-center text-[15px] font-bold text-[#D7372C] hover:underline"
        >
          Skip and go to my dashboard
        </Link>
      </AuthLayout>
    );
  }

  if (step === 2) {
    return (
      <AuthLayout>
        <StepHeader onBack={() => setStep(1)} step={2} total={2} />
        <StepTitle
          kicker="Student sign-up · free"
          title="What are you curious about?"
          sub="Pick any. We’ll tailor your dashboard — no payment needed."
        />
        <div role="group" aria-label="Interests" className="mt-5 flex flex-col gap-2">
          {COURSES.map((c) => {
            const on = interests.includes(c.id);
            return (
              <label
                key={c.id}
                className={cn(
                  "flex h-[58px] cursor-pointer items-center gap-3 rounded-2xl border px-3.5 transition",
                  on
                    ? "border-2 border-primary bg-[#f3f6fb]"
                    : "border-border bg-white hover:bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() =>
                    setInterests((xs) => (on ? xs.filter((x) => x !== c.id) : [...xs, c.id]))
                  }
                />
                <CourseTile course={c} size={36} radius={10} />
                <span className="flex-1 text-[15px] font-semibold">{c.name}</span>
                <span className="text-xs font-semibold text-muted-foreground">{c.duration}</span>
                <span
                  className={cn(
                    "flex h-[22px] w-[22px] items-center justify-center rounded-md",
                    on ? "bg-primary text-white" : "border-2 border-border",
                  )}
                >
                  {on && <Check size={13} strokeWidth={3} />}
                </span>
              </label>
            );
          })}
        </div>
        <p className="mb-2.5 mt-5 text-sm font-semibold">Your experience level</p>
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={level === l}
              onClick={() => setLevel(l)}
              className={cn(
                "h-11 flex-1 rounded-xl text-sm font-semibold",
                level === l
                  ? "border-2 border-primary bg-[#f3f6fb]"
                  : "border border-border bg-white",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        {submitError && (
          <p role="alert" className="mt-4 text-center text-xs font-semibold text-[#D7372C]">
            {submitError}
          </p>
        )}
        <button type="button" className={cn(btn.big, "mt-8")} onClick={finish} disabled={loading}>
          {loading ? "Creating account…" : "Create my free account"}
        </button>
        <button
          type="button"
          onClick={finish}
          disabled={loading}
          className="mt-2 h-11 text-[13px] text-muted-foreground"
        >
          Not sure yet? <span className="font-bold text-[#D7372C]">Skip this step</span>
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={submitDetails} noValidate className="flex flex-1 flex-col">
        <StepHeader onBack={() => navigate({ to: "/join" })} step={1} total={2} />
        <StepTitle kicker="Student sign-up · free" title="Let’s start with your details" />
        <div className="mt-7 flex flex-col gap-4">
          <Field
            id="s-name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            placeholder="e.g. Amaka Obi"
          />
          <Field
            id="s-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Field
            id="s-phone"
            label="Phone number"
            type="tel"
            autoComplete="tel-national"
            prefix="+234"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            placeholder="803 000 0000"
          />
          <Field
            id="s-pass"
            label="Create password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            hint="At least 8 characters, with a number."
          />
        </div>
        <div className="min-h-8 flex-1" />
        <button type="submit" className={btn.big}>
          Continue
        </button>
        <p className="mt-3.5 text-center text-[13px] text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#D7372C] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

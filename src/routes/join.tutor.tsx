import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, FileText, Upload } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { COURSES } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import {
  AuthLayout,
  emailOk,
  Field,
  passwordOk,
  selectCls,
  StepHeader,
  StepTitle,
  textareaCls,
} from "@/components/academy/auth";
import { btn, SuccessArt } from "@/components/academy/ui";

export const Route = createFileRoute("/join/tutor")({
  head: () => ({ meta: [{ title: "Tutor application · DarlTech Academy" }] }),
  component: TutorSignUp,
});

const SKILLS = [...COURSES.map((c) => c.name), "Web Development", "Other"];
const YEARS = ["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "More than 10 years"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Upload1({
  id,
  label,
  hint,
  file,
  onFile,
}: {
  id: string;
  label: string;
  hint: string;
  file: string;
  onFile: (n: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{label}</span>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#fdecea] text-[#D7372C]">
            <FileText size={18} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">{file}</span>
            <span className="text-xs font-semibold text-[#16794a]">Uploaded</span>
          </span>
          <label
            htmlFor={id}
            className="flex h-11 cursor-pointer items-center px-2 text-[13px] font-bold text-[#D7372C]"
          >
            Replace
          </label>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[#b9c3d8] bg-surface p-4 hover:bg-surface-2"
        >
          <Upload size={22} />
          <span className="text-sm font-semibold">Tap to upload</span>
          <span className="text-center text-xs text-muted-foreground">{hint}</span>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0]?.name ?? "")}
      />
    </div>
  );
}

function TutorSignUp() {
  const navigate = useNavigate();
  const { signUp } = useAcademy();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    link: "",
    bio: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [years, setYears] = useState(YEARS[2]);
  const [cv, setCv] = useState("");
  const [idDoc, setIdDoc] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const next1 = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().split(/\s+/).length < 2) err.name = "Enter your first and last name.";
    if (!emailOk(form.email)) err.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) err.phone = "Enter a valid phone number.";
    if (!passwordOk(form.password)) err.password = "Use at least 8 characters, with a number.";
    setErrors(err);
    if (!Object.keys(err).length) setStep(2);
  };
  const next2 = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!skills.length) err.skills = "Pick at least one skill you can teach.";
    if (form.bio.trim().length < 20)
      err.bio = "Tell students a little more (at least 20 characters).";
    setErrors(err);
    if (!Object.keys(err).length) setStep(3);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!cv) err.cv = "Upload your CV.";
    if (!idDoc) err.id = "Upload a government-issued ID.";
    if (!days.length) err.days = "Pick at least one day.";
    if (!agree) err.agree = "Please accept the tutor terms.";
    setErrors(err);
    if (Object.keys(err).length) return;
    signUp({
      role: "tutor",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+234 ${form.phone.trim()}`,
      interests: [],
      level: "",
      bio: form.bio.trim(),
      skills,
      experience: years,
      link: form.link.trim(),
      availability: days,
      status: "pending",
    });
    setStep(4);
  };

  if (step === 4)
    return (
      <AuthLayout>
        <StepHeader step={1} total={1} />
        <div className="flex flex-1 flex-col justify-center gap-7 py-8">
          <SuccessArt kind="review" />
          <div className="flex flex-col gap-2.5 text-center">
            <h1 className="text-[26px] font-extrabold">Application received</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our team reviews every tutor application. We’ll email {form.email} once you’re
              approved. Meanwhile you can explore your tutor dashboard.
            </p>
          </div>
        </div>
        <button type="button" className={btn.big} onClick={() => navigate({ to: "/tutor" })}>
          Explore the tutor dashboard
        </button>
      </AuthLayout>
    );

  if (step === 3)
    return (
      <AuthLayout>
        <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
          <StepHeader onBack={() => setStep(2)} step={3} total={3} />
          <StepTitle kicker="Tutor application" title="Verify your profile" />
          <div className="mt-6 flex flex-col gap-4">
            <Upload1
              id="t-cv"
              label="CV or résumé"
              hint="PDF or Word document"
              file={cv}
              onFile={setCv}
            />
            {errors.cv && <p className="-mt-2 text-xs font-semibold text-[#D7372C]">{errors.cv}</p>}
            <Upload1
              id="t-id"
              label="Government-issued ID"
              hint="NIN slip, passport or driver’s licence · PDF or JPG"
              file={idDoc}
              onFile={setIdDoc}
            />
            {errors.id && <p className="-mt-2 text-xs font-semibold text-[#D7372C]">{errors.id}</p>}
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">When can you teach?</legend>
              <div className="flex gap-1.5">
                {DAYS.map((d) => {
                  const on = days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setDays((xs) => (on ? xs.filter((x) => x !== d) : [...xs, d]))}
                      className={cn(
                        "h-11 flex-1 rounded-[10px] border text-xs font-bold",
                        on ? "border-primary bg-primary text-white" : "border-border bg-white",
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              {errors.days && <p className="text-xs font-semibold text-[#D7372C]">{errors.days}</p>}
            </fieldset>
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0E2A54]"
              />
              <span>I agree to DarlTech’s tutor terms and confirm the details above are true.</span>
            </label>
            {errors.agree && (
              <p className="-mt-2 text-xs font-semibold text-[#D7372C]">{errors.agree}</p>
            )}
          </div>
          <div className="min-h-8 flex-1" />
          <button type="submit" className={btn.big}>
            Submit application
          </button>
        </form>
      </AuthLayout>
    );

  if (step === 2)
    return (
      <AuthLayout>
        <form onSubmit={next2} noValidate className="flex flex-1 flex-col">
          <StepHeader onBack={() => setStep(1)} step={2} total={3} />
          <StepTitle kicker="Tutor application" title="Your teaching expertise" />
          <fieldset className="mt-6">
            <legend className="mb-2.5 text-sm font-semibold">Skills you can teach</legend>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => {
                const on = skills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSkills((xs) => (on ? xs.filter((x) => x !== s) : [...xs, s]))}
                    className={cn(
                      "inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold",
                      on ? "border-primary bg-primary text-white" : "border-border bg-white",
                    )}
                  >
                    {on && <Check size={14} strokeWidth={3} />}
                    {s}
                  </button>
                );
              })}
            </div>
            {errors.skills && (
              <p className="mt-2 text-xs font-semibold text-[#D7372C]">{errors.skills}</p>
            )}
          </fieldset>
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="t-yrs" className="text-sm font-semibold">
                Years of industry experience
              </label>
              <select
                id="t-yrs"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={selectCls}
              >
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <Field
              id="t-link"
              label="LinkedIn or portfolio link"
              type="url"
              value={form.link}
              onChange={set("link")}
              placeholder="https://"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="t-bio" className="text-sm font-semibold">
                Short bio
              </label>
              <textarea
                id="t-bio"
                rows={3}
                value={form.bio}
                onChange={set("bio")}
                aria-invalid={errors.bio ? true : undefined}
                placeholder="What you do, where you’ve worked, and how you like to teach"
                className={textareaCls}
              />
              {errors.bio && <p className="text-xs font-semibold text-[#D7372C]">{errors.bio}</p>}
            </div>
          </div>
          <div className="min-h-8 flex-1" />
          <button type="submit" className={cn(btn.big, "mt-6")}>
            Continue
          </button>
        </form>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <form onSubmit={next1} noValidate className="flex flex-1 flex-col">
        <StepHeader onBack={() => navigate({ to: "/join" })} step={1} total={3} />
        <StepTitle kicker="Tutor application" title="Tell us about yourself" />
        <div className="mt-7 flex flex-col gap-4">
          <Field
            id="t-name"
            label="Full name"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            placeholder="e.g. Tunde Bakare"
          />
          <Field
            id="t-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Field
            id="t-phone"
            label="Phone number"
            type="tel"
            prefix="+234"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            placeholder="809 000 0000"
          />
          <Field
            id="t-pass"
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
          Want to learn instead?{" "}
          <Link to="/join/student" className="font-bold text-[#D7372C] hover:underline">
            Join as a student
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

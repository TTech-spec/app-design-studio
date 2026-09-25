import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Avatar, Logo, SuccessArt } from "./ui";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="academy flex min-h-screen bg-white">
      <aside className="hidden w-[42%] max-w-[600px] shrink-0 flex-col bg-primary px-14 py-12 text-white lg:flex">
        <Logo light />
        <div className="flex-1" />
        <div className="rounded-[28px] bg-white py-7">
          <SuccessArt className="max-w-[340px]" />
        </div>
        <h2 className="mt-10 text-[34px] font-extrabold leading-tight">
          Learn the tech skills Nigeria is hiring for.
        </h2>
        <figure className="mt-6 rounded-2xl bg-white/8 p-5">
          <blockquote className="text-[15px] leading-relaxed text-white/90">
            “DarlTech Academy completely changed my career. I went from zero coding knowledge to
            landing a frontend dev role in 8 months.”
          </blockquote>
          <figcaption className="mt-3.5 flex items-center gap-2.5">
            <Avatar initials="AO" color="#EF4136" size={36} />
            <span className="flex flex-col">
              <span className="text-sm font-bold">Adebayo Okafor</span>
              <span className="text-xs text-white/70">Frontend Developer · Lagos</span>
            </span>
          </figcaption>
        </figure>
      </aside>
      <main className="flex flex-1 justify-center px-6 pb-8 pt-6 lg:items-center lg:py-10">
        <div className="flex w-full max-w-[440px] flex-col">{children}</div>
      </main>
    </div>
  );
}

export function StepHeader({
  onBack,
  step,
  total,
  label,
}: {
  onBack?: () => void;
  step?: number;
  total?: number;
  label?: string;
}) {
  const pct = step && total ? Math.round((step / total) * 100) : 0;
  return (
    <div>
      <div className="flex h-11 items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-3 flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>
        ) : (
          <span className="lg:hidden">
            <Logo />
          </span>
        )}
        {step && total ? (
          <span className="text-[13px] font-semibold text-muted-foreground">
            Step {step} of {total}
          </span>
        ) : label ? (
          <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>
        ) : null}
      </div>
      <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StepTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mt-7">
      <p className="text-[13px] font-semibold text-muted-foreground">{kicker}</p>
      <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight lg:text-[30px]">{title}</h1>
      {sub && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}

const inputCls =
  "h-[52px] w-full rounded-xl border border-primary-soft bg-surface px-4 text-[15px] text-primary outline-none transition placeholder:text-[#8a97b3] focus:border-primary focus:bg-white aria-[invalid=true]:border-[#D7372C]";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  prefix?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({
  id,
  label,
  error,
  hint,
  prefix,
  type = "text",
  className,
  ...rest
}: FieldProps) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="flex gap-2">
        {prefix && (
          <span className="flex h-[52px] items-center rounded-xl border border-primary-soft bg-surface px-3.5 text-[15px] font-semibold">
            {prefix}
          </span>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            type={isPw && show ? "text" : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
            className={cn(inputCls, isPw && "pr-12")}
            {...rest}
          />
          {isPw && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-xs font-semibold text-[#D7372C]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const selectCls =
  "h-[52px] w-full rounded-xl border border-primary-soft bg-surface px-3 text-[15px] text-primary outline-none focus:border-primary";
export const textareaCls =
  "w-full resize-none rounded-xl border border-primary-soft bg-surface px-4 py-3.5 text-[15px] leading-relaxed text-primary outline-none placeholder:text-[#8a97b3] focus:border-primary focus:bg-white";

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const passwordOk = (v: string) => v.length >= 8 && /\d/.test(v);

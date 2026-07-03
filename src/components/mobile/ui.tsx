import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, CheckCircle2, MapPin, Heart, Eye, EyeOff, Loader2, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import farmCassava from "@/assets/farm-cassava.jpg";
import farmGrains from "@/assets/farm-grains.jpg";
import farmVeg from "@/assets/farm-vegetables.jpg";
import farmCocoa from "@/assets/farm-cocoa.jpg";
import farmPoultry from "@/assets/farm-poultry.jpg";
import farmYam from "@/assets/farm-yam.jpg";

/* ============ FarmImage — real photography with deterministic pick ============ */
const FARM_PHOTOS = [farmCassava, farmGrains, farmVeg, farmCocoa, farmPoultry, farmYam];

export function FarmImage({ seed, className }: { seed: string; className?: string }) {
  const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % FARM_PHOTOS.length;
  const src = FARM_PHOTOS[idx];
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}


/* ============ VerificationBadge ============ */
export function VerificationBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 font-semibold text-primary",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      )}
    >
      <CheckCircle2 className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.5} />
      Verified
    </span>
  );
}

/* ============ Rating ============ */
export function Rating({ value, reviews, compact }: { value: number; reviews?: number; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
      {value.toFixed(1)}
      {reviews != null && !compact && <span className="text-muted-foreground font-normal">({reviews})</span>}
    </span>
  );
}

/* ============ FarmCard ============ */
export function FarmCard({ farm }: { farm: { id: string; name: string; location: string; crops: string[]; rating: number; reviews: number; verified: boolean; img: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to="/app/$screen"
        params={{ screen: "farm-profile" }}
        className="block overflow-hidden rounded-[18px] border border-border bg-card shadow-soft transition hover:shadow-card"
      >
        <div className="relative">
          <FarmImage seed={farm.img} className="aspect-[16/10]" />
          <button className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-soft">
            <Heart className="h-4 w-4 text-forest" />
          </button>
          {farm.verified && (
            <div className="absolute top-3 left-3">
              <VerificationBadge />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{farm.name}</h3>
            <Rating value={farm.rating} reviews={farm.reviews} compact />
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {farm.location}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {farm.crops.slice(0, 3).map((c) => (
              <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============ CropCard ============ */
export function CropCard({ crop }: { crop: { id: string; name: string; farm: string; price: string; unit: string; stock: string; rating: number; season: string; verified: boolean } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to="/app/$screen"
        params={{ screen: "crop-details" }}
        className="block overflow-hidden rounded-[18px] border border-border bg-card shadow-soft transition hover:shadow-card"
      >
        <FarmImage seed={crop.id + crop.name} className="aspect-square" />
        <div className="p-3">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-gold-foreground">
            <span className="rounded-full bg-gold-soft px-1.5 py-0.5">{crop.season}</span>
          </div>
          <h4 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground min-h-[2.5rem]">{crop.name}</h4>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{crop.farm}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-base font-bold text-forest">{crop.price}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">{crop.unit}</div>
          <div className="mt-2 flex items-center justify-between">
            <Rating value={crop.rating} compact />
            <span className="text-[10px] text-muted-foreground">{crop.stock}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============ SectionHeader ============ */
export function SectionHeader({ title, action, actionHref }: { title: string; action?: string; actionHref?: string }) {
  return (
    <div className="mb-3 mt-2 flex items-center justify-between">
      <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
      {action && actionHref && (
        <Link to="/app/$screen" params={{ screen: actionHref }} className="text-xs font-semibold text-primary">
          {action}
        </Link>
      )}
    </div>
  );
}

/* ============ PrimaryButton ============ */
const MotionLink = motion.create(Link);

export function PrimaryButton({
  children,
  href,
  to,
  onClick,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  icon,
  disabled,
  loading,
  type = "button",
}: {
  children: ReactNode;
  /** Prototype gallery navigation — links to /app/$screen with this slug. */
  href?: string;
  /** Real app route to link to, e.g. "/login". */
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "forest" | "gold" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow",
    forest: "bg-forest text-forest-foreground hover:bg-forest/90",
    gold: "bg-gold text-gold-foreground hover:bg-gold/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary hover:bg-primary-soft",
    ghost: "text-primary hover:bg-primary-soft",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-4 text-sm",
    lg: "h-13 px-5 text-[15px] min-h-[52px]",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    fullWidth && "w-full"
  );
  const body = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </>
  );
  const tapProps = { whileTap: { scale: 0.97 }, whileHover: { scale: 1.01 } };
  if (to) {
    return (
      <MotionLink to={to as never} className={cls} {...tapProps}>
        {body}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <MotionLink to="/app/$screen" params={{ screen: href } as never} className={cls} {...tapProps}>
        {body}
      </MotionLink>
    );
  }
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled || loading} className={cls} {...tapProps}>
      {body}
    </motion.button>
  );
}

/* ============ Input ============ */
export function TextInput({
  label,
  placeholder,
  icon,
  type = "text",
  hint,
  error,
  value,
  defaultValue,
  onChange,
  name,
  suffix,
  required,
  autoComplete,
  disabled,
  multiline,
  rows = 4,
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  type?: string;
  hint?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  suffix?: ReactNode;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;
  const isControlled = onChange !== undefined;

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <div
        className={cn(
          "flex h-13 min-h-[52px] items-center gap-2 rounded-2xl border-2 bg-card px-4 transition focus-within:border-primary",
          error ? "border-destructive" : "border-border",
          disabled && "opacity-60"
        )}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <input
          type={resolvedType}
          name={name}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          {...(isControlled
            ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) }
            : { defaultValue: value ?? defaultValue })}
          className="flex-1 min-w-0 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : (
          suffix
        )}
      </div>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ============ EmptyState ============ */
export function EmptyState({ icon, title, body, action, actionHref }: { icon?: ReactNode; title: string; body: string; action?: string; actionHref?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary-soft text-primary">
        {icon ?? <Sprout className="h-8 w-8" />}
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>
      {action && actionHref && (
        <div className="mt-5">
          <PrimaryButton href={actionHref} size="md" fullWidth={false}>
            {action}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

/* ============ OnboardingProgress ============ */
export function OnboardingProgress({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-forest">Step {step} of {total}</span>
        <span className="text-muted-foreground">{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-border")} />
        ))}
      </div>
    </div>
  );
}

/* ============ Chip ============ */
export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50"
      )}
    >
      {children}
    </motion.button>
  );
}

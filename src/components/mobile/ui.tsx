import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Star, CheckCircle2, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============ FarmImage — deterministic gradient art per farm ============ */
export function FarmImage({ seed, className }: { seed: string; className?: string }) {
  const palettes: [string, string, string][] = [
    ["#2f7d3a", "#8fc861", "#f4d35e"], // lush greens + gold
    ["#c98a1a", "#e8b85a", "#faead0"], // golden fields
    ["#1f6b5e", "#5cb99a", "#f0e6c8"], // tropical
    ["#a8412a", "#e0834c", "#ffd67e"], // vegetables
    ["#8b6d2e", "#d4a94b", "#fff2c6"], // poultry
    ["#4a3a1e", "#8b5a2b", "#d9b26a"], // cocoa
  ];
  const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length;
  const [a, b, c] = palettes[idx];
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${c} 0%, transparent 40%),
                     radial-gradient(circle at 80% 70%, ${b} 0%, transparent 45%),
                     linear-gradient(135deg, ${a}, ${b})`,
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={`M0,${50 + (idx * 5)} Q25,${30 + idx * 3} 50,${45 + idx * 4} T100,${40 + idx * 5} L100,100 L0,100 Z`} fill={a} opacity="0.5" />
        <path d={`M0,${70 + idx * 2} Q30,${55 + idx * 3} 60,${65 + idx * 2} T100,${60 + idx * 3} L100,100 L0,100 Z`} fill={a} opacity="0.7" />
      </svg>
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
  );
}

/* ============ CropCard ============ */
export function CropCard({ crop }: { crop: { id: string; name: string; farm: string; price: string; unit: string; stock: string; rating: number; season: string; verified: boolean } }) {
  return (
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
export function PrimaryButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  icon,
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "forest" | "gold" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
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
      {icon}
      {children}
    </>
  );
  if (href) {
    return (
      <Link to="/app/$screen" params={{ screen: href }} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {body}
    </button>
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
  suffix,
}: {
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  type?: string;
  hint?: string;
  error?: string;
  value?: string;
  suffix?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <div
        className={cn(
          "flex h-13 min-h-[52px] items-center gap-2 rounded-2xl border-2 bg-card px-4 transition focus-within:border-primary",
          error ? "border-destructive" : "border-border"
        )}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
        />
        {suffix}
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
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary-soft text-primary text-3xl">
        {icon ?? "🌱"}
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

/* ============ Chip ============ */
export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50"
      )}
    >
      {children}
    </button>
  );
}

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

type Props = {
  /** Large heading on the brand panel, e.g. "Welcome back to Agricon". */
  headline: string;
  /** Supporting copy under the headline. */
  tagline: string;
  /** Right-panel form heading, e.g. "Welcome back". */
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Links/copy rendered under the form, e.g. "New to Agricon? Create an account". */
  footer?: ReactNode;
};

/**
 * Shared desktop split-screen frame for the auth section: brand panel on the left,
 * form card on the right. Only rendered at `lg:` — pair with a `lg:hidden` MobileShell
 * for the small-viewport version of the same screen.
 */
export function AuthLayout({ headline, tagline, title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-surface p-8 xl:p-12">
      <div className="grid w-full max-w-[1100px] grid-cols-2 overflow-hidden rounded-[40px] shadow-pop">
        {/* Brand panel */}
        <div className="relative flex flex-col justify-between overflow-hidden p-10 xl:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/ChatGPT_Image_Jul_2__2026__09_53_57_AM-removebg-preview.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/90 via-forest/70 to-forest/95" />
          <div className="absolute inset-0 gradient-mesh opacity-30" />

          <Link to="/" className="relative z-10 flex items-center gap-2.5">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-lg ring-2 ring-white/20">
              <Sprout className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-white">AGRICON</p>
              <p className="-mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">Nigeria</p>
            </div>
          </Link>

          <div className="relative z-10 flex flex-1 items-center justify-center py-10">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="grid h-44 w-44 place-items-center rounded-[44px] bg-white/15 backdrop-blur-lg ring-2 ring-white/20 shadow-glow">
                <Sprout className="h-20 w-20 text-white" strokeWidth={1.8} />
              </div>
            </motion.div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white">{headline}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">{tagline}</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center bg-card p-10 xl:p-14">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-3xl font-black tracking-tight text-forest">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-muted-foreground">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

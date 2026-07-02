import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  width?: number;
  height?: number;
  className?: string;
};

/** A realistic modern-smartphone chrome — dynamic island, side buttons, camera, home indicator — wrapping arbitrary screen content. */
export function PhoneFrame({ children, width = 300, height = 620, className }: Props) {
  // The bezel's 10px padding is layered on top of the requested size (not carved out of it),
  // so the inner screen area is exactly `width x height` — matching what content scales itself to fill.
  const bezelWidth = width + 20;
  const bezelHeight = height + 20;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: bezelWidth + 14 }}>
      {/* Side buttons */}
      <div className="absolute -left-[2px] top-[92px] h-7 w-[3px] rounded-l-sm bg-neutral-600/90" />
      <div className="absolute -left-[2px] top-[128px] h-12 w-[3px] rounded-l-sm bg-neutral-600/90" />
      <div className="absolute -left-[2px] top-[184px] h-12 w-[3px] rounded-l-sm bg-neutral-600/90" />
      <div className="absolute -right-[2px] top-[140px] h-16 w-[3px] rounded-r-sm bg-neutral-600/90" />

      {/* Titanium-style bezel */}
      <div
        className="rounded-[52px] bg-gradient-to-br from-neutral-700 via-neutral-900 to-black p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
        style={{ width: bezelWidth, height: bezelHeight }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-surface ring-1 ring-black/40">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-[10px] z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black shadow-inner">
            <span className="absolute right-2 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
          </div>

          {/* Screen content */}
          <div className="h-full w-full">{children}</div>

          {/* Home indicator */}
          <div className="pointer-events-none absolute bottom-[7px] left-1/2 z-30 h-[4px] w-[112px] -translate-x-1/2 rounded-full bg-black/50" />

          {/* Screen glare */}
          <div className="pointer-events-none absolute inset-0 rounded-[42px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

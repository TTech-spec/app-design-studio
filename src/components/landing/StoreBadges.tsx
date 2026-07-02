import { cn } from "@/lib/utils";

export function AppStoreBadge({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-2.5 rounded-2xl bg-black px-5 py-2.5 transition hover:bg-neutral-800",
        className
      )}
    >
      <svg viewBox="0 0 384 512" className="h-7 w-7 shrink-0 fill-white" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 8 184.8 8 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-65.7-90-65.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <div className="text-left leading-none">
        <p className="text-[10px] text-white/80">Download on the</p>
        <p className="mt-0.5 text-base font-semibold text-white">App Store</p>
      </div>
    </a>
  );
}

export function GooglePlayBadge({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-2.5 rounded-2xl bg-black px-5 py-2.5 transition hover:bg-neutral-800",
        className
      )}
    >
      <svg viewBox="0 0 512 512" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path d="M99.6 8.6C94 14 91 22.3 91 33v446c0 10.7 3 19 8.7 24.4l2.5 2.2L342 264.4v-9L102 12z" fill="#00d9ff" />
        <path d="M420.9 342.6l-79.7-46-.3-.3-78.9-45.9v-.1L342 164.4l78.9 45.6c22.4 12.9 22.4 34.1 0 47.1z" fill="#ffbc00" />
        <path d="M341.2 355L263 276.9 99.6 440.2c6 6.3 15.9 7.1 27.1 0.8z" fill="#ff3a44" />
        <path d="M341.2 173.9L126.7 51.4c-11.2-6.4-21.1-5.5-27.1.8L263 216.1z" fill="#00f076" />
      </svg>
      <div className="text-left leading-none">
        <p className="text-[10px] text-white/80">GET IT ON</p>
        <p className="mt-0.5 text-base font-semibold text-white">Google Play</p>
      </div>
    </a>
  );
}

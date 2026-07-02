import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

export function SplashVisual({ onSkip }: { onSkip?: () => void }) {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gradient-mesh overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
          className="grid h-24 w-24 place-items-center rounded-[28px] bg-white/15 backdrop-blur-lg ring-2 ring-white/20"
        >
          <Sprout className="h-12 w-12 text-white" strokeWidth={2.5} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 text-4xl font-black tracking-tight text-white"
        >
          AGRICON
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
        >
          Nigeria
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 max-w-[240px] text-center text-sm text-white/90"
        >
          Nigeria's most trusted agricultural marketplace
        </motion.p>
      </motion.div>
      <div className="absolute bottom-14 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-white/80 underline underline-offset-4"
          >
            Skip intro →
          </button>
        )}
      </div>
    </div>
  );
}

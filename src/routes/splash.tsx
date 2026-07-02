import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SplashVisual } from "@/components/landing/SplashVisual";
import { useAuth } from "@/lib/auth-context";
import { hasSeenIntro, markIntroSeen } from "@/lib/onboarding-flags";

export const Route = createFileRoute("/splash")({
  head: () => ({ meta: [{ title: "Agricon NG" }] }),
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  function goNext() {
    if (session) {
      navigate({ to: "/home" });
      return;
    }
    if (hasSeenIntro()) {
      navigate({ to: "/signin" });
      return;
    }
    markIntroSeen();
    navigate({ to: "/intro" });
  }

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(goNext, 2600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);

  return <SplashVisual onSkip={goNext} />;
}

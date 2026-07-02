import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/otp")({
  head: () => ({ meta: [{ title: "Agricon NG — Verify your email" }] }),
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const { pendingEmail, pendingFlow, user, resendOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Check if user is already authenticated (magic link was clicked)
  useEffect(() => {
    if (user) {
      toast.success("Verified!");
      navigate({ to: "/create-password" });
    }
  }, [user, navigate]);

  async function handleResend() {
    setResending(true);
    try {
      await resendOtp();
      toast.success("Link resent to " + pendingEmail);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  const heading = pendingFlow === "recovery" ? "Verify it's you" : "Verify your email";

  const formFields = (
    <>
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-6">
        <Mail className="h-8 w-8" strokeWidth={2.2} />
      </div>
      <h2 className="text-2xl font-black text-forest">Check your email</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a magic link to <span className="font-semibold text-foreground">{pendingEmail ?? "your email"}</span>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Click the link in the email to verify your account and continue.
      </p>
      <div className="mt-8">
        <PrimaryButton onClick={() => navigate({ to: "/create-password" })} loading={loading}>
          I've clicked the link
        </PrimaryButton>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Didn't receive it?</span>
        <button
          type="button"
          disabled={resending}
          onClick={handleResend}
          className="font-semibold text-primary disabled:text-muted-foreground"
        >
          {resending ? "Sending..." : "Resend link"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone title={heading} showBottomNav={false}>
          {formFields}
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="Almost there."
          tagline="Verifying your email keeps every conversation on Agricon between real, verified people."
          title={heading}
        >
          {formFields}
        </AuthLayout>
      </div>
    </>
  );
}

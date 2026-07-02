import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Agricon NG — Reset your password" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) {
      setError("Enter the email associated with your account.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("Reset code sent to " + email);
      navigate({ to: "/otp" });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const formFields = (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TextInput label="Email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} error={error ?? undefined} autoComplete="email" />
      <div className="mt-4 space-y-3">
        <PrimaryButton type="submit" loading={loading}>Send reset code</PrimaryButton>
        <Link to="/signin" className="block text-center text-sm font-semibold text-primary py-2">Back to sign in</Link>
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone title="Reset your password" showBottomNav={false}>
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-6">
            <Lock className="h-8 w-8" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-black text-forest">Forgot password?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Enter the email associated with your account and we'll send you a reset code.</p>
          <div className="mt-6">{formFields}</div>
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="Forgot your password?"
          tagline="No problem — enter your email and we'll send a reset code straight to your inbox."
          title="Forgot password?"
          subtitle="Enter the email associated with your account and we'll send you a reset code."
        >
          {formFields}
        </AuthLayout>
      </div>
    </>
  );
}

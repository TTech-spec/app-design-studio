import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/create-password")({
  head: () => ({ meta: [{ title: "Agricon NG — Create password" }] }),
  component: CreatePasswordPage,
});

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

function CreatePasswordPage() {
  const navigate = useNavigate();
  const { pendingFlow, setNewPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const score = passwordStrength(password);
  const strengthLabel = ["Too weak", "Weak", "Fair", "Strong", "Very strong"][score];
  const hasMinLength = password.length >= 8;
  const hasCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  async function handleSubmit() {
    if (!hasMinLength) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    const flow = pendingFlow;
    try {
      await setNewPassword(password);
      toast.success(flow === "recovery" ? "Password updated!" : "Account created!");
      if (flow === "recovery") {
        navigate({ to: "/password-reset-success" });
      } else {
        navigate({ to: "/user-type" });
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const heading = pendingFlow === "recovery" ? "Reset password" : "Create password";

  const formFields = (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <TextInput
        label="New password"
        placeholder="At least 8 characters"
        type="password"
        icon={<Lock className="h-4 w-4" />}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />
      <TextInput
        label="Confirm password"
        placeholder="Re-enter password"
        type="password"
        icon={<Lock className="h-4 w-4" />}
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        error={error ?? undefined}
      />
      <div className="rounded-2xl bg-secondary p-4">
        <p className="text-xs font-semibold text-foreground mb-2">Password strength: <span className="text-primary">{password ? strengthLabel : "—"}</span></p>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasMinLength ? "text-primary" : "text-border"}`} /> At least 8 characters</li>
          <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasCase ? "text-primary" : "text-border"}`} /> Contains uppercase & lowercase</li>
          <li className="flex items-center gap-1.5"><CheckCircle2 className={`h-3 w-3 ${hasNumber ? "text-primary" : "text-border"}`} /> Contains a number</li>
        </ul>
      </div>
      <div className="mt-4">
        <PrimaryButton type="submit" loading={loading}>
          {pendingFlow === "recovery" ? "Reset password" : "Create account"}
        </PrimaryButton>
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone title="Create password" showBottomNav={false}>
          <p className="text-sm text-muted-foreground mb-6">Choose a strong password to secure your account.</p>
          {formFields}
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="Secure your account."
          tagline="A strong password keeps your farm, business, and buyer conversations protected."
          title={heading}
          subtitle="Choose a strong password to secure your account."
        >
          {formFields}
        </AuthLayout>
      </div>
    </>
  );
}

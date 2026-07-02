import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sprout, Mail, Lock } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Agricon NG — Sign in" }] }),
  component: SigninPage,
});

function SigninPage() {
  const navigate = useNavigate();
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithPassword(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/home" });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleOAuthStub(provider: string) {
    // TODO: wire real OAuth once Google/Apple providers are configured in Supabase.
    toast.info(`${provider} sign-in is coming soon.`);
  }

  const formFields = (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
    >
      <TextInput
        label="Email"
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />
      <TextInput
        label="Password"
        placeholder="Enter your password"
        type="password"
        icon={<Lock className="h-4 w-4" />}
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        error={error ?? undefined}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-2 border-border text-primary" defaultChecked />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link>
      </div>
      <div className="space-y-3 pt-4">
        <PrimaryButton type="submit" loading={loading}>Sign in</PrimaryButton>
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-surface px-3 text-xs text-muted-foreground">or continue with</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthStub("Google")}
            aria-label="Continue with Google"
            className="h-12 rounded-2xl border-2 border-border bg-card text-sm font-semibold hover:border-primary/40"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthStub("Apple")}
            aria-label="Continue with Apple"
            className="h-12 rounded-2xl border-2 border-border bg-card text-sm font-semibold hover:border-primary/40"
          >
            Apple
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone showBack={false} showBottomNav={false} fullBleed>
          <div className="flex h-full flex-col p-6">
            <div className="grid h-14 w-14 place-items-center rounded-[18px] gradient-primary shadow-glow">
              <Sprout className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="mt-8">
              <h1 className="text-3xl font-black tracking-tight text-forest">Welcome back</h1>
              <p className="mt-2 text-[15px] text-muted-foreground">Sign in to your Agricon account</p>
            </div>
            <div className="mt-8">{formFields}</div>
            <p className="mt-auto pt-6 text-center text-sm text-muted-foreground">
              New to Agricon?{" "}
              <Link to="/signup" className="font-semibold text-primary">Create an account</Link>
            </p>
          </div>
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="Nigeria's most trusted agricultural marketplace."
          tagline="Sign in to message verified farmers, track inquiries, and pick up right where you left off."
          title="Welcome back"
          subtitle="Sign in to your Agricon account"
          footer={
            <p className="text-center text-sm text-muted-foreground">
              New to Agricon?{" "}
              <Link to="/signup" className="font-semibold text-primary">Create an account</Link>
            </p>
          }
        >
          {formFields}
        </AuthLayout>
      </div>
    </>
  );
}

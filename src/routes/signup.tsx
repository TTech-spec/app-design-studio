import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton, TextInput } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";
import { useAuth, authErrorMessage } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Agricon NG — Create your account" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signUpWithOtp } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in every field to continue.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUpWithOtp({ email, firstName, lastName, phone });
      toast.success("Verification code sent to " + email);
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
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="First name" placeholder="Adekunle" value={firstName} onChange={setFirstName} />
        <TextInput label="Last name" placeholder="Kolawole" value={lastName} onChange={setLastName} />
      </div>
      <TextInput label="Email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} autoComplete="email" />
      <TextInput label="Phone" placeholder="+234 800 000 0000" icon={<Phone className="h-4 w-4" />} value={phone} onChange={setPhone} error={error ?? undefined} />
      <label className="flex items-start gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-2 border-border text-primary"
        />
        <span>I agree to the <span className="font-semibold text-primary">Terms of Service</span> and <span className="font-semibold text-primary">Privacy Policy</span></span>
      </label>
      <div className="mt-4">
        <PrimaryButton type="submit" loading={loading}>Continue</PrimaryButton>
      </div>
    </form>
  );

  const signInLink = (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link to="/signin" className="font-semibold text-primary">Sign in</Link>
    </p>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone title="Create your account" showBottomNav={false} backTo="/language">
          <p className="text-sm text-muted-foreground mb-6">Join thousands of verified farmers and distributors.</p>
          {formFields}
          <div className="mt-3">{signInLink}</div>
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="Join thousands of verified farmers and distributors."
          tagline="Create your Agricon account to list produce, source from verified farms, and trade with total confidence."
          title="Create your account"
          subtitle="Join thousands of verified farmers and distributors."
          footer={signInLink}
        >
          {formFields}
        </AuthLayout>
      </div>
    </>
  );
}

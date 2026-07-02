import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { PrimaryButton } from "@/components/mobile/ui";
import { AuthLayout } from "@/components/desktop/AuthLayout";

export const Route = createFileRoute("/password-reset-success")({
  head: () => ({ meta: [{ title: "Agricon NG — All set" }] }),
  component: PasswordResetSuccessPage,
});

function PasswordResetSuccessPage() {
  const icon = (
    <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-8 w-8" strokeWidth={3} />
      </div>
    </div>
  );
  const body = <p className="mt-6 max-w-xs text-[15px] text-muted-foreground">Your password has been reset successfully. Sign in with your new password.</p>;
  const cta = (
    <div className="mt-8 w-full">
      <PrimaryButton to="/signin">Continue to sign in</PrimaryButton>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileShell standalone showBack={false} showBottomNav={false}>
          <div className="flex h-full flex-col items-center justify-center text-center pb-20">
            {icon}
            <h1 className="mt-6 text-2xl font-black text-forest">All set!</h1>
            {body}
            {cta}
          </div>
        </MobileShell>
      </div>

      <div className="hidden lg:flex">
        <AuthLayout
          headline="You're all set."
          tagline="Your account is secure. Sign back in to keep sourcing and selling with confidence."
          title="All set!"
        >
          <div className="flex flex-col items-center text-center">
            {icon}
            {body}
            {cta}
          </div>
        </AuthLayout>
      </div>
    </>
  );
}

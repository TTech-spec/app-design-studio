import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAcademy } from "@/lib/academy/store";
import { AuthLayout, emailOk, Field, StepHeader } from "@/components/academy/auth";
import { btn } from "@/components/academy/ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · DarlTech Academy" }] }),
  component: Login,
});

function Login() {
  const { logIn } = useAcademy();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!emailOk(email)) err.email = "Enter a valid email address.";
    if (!password) err.password = "Enter your password.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const role = logIn(email.trim());
    navigate({ to: role === "tutor" ? "/tutor" : "/student" });
  };
  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <StepHeader onBack={() => navigate({ to: "/" })} />
        <div className="mt-7">
          <p className="text-[13px] font-semibold text-muted-foreground">Welcome back</p>
          <h1 className="mt-1.5 text-[26px] font-extrabold lg:text-[30px]">Log in to DarlTech</h1>
        </div>
        <div className="mt-7 flex flex-col gap-4">
          <Field
            id="l-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Field
            id="l-pass"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>
        <div className="min-h-8 flex-1" />
        <button type="submit" className={btn.big}>
          Log in
        </button>
        <p className="mt-3.5 text-center text-[13px] text-muted-foreground">
          New here?{" "}
          <Link to="/join" className="font-bold text-[#D7372C] hover:underline">
            Create a free account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

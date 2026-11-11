import { supabase } from "@/lib/supabase";
import type { AcademyUser, Role } from "./store";

/** Create a Supabase account for an academy student/tutor. Profile data lives in user_metadata. */
export async function academySignUp(user: AcademyUser, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: { academy: user, role: user.role, full_name: user.name, phone: user.phone },
    },
  });
  if (error) throw error;
  // Supabase returns a user with no identities when the email is already registered.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error("An account with this email already exists. Please log in.");
  }
  return { needsConfirmation: !data.session };
}

/** Sign in with Supabase and return the academy profile stored on the account. */
export async function academyLogIn(email: string, password: string): Promise<AcademyUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (/email not confirmed/i.test(error.message))
      throw new Error("Please confirm your email first — check your inbox for the link.");
    if (/invalid login credentials/i.test(error.message))
      throw new Error("Incorrect email or password.");
    throw error;
  }
  const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
  const stored = (meta.academy ?? {}) as Partial<AcademyUser>;
  const role: Role = (stored.role ?? meta.role) === "tutor" ? "tutor" : "student";
  const name =
    stored.name ??
    (meta.full_name as string | undefined) ??
    email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    interests: [],
    level: "Beginner",
    bio: "",
    skills: [],
    phone: (meta.phone as string | undefined) ?? "",
    ...stored,
    role,
    name,
    email: data.user.email ?? email,
  };
}

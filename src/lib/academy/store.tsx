import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { QUIZZES, type ChatMessage, type Post, type Quiz } from "./data";

/*
 * DarlTech app store. Accounts use Supabase Auth; profile, progress, enrollments,
 * quiz attempts, tutor quizzes and posts are stored in Supabase
 * (supabase/migrations/0011_academy_users.sql) and loaded on sign-in.
 */

export type Role = "student" | "tutor";

export type AcademyUser = {
  role: Role;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  level: string;
  bio: string;
  skills: string[];
  experience?: string;
  link?: string;
  availability?: string[];
  status?: "pending" | "approved";
};

export type Enrollment = {
  courseId: string;
  plan: "full" | "scholarship";
  progress: number;
  at: number;
};

export type MyAttempt = {
  id: string;
  quizId: string;
  score: number;
  correct: number;
  total: number;
  answers: number[];
  minutes: number;
  source: string;
  at: number;
};

export type PlusPlan = { billing: "monthly" | "annual"; startedAt: number };

export type ShareSettings = { cohorts: string[]; openToAll: boolean };

type State = {
  user: AcademyUser | null;
  tourDone: boolean;
  profileDone: boolean;
  previewWatched: boolean;
  enrollments: Enrollment[];
  cart: string[];
  owned: string[];
  follows: string[];
  likes: string[];
  posts: Post[];
  messages: Record<string, ChatMessage[]>;
  attempts: MyAttempt[];
  quizzes: Quiz[];
  shares: Record<string, ShareSettings>;
  plus: PlusPlan | null;
};

const EMPTY: State = {
  user: null,
  tourDone: false,
  profileDone: false,
  previewWatched: false,
  enrollments: [],
  cart: [],
  owned: [],
  follows: [],
  likes: [],
  posts: [],
  messages: {},
  attempts: [],
  quizzes: [],
  shares: {},
  plus: null,
};

type Actions = {
  signUp: (u: AcademyUser, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<Role>;
  updateUser: (patch: Partial<AcademyUser>) => void;
  signOut: () => void;
  completeTour: () => void;
  watchPreview: () => void;
  enroll: (courseId: string, plan: Enrollment["plan"]) => void;
  toggleCart: (id: string) => void;
  checkoutCart: () => void;
  toggleFollow: (tutorId: string) => void;
  toggleLike: (postId: string) => void;
  addPost: (p: Omit<Post, "id" | "time" | "likes" | "comments">) => void;
  sendMessage: (convId: string, text: string) => void;
  receiveMessage: (convId: string, text: string) => void;
  recordAttempt: (a: Omit<MyAttempt, "id" | "at">) => MyAttempt;
  saveQuiz: (q: Quiz) => void;
  setShare: (quizId: string, s: ShareSettings) => void;
  startTrial: (billing: PlusPlan["billing"]) => void;
  cancelPlus: () => void;
  reset: () => void;
};

type Ctx = State &
  Actions & { ready: boolean; allQuizzes: Quiz[]; quizById: (id: string) => Quiz | undefined };

const AcademyContext = createContext<Ctx | null>(null);

const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);
const clock = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/* ---------- Supabase mapping ---------- */

type ProfileRow = {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  level: string;
  bio: string;
  skills: string[];
  experience: string | null;
  link: string | null;
  availability: string[] | null;
  status: "pending" | "approved" | null;
  tour_done: boolean;
  profile_done: boolean;
  preview_watched: boolean;
  cart: string[];
  owned: string[];
  follows: string[];
  likes: string[];
  messages: Record<string, ChatMessage[]>;
  shares: Record<string, ShareSettings>;
  plus: PlusPlan | null;
};

const toRow = (id: string, s: State): ProfileRow | null =>
  s.user
    ? {
        id,
        role: s.user.role,
        name: s.user.name,
        email: s.user.email,
        phone: s.user.phone,
        interests: s.user.interests,
        level: s.user.level,
        bio: s.user.bio,
        skills: s.user.skills,
        experience: s.user.experience ?? null,
        link: s.user.link ?? null,
        availability: s.user.availability ?? null,
        status: s.user.status ?? null,
        tour_done: s.tourDone,
        profile_done: s.profileDone,
        preview_watched: s.previewWatched,
        cart: s.cart,
        owned: s.owned,
        follows: s.follows,
        likes: s.likes,
        messages: s.messages,
        shares: s.shares,
        plus: s.plus,
      }
    : null;

const fromRow = (r: ProfileRow): Partial<State> => ({
  user: {
    role: r.role,
    name: r.name,
    email: r.email,
    phone: r.phone,
    interests: r.interests ?? [],
    level: r.level,
    bio: r.bio,
    skills: r.skills ?? [],
    experience: r.experience ?? undefined,
    link: r.link ?? undefined,
    availability: r.availability ?? undefined,
    status: r.status ?? undefined,
  },
  tourDone: r.tour_done,
  profileDone: r.profile_done,
  previewWatched: r.preview_watched,
  cart: r.cart ?? [],
  owned: r.owned ?? [],
  follows: r.follows ?? [],
  likes: r.likes ?? [],
  messages: r.messages ?? {},
  shares: r.shares ?? {},
  plus: r.plus,
});

const ago = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
};

const fail = (what: string) => (e: { message?: string } | null) => {
  if (e) toast.error(`Couldn't save ${what}. ${e.message ?? ""}`.trim());
};

async function loadEverything(userId: string, email: string): Promise<Partial<State>> {
  const [profile, enr, att, quiz, posts] = await Promise.all([
    supabase.from("academy_profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("academy_enrollments").select("*").eq("user_id", userId).order("created_at"),
    supabase
      .from("academy_quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("academy_quizzes")
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false }),
    supabase.from("academy_posts").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const base: Partial<State> = profile.data
    ? fromRow(profile.data as ProfileRow)
    : {
        user: {
          role: "student",
          name: email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          phone: "",
          interests: [],
          level: "Beginner",
          bio: "",
          skills: [],
        },
        tourDone: true,
      };
  return {
    ...base,
    enrollments: (enr.data ?? []).map((e) => ({
      courseId: e.course_id,
      plan: e.plan,
      progress: e.progress,
      at: new Date(e.created_at).getTime(),
    })),
    attempts: (att.data ?? []).map((a) => ({
      id: a.id,
      quizId: a.quiz_id,
      score: a.score,
      correct: a.correct,
      total: a.total,
      answers: a.answers ?? [],
      minutes: a.minutes,
      source: a.source,
      at: new Date(a.created_at).getTime(),
    })),
    quizzes: (quiz.data ?? []).map((q) => q.data as Quiz),
    posts: (posts.data ?? []).map((p) => ({
      ...(p.data as Post),
      id: p.id,
      time: ago(p.created_at),
    })),
  };
}

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const userId = useRef<string | null>(null);
  const synced = useRef(false);

  const patch = useCallback(
    (fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })),
    [],
  );

  // Load the signed-in user's data from Supabase and follow sign-in / sign-out.
  useEffect(() => {
    let alive = true;
    const hydrate = async (id: string | null, email: string) => {
      synced.current = false;
      userId.current = id;
      if (!id) {
        setState(EMPTY);
        setReady(true);
        return;
      }
      try {
        const data = await loadEverything(id, email);
        if (alive && userId.current === id) setState({ ...EMPTY, ...data });
      } catch {
        /* offline or tables missing: keep going in memory */
      }
      if (alive) {
        synced.current = true;
        setReady(true);
      }
    };
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      hydrate(u?.id ?? null, u?.email ?? "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user;
      if (event === "SIGNED_OUT") hydrate(null, "");
      else if (event === "SIGNED_IN" && u && u.id !== userId.current) hydrate(u.id, u.email ?? "");
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Save profile, progress and preferences whenever they change (debounced).
  const row = userId.current ? toRow(userId.current, state) : null;
  const rowKey = row ? JSON.stringify(row) : "";
  useEffect(() => {
    if (!rowKey || !synced.current) return;
    const t = window.setTimeout(() => {
      supabase
        .from("academy_profiles")
        .upsert(JSON.parse(rowKey))
        .then(({ error }) => fail("your profile")(error));
    }, 600);
    return () => window.clearTimeout(t);
  }, [rowKey]);

  const actions = useMemo<Actions>(
    () => ({
      signUp: async (u, password) => {
        if (!supabaseConfigured) throw new Error("not configured");
        const { data, error } = await supabase.auth.signUp({
          email: u.email,
          password,
          options: { data: { name: u.name, role: u.role } },
        });
        if (error) throw error;
        let session = data.session;
        if (!session) {
          const r = await supabase.auth.signInWithPassword({ email: u.email, password });
          session = r.data.session;
          if (!session) throw new Error("Check your email to confirm your account, then log in.");
        }
        const id = session.user.id;
        userId.current = id;
        const next: State = { ...EMPTY, user: u };
        const { error: pErr } = await supabase.from("academy_profiles").upsert(toRow(id, next)!);
        if (pErr) throw pErr;
        setState(next);
        synced.current = true;
        setReady(true);
      },
      logIn: async (email, password) => {
        if (!supabaseConfigured) throw new Error("not configured");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const id = data.user.id;
        userId.current = id;
        synced.current = false;
        const loaded = await loadEverything(id, data.user.email ?? email);
        setState({ ...EMPTY, ...loaded });
        synced.current = true;
        setReady(true);
        return loaded.user?.role ?? "student";
      },
      updateUser: (p) =>
        patch((s) => ({ user: s.user ? { ...s.user, ...p } : s.user, profileDone: true })),
      signOut: () => {
        synced.current = false;
        userId.current = null;
        setState(EMPTY);
        void supabase.auth.signOut();
      },
      completeTour: () => patch(() => ({ tourDone: true })),
      watchPreview: () => patch(() => ({ previewWatched: true })),
      enroll: (courseId, plan) => {
        patch((s) => ({
          enrollments: [
            ...s.enrollments.filter((e) => e.courseId !== courseId),
            { courseId, plan, progress: 0, at: now() },
          ],
        }));
        if (userId.current)
          void supabase
            .from("academy_enrollments")
            .upsert(
              { user_id: userId.current, course_id: courseId, plan, progress: 0 },
              { onConflict: "user_id,course_id" },
            )
            .then(({ error }) => fail("your enrollment")(error));
      },
      toggleCart: (id) =>
        patch((s) => ({
          cart: s.cart.includes(id) ? s.cart.filter((c) => c !== id) : [...s.cart, id],
        })),
      checkoutCart: () =>
        patch((s) => ({ owned: Array.from(new Set([...s.owned, ...s.cart])), cart: [] })),
      toggleFollow: (t) =>
        patch((s) => ({
          follows: s.follows.includes(t) ? s.follows.filter((x) => x !== t) : [...s.follows, t],
        })),
      toggleLike: (p) =>
        patch((s) => ({
          likes: s.likes.includes(p) ? s.likes.filter((x) => x !== p) : [...s.likes, p],
        })),
      addPost: (p) => {
        const tmp = uid();
        patch((s) => ({
          posts: [{ ...p, id: tmp, time: "now", likes: 0, comments: 0 }, ...s.posts],
        }));
        if (userId.current)
          void supabase
            .from("academy_posts")
            .insert({ user_id: userId.current, data: { ...p, likes: 0, comments: 0 } })
            .select("id")
            .single()
            .then(({ data, error }) => {
              fail("your post")(error);
              if (data)
                patch((s) => ({
                  posts: s.posts.map((x) => (x.id === tmp ? { ...x, id: data.id } : x)),
                }));
            });
      },
      sendMessage: (c, text) =>
        patch((s) => ({
          messages: {
            ...s.messages,
            [c]: [...(s.messages[c] ?? []), { id: uid(), from: "me", text, time: clock() }],
          },
        })),
      receiveMessage: (c, text) =>
        patch((s) => ({
          messages: {
            ...s.messages,
            [c]: [...(s.messages[c] ?? []), { id: uid(), from: "them", text, time: clock() }],
          },
        })),
      recordAttempt: (a) => {
        const full: MyAttempt = { ...a, id: uid(), at: now() };
        patch((s) => ({ attempts: [full, ...s.attempts] }));
        if (userId.current)
          void supabase
            .from("academy_quiz_attempts")
            .insert({
              user_id: userId.current,
              quiz_id: a.quizId,
              score: a.score,
              correct: a.correct,
              total: a.total,
              answers: a.answers,
              minutes: a.minutes,
              source: a.source,
            })
            .then(({ error }) => fail("your quiz result")(error));
        return full;
      },
      saveQuiz: (q) => {
        patch((s) => ({ quizzes: [q, ...s.quizzes.filter((x) => x.id !== q.id)] }));
        if (userId.current)
          void supabase
            .from("academy_quizzes")
            .upsert({ id: q.id, owner_id: userId.current, data: q })
            .then(({ error }) => fail("the quiz")(error));
      },
      setShare: (id, sh) => patch((s) => ({ shares: { ...s.shares, [id]: sh } })),
      startTrial: (billing) => patch(() => ({ plus: { billing, startedAt: now() } })),
      cancelPlus: () => patch(() => ({ plus: null })),
      reset: () => setState(EMPTY),
    }),
    [patch],
  );

  const allQuizzes = useMemo(() => {
    const mine = state.quizzes;
    const base = QUIZZES.filter((q) => !mine.some((m) => m.id === q.id));
    return [...mine, ...base].map((q) => {
      const sh = state.shares[q.id];
      return sh ? { ...q, cohorts: sh.cohorts, openToAll: sh.openToAll } : q;
    });
  }, [state.quizzes, state.shares]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ...actions,
      ready,
      allQuizzes,
      quizById: (id: string) => allQuizzes.find((q) => q.id === id),
    }),
    [state, actions, ready, allQuizzes],
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy() {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error("useAcademy must be used inside <AcademyProvider>");
  return ctx;
}

/** Turns Supabase auth errors into plain messages for sign-up and log-in screens. */
export function authMessage(x: unknown) {
  const m = x instanceof Error ? x.message : String(x ?? "");
  if (!supabaseConfigured)
    return "Accounts aren't connected yet: the site is missing its Supabase settings.";
  if (/already registered|already exists/i.test(m))
    return "That email already has an account. Log in instead.";
  if (/invalid login/i.test(m)) return "Wrong email or password.";
  if (/email not confirmed|confirm your account/i.test(m))
    return "Please confirm your email first (check your inbox), then log in.";
  if (/signups? not allowed|signup is disabled/i.test(m))
    return "New sign-ups are switched off right now.";
  if (/password/i.test(m) && /least|short|weak/i.test(m))
    return "Please choose a longer, stronger password.";
  if (/rate limit|too many/i.test(m))
    return "Too many attempts. Please wait a minute and try again.";
  if (/failed to fetch|network/i.test(m))
    return "Couldn't reach the server. Check your connection and try again.";
  if (/academy_profiles|relation .* does not exist|schema cache/i.test(m))
    return "Your account was created but the database isn't set up yet. Please contact support.";
  if (/database error saving new user/i.test(m))
    return "The database rejected the new account. Please contact support.";
  return m || "Something went wrong. Please try again.";
}

export const firstName = (u: AcademyUser | null, fallback = "there") =>
  u?.name ? u.name.split(" ")[0] : fallback;

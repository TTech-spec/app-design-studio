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
import { QUIZZES, type ChatMessage, type Post, type Quiz } from "./data";

/*
 * Local demo store for the DarlTech app. State lives in React and is saved to
 * localStorage so a visitor's sign-up, enrollments and quiz attempts survive a refresh.
 * Swap these actions for Supabase calls when the backend is ready.
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
};

const KEY = "darltech_app_v1";

type Actions = {
  signUp: (u: AcademyUser) => void;
  logIn: (email: string) => Role;
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
  reset: () => void;
};

type Ctx = State &
  Actions & { ready: boolean; allQuizzes: Quiz[]; quizById: (id: string) => Quiz | undefined };

const AcademyContext = createContext<Ctx | null>(null);

const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);
const clock = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export function AcademyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* storage unavailable: run in memory */
    }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state]);

  const patch = useCallback(
    (fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })),
    [],
  );

  const actions = useMemo<Actions>(
    () => ({
      signUp: (u) => patch(() => ({ ...EMPTY, user: u })),
      logIn: (email) => {
        let role: Role = "student";
        setState((s) => {
          if (s.user && s.user.email.toLowerCase() === email.toLowerCase()) {
            role = s.user.role;
            return s;
          }
          const name = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return {
            ...s,
            user: {
              role,
              name,
              email,
              phone: "",
              interests: [],
              level: "Beginner",
              bio: "",
              skills: [],
            },
            tourDone: true,
          };
        });
        return role;
      },
      updateUser: (p) =>
        patch((s) => ({ user: s.user ? { ...s.user, ...p } : s.user, profileDone: true })),
      signOut: () => setState(EMPTY),
      completeTour: () => patch(() => ({ tourDone: true })),
      watchPreview: () => patch(() => ({ previewWatched: true })),
      enroll: (courseId, plan) =>
        patch((s) => ({
          enrollments: [
            ...s.enrollments.filter((e) => e.courseId !== courseId),
            { courseId, plan, progress: 0, at: now() },
          ],
        })),
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
      addPost: (p) =>
        patch((s) => ({
          posts: [{ ...p, id: uid(), time: "now", likes: 0, comments: 0 }, ...s.posts],
        })),
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
        return full;
      },
      saveQuiz: (q) => patch((s) => ({ quizzes: [q, ...s.quizzes.filter((x) => x.id !== q.id)] })),
      setShare: (id, sh) => patch((s) => ({ shares: { ...s.shares, [id]: sh } })),
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

export const firstName = (u: AcademyUser | null, fallback = "there") =>
  u?.name ? u.name.split(" ")[0] : fallback;

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Post } from "./data";

/*
 * Live data for the student dashboard, tutor dashboard and community page.
 * Tables come from supabase/migrations/0011 and 0012.
 */

export type Announcement = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  audience: string;
  created_at: string;
};
export type AcademyEvent = {
  id: string;
  title: string;
  kind: string;
  starts_at: string;
  ends_at: string | null;
  link: string | null;
  host: string | null;
  status: string;
};
export type Submission = {
  id: string;
  quiz_id: string;
  quiz_title: string | null;
  user_id: string;
  student_name: string;
  score: number;
  correct: number;
  total: number;
  created_at: string;
};
export type FeedPost = Post & { user_id: string; created_at: string; course?: string };
export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  author: string;
  text: string;
  created_at: string;
};

/** Current signed-in user id (null when signed out). */
export function useUserId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setId(data.session?.user.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setId(s?.user.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return id;
}

/** Refetch a query whenever one of the tables changes. */
function useLive(key: string, tables: string[]) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!supabaseConfigured) return;
    const ch = supabase.channel(`live-${key}-${Math.random().toString(36).slice(2)}`);
    for (const table of tables)
      ch.on("postgres_changes", { event: "*", schema: "public", table }, () =>
        qc.invalidateQueries({ queryKey: [key] }),
      );
    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [key, qc, tables.join()]);
}

const on = (uid: string | null) => supabaseConfigured && Boolean(uid);

export function useAnnouncements() {
  const uid = useUserId();
  useLive("announcements", ["academy_announcements"]);
  return useQuery({
    queryKey: ["announcements"],
    enabled: on(uid),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_announcements")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Announcement[];
    },
  });
}

export function useEvents() {
  const uid = useUserId();
  useLive("events", ["academy_events"]);
  return useQuery({
    queryKey: ["events"],
    enabled: on(uid),
    queryFn: async () => {
      const since = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("academy_events")
        .select("*")
        .eq("status", "scheduled")
        .gte("starts_at", since)
        .order("starts_at")
        .limit(20);
      if (error) throw error;
      return data as AcademyEvent[];
    },
  });
}

export function useCommunityStats() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["community-stats"],
    enabled: on(uid),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("academy_community_stats");
      if (error) throw error;
      const r = (Array.isArray(data) ? data[0] : data) as {
        members: number;
        active_week: number;
        students: number;
        tutors: number;
      } | null;
      return {
        members: Number(r?.members ?? 0),
        activeWeek: Number(r?.active_week ?? 0),
        students: Number(r?.students ?? 0),
        tutors: Number(r?.tutors ?? 0),
      };
    },
  });
}

export function useTutorSubmissions() {
  const uid = useUserId();
  useLive("tutor-submissions", ["academy_quiz_attempts"]);
  return useQuery({
    queryKey: ["tutor-submissions"],
    enabled: on(uid),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("academy_tutor_submissions");
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ["public-settings"],
    enabled: supabaseConfigured,
    queryFn: async () => {
      const { data } = await supabase
        .from("academy_settings")
        .select("cohort_name, applications_open, commitment_fee")
        .eq("id", 1)
        .maybeSingle();
      return (data ?? {
        cohort_name: "Cohort 2",
        applications_open: true,
        commitment_fee: 50000,
      }) as { cohort_name: string; applications_open: boolean; commitment_fee: number };
    },
  });
}

/* ---------------- community feed ---------------- */

export function useFeed() {
  const uid = useUserId();
  useLive("feed", ["academy_posts", "academy_post_likes", "academy_post_comments"]);
  return useQuery({
    queryKey: ["feed"],
    enabled: on(uid),
    queryFn: async () => {
      const [posts, likes, comments] = await Promise.all([
        supabase
          .from("academy_posts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("academy_post_likes").select("post_id, user_id").limit(5000),
        supabase.from("academy_post_comments").select("*").order("created_at").limit(2000),
      ]);
      if (posts.error) throw posts.error;
      const likeMap = new Map<string, Set<string>>();
      for (const l of likes.data ?? []) {
        if (!likeMap.has(l.post_id)) likeMap.set(l.post_id, new Set());
        likeMap.get(l.post_id)!.add(l.user_id);
      }
      const commentMap = new Map<string, Comment[]>();
      for (const c of (comments.data ?? []) as Comment[]) {
        if (!commentMap.has(c.post_id)) commentMap.set(c.post_id, []);
        commentMap.get(c.post_id)!.push(c);
      }
      return (posts.data ?? []).map((p) => {
        const who = likeMap.get(p.id) ?? new Set<string>();
        const cs = commentMap.get(p.id) ?? [];
        return {
          ...(p.data as Post & { course?: string }),
          id: p.id as string,
          user_id: p.user_id as string,
          created_at: p.created_at as string,
          likes: who.size,
          comments: cs.length,
          likedByMe: uid ? who.has(uid) : false,
          commentList: cs,
        };
      });
    },
  });
}

export type FeedItem = NonNullable<ReturnType<typeof useFeed>["data"]>[number];

export function useFeedActions() {
  const qc = useQueryClient();
  const uid = useUserId();
  const refresh = () => qc.invalidateQueries({ queryKey: ["feed"] });
  const err = (e: Error) => toast.error(e.message);

  const post = useMutation({
    mutationFn: async (
      p: Omit<Post, "id" | "time" | "likes" | "comments"> & { course?: string },
    ) => {
      if (!uid) throw new Error("Please log in to post.");
      const { error } = await supabase
        .from("academy_posts")
        .insert({ user_id: uid, data: { ...p, likes: 0, comments: 0 } });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Posted");
      refresh();
    },
    onError: err,
  });

  const like = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!uid) throw new Error("Please log in.");
      const q = liked
        ? supabase.from("academy_post_likes").delete().eq("post_id", postId).eq("user_id", uid)
        : supabase.from("academy_post_likes").insert({ post_id: postId, user_id: uid });
      const { error } = await q;
      if (error) throw error;
    },
    onMutate: async ({ postId, liked }) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      qc.setQueryData<FeedItem[]>(["feed"], (old) =>
        old?.map((p) =>
          p.id === postId ? { ...p, likedByMe: !liked, likes: p.likes + (liked ? -1 : 1) } : p,
        ),
      );
    },
    onSettled: refresh,
    onError: err,
  });

  const comment = useMutation({
    mutationFn: async ({
      postId,
      text,
      author,
    }: {
      postId: string;
      text: string;
      author: string;
    }) => {
      if (!uid) throw new Error("Please log in.");
      const { error } = await supabase
        .from("academy_post_comments")
        .insert({ post_id: postId, user_id: uid, author, text });
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: err,
  });

  const remove = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("academy_posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      refresh();
    },
    onError: err,
  });

  return { post, like, comment, remove, uid };
}

export const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} days ago`;
  return new Date(iso).toLocaleDateString();
};

export const fmtEvent = (iso: string, end?: string | null) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const t = (x: Date) =>
    x.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${date} • ${t(d)}${end ? ` – ${t(new Date(end))}` : ""}`;
};

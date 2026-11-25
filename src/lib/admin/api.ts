import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase, supabaseConfigured } from "@/lib/supabase";

/* ---------------- types (mirror supabase/migrations/0010_academy_admin.sql) ---------------- */

export type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: "student" | "tutor";
  track: string | null;
  status: "active" | "pending" | "suspended";
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  weeks: number;
  price: number;
  tutor_name: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
};

export type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  track: string;
  cohort: string;
  scholarship: boolean;
  motivation: string | null;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  admin_note: string | null;
  created_at: string;
};

export type Payment = {
  id: string;
  application_id: string | null;
  payer_name: string;
  email: string | null;
  amount: number;
  currency: string;
  purpose: "commitment_fee" | "tuition" | "certificate" | "other";
  reference: string | null;
  status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
};

export type Settings = {
  id: number;
  cohort_name: string;
  applications_open: boolean;
  commitment_fee: number;
  support_email: string | null;
  whatsapp_number: string | null;
};

export type TableName =
  "academy_members" | "academy_courses" | "academy_applications" | "academy_payments";
type RowOf<T extends TableName> = T extends "academy_members"
  ? Member
  : T extends "academy_courses"
    ? Course
    : T extends "academy_applications"
      ? Application
      : Payment;

export const TRACKS = [
  "Web Development",
  "Backend Development",
  "UI/UX Design",
  "Data Analytics",
  "Data Science",
  "AI Automation",
  "DevOps & Cloud Computing",
  "Cyber Security",
  "Python Development",
  "Product Management",
  "Graphics Design",
  "Robotics Engineering",
];

export const isConfigured = supabaseConfigured;

export const naira = (n: number) =>
  `₦${Number(n || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

/* ---------------- auth / admin check ---------------- */

export function useAdminSession() {
  const qc = useQueryClient();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      qc.invalidateQueries({ queryKey: ["admin-session"] });
    });
    return () => data.subscription.unsubscribe();
  }, [qc]);
  return useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      if (!user) return { user: null, isAdmin: false };
      const { data: ok, error } = await supabase.rpc("is_academy_admin");
      if (error) throw error;
      return { user, isAdmin: Boolean(ok) };
    },
    enabled: isConfigured,
    staleTime: 60_000,
  });
}

/* ---------------- generic table hooks ---------------- */

export function useTable<T extends TableName>(table: T) {
  const qc = useQueryClient();
  // live updates: any change refetches the table
  useEffect(() => {
    if (!isConfigured) return;
    const ch = supabase
      .channel(`admin-${table}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        qc.invalidateQueries({ queryKey: [table] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [table, qc]);

  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as RowOf<T>[];
    },
    enabled: isConfigured,
  });
}

export function useSave<T extends TableName>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<RowOf<T>> & { id?: string }) => {
      const {
        id,
        created_at: _c,
        ...rest
      } = row as Record<string, unknown> & { id?: string; created_at?: string };
      const q = id
        ? supabase.from(table).update(rest).eq("id", id)
        : supabase.from(table).insert(rest);
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: (_d, row) => {
      toast.success(row.id ? "Saved" : "Created");
      qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemove(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["academy_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as Settings | null;
    },
    enabled: isConfigured,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<Settings>) => {
      const { error } = await supabase.from("academy_settings").upsert({ ...s, id: 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["academy_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

/* ---------------- helpers for charts ---------------- */

/** Groups rows into the last `weeks` weeks (oldest first). */
export function weeklySeries<R extends { created_at: string }>(
  rows: R[],
  weeks: number,
  value: (r: R) => number = () => 1,
) {
  const now = Date.now();
  const WEEK = 7 * 24 * 3600 * 1000;
  const buckets = Array.from({ length: weeks }, (_, i) => ({ label: `Wk ${i + 1}`, value: 0 }));
  for (const r of rows) {
    const age = Math.floor((now - new Date(r.created_at).getTime()) / WEEK);
    if (age >= 0 && age < weeks) buckets[weeks - 1 - age].value += value(r);
  }
  return buckets;
}

export function growth(rows: { created_at: string }[], days = 30) {
  const now = Date.now();
  const span = days * 24 * 3600 * 1000;
  const cur = rows.filter((r) => now - new Date(r.created_at).getTime() < span).length;
  const prev = rows.filter((r) => {
    const a = now - new Date(r.created_at).getTime();
    return a >= span && a < 2 * span;
  }).length;
  if (!prev) return cur ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 100);
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Download,
  FileText,
  GraduationCap,
  Settings as SettingsIcon,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  TRACKS,
  downloadCsv,
  growth,
  naira,
  useSaveSettings,
  useSettings,
  useTable,
  weeklySeries,
  type Application,
  type Course,
  type Member,
  type Payment,
} from "@/lib/admin/api";
import {
  Avatar,
  Bars,
  Btn,
  CrudTable,
  Empty,
  LineChart,
  NAVY,
  Page,
  Panel,
  Pill,
  RED,
  Stat,
  rise,
  timeAgo,
  type Field,
} from "./kit";

const money = (n: number) => naira(n);

/* ======================= Dashboard ======================= */

export function AdminHome() {
  const members = useTable("academy_members");
  const apps = useTable("academy_applications");
  const pays = useTable("academy_payments");
  const courses = useTable("academy_courses");
  const [range, setRange] = useState(4);

  const m = members.data ?? [];
  const a = apps.data ?? [];
  const paid = (pays.data ?? []).filter((p) => p.status === "paid");
  const students = m.filter((x) => x.role === "student");
  const tutors = m.filter((x) => x.role === "tutor");
  const revenue = paid.reduce((s, p) => s + Number(p.amount), 0);
  const loading = members.isLoading || apps.isLoading || pays.isLoading;

  const series = useMemo(
    () => [
      { name: "Applications", color: "#2563EB", points: weeklySeries(a, range) },
      {
        name: "Revenue",
        color: RED,
        points: weeklySeries(paid, range, (p) => Number(p.amount)),
        format: money,
      },
    ],
    [a, paid, range],
  );

  return (
    <Page
      title="Admin Dashboard"
      subtitle="Overview of your academy platform · updates live"
      actions={
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
          {[
            [4, "30 days"],
            [12, "90 days"],
            [26, "6 months"],
          ].map(([w, l]) => (
            <button
              key={w}
              onClick={() => setRange(w as number)}
              className="relative rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              {range === w && (
                <motion.span
                  layoutId="range"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: NAVY }}
                />
              )}
              <span className={range === w ? "relative text-white" : "relative text-slate-500"}>
                {l}
              </span>
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Users}
          tint="#2563EB"
          label="Total Students"
          value={students.length}
          delta={growth(students)}
          loading={loading}
        />
        <Stat
          icon={Users}
          tint="#7C3AED"
          label="Total Tutors"
          value={tutors.length}
          delta={growth(tutors)}
          loading={loading}
        />
        <Stat
          icon={Wallet}
          tint="#059669"
          label="Total Revenue"
          value={revenue}
          format={money}
          delta={growth(paid)}
          loading={loading}
        />
        <Stat
          icon={FileText}
          tint="#D97706"
          label="Applications"
          value={a.length}
          delta={growth(a)}
          loading={loading}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Platform Analytics"
          action={
            <div className="flex gap-4 text-xs text-slate-600">
              {series.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
              ))}
            </div>
          }
        >
          <LineChart series={series} />
        </Panel>
        <Panel
          title="Recent Applications"
          action={
            <Link
              to="/admin/applications"
              search={{ q: "" }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {a.length ? (
            <ul className="space-y-3">
              {a.slice(0, 5).map((x, i) => (
                <motion.li
                  key={x.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.06 } }}
                  className="flex items-center gap-3"
                >
                  <Avatar name={x.full_name} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                      {x.full_name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {x.track} · {timeAgo(x.created_at)}
                    </p>
                  </div>
                  <Pill value={x.status} />
                </motion.li>
              ))}
            </ul>
          ) : (
            <Empty
              title="No applications yet"
              hint="New Cohort applications will appear here instantly."
            />
          )}
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Quick Actions">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                [Users, "Manage Users", "/admin/users"],
                [BookOpen, "Manage Courses", "/admin/courses"],
                [BarChart3, "View Reports", "/admin/reports"],
                [SettingsIcon, "Settings", "/admin/settings"],
              ] as const
            ).map(([Icon, l, to]) => (
              <motion.div key={l} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to={to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 p-4 text-center text-xs font-semibold transition hover:border-blue-200 hover:bg-blue-50/40"
                  style={{ color: NAVY }}
                >
                  <Icon className="h-6 w-6 text-blue-600" />
                  {l}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              [
                "Published courses",
                (courses.data ?? []).filter((c) => c.status === "published").length,
              ],
              ["Pending applications", a.filter((x) => x.status === "pending").length],
              ["Pending payments", (pays.data ?? []).filter((p) => p.status === "pending").length],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xl font-extrabold" style={{ color: NAVY }}>
                  {v}
                </p>
                <p className="text-xs text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </Panel>
        <motion.div
          variants={rise}
          className="relative flex items-center gap-4 overflow-hidden rounded-2xl p-6 text-white"
          style={{ backgroundColor: NAVY }}
        >
          <motion.div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
            style={{ backgroundColor: RED }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
          <motion.span
            animate={{ y: [0, -6, 0], rotate: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <GraduationCap className="h-14 w-14" />
          </motion.span>
          <div className="relative">
            <p className="text-lg font-bold">DarlTech Academy</p>
            <p className="text-sm text-white/70">Building Africa's Next Generation Tech Talent</p>
          </div>
        </motion.div>
      </div>
    </Page>
  );
}

/* ======================= Users ======================= */

const memberFields: Field[] = [
  { key: "full_name", label: "Full name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role", type: "select", options: ["student", "tutor"], required: true },
  { key: "track", label: "Track", type: "select", options: TRACKS },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["active", "pending", "suspended"],
    required: true,
  },
];

export function AdminUsers() {
  return (
    <CrudTable<Member>
      table="academy_members"
      title="Users"
      subtitle="Students and tutors in the academy"
      statuses={["active", "pending", "suspended"]}
      searchKeys={["full_name", "email", "track"]}
      defaults={{ role: "student", status: "active" }}
      fields={memberFields}
      columns={[
        {
          label: "Name",
          render: (r) => (
            <div className="flex items-center gap-3">
              <Avatar name={r.full_name} size={34} />
              <div>
                <p className="font-semibold" style={{ color: NAVY }}>
                  {r.full_name}
                </p>
                <p className="text-xs text-slate-500">{r.email}</p>
              </div>
            </div>
          ),
        },
        { label: "Role", render: (r) => <Pill value={r.role} /> },
        { label: "Track", render: (r) => <span className="text-slate-600">{r.track ?? "—"}</span> },
        { label: "Status", render: (r) => <Pill value={r.status} /> },
        {
          label: "Joined",
          render: (r) => <span className="text-slate-500">{timeAgo(r.created_at)}</span>,
        },
      ]}
    />
  );
}

/* ======================= Courses ======================= */

export function AdminCourses() {
  return (
    <CrudTable<Course>
      table="academy_courses"
      title="Courses"
      subtitle="Tracks offered by the academy. Published courses are visible to the public."
      statuses={["published", "draft", "archived"]}
      searchKeys={["title", "tutor_name", "level"]}
      defaults={{ level: "Beginner", weeks: 12, price: 0, status: "draft" }}
      fields={[
        { key: "title", label: "Title", required: true },
        {
          key: "level",
          label: "Level",
          type: "select",
          options: ["Beginner", "Intermediate", "Advanced"],
          required: true,
        },
        { key: "weeks", label: "Duration (weeks)", type: "number", required: true },
        { key: "price", label: "Price (₦)", type: "number" },
        { key: "tutor_name", label: "Tutor" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["draft", "published", "archived"],
          required: true,
        },
      ]}
      columns={[
        {
          label: "Course",
          render: (r) => (
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0B1F4D] text-xs font-bold text-blue-200">
                &lt;/&gt;
              </span>
              <div>
                <p className="font-semibold" style={{ color: NAVY }}>
                  {r.title}
                </p>
                <p className="text-xs text-slate-500">{r.tutor_name ?? "No tutor yet"}</p>
              </div>
            </div>
          ),
        },
        { label: "Level", render: (r) => r.level },
        { label: "Duration", render: (r) => `${r.weeks} weeks` },
        { label: "Price", render: (r) => (Number(r.price) ? money(r.price) : "Free") },
        { label: "Status", render: (r) => <Pill value={r.status} /> },
      ]}
      rowActions={(r, save) =>
        r.status !== "published" ? (
          <button
            onClick={() => save({ status: "published" })}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
          >
            Publish
          </button>
        ) : null
      }
    />
  );
}

/* ======================= Applications / Scholarships ======================= */

const appFields: Field[] = [
  { key: "full_name", label: "Full name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone" },
  { key: "track", label: "Track", type: "select", options: TRACKS, required: true },
  { key: "cohort", label: "Cohort", required: true },
  { key: "scholarship", label: "Applying for scholarship", type: "checkbox" },
  { key: "motivation", label: "Motivation", type: "textarea" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["pending", "approved", "rejected", "waitlisted"],
    required: true,
  },
  { key: "admin_note", label: "Admin note", type: "textarea" },
];

function decision(r: Application, save: (p: Partial<Application>) => void) {
  if (r.status !== "pending") return null;
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.85 }}
        aria-label="Approve"
        title="Approve"
        onClick={() => save({ status: "approved" })}
        className="grid h-8 w-8 place-items-center rounded-lg text-green-600 hover:bg-green-50"
      >
        <Check className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        aria-label="Reject"
        title="Reject"
        onClick={() => save({ status: "rejected" })}
        className="grid h-8 w-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </>
  );
}

const appColumns = [
  {
    label: "Applicant",
    render: (r: Application) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.full_name} size={34} />
        <div>
          <p className="font-semibold" style={{ color: NAVY }}>
            {r.full_name}
          </p>
          <p className="text-xs text-slate-500">{r.email}</p>
        </div>
      </div>
    ),
  },
  { label: "Track", render: (r: Application) => <span className="text-slate-600">{r.track}</span> },
  {
    label: "Cohort",
    render: (r: Application) => <span className="text-slate-600">{r.cohort}</span>,
  },
  { label: "Status", render: (r: Application) => <Pill value={r.status} /> },
  {
    label: "Applied",
    render: (r: Application) => <span className="text-slate-500">{timeAgo(r.created_at)}</span>,
  },
];

export function AdminApplications({ q = "" }: { q?: string }) {
  return (
    <CrudTable<Application>
      table="academy_applications"
      title="Applications"
      subtitle="Every Cohort application. Approve or reject with one click."
      statuses={["pending", "approved", "waitlisted", "rejected"]}
      searchKeys={["full_name", "email", "track", "phone"]}
      defaults={{ status: "pending", cohort: "Cohort 2", scholarship: false }}
      fields={appFields}
      columns={appColumns}
      rowActions={decision}
      initialQuery={q}
    />
  );
}

const isScholarship = (r: Application) => r.scholarship;

export function AdminScholarships() {
  return (
    <CrudTable<Application>
      table="academy_applications"
      title="Scholarships"
      subtitle="Applicants for the Cohort scholarship (₦50,000 commitment fee on acceptance)."
      statuses={["pending", "approved", "waitlisted", "rejected"]}
      searchKeys={["full_name", "email", "track"]}
      defaults={{ status: "pending", cohort: "Cohort 2", scholarship: true }}
      fields={appFields}
      columns={appColumns}
      filter={isScholarship}
      rowActions={decision}
    />
  );
}

/* ======================= Payments ======================= */

export function AdminPayments() {
  return (
    <CrudTable<Payment>
      table="academy_payments"
      title="Payments"
      subtitle="Commitment fees, tuition and certificate payments"
      statuses={["paid", "pending", "failed", "refunded"]}
      searchKeys={["payer_name", "email", "reference"]}
      defaults={{ currency: "NGN", purpose: "commitment_fee", status: "pending", amount: 50000 }}
      fields={[
        { key: "payer_name", label: "Payer name", required: true },
        { key: "email", label: "Email", type: "email" },
        { key: "amount", label: "Amount (₦)", type: "number", required: true },
        {
          key: "purpose",
          label: "Purpose",
          type: "select",
          options: ["commitment_fee", "tuition", "certificate", "other"],
          required: true,
        },
        { key: "reference", label: "Payment reference" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["pending", "paid", "failed", "refunded"],
          required: true,
        },
      ]}
      columns={[
        {
          label: "Payer",
          render: (r) => (
            <div className="flex items-center gap-3">
              <Avatar name={r.payer_name} size={34} />
              <div>
                <p className="font-semibold" style={{ color: NAVY }}>
                  {r.payer_name}
                </p>
                <p className="text-xs text-slate-500">{r.email ?? "—"}</p>
              </div>
            </div>
          ),
        },
        {
          label: "Amount",
          render: (r) => (
            <span className="font-semibold" style={{ color: NAVY }}>
              {money(r.amount)}
            </span>
          ),
        },
        {
          label: "Purpose",
          render: (r) => (
            <span className="capitalize text-slate-600">{r.purpose.replace(/_/g, " ")}</span>
          ),
        },
        {
          label: "Reference",
          render: (r) => (
            <span className="font-mono text-xs text-slate-500">{r.reference ?? "—"}</span>
          ),
        },
        { label: "Status", render: (r) => <Pill value={r.status} /> },
        {
          label: "Date",
          render: (r) => (
            <span className="text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
          ),
        },
      ]}
      rowActions={(r, save) =>
        r.status === "pending" ? (
          <button
            onClick={() => save({ status: "paid" })}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
          >
            Mark paid
          </button>
        ) : null
      }
    />
  );
}

/* ======================= Reports ======================= */

export function AdminReports() {
  const apps = useTable("academy_applications").data ?? [];
  const members = useTable("academy_members").data ?? [];
  const pays = useTable("academy_payments").data ?? [];
  const paid = pays.filter((p) => p.status === "paid");
  const byTrack = TRACKS.map((t) => ({ label: t, value: apps.filter((a) => a.track === t).length }))
    .filter((r) => r.value)
    .sort((a, b) => b.value - a.value);
  const decided = apps.filter((a) => a.status !== "pending");
  const approval = decided.length
    ? Math.round((apps.filter((a) => a.status === "approved").length / decided.length) * 100)
    : 0;
  const purposes = ["commitment_fee", "tuition", "certificate", "other"]
    .map((p) => ({
      label: p.replace(/_/g, " "),
      value: paid.filter((x) => x.purpose === p).reduce((s, x) => s + Number(x.amount), 0),
    }))
    .filter((r) => r.value);

  return (
    <Page
      title="Reports"
      subtitle="How the academy is doing"
      actions={
        <>
          <Btn variant="ghost" onClick={() => downloadCsv("applications", apps as never)}>
            <Download className="h-4 w-4" /> Applications CSV
          </Btn>
          <Btn variant="ghost" onClick={() => downloadCsv("payments", pays as never)}>
            <Download className="h-4 w-4" /> Payments CSV
          </Btn>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={FileText}
          tint="#2563EB"
          label="Approval rate"
          value={approval}
          format={(n) => `${Math.round(n)}%`}
        />
        <Stat
          icon={Wallet}
          tint="#059669"
          label="Collected"
          value={paid.reduce((s, p) => s + Number(p.amount), 0)}
          format={money}
        />
        <Stat
          icon={Wallet}
          tint="#D97706"
          label="Outstanding"
          value={pays
            .filter((p) => p.status === "pending")
            .reduce((s, p) => s + Number(p.amount), 0)}
          format={money}
        />
        <Stat
          icon={Users}
          tint="#7C3AED"
          label="Active members"
          value={members.filter((m) => m.status === "active").length}
        />
      </div>
      <Panel title="Growth over 12 weeks">
        <LineChart
          series={[
            { name: "Applications", color: "#2563EB", points: weeklySeries(apps, 12) },
            { name: "New members", color: "#7C3AED", points: weeklySeries(members, 12) },
            {
              name: "Revenue",
              color: RED,
              points: weeklySeries(paid, 12, (p) => Number(p.amount)),
              format: money,
            },
          ]}
          height={260}
        />
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Applications by track">
          <Bars rows={byTrack} color="#2563EB" />
        </Panel>
        <Panel title="Revenue by purpose (₦)">
          <Bars rows={purposes} />
        </Panel>
      </div>
    </Page>
  );
}

/* ======================= Settings ======================= */

export function AdminSettings() {
  const { data, isLoading } = useSettings();
  const save = useSaveSettings();
  const [v, setV] = useState({
    cohort_name: "",
    applications_open: true,
    commitment_fee: 50000,
    support_email: "",
    whatsapp_number: "",
  });
  useEffect(() => {
    if (data)
      setV({
        cohort_name: data.cohort_name,
        applications_open: data.applications_open,
        commitment_fee: Number(data.commitment_fee),
        support_email: data.support_email ?? "",
        whatsapp_number: data.whatsapp_number ?? "",
      });
  }, [data]);
  const input =
    "h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-blue-200 focus:ring-2";
  return (
    <Page title="Settings" subtitle="Academy-wide configuration">
      <Panel className="max-w-2xl">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-slate-50" />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate({
                ...v,
                support_email: v.support_email || null,
                whatsapp_number: v.whatsapp_number || null,
              });
            }}
            className="space-y-5"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Current cohort
              </span>
              <input
                className={input}
                value={v.cohort_name}
                onChange={(e) => setV({ ...v, cohort_name: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Commitment fee (₦)
              </span>
              <input
                type="number"
                min={0}
                className={input}
                value={v.commitment_fee}
                onChange={(e) => setV({ ...v, commitment_fee: Number(e.target.value) })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Support email</span>
              <input
                type="email"
                className={input}
                value={v.support_email}
                onChange={(e) => setV({ ...v, support_email: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                WhatsApp number
              </span>
              <input
                className={input}
                value={v.whatsapp_number}
                onChange={(e) => setV({ ...v, whatsapp_number: e.target.value })}
                placeholder="+234…"
              />
            </label>
            <button
              type="button"
              onClick={() => setV({ ...v, applications_open: !v.applications_open })}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4"
            >
              <span className="text-left">
                <span className="block text-sm font-semibold" style={{ color: NAVY }}>
                  Applications open
                </span>
                <span className="text-xs text-slate-500">Turn off to close the current cohort</span>
              </span>
              <span
                className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${v.applications_open ? "justify-end bg-green-500" : "justify-start bg-slate-300"}`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                  className="h-5 w-5 rounded-full bg-white shadow"
                />
              </span>
            </button>
            <div className="flex justify-end">
              <Btn type="submit" disabled={save.isPending}>
                Save changes
              </Btn>
            </div>
          </form>
        )}
      </Panel>
    </Page>
  );
}

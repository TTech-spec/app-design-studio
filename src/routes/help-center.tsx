import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, ArrowRight, ChevronDown, ChevronUp, Sprout, Lock, Bell, MessageCircle, Truck, CreditCard, BarChart3, AlertTriangle } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { TextInput, PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/help-center")({
  head: () => ({ meta: [{ title: "Agricon NG — Help Center" }] }),
  component: HelpCenterPage,
});

const TOPICS = [
  { icon: <Sprout className="h-6 w-6" />, title: "Getting started", body: "Onboarding, verification, and setup", articles: 12 },
  { icon: <Lock className="h-6 w-6" />, title: "Account & security", body: "Password, 2FA, and privacy settings", articles: 8 },
  { icon: <Bell className="h-6 w-6" />, title: "Listing crops", body: "Best practices and visibility tips", articles: 15 },
  { icon: <MessageCircle className="h-6 w-6" />, title: "Inquiries & chats", body: "Managing conversations and quotes", articles: 10 },
  { icon: <Truck className="h-6 w-6" />, title: "Delivery & logistics", body: "Shipping, fulfilment, and tracking", articles: 9 },
  { icon: <CreditCard className="h-6 w-6" />, title: "Payments", body: "How payments work on Agricon", articles: 7 },
  { icon: <BarChart3 className="h-6 w-6" />, title: "Dashboard & analytics", body: "Understanding your performance data", articles: 6 },
  { icon: <AlertTriangle className="h-6 w-6" />, title: "Disputes & refunds", body: "Resolving issues with transactions", articles: 5 },
];

const FAQS = [
  {
    q: "How does farm verification work?",
    a: "Our team reviews your submitted documents — government ID, farm ownership proof, and photos. The process typically takes 24–48 hours. Once approved, a verified badge appears on your profile.",
  },
  {
    q: "What documents do I need for verification?",
    a: "You need a government-issued ID (NIN, driver's licence, or passport), proof of farm ownership (land title, C of O, or community letter), and at least 3 clear farm photos.",
  },
  {
    q: "How long does verification take?",
    a: "Most verifications are completed within 24–48 hours on business days. You'll receive a notification once your verification status changes.",
  },
  {
    q: "Can I list crops before verification?",
    a: "You can create draft listings, but they won't be visible to buyers until your account is verified. This protects buyers and maintains marketplace quality.",
  },
  {
    q: "How do I reset my password?",
    a: "Tap 'Forgot password?' on the sign-in screen, enter your email address, and we'll send you a 6-digit reset code.",
  },
  {
    q: "Is there a commission on sales?",
    a: "Agricon currently charges a small platform fee on completed transactions. This fee covers payment processing and platform maintenance.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary transition"
        aria-expanded={open}
      >
        <span className="flex-1 text-sm font-semibold text-foreground">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
      )}
    </div>
  );
}

function HelpCenterPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filteredFaqs = FAQS.filter(
    (f) =>
      query === "" ||
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTopics = TOPICS.filter(
    (t) =>
      query === "" ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.body.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MobileShell
      standalone
      title="Help center"
      showBack
      backTo="/settings"
      showBottomNav
    >
      <div className="space-y-5">
        {/* Search */}
        <TextInput
          placeholder="Search articles, topics..."
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={setQuery}
        />

        {/* No results */}
        {query !== "" && filteredTopics.length === 0 && filteredFaqs.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No results for "{query}". Try different keywords.
            </p>
          </div>
        )}

        {/* Topics grid */}
        {filteredTopics.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">Browse topics</h2>
            <div className="grid grid-cols-2 gap-3">
              {filteredTopics.map((t) => (
                <button
                  key={t.title}
                  type="button"
                  className="rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/40 transition"
                  onClick={() => {}}
                >
                  <div className="text-[#154212] mb-2">{t.icon}</div>
                  <p className="text-sm font-bold text-foreground">{t.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t.body}</p>
                  <p className="mt-2 text-[11px] font-semibold text-primary">
                    {t.articles} articles
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular FAQs */}
        {filteredFaqs.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">
              {query ? "Matching questions" : "Popular questions"}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {filteredFaqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        {query === "" && (
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">Quick links</h2>
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {[
                { label: "Track my verification", href: "/verification-status" },
                { label: "Manage my listings", href: "/marketplace" },
                { label: "View account settings", href: "/settings" },
              ].map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigate({ to: link.href as never })}
                  className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary transition"
                >
                  <span className="flex-1 text-sm font-semibold text-foreground">{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact support CTA */}
        <div className="rounded-2xl gradient-primary p-5 text-white">
          <p className="font-bold">Still need help?</p>
          <p className="mt-1 text-sm opacity-90">
            Our support team is available Mon–Sat 8 am–8 pm and responds within 2 hours.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/contact-support" })}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary"
          >
            Contact support <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

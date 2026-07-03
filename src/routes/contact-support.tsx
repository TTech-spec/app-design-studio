import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageCircle, Phone, Mail, MessageSquare, Paperclip,
  ChevronDown, CheckCircle2, Send,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { TextInput, PrimaryButton } from "@/components/mobile/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export const Route = createFileRoute("/contact-support")({
  head: () => ({ meta: [{ title: "Agricon NG — Contact Support" }] }),
  component: ContactSupportPage,
});

const CATEGORIES = [
  "Account & verification",
  "Listing issues",
  "Payment problem",
  "Delivery dispute",
  "Technical bug",
  "Other",
];

function ContactSupportPage() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [ticketId] = useState(() => `AGR-${Math.floor(100000 + Math.random() * 900000)}`);

  async function handleSend() {
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please describe your issue.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
    toast.success("Support ticket submitted!");
  }

  if (sent) {
    return (
      <MobileShell standalone title="Ticket submitted" showBack={false} showBottomNav={false}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-black text-forest">Ticket submitted!</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            We've received your message and will get back to you within 2 hours.
          </p>
          <div className="mt-4 rounded-2xl border border-border bg-card px-6 py-4 w-full">
            <p className="text-xs text-muted-foreground">Ticket reference</p>
            <p className="mt-1 text-lg font-black text-forest tracking-wide">{ticketId}</p>
          </div>
          <div className="mt-8 w-full space-y-3">
            <PrimaryButton onClick={() => navigate({ to: "/messages" })}>
              Open live chat
            </PrimaryButton>
            <PrimaryButton variant="outline" onClick={() => navigate({ to: "/settings" })}>
              Back to settings
            </PrimaryButton>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell
      standalone
      title="Contact support"
      showBack
      backTo="/help-center"
      showBottomNav={false}
    >
      <div className="space-y-5">
        {/* Contact method cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <MessageCircle className="h-6 w-6" />,
              label: "Live chat",
              body: "Online now",
              color: "gradient-primary text-white",
              action: () => navigate({ to: "/chat" }),
            },
            {
              icon: <Phone className="h-6 w-6" />,
              label: "Call us",
              body: "Mon–Sat 8am–8pm",
              color: "bg-card border border-border text-foreground",
              action: () => { window.location.href = "tel:+2348001234567"; },
            },
            {
              icon: <Mail className="h-6 w-6" />,
              label: "Email",
              body: "help@agricon.ng",
              color: "bg-card border border-border text-foreground",
              action: () => { window.location.href = "mailto:help@agricon.ng"; },
            },
            {
              icon: <MessageSquare className="h-6 w-6" />,
              label: "WhatsApp",
              body: "Fast response",
              color: "bg-card border border-border text-foreground",
              action: () => { window.open("https://wa.me/2348001234567", "_blank"); },
            },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.action}
              className={`rounded-2xl p-4 text-left transition hover:opacity-90 ${c.color}`}
            >
              {c.icon}
              <p className="mt-2 text-sm font-bold">{c.label}</p>
              <p className="mt-0.5 text-xs opacity-80">{c.body}</p>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-3 text-xs text-muted-foreground">or send a message</span>
          </div>
        </div>

        {/* Support form */}
        <div className="space-y-4">
          <TextInput
            label="Subject"
            placeholder="Briefly describe your issue"
            value={subject}
            onChange={setSubject}
          />

          {/* Category picker */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCategoryPicker((s) => !s)}
                className="flex h-13 min-h-[52px] w-full items-center justify-between rounded-2xl border-2 border-border bg-card px-4 text-left text-[15px] transition focus:border-primary"
              >
                <span className={category ? "text-foreground" : "text-muted-foreground"}>
                  {category || "Select a category"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${showCategoryPicker ? "rotate-180" : ""}`}
                />
              </button>
              {showCategoryPicker && (
                <div className="absolute z-10 mt-1 w-full rounded-2xl border border-border bg-card shadow-pop overflow-hidden">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setShowCategoryPicker(false);
                      }}
                      className={`flex w-full items-center px-4 py-3 text-sm hover:bg-secondary transition ${
                        category === c ? "font-bold text-primary" : "text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail. Include any error messages or steps to reproduce."
              className="w-full rounded-2xl border-2 border-border bg-card p-4 text-sm text-foreground outline-none focus:border-primary resize-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Attachment */}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition"
          >
            <Paperclip className="h-4 w-4 shrink-0" />
            Attach a screenshot (optional)
          </button>

          {/* Priority note */}
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Typical response time:</span> 2 hours
              during business hours (Mon–Sat 8am–8pm WAT). Urgent issues are prioritised.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pb-6">
          <PrimaryButton
            onClick={handleSend}
            loading={loading}
            icon={<Send className="h-4 w-4" />}
          >
            Send message
          </PrimaryButton>
        </div>
      </div>
    </MobileShell>
  );
}

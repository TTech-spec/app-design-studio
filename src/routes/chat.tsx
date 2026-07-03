import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Phone, MoreVertical, Paperclip, Image as ImageIcon, Send,
  ArrowLeft, Check, CheckCheck, Smile, Search, Settings, Bell,
  FileText, Attach, Clock, Archive, Languages,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { VerificationBadge, FarmImage } from "@/components/mobile/ui";
import { DesktopShell, ChatComponent } from "@/components/desktop";
import { FARMS } from "@/lib/agricon-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import { toast } from "sonner";

type SearchParams = { farmId?: string; farmName?: string; contactName?: string };

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Agricon NG — Chat" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    farmId: typeof s.farmId === "string" ? s.farmId : undefined,
    farmName: typeof s.farmName === "string" ? s.farmName : undefined,
    contactName: typeof s.contactName === "string" ? s.contactName : undefined,
  }),
  component: ChatPage,
});

type Message = {
  id: string;
  from: "me" | "them";
  text?: string;
  translatedText?: string;
  image?: boolean;
  time: string;
  status?: "sent" | "delivered" | "read";
  translating?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    from: "them",
    text: "Hello! Thanks for your interest in our premium cassava.",
    time: "10:24",
  },
  {
    id: "2",
    from: "me",
    text: "Hi! I'm looking to source 5 tonnes for our processing plant in Lagos.",
    time: "10:26",
    status: "read",
  },
  {
    id: "3",
    from: "them",
    text: "Perfect — we currently have 24 tonnes available at ₦48,000/tonne. Bulk discount applies for 10+ tonnes.",
    time: "10:28",
  },
  {
    id: "4",
    from: "them",
    image: true,
    time: "10:28",
  },
  {
    id: "5",
    from: "me",
    text: "Great quality! Can you deliver to Lagos next week?",
    time: "10:32",
    status: "read",
  },
  {
    id: "6",
    from: "them",
    text: "Yes, we can arrange delivery to Lagos next week. I'll send the logistics details shortly.",
    time: "10:34",
  },
];

function ChatPage() {
  const { farmId, farmName, contactName } = Route.useSearch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { translateMessage } = useAuth();
  const { locale, setLocale } = useLocale();

  const farm = FARMS.find((f) => f.id === farmId) ?? FARMS[0];
  const displayName = contactName ?? farm.owner;
  const displayFarm = farmName ?? farm.name;

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function translateMessageText(messageId: string, text: string) {
    if (!translationEnabled || locale === "en") return;
    
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, translating: true } : m
      )
    );

    try {
      const translated = await translateMessage(text, locale);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, translatedText: translated, translating: false } : m
        )
      );
    } catch (error) {
      console.error("Translation failed:", error);
      toast.error("Translation failed");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, translating: false } : m
        )
      );
    }
  }

  // Auto-translate incoming messages when translation is enabled
  useEffect(() => {
    if (translationEnabled && locale !== "en") {
      messages.forEach((m) => {
        if (m.from === "them" && m.text && !m.translatedText && !m.translating) {
          translateMessageText(m.id, m.text);
        }
      });
    }
  }, [translationEnabled, locale, messages]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      from: "me",
      text,
      time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
      status: "sent",
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
    inputRef.current?.focus();

    // Simulate reply after short delay
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: "them",
        text: "Thanks for the message! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  }

  // Mobile view
  if (isMobile) {
    return (
      <MobileShell
        standalone
        showBottomNav={false}
        title=""
        showBack={false}
      >
        {/* Custom header */}
        <div className="-mx-4 -mt-4 flex items-center gap-3 border-b border-border bg-card px-4 py-3 mb-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/messages" })}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-muted"
            aria-label="Back to messages"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/farmer-profile", search: { farmerId: farm.id } as never })}
            className="flex flex-1 min-w-0 items-center gap-3"
          >
            <div className="relative shrink-0">
              <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-white font-bold text-sm">
                {displayName.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                <VerificationBadge />
              </div>
              <p className="text-[11px] text-primary truncate">
                Active now · Replies in ~2 hrs · {displayFarm}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
              aria-label="Call"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3 pb-4">
          <div className="text-center">
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
              Today
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                  m.from === "me"
                    ? "gradient-primary text-white rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {m.image ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/image-viewer",
                        search: { seed: "cassava-photo", sender: displayName } as never,
                      })
                    }
                    className="block focus:outline-none"
                    aria-label="View image"
                  >
                    <FarmImage seed="cassava-photo" className="h-40 w-52 rounded-xl" />
                  </button>
                ) : (
                  <p className="text-sm leading-relaxed">{m.text}</p>
                )}
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    m.from === "me" ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  <span>{m.time}</span>
                  {m.from === "me" && m.status === "read" && (
                    <CheckCheck className="h-3 w-3 text-white/80" />
                  )}
                  {m.from === "me" && m.status === "delivered" && (
                    <CheckCheck className="h-3 w-3 text-white/50" />
                  )}
                  {m.from === "me" && m.status === "sent" && (
                    <Check className="h-3 w-3 text-white/50" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator (visible briefly after sending) */}
          <div ref={bottomRef} />
        </div>

        {/* Attach menu */}
        {showAttachMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAttachMenu(false)}
          >
            <div
              className="absolute bottom-24 left-4 rounded-2xl border border-border bg-card shadow-pop p-2 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { label: "Photo from gallery", icon: <ImageIcon className="h-4 w-4" /> },
                { label: "Attach document", icon: <Paperclip className="h-4 w-4" /> },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setShowAttachMenu(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar — sticky to viewport bottom */}
        <div className="sticky -bottom-4 -mx-4 border-t border-border bg-card px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAttachMenu((s) => !s)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <div className="flex flex-1 min-w-0 items-center gap-2 rounded-full bg-secondary px-4 py-2.5">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-primary text-white shadow-glow disabled:opacity-50 disabled:shadow-none transition"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  // Desktop view
  return (
    <DesktopShell title="Chat" activeNav="messages">
      <div className="flex h-full">
        {/* Left Pane: Conversation List */}
        <div className="w-80 lg:w-96 flex flex-col border-r border-[#c2c9bb] bg-[#f3f4ed] shrink-0">
          {/* Search and Filters */}
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#44483d]" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#c2c9bb] rounded-full text-sm focus:ring-1 focus:ring-[#154212] focus:border-[#154212] transition-all"
                placeholder="Search conversations..."
                type="text"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Unread", "Inquiries", "Sales", "Archived"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? "bg-[#154212] text-white"
                      : "bg-white border border-[#c2c9bb] text-[#44483d] hover:bg-[#e7e9e1]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {[
              {
                initials: "AK",
                name: "Adekunle Kolawole",
                farm: "Kolawole Family Farms",
                preview: "Yes, we can arrange delivery to Lagos n...",
                time: "2m",
                active: true,
                online: true,
                unread: 2,
              },
              {
                initials: "FB",
                name: "Fatima Bello",
                farm: "Sahel Grains Co.",
                preview: "Sent you the harvest schedule for Q1",
                time: "1h",
                active: false,
                online: true,
                unread: 0,
              },
              {
                initials: "CO",
                name: "Chinedu Okafor",
                farm: "Green Delta Farms",
                preview: "The plantains will be ready by Friday",
                time: "3h",
                active: false,
                online: false,
                unread: 1,
              },
              {
                initials: "MI",
                name: "Musa Ibrahim",
                farm: "Northern Harvest Co-op",
                preview: "Photos attached — Grade A tomatoes",
                time: "Yesterday",
                active: false,
                online: false,
                unread: 0,
              },
              {
                initials: "BA",
                name: "Blessing Adeyemi",
                farm: "Ogun Poultry Estate",
                preview: "Thanks for the review!",
                time: "2d",
                active: false,
                online: false,
                unread: 0,
              },
            ].map((conv) => (
              <div
                key={conv.name}
                className={`p-4 border-b border-[#c2c9bb]/30 flex gap-4 cursor-pointer hover:bg-[#e7e9e1] transition-all ${
                  conv.active ? "bg-[#d6e4c8]" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      conv.active ? "bg-[#154212]" : "bg-[#55624c]"
                    }`}
                  >
                    {conv.initials}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold truncate text-sm ${conv.active ? "text-[#154212]" : "text-[#191c18]"}`}>
                      {conv.name}
                    </h3>
                    <span className={`text-xs whitespace-nowrap ml-2 ${conv.active ? "text-[#154212] font-bold" : "text-[#44483d]"}`}>
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-[#55624c] text-xs mb-0.5 truncate">{conv.farm}</p>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-[#44483d] text-xs truncate flex-1">{conv.preview}</p>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-[#154212] text-white text-[10px] flex items-center justify-center rounded-full shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <ChatComponent
            receiverId={farmId}
            receiverName={displayName}
            receiverFarm={displayFarm}
            isMobile={false}
          />
        </div>
      </div>
    </DesktopShell>
  );
}

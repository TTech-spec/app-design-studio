import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Edit, Archive, MoreVertical } from "lucide-react";
import { MobileShell, NotificationBell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { TextInput, Chip } from "@/components/mobile/ui";
import { MESSAGES } from "@/lib/agricon-data";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Agricon NG — Messages" }] }),
  component: MessagesPage,
});

const TABS = ["All", "Unread", "Inquiries", "Sales", "Archived"] as const;
type Tab = (typeof TABS)[number];

function MessagesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();

  const filtered = MESSAGES.filter((m) => {
    const matchesQuery =
      query === "" ||
      m.from.toLowerCase().includes(query.toLowerCase()) ||
      m.farm.toLowerCase().includes(query.toLowerCase()) ||
      m.last.toLowerCase().includes(query.toLowerCase());

    const matchesTab =
      tab === "All" ||
      (tab === "Unread" && m.unread > 0) ||
      (tab === "Archived" && false); // no archived in sample data

    return matchesQuery && matchesTab;
  });

  const unreadCount = MESSAGES.reduce((n, m) => n + m.unread, 0);

  // Mobile view
  if (isMobile) {
    return (
      <MobileShell
        standalone
        title="Messages"
        showBack={false}
        showBottomNav
        headerRight={
          <div className="flex items-center gap-1">
            <NotificationBell count={3} />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
              aria-label="New message"
              onClick={() => navigate({ to: "/marketplace" })}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Search */}
          <TextInput
            placeholder="Search conversations..."
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={setQuery}
          />

          {/* Tabs */}
          <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-hide px-4">
            {TABS.map((t) => (
              <Chip key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
                {t === "Unread" && unreadCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary">
                    {unreadCount}
                  </span>
                )}
              </Chip>
            ))}
          </div>

          {/* Conversation list */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {query ? `No conversations matching "${query}"` : "No messages here yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/chat",
                      search: { farmId: m.id, farmName: m.farm, contactName: m.from } as never,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-secondary transition"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="grid h-12 w-12 place-items-center rounded-full gradient-primary text-white font-bold">
                      {m.from.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {m.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm truncate ${
                          m.unread > 0 ? "font-bold text-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {m.from}
                      </p>
                      <span
                        className={`text-[11px] shrink-0 ${
                          m.unread > 0 ? "font-bold text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.farm}</p>
                    <p
                      className={`mt-0.5 text-xs truncate ${
                        m.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {m.last}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {m.unread > 0 && (
                    <div className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {m.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Archived hint */}
          {tab === "All" && (
            <button
              type="button"
              onClick={() => setTab("Archived")}
              className="flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Archive className="h-4 w-4" /> View archived conversations
            </button>
          )}
        </div>
      </MobileShell>
    );
  }

  // Desktop view
  return (
    <DesktopShell title="Messages" activeNav="messages">
      <div className="flex h-full">
        {/* Conversation List */}
        <div className="w-full max-w-2xl mx-auto p-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#44483d]" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#c2c9bb] rounded-full text-sm focus:ring-2 focus:ring-[#154212] focus:border-[#154212] transition-all"
              placeholder="Search conversations..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-[#154212] text-white"
                    : "bg-white border border-[#c2c9bb] text-[#44483d] hover:bg-[#e7e9e1]"
                }`}
              >
                {t}
                {t === "Unread" && unreadCount > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-2 text-[10px] font-bold text-[#154212]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Conversation list */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#44483d]">
                {query ? `No conversations matching "${query}"` : "No messages here yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/chat",
                      search: { farmId: m.id, farmName: m.farm, contactName: m.from } as never,
                    })
                  }
                  className="flex w-full items-center gap-4 rounded-2xl p-4 text-left hover:bg-[#e7e9e1] transition border border-[#c2c9bb] bg-white"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-[#154212] text-white flex items-center justify-center font-bold text-lg">
                      {m.from.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {m.online && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-base truncate ${
                          m.unread > 0 ? "font-bold text-[#191c18]" : "font-semibold text-[#191c18]"
                        }`}
                      >
                        {m.from}
                      </p>
                      <span
                        className={`text-sm shrink-0 ${
                          m.unread > 0 ? "font-bold text-[#154212]" : "text-[#44483d]"
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                    <p className="text-sm text-[#44483d] truncate">{m.farm}</p>
                    <p
                      className={`mt-1 text-sm truncate ${
                        m.unread > 0 ? "font-semibold text-[#191c18]" : "text-[#44483d]"
                      }`}
                    >
                      {m.last}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {m.unread > 0 && (
                    <div className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-[#154212] px-2 text-[11px] font-bold text-white">
                      {m.unread}
                    </div>
                  )}

                  {/* More options */}
                  <button className="shrink-0 p-2 rounded-full hover:bg-[#e7e9e1] text-[#44483d]">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DesktopShell>
  );
}

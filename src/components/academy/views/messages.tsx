import { ChevronLeft, FileText, Paperclip, Search, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/academy/data";
import { useAcademy } from "@/lib/academy/store";
import { Avatar, ChipTabs } from "../ui";

const REPLIES = [
  "Thanks! I’ll take a look and get back to you today.",
  "Good question — let’s go through it in the next live class too.",
  "Got it, thanks!",
  "Share your screen during office hours and I’ll walk you through it.",
];

export function MessagesView({
  conversations,
  active,
  onSelect,
  filters,
}: {
  conversations: Conversation[];
  active?: string;
  onSelect: (id?: string) => void;
  filters: readonly string[];
}) {
  const { messages, sendMessage, receiveMessage } = useAcademy();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const merged = useMemo(
    () =>
      conversations.map((c) => ({ ...c, messages: [...c.messages, ...(messages[c.id] ?? [])] })),
    [conversations, messages],
  );
  const convs = merged.filter(
    (c) =>
      (filter === "All" || c.kind === filter) && c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const current = merged.find((c) => c.id === active);
  const threadDedup = current?.messages ?? [];

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [threadDedup.length, active]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!current || !draft.trim()) return;
    sendMessage(current.id, draft.trim());
    setDraft("");
    const id = current.id;
    timers.current.push(
      window.setTimeout(
        () => receiveMessage(id, REPLIES[Math.floor(Math.random() * REPLIES.length)]),
        1400,
      ),
    );
  };

  return (
    <div className="flex h-[calc(100dvh-160px)] min-h-[520px] overflow-hidden rounded-2xl border border-border bg-white lg:h-[calc(100dvh-130px)]">
      <div
        className={cn(
          "w-full flex-col border-r border-border p-3 md:flex md:w-[340px] md:shrink-0",
          current ? "hidden" : "flex",
        )}
      >
        <div className="flex items-center justify-between px-1.5 pb-3 pt-1">
          <h1 className="text-xl font-extrabold">Messages</h1>
        </div>
        <label className="mx-1.5 mb-3 flex h-11 items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 text-muted-foreground">
          <Search size={18} />
          <span className="sr-only">Search messages</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages"
            className="w-full bg-transparent text-sm text-primary outline-none"
          />
        </label>
        <div className="mb-3 px-1.5">
          <ChipTabs
            items={filters}
            value={filter}
            onChange={setFilter}
            label="Filter conversations"
          />
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto">
          {convs.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const unread = c.id === conversations[0].id && !messages[c.id]?.length ? 2 : 0;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex gap-3 rounded-2xl p-3 text-left transition",
                  c.id === active ? "bg-[#f3f6fb]" : "hover:bg-surface",
                )}
              >
                <Avatar initials={c.initials} color={c.color} size={44} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex justify-between gap-2">
                    <span className="text-sm font-bold">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{last?.time}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{c.subtitle}</span>
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-[13px]",
                        unread ? "font-semibold text-primary" : "text-muted-foreground",
                      )}
                    >
                      {last?.file ? `Attachment: ${last.file}` : last?.text}
                    </span>
                    {unread ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4136] px-1.5 text-[11px] font-bold text-white">
                        {unread}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {current ? (
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-border px-3 md:px-6">
            <button
              type="button"
              aria-label="Back to conversations"
              onClick={() => onSelect(undefined)}
              className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-surface md:hidden"
            >
              <ChevronLeft size={24} />
            </button>
            <Avatar initials={current.initials} color={current.color} size={42} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-base font-bold">{current.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                Online · {current.subtitle}
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto bg-[#fbfcfe] p-4 md:p-6">
            {threadDedup.map((m) =>
              m.file ? (
                <div
                  key={m.id}
                  className={cn(
                    "flex w-[260px] items-center gap-3 rounded-2xl border border-border bg-white p-3",
                    m.from === "me" ? "self-end" : "self-start",
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#fdecea] text-[#D7372C]">
                    <FileText size={18} />
                  </span>
                  <span className="truncate text-[13px] font-bold">{m.file}</span>
                </div>
              ) : (
                <div
                  key={m.id}
                  className={cn(
                    "flex max-w-[85%] flex-col gap-1 md:max-w-[460px]",
                    m.from === "me" ? "items-end self-end" : "self-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.from === "me"
                        ? "rounded-br-[4px] bg-primary text-white"
                        : "rounded-bl-[4px] border border-border bg-white",
                    )}
                  >
                    {m.text}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{m.time}</span>
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={send}
            className="flex items-center gap-2.5 border-t border-border p-3 md:px-6 md:py-4"
          >
            <button
              type="button"
              aria-label="Attach file"
              title="Coming soon"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border"
            >
              <Paperclip size={20} />
            </button>
            <label className="flex flex-1">
              <span className="sr-only">Message</span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${current.name.split(" ")[0]}…`}
                className="h-12 w-full rounded-xl border border-primary-soft bg-surface px-4 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D7372C] text-white disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground md:flex">
          Pick a conversation to start chatting.
        </div>
      )}
    </div>
  );
}

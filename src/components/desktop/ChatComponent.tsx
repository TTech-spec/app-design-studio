import { useEffect, useRef, useState } from "react";
import {
  Phone, MoreVertical, Paperclip, Image as ImageIcon, Send,
  ArrowLeft, Mic, MicOff, Languages, Volume2, X, FileText
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { translateText, detectLanguage } from "@/lib/translation";
import { toast } from "sonner";

type Message = {
  id: string;
  from: "me" | "them";
  text?: string;
  image?: boolean;
  file?: { url: string; name: string; type: string };
  voice?: { url: string; transcription?: string };
  time: string;
  status?: "sent" | "delivered" | "read";
  translatedText?: string;
  showTranslation?: boolean;
};

interface ChatComponentProps {
  conversationId?: string;
  receiverId?: string;
  receiverName?: string;
  receiverFarm?: string;
  isMobile?: boolean;
  onBack?: () => void;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "yo", name: "Yoruba" },
  { code: "ha", name: "Hausa" },
  { code: "ig", name: "Igbo" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
];

export function ChatComponent({
  conversationId,
  receiverId,
  receiverName = "User",
  receiverFarm = "Farm",
  isMobile = false,
  onBack
}: ChatComponentProps) {
  const { user, profile, getChatMessages, sendChatMessage, uploadChatFile, uploadVoiceNote, markMessageAsRead } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.language || "en");
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  async function loadMessages() {
    if (!conversationId) return;
    try {
      const chatMessages = await getChatMessages(conversationId);
      const formattedMessages: Message[] = chatMessages.map(msg => ({
        id: msg.id,
        from: msg.sender_id === user?.id ? "me" : "them",
        text: msg.text || undefined,
        file: msg.file_url ? { url: msg.file_url, name: "File", type: msg.file_type || "file" } : undefined,
        voice: msg.voice_url ? { url: msg.voice_url, transcription: msg.voice_transcription || undefined } : undefined,
        time: new Date(msg.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
        status: msg.read ? "read" : "sent",
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  }

  async function sendMessage() {
    const text = draft.trim();
    if (!text && !receiverId) return;
    
    try {
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

      if (receiverId) {
        await sendChatMessage(receiverId, text);
        await loadMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter(m => m.id !== newMsg?.id));
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !receiverId) return;

    try {
      toast.loading("Uploading file...");
      const fileUrl = await uploadChatFile(file);
      
      const newMsg: Message = {
        id: Date.now().toString(),
        from: "me",
        file: { url: fileUrl, name: file.name, type: file.type },
        time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
        status: "sent",
      };
      setMessages((prev) => [...prev, newMsg]);
      
      await sendChatMessage(receiverId, "", fileUrl, file.type);
      await loadMessages();
      
      toast.dismiss();
      toast.success("File uploaded successfully");
      setShowAttachMenu(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.dismiss();
      toast.error("Failed to upload file");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice-note.webm", { type: "audio/webm" });
        
        if (receiverId) {
          try {
            toast.loading("Processing voice note...");
            const voiceUrl = await uploadVoiceNote(audioFile);
            
            const newMsg: Message = {
              id: Date.now().toString(),
              from: "me",
              voice: { url: voiceUrl },
              time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
              status: "sent",
            };
            setMessages((prev) => [...prev, newMsg]);
            
            await sendChatMessage(receiverId, "", undefined, undefined, voiceUrl);
            await loadMessages();
            
            toast.dismiss();
            toast.success("Voice note sent");
          } catch (error) {
            console.error("Error uploading voice note:", error);
            toast.dismiss();
            toast.error("Failed to send voice note");
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }

  async function handleTranslate(messageId: string, text: string) {
    if (!text) return;
    setTranslatingId(messageId);
    try {
      const translated = await translateText(text, selectedLanguage);
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, translatedText: translated, showTranslation: true }
          : m
      ));
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed");
    } finally {
      setTranslatingId(null);
    }
  }

  function toggleTranslation(messageId: string) {
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, showTranslation: !m.showTranslation }
        : m
    ));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 shrink-0">
        {isMobile && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-primary text-white font-bold text-sm">
            {receiverName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{receiverName}</p>
            <p className="text-[11px] text-primary truncate">{receiverFarm}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowTranslateMenu(!showTranslateMenu)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted relative"
            title="Translate"
          >
            <Languages className="h-4 w-4" />
          </button>
          {showTranslateMenu && (
            <div className="absolute top-12 right-0 bg-card border border-border rounded-lg shadow-lg p-2 z-50 w-48">
              <div className="text-xs font-semibold mb-2 px-2">Translate to:</div>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowTranslateMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-secondary ${
                    selectedLanguage === lang.code ? "bg-secondary font-semibold" : ""
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
            <Phone className="h-4 w-4" />
          </button>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((m) => (
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
                {m.image && (
                  <img src="/placeholder.jpg" alt="Image" className="h-40 w-52 rounded-xl mb-2" />
                )}
                
                {m.file && (
                  <div className="flex items-center gap-2 bg-black/10 rounded-lg p-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate">{m.file.name}</span>
                  </div>
                )}
                
                {m.voice && (
                  <div className="mb-2">
                    <audio controls src={m.voice.url} className="w-full h-8" />
                    {m.voice.transcription && (
                      <p className="text-xs mt-1 opacity-80 italic">"{m.voice.transcription}"</p>
                    )}
                  </div>
                )}
                
                {m.text && (
                  <>
                    <p className="text-sm leading-relaxed">
                      {m.showTranslation && m.translatedText ? m.translatedText : m.text}
                    </p>
                    {m.showTranslation && m.translatedText && m.text !== m.translatedText && (
                      <button
                        onClick={() => toggleTranslation(m.id)}
                        className="text-[10px] underline opacity-70 mt-1"
                      >
                        Show original
                      </button>
                    )}
                    {!m.showTranslation && selectedLanguage !== "en" && (
                      <button
                        onClick={() => handleTranslate(m.id, m.text!)}
                        disabled={translatingId === m.id}
                        className="text-[10px] underline opacity-70 mt-1 flex items-center gap-1"
                      >
                        <Languages className="h-3 w-3" />
                        {translatingId === m.id ? "Translating..." : "Translate"}
                      </button>
                    )}
                  </>
                )}
                
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    m.from === "me" ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  <span>{m.time}</span>
                  {m.from === "me" && m.status === "read" && (
                    <span className="text-blue-400">✓✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Attach menu */}
      {showAttachMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAttachMenu(false)}>
          <div
            className="absolute bottom-20 left-4 rounded-2xl border border-border bg-card shadow-pop p-2 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
                setShowAttachMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <ImageIcon className="h-4 w-4 text-primary" />
              Photo from gallery
            </button>
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
                setShowAttachMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <FileText className="h-4 w-4 text-primary" />
              Attach document
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-border bg-card px-3 py-3 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAttachMenu((s) => !s)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
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
          </div>

          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-500 text-white shadow-glow transition"
            >
              <MicOff className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-muted transition"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}

          <button
            type="button"
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-primary text-white shadow-glow disabled:opacity-50 disabled:shadow-none transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

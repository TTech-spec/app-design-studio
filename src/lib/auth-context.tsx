import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, VERIFICATION_BUCKET, AVATAR_BUCKET, PRODUCTS_BUCKET, CHAT_FILES_BUCKET, type Profile, type Product, type ChatMessage, type ConversationParticipant } from "./supabase";

export type PendingAuthFlow = "signup" | "recovery";

const PENDING_EMAIL_KEY = "agricon_pending_email";
const PENDING_FLOW_KEY = "agricon_pending_flow";
const PENDING_SIGNUP_KEY = "agricon_pending_signup";

function createPasswordRedirect(flow: PendingAuthFlow) {
  return `${window.location.origin}/create-password?flow=${flow}`;
}

function readPendingFlowFromUrl(): PendingAuthFlow | null {
  if (typeof window === "undefined") return null;
  const flow = new URLSearchParams(window.location.search).get("flow");
  if (flow === "signup" || flow === "recovery") return flow;
  return null;
}

function persistPendingFlow(flow: PendingAuthFlow) {
  window.sessionStorage.setItem(PENDING_FLOW_KEY, flow);
}

function persistPendingEmail(email: string) {
  window.sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

function readSession<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

type PendingSignup = { firstName: string; lastName: string; phone: string };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  pendingEmail: string | null;
  pendingFlow: PendingAuthFlow | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Record<string, unknown>) => Promise<Profile>;
  signUpWithOtp: (params: { email: string; firstName: string; lastName: string; phone: string }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  setNewPassword: (password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearPendingFlow: () => void;
  uploadVerificationDocument: (docType: string, file: File) => Promise<void>;
  submitForVerification: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  uploadProductImage: (file: File) => Promise<string>;
  createProduct: (product: Omit<Product, "id" | "seller_id" | "created_at" | "updated_at">) => Promise<Product>;
  getProducts: (sellerId?: string) => Promise<Product[]>;
  getConversations: () => Promise<ConversationParticipant[]>;
  getChatMessages: (conversationId: string) => Promise<ChatMessage[]>;
  sendChatMessage: (receiverId: string, text: string, fileUrl?: string, fileType?: string, voiceUrl?: string) => Promise<ChatMessage>;
  uploadChatFile: (file: File) => Promise<string>;
  uploadVoiceNote: (file: File) => Promise<string>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  getNotifications: () => Promise<any[]>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  submitLandIssueReport: (report: Omit<any, "id" | "user_id" | "status" | "admin_notes" | "created_at" | "updated_at">) => Promise<void>;
  translateMessage: (text: string, targetLanguage: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingFlow, setPendingFlow] = useState<PendingAuthFlow | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, []);

  useEffect(() => {
    const urlFlow = readPendingFlowFromUrl();
    if (urlFlow) {
      persistPendingFlow(urlFlow);
      setPendingFlow(urlFlow);
    } else {
      setPendingFlow(readSession<PendingAuthFlow>(PENDING_FLOW_KEY));
    }
    setPendingEmail(readSession<string>(PENDING_EMAIL_KEY));

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (newSession?.user) fetchProfile(newSession.user.id);
      else setProfile(null);

      if (event === "INITIAL_SESSION") {
        setLoading(false);
      }

      if (event === "PASSWORD_RECOVERY") {
        persistPendingFlow("recovery");
        setPendingFlow("recovery");
        if (newSession?.user?.email) {
          persistPendingEmail(newSession.user.email);
          setPendingEmail(newSession.user.email);
        }
        if (window.location.pathname !== "/create-password") {
          window.location.replace(createPasswordRedirect("recovery"));
        }
      } else if (event === "SIGNED_IN" && newSession?.user) {
        const flow = readPendingFlowFromUrl() ?? readSession<PendingAuthFlow>(PENDING_FLOW_KEY);
        if (flow) {
          persistPendingFlow(flow);
          setPendingFlow(flow);
          if (window.location.pathname !== "/create-password") {
            window.location.replace(createPasswordRedirect(flow));
            return;
          }
        }
        if (newSession.user.email) {
          persistPendingEmail(newSession.user.email);
          setPendingEmail(newSession.user.email);
        }
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) await fetchProfile(data.user.id);
  }, [fetchProfile]);

  const updateProfile = useCallback(async (patch: Record<string, unknown>) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: userData.user.id, ...patch }, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    setProfile(data as Profile);
    return data as Profile;
  }, []);

  const signUpWithOtp = useCallback(
    async ({ email, firstName, lastName, phone }: { email: string; firstName: string; lastName: string; phone: string }) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: { first_name: firstName, last_name: lastName, phone },
          emailRedirectTo: createPasswordRedirect("signup"),
        },
      });
      if (error) throw error;
      const signup: PendingSignup = { firstName, lastName, phone };
      window.sessionStorage.setItem(PENDING_EMAIL_KEY, email);
      window.sessionStorage.setItem(PENDING_FLOW_KEY, "signup");
      window.sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(signup));
      setPendingEmail(email);
      setPendingFlow("signup");
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: createPasswordRedirect("recovery"),
    });
    if (error) throw error;
    persistPendingEmail(email);
    persistPendingFlow("recovery");
    setPendingEmail(email);
    setPendingFlow("recovery");
  }, []);

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!pendingEmail) throw new Error("No pending verification found. Please start again.");
      const { error } = await supabase.auth.verifyOtp({ email: pendingEmail, token: code, type: "email" });
      if (error) throw error;
    },
    [pendingEmail]
  );

  const resendOtp = useCallback(async () => {
    if (!pendingEmail) throw new Error("No pending email found.");
    if (pendingFlow === "recovery") {
      const { error } = await supabase.auth.resetPasswordForEmail(pendingEmail, {
        redirectTo: createPasswordRedirect("recovery"),
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email: pendingEmail,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: createPasswordRedirect("signup"),
        },
      });
      if (error) throw error;
    }
  }, [pendingEmail, pendingFlow]);

  const clearPendingFlow = useCallback(() => {
    window.sessionStorage.removeItem(PENDING_EMAIL_KEY);
    window.sessionStorage.removeItem(PENDING_FLOW_KEY);
    window.sessionStorage.removeItem(PENDING_SIGNUP_KEY);
    setPendingEmail(null);
    setPendingFlow(null);
  }, []);

  const setNewPassword = useCallback(
    async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      if (pendingFlow === "signup") {
        const signup = readSession<PendingSignup>(PENDING_SIGNUP_KEY);
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const meta = userData.user.user_metadata;
          await updateProfile({
            first_name: signup?.firstName ?? meta.first_name ?? null,
            last_name: signup?.lastName ?? meta.last_name ?? null,
            phone: signup?.phone ?? meta.phone ?? null,
          });
        }
      }
      clearPendingFlow();
    },
    [pendingFlow, updateProfile, clearPendingFlow]
  );

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const uploadVerificationDocument = useCallback(async (docType: string, file: File) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session?.user) {
      throw new Error("You must be signed in to upload documents.");
    }
    const userId = sessionData.session.user.id;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${docType}-${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from(VERIFICATION_BUCKET)
      .upload(path, file);
    if (uploadError) {
      throw new Error(
        uploadError.message.includes("row-level security")
          ? "Upload blocked by storage permissions. Ask your admin to run supabase/migrations/0003_fix_verification_storage_rls.sql in the Supabase SQL Editor."
          : `Storage upload failed: ${uploadError.message}`
      );
    }
    const { error: insertError } = await supabase
      .from("verification_documents")
      .insert({ user_id: userId, doc_type: docType, file_path: path });
    if (insertError) {
      await supabase.storage.from(VERIFICATION_BUCKET).remove([path]);
      throw new Error(
        insertError.message.includes("row-level security")
          ? "Upload blocked by database permissions. Ask your admin to run supabase/migrations/0003_fix_verification_storage_rls.sql in the Supabase SQL Editor."
          : `Could not save document record: ${insertError.message}`
      );
    }
  }, []);

  const submitForVerification = useCallback(async () => {
    await updateProfile({ verification_status: "pending" });
  }, [updateProfile]);

  const uploadAvatar = useCallback(async (file: File) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${userData.user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      throw new Error(
        uploadError.message.includes("row-level security")
          ? "Upload blocked by storage permissions. Ask your admin to run supabase/migrations/0006_storage_buckets.sql in the Supabase SQL Editor."
          : `Storage upload failed: ${uploadError.message}`
      );
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);
    
    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  }, [updateProfile]);

  const uploadProductImage = useCallback(async (file: File) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${userData.user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(PRODUCTS_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      throw new Error(
        uploadError.message.includes("row-level security")
          ? "Upload blocked by storage permissions. Ask your admin to run supabase/migrations/0006_storage_buckets.sql in the Supabase SQL Editor."
          : `Storage upload failed: ${uploadError.message}`
      );
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(PRODUCTS_BUCKET)
      .getPublicUrl(filePath);
    
    return publicUrl;
  }, []);

  const createProduct = useCallback(async (product: Omit<Product, "id" | "seller_id" | "created_at" | "updated_at">) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    
    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, seller_id: userData.user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  }, []);

  const getProducts = useCallback(async (sellerId?: string) => {
    let query = supabase.from("products").select("*");
    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    } else {
      query = query.eq("status", "active");
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  }, []);

  const getConversations = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const userId = userData.user.id;

    const { data, error } = await supabase
      .from("conversation_participants")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false, nullsFirst: false });
    
    if (error) throw error;
    return data as ConversationParticipant[];
  }, []);

  const getChatMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data as ChatMessage[];
  }, []);

  const sendChatMessage = useCallback(async (receiverId: string, text: string, fileUrl?: string, fileType?: string, voiceUrl?: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const senderId = userData.user.id;

    // Get or create conversation
    const { data: convData, error: convError } = await supabase
      .from("conversation_participants")
      .select("*")
      .or(`and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`)
      .maybeSingle();
    
    let conversationId: string;
    if (convError || !convData) {
      // Create new conversation
      const { data: newConv, error: newConvError } = await supabase
        .from("conversation_participants")
        .insert({
          user1_id: senderId,
          user2_id: receiverId,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (newConvError) throw newConvError;
      conversationId = newConv.conversation_id;
    } else {
      conversationId = convData.conversation_id;
      // Update last_message_at
      await supabase
        .from("conversation_participants")
        .update({ last_message_at: new Date().toISOString() })
        .eq("conversation_id", conversationId);
    }

    // Send message
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        text,
        file_url: fileUrl || null,
        file_type: fileType || null,
        voice_url: voiceUrl || null,
        read: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as ChatMessage;
  }, []);

  const uploadChatFile = useCallback(async (file: File) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${userData.user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(CHAT_FILES_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      throw new Error(
        uploadError.message.includes("row-level security")
          ? "Upload blocked by storage permissions. Ask your admin to run supabase/migrations/0006_storage_buckets.sql in the Supabase SQL Editor."
          : `Storage upload failed: ${uploadError.message}`
      );
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(CHAT_FILES_BUCKET)
      .getPublicUrl(filePath);
    
    return publicUrl;
  }, []);

  const uploadVoiceNote = useCallback(async (file: File) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-voice-${Date.now()}.${fileExt}`;
    const filePath = `${userData.user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from(CHAT_FILES_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      throw new Error(
        uploadError.message.includes("row-level security")
          ? "Upload blocked by storage permissions. Ask your admin to run supabase/migrations/0006_storage_buckets.sql in the Supabase SQL Editor."
          : `Storage upload failed: ${uploadError.message}`
      );
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(CHAT_FILES_BUCKET)
      .getPublicUrl(filePath);
    
    return publicUrl;
  }, []);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    const { error } = await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("id", messageId);
    
    if (error) throw error;
  }, []);

  const getNotifications = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const userId = userData.user.id;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
    
    if (error) throw error;
  }, []);

  const submitLandIssueReport = useCallback(async (report: Omit<any, "id" | "user_id" | "status" | "admin_notes" | "created_at" | "updated_at">) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("You must be signed in.");
    const userId = userData.user.id;

    const { error } = await supabase
      .from("land_issue_reports")
      .insert({
        ...report,
        user_id: userId,
        status: "pending",
      });
    
    if (error) throw error;
  }, []);

  const translateMessage = useCallback(async (text: string, targetLanguage: string) => {
    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error("Groq API key not configured");
    }

    const languageMap: Record<string, string> = {
      "en": "English",
      "ha": "Hausa",
      "yo": "Yoruba",
      "ig": "Igbo",
      "pcm": "Nigerian Pidgin",
    };

    const targetLangName = languageMap[targetLanguage] || targetLanguage;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the given text to ${targetLangName}. Only return the translated text, nothing else. Keep the meaning and tone intact.`
            },
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Translation failed");
      }

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content || text;
      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    pendingEmail,
    pendingFlow,
    refreshProfile,
    updateProfile,
    signUpWithOtp,
    requestPasswordReset,
    verifyOtp,
    resendOtp,
    setNewPassword,
    signInWithPassword,
    signOut,
    clearPendingFlow,
    uploadVerificationDocument,
    submitForVerification,
    uploadAvatar,
    uploadProductImage,
    createProduct,
    getProducts,
    getConversations,
    getChatMessages,
    sendChatMessage,
    uploadChatFile,
    uploadVoiceNote,
    markMessageAsRead,
    getNotifications,
    markNotificationAsRead,
    submitLandIssueReport,
    translateMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

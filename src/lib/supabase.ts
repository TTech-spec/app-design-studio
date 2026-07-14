import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[DarlTech] Supabase env vars not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env for full functionality."
  );
}

// Use placeholder values when env vars are missing so the app doesn't crash at startup.
// The landing page works without Supabase. Auth-dependent pages will fail gracefully.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const VERIFICATION_BUCKET = "verification-documents";
export const AVATAR_BUCKET = "avatars";
export const PRODUCTS_BUCKET = "products";
export const CHAT_FILES_BUCKET = "chat-files";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  user_type: "farmer" | "distributor" | "buyer" | null;
  date_of_birth: string | null;
  gender: string | null;
  state: string | null;
  address: string | null;
  avatar_url: string | null;
  farm_name: string | null;
  farm_size_hectares: number | null;
  farm_state: string | null;
  farm_lga: string | null;
  primary_crops: string[] | null;
  business_name: string | null;
  business_type: string | null;
  rc_number: string | null;
  years_in_operation: number | null;
  language: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
};

export type ProductStatus = "active" | "sold" | "draft" | "removed";

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  crop_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  currency: string;
  location_state: string;
  location_lga: string;
  available_from: string;
  images: string[];
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string | null;
  file_url: string | null;
  file_type: string | null;
  voice_url: string | null;
  voice_transcription: string | null;
  original_language: string | null;
  translated_text: Record<string, string> | null;
  read: boolean;
  created_at: string;
};

export type ConversationParticipant = {
  conversation_id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string | null;
  created_at: string;
};

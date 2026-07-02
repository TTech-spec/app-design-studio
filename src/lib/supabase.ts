import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const VERIFICATION_BUCKET = "verification-documents";
export const AVATAR_BUCKET = "avatars";
export const PRODUCTS_BUCKET = "products";

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

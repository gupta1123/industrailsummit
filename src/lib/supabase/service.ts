import "server-only";

import { createClient } from "@supabase/supabase-js";

export function createSupabaseServiceClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !rawKey) {
    throw new Error("Supabase backend credentials are not configured.");
  }

  const url = rawUrl.trim().replace(/^["']|["']$/g, "");
  const secretKey = rawKey.trim().replace(/^["']|["']$/g, "");

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}


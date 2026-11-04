import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Client dùng trong Client Component (trình duyệt)
export function taoSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
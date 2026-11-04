import "server-only"; // Báo lỗi build nếu lỡ import vào Client Component
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client service role: BỎ QUA RLS. Chỉ dùng trong server cho: thanh toán, chứng chỉ, email
export function taoSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const khoa = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !khoa) throw new Error("Thiếu biến môi trường Supabase service role");
  return createClient<Database>(url, khoa, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
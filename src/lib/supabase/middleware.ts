import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

// Làm mới phiên đăng nhập trong middleware, trả về supabase + user
export async function capNhatPhien(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(danhSach) {
          danhSach.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          danhSach.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() xác thực với server Supabase (an toàn hơn getSession)
  const { data: { user } } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    get response() {
      return response;
    },
  };
}
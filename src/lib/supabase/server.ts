import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { Database } from "@/types/database";
import type { VaiTro } from "@/types";
import { trangChuTheoVaiTro } from "@/lib/utils/vai-tro";

// Client dùng trong Server Component, Server Action, Route Handler
export async function taoSupabaseServer() {
  const kho = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => kho.getAll(),
        setAll(danhSach) {
          try {
            danhSach.forEach(({ name, value, options }) => kho.set(name, value, options));
          } catch {
            // Server Component không ghi được cookie; middleware đã làm mới phiên
          }
        },
      },
    }
  );
}

// Lấy user + profile hiện tại (cache trong 1 request). Trả về null nếu chưa đăng nhập
export const layPhienHienTai = cache(async () => {
  const supabase = await taoSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || profile.trang_thai !== "hoat_dong") return null;
  return { user, profile };
});

// Dùng đầu mỗi page cần đăng nhập/vai trò. Sai vai trò → chuyển về trang chủ của vai trò đó
export async function yeuCauVaiTro(cho?: VaiTro[]) {
  const phien = await layPhienHienTai();
  if (!phien) redirect("/dang-nhap");
  if (cho && !cho.includes(phien.profile.vai_tro as VaiTro)) {
    redirect(trangChuTheoVaiTro(phien.profile.vai_tro as VaiTro));
  }
  return phien;
}
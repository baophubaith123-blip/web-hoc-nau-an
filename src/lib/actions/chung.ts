import "server-only";
import { headers } from "next/headers";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { thatBai } from "@/lib/utils/phan-hoi-loi";
import { t } from "@/lib/i18n/config";
import type { Json } from "@/types/database";
import type { VaiTro } from "@/types";

export type Db = Awaited<ReturnType<typeof taoSupabaseServer>>;

// Kiểm tra đăng nhập + vai trò trong Server Action (không redirect, trả về lỗi để client hiển thị)
export async function canPhien(cho?: VaiTro[]) {
  const phien = await layPhienHienTai();
  if (!phien) return { ok: false as const, loi: thatBai(t("loi.chua_dang_nhap")) };
  const vaiTro = phien.profile.vai_tro as VaiTro;
  if (cho && !cho.includes(vaiTro)) return { ok: false as const, loi: thatBai(t("loi.khong_co_quyen")) };
  const supabase = await taoSupabaseServer();
  return { ok: true as const, supabase, user: phien.user, profile: phien.profile, vaiTro };
}

export const laNhanVien = (v: VaiTro) => v === "support" || v === "admin";
export const laDauBepHoacAdmin = (v: VaiTro) => v === "chef" || v === "admin";

// Chuỗi rỗng → null khi ghi DB
export const rongThanhNull = (s: string | null | undefined) => (s && s.trim() !== "" ? s : null);

// Ghi nhật ký hoạt động (lỗi ghi log không làm hỏng thao tác chính)
export async function ghiNhatKy(
  supabase: Db, nguoiDungId: string, hanhDong: string,
  doiTuong?: string, doiTuongId?: string, chiTiet: Record<string, unknown> = {}
) {
  try {
    const h = await headers();
    await supabase.from("nhat_ky_hoat_dong").insert({
      nguoi_dung_id: nguoiDungId,
      hanh_dong: hanhDong,
      doi_tuong: doiTuong ?? null,
      doi_tuong_id: doiTuongId ?? null,
      chi_tiet: chiTiet as Json,
      ip_address: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      user_agent: h.get("user-agent")?.slice(0, 300) ?? null,
    });
  } catch (e) {
    console.error("[NHAT KY]", e);
  }
}

// Lấy id người dùng đang hoạt động (phân trang 1000 dòng/lần vì PostgREST giới hạn)
export async function layIdNguoiDung(supabase: Db, vaiTro?: VaiTro): Promise<string[]> {
  const ids: string[] = [];
  for (let tu = 0; ; tu += 1000) {
    let q = supabase.from("profiles").select("id").eq("trang_thai", "hoat_dong").order("id").range(tu, tu + 999);
    if (vaiTro) q = q.eq("vai_tro", vaiTro);
    const { data, error } = await q;
    if (error) throw error;
    ids.push(...(data ?? []).map((x) => x.id));
    if (!data || data.length < 1000) break;
  }
  return ids;
}

type NoiDungThongBao = { tieu_de: string; noi_dung?: string | null; loai?: string; lien_ket?: string | null };

// Gửi thông báo cho nhiều người (chia lô 500). Client truyền vào phải có quyền INSERT thong_bao (admin hoặc service role)
export async function guiThongBaoNhieuNguoi(
  client: Db | ReturnType<typeof taoSupabaseAdmin>, ids: string[], nd: NoiDungThongBao
) {
  for (let i = 0; i < ids.length; i += 500) {
    const { error } = await client.from("thong_bao").insert(
      ids.slice(i, i + 500).map((id) => ({
        nguoi_dung_id: id, tieu_de: nd.tieu_de, noi_dung: nd.noi_dung ?? null,
        loai: nd.loai ?? "he_thong", lien_ket: nd.lien_ket ?? null,
      }))
    );
    if (error) throw error;
  }
}

// Lấy email + họ tên của 1 người dùng (cần service role vì email nằm trong auth.users)
export async function layEmailVaTen(nguoiDungId: string): Promise<{ email: string; ten: string } | null> {
  const admin = taoSupabaseAdmin();
  const { data } = await admin.auth.admin.getUserById(nguoiDungId);
  if (!data.user?.email) return null;
  const { data: hs } = await admin.from("profiles").select("ho_ten, username").eq("id", nguoiDungId).maybeSingle();
  return { email: data.user.email, ten: hs?.ho_ten ?? hs?.username ?? "bạn" };
}

// Chỉ cho quay lại đường dẫn nội bộ (chống open redirect)
export const laDuongDanNoiBo = (p: string | null | undefined): p is string =>
  !!p && p.startsWith("/") && !p.startsWith("//") && !p.includes("\\");
import "server-only";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export interface HoSoCongKhai {
  id: string;
  ho_ten: string | null;
  avatar_url: string | null;
}

/**
 * Đợt 4 — Hiển thị đúng NGƯỜI ĐĂNG thật trên thẻ và trang chi tiết.
 *
 * RLS của bảng profiles chỉ cho mỗi người đọc hồ sơ của chính mình, nên
 * các truy vấn join thẳng `tac_gia:profiles(...)` / `dau_bep:profiles(...)`
 * bằng client phiên luôn trả null khi tác giả là NGƯỜI KHÁC → thẻ khóa
 * học rơi về nhãn chung "Master Chef", thẻ công thức mất hẳn tên tác
 * giả, trang chi tiết khóa học ẩn mất khối đầu bếp. Helper này đọc
 * RIÊNG các trường công khai (id, ho_ten, avatar_url) của tác giả bằng
 * admin client — cùng mẫu đã dùng cho mục "Đầu bếp hàng đầu" ở trang
 * chủ và trang /dau-bep — rồi ghép lại theo id. Chỉ chạy ở server.
 */
export async function docHoSoCongKhai(
  ids: (string | null | undefined)[]
): Promise<Map<string, HoSoCongKhai>> {
  const duyNhat = [...new Set(ids.filter((x): x is string => typeof x === "string" && x.length > 0))];
  const banDo = new Map<string, HoSoCongKhai>();
  if (duyNhat.length === 0) return banDo;
  const admin = taoSupabaseAdmin();
  const { data } = await admin.from("profiles").select("id, ho_ten, avatar_url").in("id", duyNhat);
  for (const d of data ?? []) {
    banDo.set(d.id, { id: d.id, ho_ten: d.ho_ten, avatar_url: d.avatar_url });
  }
  return banDo;
}

/** Ghép tác giả (công thức) vào danh sách theo tac_gia_id. */
export async function ganTacGia<T extends { tac_gia_id?: string | null }>(
  danhSach: T[]
): Promise<(T & { tac_gia: HoSoCongKhai | null })[]> {
  const banDo = await docHoSoCongKhai(danhSach.map((x) => x.tac_gia_id));
  return danhSach.map((x) => ({
    ...x,
    tac_gia: x.tac_gia_id ? banDo.get(x.tac_gia_id) ?? null : null,
  }));
}

/** Ghép đầu bếp (khóa học) vào danh sách theo dau_bep_id. */
export async function ganDauBep<T extends { dau_bep_id?: string | null }>(
  danhSach: T[]
): Promise<(T & { dau_bep: HoSoCongKhai | null })[]> {
  const banDo = await docHoSoCongKhai(danhSach.map((x) => x.dau_bep_id));
  return danhSach.map((x) => ({
    ...x,
    dau_bep: x.dau_bep_id ? banDo.get(x.dau_bep_id) ?? null : null,
  }));
}

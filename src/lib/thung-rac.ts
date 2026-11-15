// ============================================================
// THÙNG RÁC (đợt 3) — helper dùng chung cho xóa mềm / khôi phục.
//
// Nguyên tắc suy giảm duyên dáng khi CHƯA dán migration 009:
// các cột mới (khoa_hoc.deleted_at, bai_viet.deleted_at,
// *.trang_thai_truoc_xoa) chưa tồn tại → truy vấn Supabase chọn
// cột đó sẽ trả lỗi "cột không tồn tại" (PostgREST: PGRST204,
// Postgres: 42703). Mọi nơi chạm cột mới đều đi qua các helper
// ở đây: gặp lỗi thiếu cột thì FALLBACK về hành vi hiện tại
// (khóa học: xóa = lưu trữ; bài viết: xóa cứng; công thức: vẫn
// xóa mềm bằng deleted_at sẵn có, khôi phục giữ nguyên trạng
// thái đang lưu) — không trang/action nào được lỗi 500.
// ============================================================

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type BangThungRac = "cong_thuc" | "khoa_hoc" | "bai_viet";
export type DbThungRac = SupabaseClient<Database>;

/** Số ngày giữ trong thùng rác trước khi đủ điều kiện dọn vĩnh viễn (chốt F.3). */
export const SO_NGAY_GIU_THUNG_RAC = 30;

type LoiTruyVan = { code?: string; message?: string } | null | undefined;

/** Lỗi "cột chưa tồn tại" — dấu hiệu migration 009 chưa được dán. */
export function laLoiThieuCot(loi: unknown): boolean {
  if (!loi || typeof loi !== "object") return false;
  const e = loi as LoiTruyVan & { details?: string; hint?: string };
  if (e?.code === "PGRST204" || e?.code === "42703") return true;
  const chuoi = `${e?.message ?? ""} ${e?.details ?? ""} ${e?.hint ?? ""}`.toLowerCase();
  return (
    chuoi.includes("could not find the") && chuoi.includes("column") ||
    chuoi.includes("column") && chuoi.includes("does not exist")
  );
}

/**
 * Chạy một truy vấn có lọc deleted_at IS NULL; nếu DB chưa có cột
 * (chưa dán migration 009) thì chạy lại KHÔNG lọc. Dùng cho các
 * truy vấn hiển thị chọn cột tường minh (không dùng select *).
 * Cách dùng: voiLocXoa((loc) => { let q = supabase.from(...).select(...); if (loc) q = q.is("deleted_at", null); return q; })
 */
export async function voiLocXoa<R extends { error: unknown }>(
  taoTruyVan: (coLoc: boolean) => PromiseLike<R>
): Promise<R> {
  const dau = await taoTruyVan(true);
  if (!laLoiThieuCot(dau.error)) return dau;
  return taoTruyVan(false);
}

/** Số ngày còn giữ được trong thùng rác (0 = đã quá hạn 30 ngày). */
export function soNgayConLai(deletedAt: string, bayGio: Date = new Date()): number {
  const daQua = Math.floor((bayGio.getTime() - new Date(deletedAt).getTime()) / 86_400_000);
  return Math.max(0, SO_NGAY_GIU_THUNG_RAC - daQua);
}

/** Nhãn tiếng Việt cho trạng thái nội dung (dùng ở các trang thùng rác). */
export const NHAN_TRANG_THAI_THUNG_RAC: Record<string, string> = {
  nhap: "Bản nháp",
  cho_duyet: "Chờ phê duyệt",
  xuat_ban: "Đã xuất bản",
  luu_tru: "Đã lưu trữ",
  tu_choi: "Bị từ chối",
};

export type DongThungRac = {
  trang_thai: string;
  deleted_at: string | null;
  trang_thai_truoc_xoa: string | null;
  chu_id: string;
};

// Kiểu cấu trúc tối thiểu của query builder Supabase cho 3 bảng thùng rác
// (tránh vướng type union khi gọi from() bằng tên bảng động).
type BoTruyVanBang = {
  select: (cot: string) => {
    eq: (cot: string, giaTri: string) => {
      maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
    };
  };
  update: (duLieu: Record<string, unknown>) => {
    eq: (cot: string, giaTri: string) => Promise<{ error: unknown }>;
  };
};

function bangDb(client: DbThungRac, bang: BangThungRac): BoTruyVanBang {
  return client.from(bang as never) as unknown as BoTruyVanBang;
}

/**
 * Đọc 1 dòng kèm thông tin thùng rác bằng client bất kỳ (thường là
 * admin client để thấy cả dòng đã xóa mềm). Trả về thieuCot = true
 * khi DB chưa có cột của migration 009 — khi đó deleted_at được
 * hiểu là null (chưa thể nằm trong thùng rác) trừ cong_thuc vốn
 * đã có deleted_at từ migration 001.
 */
export async function docDongThungRac(
  client: DbThungRac,
  bang: BangThungRac,
  id: string,
  cotChu: "tac_gia_id" | "dau_bep_id"
): Promise<{ dong: DongThungRac | null; thieuCot: boolean }> {
  const dayDu = await bangDb(client, bang)
    .select(`trang_thai, deleted_at, trang_thai_truoc_xoa, chu_id:${cotChu}`)
    .eq("id", id)
    .maybeSingle();
  if (!laLoiThieuCot(dayDu.error)) {
    if (dayDu.error) throw dayDu.error;
    const d = dayDu.data as DongThungRac | null;
    return { dong: d, thieuCot: false };
  }
  // Fallback: chỉ đọc cột chắc chắn tồn tại (cong_thuc có thêm deleted_at)
  const cotCoBan = bang === "cong_thuc" ? `trang_thai, deleted_at, chu_id:${cotChu}` : `trang_thai, chu_id:${cotChu}`;
  const thieu = await bangDb(client, bang).select(cotCoBan).eq("id", id).maybeSingle();
  if (thieu.error) throw thieu.error;
  const d = thieu.data as (Omit<DongThungRac, "trang_thai_truoc_xoa"> & { deleted_at?: string | null }) | null;
  return {
    dong: d
      ? {
          trang_thai: d.trang_thai,
          deleted_at: d.deleted_at ?? null,
          trang_thai_truoc_xoa: null,
          chu_id: d.chu_id,
        }
      : null,
    thieuCot: true,
  };
}

export type KetQuaGhiXoaMem =
  | { cheDo: "day_du" }
  | { cheDo: "thieu_cot_nho" } // cong_thuc: đã set deleted_at, chỉ thiếu cột nhớ trạng thái
  | { cheDo: "chua_co_cot" }; // khoa_hoc/bai_viet: chưa có cả deleted_at → caller fallback hành vi cũ

/**
 * Ghi xóa mềm: set deleted_at = now + lưu trang_thai_truoc_xoa,
 * GIỮ NGUYÊN trang_thai hiện tại (khôi phục sẽ về đúng trạng thái).
 * Caller phải kiểm tra quyền tường minh trước khi gọi (hàm này ghi
 * bằng client được truyền vào — thường là admin client, xem ghi
 * chú ở đầu migration 009 về lý do không dùng client phiên).
 */
export async function ghiXoaMem(
  client: DbThungRac,
  bang: BangThungRac,
  id: string,
  trangThaiTruocXoa: string
): Promise<KetQuaGhiXoaMem> {
  const bayGio = new Date().toISOString();
  const { error } = await bangDb(client, bang)
    .update({ deleted_at: bayGio, trang_thai_truoc_xoa: trangThaiTruocXoa })
    .eq("id", id);
  if (!error) return { cheDo: "day_du" };
  if (!laLoiThieuCot(error)) throw error;
  if (bang !== "cong_thuc") return { cheDo: "chua_co_cot" };
  // cong_thuc: deleted_at đã có sẵn, chỉ thiếu cột nhớ → set riêng deleted_at
  const { error: e2 } = await bangDb(client, bang).update({ deleted_at: bayGio }).eq("id", id);
  if (e2) throw e2;
  return { cheDo: "thieu_cot_nho" };
}

/**
 * Ghi khôi phục: xóa deleted_at, trả trang_thai về trạng thái đã
 * lưu trong trang_thai_truoc_xoa (nếu có) rồi dọn cột nhớ.
 * Khi thiếu cột nhớ (chưa migration): chỉ xóa deleted_at — trạng
 * thái vẫn đúng vì lúc xóa mềm ta giữ nguyên trang_thai.
 */
export async function ghiKhoiPhuc(
  client: DbThungRac,
  bang: BangThungRac,
  id: string,
  dong: DongThungRac
): Promise<void> {
  const trangThaiKhoiPhuc = dong.trang_thai_truoc_xoa ?? dong.trang_thai;
  const { error } = await bangDb(client, bang)
    .update({ deleted_at: null, trang_thai: trangThaiKhoiPhuc, trang_thai_truoc_xoa: null })
    .eq("id", id);
  if (!error) return;
  if (!laLoiThieuCot(error)) throw error;
  const { error: e2 } = await bangDb(client, bang).update({ deleted_at: null }).eq("id", id);
  if (e2) throw e2;
}

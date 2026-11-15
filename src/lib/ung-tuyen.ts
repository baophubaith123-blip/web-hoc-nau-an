// Đợt 5 — Đăng ký trở thành đầu bếp: hằng số dùng chung + nhận diện
// lỗi "chưa có bảng don_ung_tuyen_dau_bep" (migration 010 chưa chạy)
// để code chạy suy giảm duyên dáng — cùng mẫu thùng rác đợt 3 với
// migration 009 (laLoiThieuCot trong lib/thung-rac.ts).

export const BANG_DON_UNG_TUYEN = "don_ung_tuyen_dau_bep";

// Bị từ chối -> gửi lại sau 7 ngày (chốt F.3)
export const SO_NGAY_GUI_LAI_SAU_TU_CHOI = 7;

export const THONG_BAO_CHUA_KICH_HOAT_010 =
  "Tính năng đăng ký đầu bếp sẽ kích hoạt sau khi cập nhật cơ sở dữ liệu (migration 010).";

export function laLoiThieuBang(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  // 42P01: bảng chưa tồn tại (Postgres) · PGRST205: PostgREST chưa thấy
  // bảng trong schema cache — cả hai đều nghĩa là chưa chạy migration 010.
  if (e.code === "42P01" || e.code === "PGRST205") return true;
  const msg = e.message ?? "";
  return (
    msg.includes(BANG_DON_UNG_TUYEN) &&
    (msg.includes("does not exist") || msg.includes("schema cache"))
  );
}

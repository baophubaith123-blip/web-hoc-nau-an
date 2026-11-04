import { z } from "zod";

// Kết quả chuẩn của mọi Server Action
export type KetQua<T = void> =
  | { thanh_cong: true; du_lieu: T }
  | { thanh_cong: false; loi: string; loi_truong?: Record<string, string[]> };

export function thanhCong(): KetQua<void>;
export function thanhCong<T>(du_lieu: T): KetQua<T>;
export function thanhCong<T>(du_lieu?: T): KetQua<T> {
  return { thanh_cong: true, du_lieu: du_lieu as T };
}

export function thatBai(loi: string, loi_truong?: Record<string, string[]>): KetQua<never> {
  return { thanh_cong: false, loi, loi_truong };
}

// Chuẩn hóa mọi lỗi → thông điệp tiếng Việt. Chi tiết chỉ ghi log server, KHÔNG gửi stack cho client
export function chuanHoaLoi(loi: unknown): KetQua<never> {
  if (loi instanceof z.ZodError) {
    const truong: Record<string, string[]> = {};
    for (const issue of loi.issues) {
      const key = issue.path.join(".") || "_";
      if (!truong[key]) truong[key] = [];
      truong[key].push(issue.message);
    }
    return thatBai("Dữ liệu không hợp lệ", truong);
  }
  const e = loi as { code?: string; message?: string } | null;
  console.error("[LOI]", e?.code, e?.message);

  if (e?.code === "23505") return thatBai("Dữ liệu đã tồn tại");
  if (e?.code === "42501") return thatBai("Bạn không có quyền thực hiện thao tác này");
  if (e?.code === "23503") return thatBai("Dữ liệu liên quan không tồn tại hoặc đang được sử dụng");
  // P0001 = RAISE EXCEPTION trong trigger (ví dụ giới hạn tần suất), message đã là tiếng Việt
  if (e?.code === "P0001" && e.message) return thatBai(e.message);
  return thatBai("Đã có lỗi xảy ra, vui lòng thử lại sau");
}
"use server";

import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy } from "@/lib/actions/chung";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { laLoiThieuCot, SO_NGAY_GIU_THUNG_RAC } from "@/lib/thung-rac";
import { chuanHoaLoi, thanhCong, type KetQua } from "@/lib/utils/phan-hoi-loi";

const CAC_TRANG_THUNG_RAC = ["/quan-tri/thung-rac", "/bep/thung-rac", "/thung-rac"];

/**
 * Dọn thùng rác: xóa VĨNH VIỄN mọi mục đã nằm trong thùng rác quá
 * 30 ngày ở cả 3 loại nội dung. CHỈ Admin (chốt F.3: giữ 30 ngày,
 * dọn thủ công bằng nút trong trang thùng rác admin — không cron).
 * Bảng nào chưa có cột deleted_at (chưa dán migration 009) thì bỏ
 * qua bảng đó, không lỗi.
 */
export async function donThungRac(): Promise<
  KetQua<{ cong_thuc: number; khoa_hoc: number; bai_viet: number }>
> {
  try {
    const p = await canPhien(["admin"]);
    if (!p.ok) return p.loi;

    const admin = taoSupabaseAdmin();
    const moc = new Date(Date.now() - SO_NGAY_GIU_THUNG_RAC * 86_400_000).toISOString();
    const ketQua = { cong_thuc: 0, khoa_hoc: 0, bai_viet: 0 };

    const ct = await admin.from("cong_thuc").delete().lt("deleted_at", moc).select("id");
    if (ct.error) throw ct.error;
    ketQua.cong_thuc = ct.data?.length ?? 0;

    const kh = await admin.from("khoa_hoc").delete().lt("deleted_at", moc).select("id");
    if (kh.error && !laLoiThieuCot(kh.error)) throw kh.error;
    ketQua.khoa_hoc = kh.error ? 0 : (kh.data?.length ?? 0);

    const bv = await admin.from("bai_viet").delete().lt("deleted_at", moc).select("id");
    if (bv.error && !laLoiThieuCot(bv.error)) throw bv.error;
    ketQua.bai_viet = bv.error ? 0 : (bv.data?.length ?? 0);

    await ghiNhatKy(p.supabase, p.user.id, "don_thung_rac", "thung_rac", undefined, {
      ...ketQua,
      moc_xoa_truoc: moc,
    });
    CAC_TRANG_THUNG_RAC.forEach((t) => revalidatePath(t));
    return thanhCong(ketQua);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

import { z } from "zod";
import { idUuid, urlTuyChon, vanBan, vanBanTuyChon } from "@/lib/validations/chung";

// Đơn ứng tuyển đầu bếp (đợt 5, phương án A — chốt F.3).
// Số năm kinh nghiệm là trường BẮT BUỘC, tối thiểu 0: người mới vào
// nghề vẫn ứng tuyển được, nhưng không được để trống/lấp lửng.
export const guiDonUngTuyenSchema = z.object({
  chuyen_mon: vanBan(2, 300),
  so_nam_kinh_nghiem: z
    .number({ message: "Vui lòng nhập số năm kinh nghiệm" })
    .int("Số năm kinh nghiệm phải là số nguyên")
    .min(0, "Số năm kinh nghiệm tối thiểu là 0")
    .max(70, "Số năm kinh nghiệm chưa hợp lệ"),
  mon_tu: vanBanTuyChon(200),
  tieu_su: vanBan(30, 1000),
  ly_do: vanBan(20, 1000),
  lien_ket_mang_xa_hoi: urlTuyChon,
});
export type GuiDonUngTuyenInput = z.infer<typeof guiDonUngTuyenSchema>;

export const duyetDonUngTuyenSchema = z.object({
  don_id: idUuid,
});
export type DuyetDonUngTuyenInput = z.infer<typeof duyetDonUngTuyenSchema>;

export const tuChoiDonUngTuyenSchema = z.object({
  don_id: idUuid,
  ly_do_tu_choi: vanBan(3, 500),
});
export type TuChoiDonUngTuyenInput = z.infer<typeof tuChoiDonUngTuyenSchema>;

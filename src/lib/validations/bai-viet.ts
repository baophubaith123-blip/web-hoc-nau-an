import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { urlTuyChon, vanBan, vanBanTuyChon } from "./chung";

export const baiVietSchema = z.object({
  tieu_de: vanBan(5, 200),
  tom_tat: vanBanTuyChon(300),
  // Nội dung markdown: KHÔNG strip ở đây, được làm sạch khi hiển thị (hien-thi-markdown.tsx)
  noi_dung: z
    .string()
    .trim()
    .min(20, t("kiem_tra.toi_thieu", { so: 20 }))
    .max(50000, t("kiem_tra.toi_da", { so: 50000 })),
  anh_dai_dien: urlTuyChon,
  danh_muc: vanBanTuyChon(50),
  trang_thai: z.enum(["nhap", "cho_duyet", "xuat_ban", "luu_tru", "tu_choi"]),
});

export type BaiVietForm = z.infer<typeof baiVietSchema>;

// Form phía người dùng: trạng thái do server quyết định (nháp / chờ duyệt), client không gửi lên
export const baiVietNguoiDungSchema = baiVietSchema.omit({ trang_thai: true });
export type BaiVietNguoiDungForm = z.infer<typeof baiVietNguoiDungSchema>;

// Admin từ chối bài viết chờ duyệt (bắt buộc có lý do để tác giả sửa lại)
export const tuChoiBaiVietSchema = z.object({
  id: z.string().uuid(),
  ly_do: vanBan(5, 500),
});
export type TuChoiBaiVietForm = z.infer<typeof tuChoiBaiVietSchema>;
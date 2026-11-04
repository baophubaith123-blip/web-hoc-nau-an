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
  trang_thai: z.enum(["nhap", "xuat_ban", "luu_tru"]),
});

export type BaiVietForm = z.infer<typeof baiVietSchema>;
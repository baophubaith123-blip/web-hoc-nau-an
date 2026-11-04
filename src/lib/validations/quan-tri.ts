import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { idUuid, soNguyen, urlTuyChon, vanBan, vanBanTuyChon } from "./chung";

export const danhMucSchema = z.object({
  ten: vanBan(2, 80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t("kiem_tra.slug")).max(80),
  mo_ta: vanBanTuyChon(300),
  anh_dai_dien: urlTuyChon,
  danh_muc_cha_id: idUuid.nullable(),
  thu_tu: soNguyen(0, 9999),
  trang_thai: z.enum(["hoat_dong", "an"]),
});

export const doiVaiTroSchema = z.object({
  nguoi_dung_id: idUuid,
  vai_tro: z.enum(["user", "chef", "support", "admin"]),
});

export const khoaNguoiDungSchema = z.object({ nguoi_dung_id: idUuid, khoa: z.boolean() });

// Liên kết trong thông báo: chỉ cho phép đường dẫn nội bộ (chống chèn link độc hại)
const lienKetNoiBo = z
  .string()
  .trim()
  .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")), t("kiem_tra.lien_ket_noi_bo"));

export const broadcastSchema = z.object({
  tieu_de: vanBan(3, 120),
  noi_dung: vanBan(3, 500),
  doi_tuong: z.enum(["tat_ca", "chef", "support"]),
  lien_ket: lienKetNoiBo,
});

export const hoanTienSchema = z.object({ thanh_toan_id: idUuid });

export const xuLyBaoCaoSchema = z.object({
  id: idUuid,
  trang_thai: z.enum(["dang_xu_ly", "da_xu_ly", "bo_qua"]),
});

// Cấu hình hệ thống: mỗi nhóm ứng với 1 dòng trong cau_hinh_he_thong
export const cauHinhSchema = z.object({
  site: z.object({
    ten_site: vanBan(2, 80),
    slogan: vanBanTuyChon(150),
    logo_url: urlTuyChon,
    email_lien_he: z.email(t("kiem_tra.email")),
    so_dien_thoai: vanBanTuyChon(20),
    dia_chi: vanBanTuyChon(200),
  }),
  seo: z.object({ tieu_de: vanBan(3, 70), mo_ta: vanBanTuyChon(160), tu_khoa: vanBanTuyChon(200) }),
  thanh_toan: z.object({ vnpay_bat: z.boolean(), momo_bat: z.boolean(), stripe_bat: z.boolean() }),
  email: z.object({ gui_tu: vanBan(2, 80), bat_email_thanh_toan: z.boolean() }),
});

export type DanhMucForm = z.infer<typeof danhMucSchema>;
export type BroadcastForm = z.infer<typeof broadcastSchema>;
export type CauHinhForm = z.infer<typeof cauHinhSchema>;
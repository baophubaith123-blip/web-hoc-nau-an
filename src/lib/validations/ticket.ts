import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { idUuid, vanBan } from "./chung";

export const DANH_MUC_TICKET = ["tai_khoan", "thanh_toan", "khoa_hoc", "ky_thuat", "khac"] as const;

export const taoTicketSchema = z.object({
  tieu_de: vanBan(5, 150),
  noi_dung: vanBan(10, 5000),
  danh_muc: z.enum(DANH_MUC_TICKET, { error: t("kiem_tra.bat_buoc") }),
});

export const tinNhanTicketSchema = z.object({
  ticket_id: idUuid,
  noi_dung: vanBan(1, 5000),
  la_noi_bo: z.boolean(), // chỉ support/admin mới được đặt true (RLS cũng chặn)
});

export const doiTrangThaiTicketSchema = z.object({
  ticket_id: idUuid,
  trang_thai: z.enum(["moi", "dang_xu_ly", "cho_phan_hoi", "da_giai_quyet", "dong"]),
});

export const phanCongTicketSchema = z.object({
  ticket_id: idUuid,
  nhan_vien_id: idUuid.nullable(),
});

export const doiUuTienTicketSchema = z.object({
  ticket_id: idUuid,
  do_uu_tien: z.enum(["thap", "trung_binh", "cao", "khan_cap"]),
});

// Form liên hệ công khai (guest cũng gửi được)
export const lienHeSchema = z.object({
  ho_ten: vanBan(2, 80),
  email: z.email(t("kiem_tra.email")).max(255),
  chu_de: vanBan(3, 150),
  noi_dung: vanBan(10, 3000),
});

export type TaoTicketForm = z.infer<typeof taoTicketSchema>;
export type TinNhanTicketForm = z.infer<typeof tinNhanTicketSchema>;
export type LienHeForm = z.infer<typeof lienHeSchema>;
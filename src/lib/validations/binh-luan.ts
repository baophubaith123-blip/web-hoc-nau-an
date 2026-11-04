import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { idUuid, vanBan, vanBanTuyChon } from "./chung";

export const binhLuanSchema = z.object({
  cong_thuc_id: idUuid,
  noi_dung: vanBan(1, 2000),
  binh_luan_cha_id: idUuid.nullable(),
});

export const suaBinhLuanSchema = z.object({ id: idUuid, noi_dung: vanBan(1, 2000) });

export const danhGiaSchema = z.object({
  cong_thuc_id: idUuid,
  diem: z.number({ error: t("kiem_tra.diem_1_5") }).int().min(1, t("kiem_tra.diem_1_5")).max(5, t("kiem_tra.diem_1_5")),
  nhan_xet: vanBanTuyChon(1000),
});

export const baoCaoSchema = z.object({
  loai_doi_tuong: z.enum(["cong_thuc", "binh_luan", "khoa_hoc", "nguoi_dung", "bai_viet"]),
  doi_tuong_id: idUuid,
  ly_do: vanBan(3, 100),
  mo_ta: vanBanTuyChon(1000),
});

export type BinhLuanForm = z.infer<typeof binhLuanSchema>;
export type DanhGiaForm = z.infer<typeof danhGiaSchema>;
export type BaoCaoForm = z.infer<typeof baoCaoSchema>;
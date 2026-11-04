import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { idUuid, linkYoutubeTuyChon, soNguyen, urlTuyChon, vanBan, vanBanTuyChon } from "./chung";

export const nguyenLieuSchema = z.object({
  ten: vanBan(1, 100),
  so_luong: z.number({ error: t("kiem_tra.bat_buoc") }).positive(t("kiem_tra.so_duong")).max(100000),
  don_vi: vanBan(1, 30),
});

export const buocNauSchema = z.object({
  thu_tu: z.number().int().min(1),
  noi_dung: vanBan(5, 2000),
  anh: urlTuyChon.optional(),
});

export const congThucSchema = z.object({
  tieu_de: vanBan(3, 150),
  mo_ta: vanBanTuyChon(500),
  nguyen_lieu: z.array(nguyenLieuSchema).min(1, t("kiem_tra.can_it_nhat_mot_nguyen_lieu")).max(60),
  cac_buoc: z.array(buocNauSchema).min(1, t("kiem_tra.can_it_nhat_mot_buoc")).max(60),
  thoi_gian_chuan_bi: soNguyen(0, 1440),
  thoi_gian_nau: soNguyen(0, 1440),
  khau_phan: soNguyen(1, 100, t("kiem_tra.so_duong")),
  do_kho: z.enum(["de", "trung_binh", "kho"], { error: t("kiem_tra.bat_buoc") }),
  anh_dai_dien: urlTuyChon,
  video_url: linkYoutubeTuyChon,
  calories: z.number().int().min(0).max(10000).nullable(),
  danh_muc_ids: z.array(idUuid).max(5),
});

// Từ chối công thức (admin)
export const tuChoiCongThucSchema = z.object({
  id: idUuid,
  ly_do: vanBan(5, 500),
});

export type CongThucForm = z.infer<typeof congThucSchema>;
export type TuChoiCongThucForm = z.infer<typeof tuChoiCongThucSchema>;
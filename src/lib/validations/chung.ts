import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { lamSachVanBan } from "@/lib/utils/sanitize";
import { layIdYoutube } from "@/lib/utils/youtube";

// Chuỗi bắt buộc: tự bỏ thẻ HTML/ký tự lạ rồi mới kiểm tra độ dài
export const vanBan = (toiThieu = 1, toiDa = 255) =>
  z
    .string()
    .transform(lamSachVanBan)
    .pipe(
      z
        .string()
        .min(toiThieu, toiThieu <= 1 ? t("kiem_tra.bat_buoc") : t("kiem_tra.toi_thieu", { so: toiThieu }))
        .max(toiDa, t("kiem_tra.toi_da", { so: toiDa }))
    );

// Chuỗi tùy chọn (cho phép rỗng)
export const vanBanTuyChon = (toiDa = 1000) =>
  z
    .string()
    .transform(lamSachVanBan)
    .pipe(z.string().max(toiDa, t("kiem_tra.toi_da", { so: toiDa })));

// z.guid() (không phải z.uuid()) vì id trong seed.sql không theo đúng chuẩn phiên bản UUID
export const idUuid = z.guid(t("kiem_tra.bat_buoc"));

const laUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);
export const urlBatBuoc = z.string().trim().refine(laUrl, t("kiem_tra.url"));
export const urlTuyChon = z.string().trim().refine((v) => v === "" || laUrl(v), t("kiem_tra.url"));

export const linkYoutubeTuyChon = z
  .string()
  .trim()
  .refine((v) => v === "" || !!layIdYoutube(v), t("kiem_tra.youtube"));

// Số nguyên trong khoảng (form dùng valueAsNumber)
export const soNguyen = (min: number, max: number, thongDiep?: string) =>
  z
    .number({ error: t("kiem_tra.bat_buoc") })
    .int(thongDiep ?? t("kiem_tra.bat_buoc"))
    .min(min, thongDiep ?? t("kiem_tra.so_khong_am"))
    .max(max, t("kiem_tra.toi_da", { so: max }));
import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { vanBan, vanBanTuyChon } from "./chung";
import { mauMatKhau } from "./auth";

export const hoSoSchema = z.object({
  ho_ten: vanBan(2, 80),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, t("kiem_tra.ten_dang_nhap")),
  bio: vanBanTuyChon(500),
  so_dien_thoai: z
    .string()
    .trim()
    .refine((v) => v === "" || /^(0|\+84)\d{9}$/.test(v.replace(/\s/g, "")), t("kiem_tra.so_dien_thoai")),
  dia_chi: vanBanTuyChon(200),
  ngay_sinh: z.string().refine((v) => v === "" || !Number.isNaN(Date.parse(v)), t("kiem_tra.bat_buoc")),
  gioi_tinh: z.enum(["nam", "nu", "khac", ""]),
});

export const doiMatKhauSchema = z
  .object({
    mat_khau_hien_tai: z.string().min(1, t("kiem_tra.bat_buoc")),
    mat_khau_moi: mauMatKhau,
    xac_nhan_mat_khau: z.string().min(1, t("kiem_tra.bat_buoc")),
  })
  .refine((d) => d.mat_khau_moi === d.xac_nhan_mat_khau, {
    error: t("kiem_tra.mat_khau_khong_khop"),
    path: ["xac_nhan_mat_khau"],
  });

export type HoSoForm = z.infer<typeof hoSoSchema>;
export type DoiMatKhauForm = z.infer<typeof doiMatKhauSchema>;
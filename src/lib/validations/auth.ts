import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { vanBan } from "./chung";

const email = z.email(t("kiem_tra.email")).max(255);

export const mauMatKhau = z
  .string()
  .min(8, t("kiem_tra.mat_khau_ngan"))
  .max(72, t("kiem_tra.toi_da", { so: 72 }))
  .regex(/[a-z]/, t("kiem_tra.mat_khau_manh"))
  .regex(/[A-Z]/, t("kiem_tra.mat_khau_manh"))
  .regex(/\d/, t("kiem_tra.mat_khau_manh"));

export const dangNhapSchema = z.object({
  email,
  mat_khau: z.string().min(1, t("kiem_tra.bat_buoc")),
});

export const dangKySchema = z
  .object({
    ho_ten: vanBan(2, 80),
    email,
    mat_khau: mauMatKhau,
    xac_nhan_mat_khau: z.string().min(1, t("kiem_tra.bat_buoc")),
    dong_y: z.boolean().refine((v) => v, t("kiem_tra.can_dong_y")),
  })
  .refine((d) => d.mat_khau === d.xac_nhan_mat_khau, {
    error: t("kiem_tra.mat_khau_khong_khop"),
    path: ["xac_nhan_mat_khau"],
  });

export const quenMatKhauSchema = z.object({ email });

export const datLaiMatKhauSchema = z
  .object({ mat_khau: mauMatKhau, xac_nhan_mat_khau: z.string().min(1, t("kiem_tra.bat_buoc")) })
  .refine((d) => d.mat_khau === d.xac_nhan_mat_khau, {
    error: t("kiem_tra.mat_khau_khong_khop"),
    path: ["xac_nhan_mat_khau"],
  });

export type DangNhapForm = z.infer<typeof dangNhapSchema>;
export type DangKyForm = z.infer<typeof dangKySchema>;
export type QuenMatKhauForm = z.infer<typeof quenMatKhauSchema>;
export type DatLaiMatKhauForm = z.infer<typeof datLaiMatKhauSchema>;
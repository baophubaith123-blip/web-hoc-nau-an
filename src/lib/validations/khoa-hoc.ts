import { z } from "zod";
import { t } from "@/lib/i18n/config";
import { idUuid, linkYoutubeTuyChon, soNguyen, urlBatBuoc, urlTuyChon, vanBan, vanBanTuyChon } from "./chung";

export const khoaHocSchema = z
  .object({
    tieu_de: vanBan(5, 150),
    mo_ta: vanBan(10, 300),
    mo_ta_chi_tiet: vanBanTuyChon(5000),
    anh_dai_dien: urlTuyChon,
    video_gioi_thieu: linkYoutubeTuyChon,
    cap_do: z.enum(["co_ban", "trung_cap", "nang_cao"], { error: t("kiem_tra.bat_buoc") }),
    gia: soNguyen(0, 50_000_000),
    mien_phi: z.boolean(),
    co_chung_chi: z.boolean(),
    co_tai_lieu: z.boolean(),
    co_bai_tap: z.boolean(),
    ho_tro_1_1: z.boolean(),
  })
  .refine((d) => !d.mien_phi || d.gia === 0, { error: t("kiem_tra.mien_phi_gia_0"), path: ["gia"] })
  .refine((d) => d.mien_phi || d.gia >= 10000, { error: t("kiem_tra.gia_toi_thieu"), path: ["gia"] })
  .refine((d) => !d.mien_phi || !(d.co_chung_chi || d.co_tai_lieu || d.co_bai_tap || d.ho_tro_1_1), {
    error: t("kiem_tra.mien_phi_khong_quyen_loi"),
    path: ["mien_phi"],
  });

export const taiLieuSchema = z.object({ ten: vanBan(1, 120), url: urlBatBuoc });

export const baiTapSchema = z
  .object({
    cau_hoi: vanBan(3, 500),
    lua_chon: z.array(vanBan(1, 200)).min(2, t("kiem_tra.tu_2_lua_chon")).max(6),
    dap_an_dung: z.number().int().min(0),
    diem: soNguyen(1, 100),
  })
  .refine((d) => d.dap_an_dung < d.lua_chon.length, {
    error: t("kiem_tra.dap_an_khong_hop_le"),
    path: ["dap_an_dung"],
  });

export const baiHocSchema = z.object({
  khoa_hoc_id: idUuid,
  tieu_de: vanBan(3, 150),
  mo_ta: vanBanTuyChon(1000),
  video_url: linkYoutubeTuyChon,
  tai_lieu: z.array(taiLieuSchema).max(20),
  bai_tap: z.array(baiTapSchema).max(50),
  thoi_gian_phut: soNguyen(0, 600),
  thu_tu: soNguyen(0, 1000),
  xem_truoc: z.boolean(),
});

export type KhoaHocForm = z.infer<typeof khoaHocSchema>;
export type BaiHocForm = z.infer<typeof baiHocSchema>;
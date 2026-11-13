"use server";

import type { Bang } from "@/types";
import { revalidatePath } from "next/cache";
import { canPhien, ghiNhatKy } from "@/lib/actions/chung";
import { huyYeuCauSchema } from "@/lib/validations/yeu-cau-nang-cap";
import { chuanHoaLoi, thanhCong, thatBai, type KetQua } from "@/lib/utils/phan-hoi-loi";
import { t } from "@/lib/i18n/config";
import { donYeuCauHetHan } from "@/lib/thanh-toan/yeu-cau";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

// Lấy danh sách các gói Pro đang hoạt động công khai
export async function layDanhSachGoiAction(): Promise<KetQua<Bang<"goi_premium">[]>> {
  try {
    const p = await canPhien();
    const supabase = p.ok ? p.supabase : (await import("@/lib/supabase/server")).taoSupabaseServer().then((s) => s);
    const db = await supabase;

    const { data, error } = await db
      .from("goi_premium")
      .select("*")
      .eq("hoat_dong", true)
      .order("thu_tu", { ascending: true });

    if (error) throw error;
    return thanhCong(data ?? []);
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Lấy thông tin gói của người dùng hiện tại + lịch sử + yêu cầu đang chờ
export async function layGoiCuaToiAction(): Promise<
  KetQua<{
    dangHoatDong: (Bang<"goi_nguoi_dung"> & { goi: Bang<"goi_premium"> | null }) | null;
    lichSu: (Bang<"goi_nguoi_dung"> & { goi: Bang<"goi_premium"> | null })[];
    yeuCauChoDuyet: (Bang<"yeu_cau_nang_cap"> & {
      goi: Bang<"goi_premium"> | null;
      thanh_toan: Bang<"thanh_toan"> | null;
    })[];
    profile: {
      la_pro: boolean;
      goi_het_han: string | null;
    };
  }>
> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;

    await donYeuCauHetHan(taoSupabaseAdmin());

    // 1. Lấy thông tin profile
    const { data: profile } = await p.supabase
      .from("profiles")
      .select("la_pro, goi_het_han")
      .eq("id", p.user.id)
      .single();

    // 2. Lấy gói đang hoạt động
    const { data: goiHoatDong } = await p.supabase
      .from("goi_nguoi_dung")
      .select("*, goi:goi_premium(*)")
      .eq("nguoi_dung_id", p.user.id)
      .eq("trang_thai", "hoat_dong")
      .order("ngay_het_han", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Lấy toàn bộ lịch sử gói
    const { data: lichSu } = await p.supabase
      .from("goi_nguoi_dung")
      .select("*, goi:goi_premium(*)")
      .eq("nguoi_dung_id", p.user.id)
      .order("created_at", { ascending: false });

    // 4. Lấy các yêu cầu nâng cấp đang chờ duyệt
    const { data: yeuCauChoDuyet } = await p.supabase
      .from("yeu_cau_nang_cap")
      .select("*, goi:goi_premium(*), thanh_toan(*)")
      .eq("nguoi_dung_id", p.user.id)
      .eq("trang_thai", "cho_duyet")
      .order("created_at", { ascending: false });

    return thanhCong({
      dangHoatDong: goiHoatDong ?? null,
      lichSu: lichSu ?? [],
      yeuCauChoDuyet: yeuCauChoDuyet ?? [],
      profile: {
        la_pro: profile?.la_pro ?? false,
        goi_het_han: profile?.goi_het_han ?? null,
      },
    });
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

// Người dùng hủy yêu cầu nâng cấp đang chờ duyệt
export async function huyYeuCauNangCapAction(dauVao: unknown): Promise<KetQua> {
  try {
    const p = await canPhien();
    if (!p.ok) return p.loi;
    const d = huyYeuCauSchema.parse(dauVao);

    // Kiểm tra yêu cầu có thuộc về người dùng không và trạng thái có phải cho_duyet
    const { data: yc } = await p.supabase
      .from("yeu_cau_nang_cap")
      .select("id, trang_thai, nguoi_dung_id, ma_yeu_cau")
      .eq("id", d.yeu_cau_id)
      .eq("nguoi_dung_id", p.user.id)
      .maybeSingle();

    if (!yc) return thatBai(t("loi.khong_tim_thay"));
    if (yc.trang_thai !== "cho_duyet") {
      return thatBai("Yêu cầu này không thể hủy vì đã được xử lý.");
    }

    const { error } = await p.supabase
      .from("yeu_cau_nang_cap")
      .update({ trang_thai: "da_huy" })
      .eq("id", yc.id);

    if (error) throw error;

    await ghiNhatKy(p.supabase, p.user.id, "huy_yeu_cau_nang_cap", "yeu_cau_nang_cap", yc.id, {
      ma_yeu_cau: yc.ma_yeu_cau,
    });

    revalidatePath("/goi-cua-toi");
    revalidatePath("/quan-tri/duyet-nang-cap");
    return thanhCong();
  } catch (e) {
    return chuanHoaLoi(e);
  }
}

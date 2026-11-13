import "server-only";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

type DbAdmin = ReturnType<typeof taoSupabaseAdmin>;

// Nguong giao dich treo: qua 30 phut chua co ket qua IPN thi yeu cau di kem
// tu het hieu luc (nguoi dung co the dong tab/bot giua chung khi thanh toan).
export const NGUONG_HET_HAN_PHUT = 30;

export const LY_DO_THANH_TOAN_THAT_BAI =
  "Thanh toán thất bại hoặc đã hủy tại cổng thanh toán";
export const LY_DO_QUA_HAN = `Giao dịch chưa hoàn tất sau ${NGUONG_HET_HAN_PHUT} phút — yêu cầu tự hết hiệu lực`;

// Huy (he thong) moi yeu cau con cho_duyet gan voi mot giao dich.
// Dung khi giao dich that bai/huy: yeu cau khong con nam o hang cho duyet,
// hoc vien thay no trong lich su voi nhan "Da huy".
export async function huyYeuCauTheoGiaoDich(
  db: DbAdmin,
  thanhToanId: string,
  lyDo: string
): Promise<void> {
  await db
    .from("yeu_cau_nang_cap")
    .update({
      trang_thai: "da_huy",
      ly_do_tu_choi: lyDo,
      updated_at: new Date().toISOString(),
    })
    .eq("thanh_toan_id", thanhToanId)
    .eq("trang_thai", "cho_duyet");
}

// Quet dinh ky (lazy — chay khi admin mo trang duyet hoac hoc vien mo trang
// goi cua toi, va truoc khi admin bam duyet):
//  1) Yeu cau cho_duyet ma giao dich da that_bai -> da_huy.
//  2) Yeu cau cho_duyet ma giao dich cho_xu_ly qua nguong -> da_huy (het han).
// Khong bao gio nem loi ra ngoai: loi quet khong duoc lam hong trang chinh.
export async function donYeuCauHetHan(db?: DbAdmin): Promise<{ daHuy: number }> {
  try {
    const client = db ?? taoSupabaseAdmin();
    let daHuy = 0;

    // 1) Giao dich that bai
    const { data: gdThatBai } = await client
      .from("thanh_toan")
      .select("id")
      .eq("trang_thai", "that_bai")
      .eq("loai_thanh_toan", "goi_premium");

    const idsThatBai = (gdThatBai ?? []).map((g) => g.id);
    if (idsThatBai.length > 0) {
      const { data: huy1 } = await client
        .from("yeu_cau_nang_cap")
        .update({
          trang_thai: "da_huy",
          ly_do_tu_choi: LY_DO_THANH_TOAN_THAT_BAI,
          updated_at: new Date().toISOString(),
        })
        .in("thanh_toan_id", idsThatBai)
        .eq("trang_thai", "cho_duyet")
        .select("id");
      daHuy += huy1?.length ?? 0;
    }

    // 2) Giao dich treo qua nguong
    const moc = new Date(Date.now() - NGUONG_HET_HAN_PHUT * 60_000).toISOString();
    const { data: gdTreo } = await client
      .from("thanh_toan")
      .select("id")
      .eq("trang_thai", "cho_xu_ly")
      .eq("loai_thanh_toan", "goi_premium")
      .lt("created_at", moc);

    const idsTreo = (gdTreo ?? []).map((g) => g.id);
    if (idsTreo.length > 0) {
      const { data: huy2 } = await client
        .from("yeu_cau_nang_cap")
        .update({
          trang_thai: "da_huy",
          ly_do_tu_choi: LY_DO_QUA_HAN,
          updated_at: new Date().toISOString(),
        })
        .in("thanh_toan_id", idsTreo)
        .eq("trang_thai", "cho_duyet")
        .select("id");
      daHuy += huy2?.length ?? 0;
    }

    return { daHuy };
  } catch (e) {
    console.error("[DON YEU CAU HET HAN LOI]", e);
    return { daHuy: 0 };
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { xacMinhChuKyVNPay } from "@/lib/thanh-toan/vnpay";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import {
  huyYeuCauTheoGiaoDich,
  LY_DO_THANH_TOAN_THAT_BAI,
} from "@/lib/thanh-toan/yeu-cau";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const ketQua = xacMinhChuKyVNPay(params);

    if (!ketQua.hopLe) {
      return NextResponse.json({ RspCode: "97", Message: "Checksum failed" });
    }

    const supabase = taoSupabaseAdmin();

    const { data: gd } = await supabase
      .from("thanh_toan")
      .select("id, nguoi_dung_id, khoa_hoc_id, goi_id, loai_thanh_toan, so_tien, trang_thai")
      .eq("ma_giao_dich", ketQua.maGiaoDich)
      .maybeSingle();

    if (!gd) {
      return NextResponse.json({ RspCode: "01", Message: "Order not found" });
    }

    if (gd.so_tien !== ketQua.soTien) {
      return NextResponse.json({ RspCode: "04", Message: "Amount invalid" });
    }

    if (gd.trang_thai !== "cho_xu_ly") {
      return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (ketQua.thanhCong) {
      await supabase
        .from("thanh_toan")
        .update({
          trang_thai: "thanh_cong",
          ma_giao_dich_ngoai: params["vnp_TransactionNo"] || null,
          chi_tiet: params,
        })
        .eq("id", gd.id);

      if (gd.loai_thanh_toan === "goi_premium") {
        await supabase.from("thong_bao").insert({
          nguoi_dung_id: gd.nguoi_dung_id,
          tieu_de: "Thanh toán gói Pro thành công",
          noi_dung: `Giao dịch ${ketQua.maGiaoDich} đã được xác nhận thanh toán. Yêu cầu của bạn đang chờ phê duyệt.`,
          loai: "thanh_toan",
          lien_ket: "/goi-cua-toi",
        });
      } else if (gd.khoa_hoc_id) {
        const { data: daCo } = await supabase
          .from("dang_ky_khoa_hoc")
          .select("id")
          .eq("nguoi_dung_id", gd.nguoi_dung_id)
          .eq("khoa_hoc_id", gd.khoa_hoc_id)
          .maybeSingle();

        if (daCo) {
          await supabase
            .from("dang_ky_khoa_hoc")
            .update({
              da_thanh_toan: true,
              ma_giao_dich: ketQua.maGiaoDich,
            })
            .eq("id", daCo.id);
        } else {
          await supabase.from("dang_ky_khoa_hoc").insert({
            nguoi_dung_id: gd.nguoi_dung_id,
            khoa_hoc_id: gd.khoa_hoc_id,
            da_thanh_toan: true,
            ma_giao_dich: ketQua.maGiaoDich,
            phan_tram_tien_do: 0,
          });
        }

        await supabase.from("thong_bao").insert({
          nguoi_dung_id: gd.nguoi_dung_id,
          tieu_de: "Thanh toán khóa học thành công",
          noi_dung: `Giao dịch ${ketQua.maGiaoDich} đã được xác nhận. Chúc bạn học tốt!`,
          loai: "thanh_toan",
          lien_ket: "/khoa-hoc-cua-toi",
        });
      }
    } else {
      await supabase
        .from("thanh_toan")
        .update({
          trang_thai: "that_bai",
          ma_giao_dich_ngoai: params["vnp_TransactionNo"] || null,
          chi_tiet: params,
        })
        .eq("id", gd.id);

      // Giao dich goi Pro that bai/huy -> yeu cau nang cap di kem tu huy,
      // khong de treo "ma" trong hang cho duyet cua admin (L-01).
      if (gd.loai_thanh_toan === "goi_premium") {
        await huyYeuCauTheoGiaoDich(
          supabase,
          gd.id,
          `${LY_DO_THANH_TOAN_THAT_BAI} (mã phản hồi ${ketQua.maPhanHoi})`
        );
      }
    }

    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (e) {
    console.error("[IPN LOI]", e);
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}

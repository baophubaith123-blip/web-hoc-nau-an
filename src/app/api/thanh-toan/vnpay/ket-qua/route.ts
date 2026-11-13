import { NextResponse, type NextRequest } from "next/server";
import { xacMinhChuKyVNPay } from "@/lib/thanh-toan/vnpay";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import {
  huyYeuCauTheoGiaoDich,
  LY_DO_THANH_TOAN_THAT_BAI,
} from "@/lib/thanh-toan/yeu-cau";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const ketQua = xacMinhChuKyVNPay(params);

  if (!ketQua.hopLe) {
    return NextResponse.redirect(`${origin}/goi-cua-toi?thanh_toan=sai_chu_ky`);
  }

  const supabase = taoSupabaseAdmin();

  // Tìm giao dịch
  const { data: gd } = await supabase
    .from("thanh_toan")
    .select("id, nguoi_dung_id, khoa_hoc_id, goi_id, loai_thanh_toan, trang_thai")
    .eq("ma_giao_dich", ketQua.maGiaoDich)
    .maybeSingle();

  if (!gd) {
    return NextResponse.redirect(`${origin}/goi-cua-toi?thanh_toan=khong_tim_thay`);
  }

  if (ketQua.thanhCong) {
    // Cập nhật thanh toán thành công
    await supabase
      .from("thanh_toan")
      .update({
        trang_thai: "thanh_cong",
        ma_giao_dich_ngoai: params["vnp_TransactionNo"] || null,
        chi_tiet: params,
      })
      .eq("id", gd.id);

    // Xử lý theo loại thanh toán.
    // LUU Y (A3): thong bao thanh cong chi tao DUY NHAT o IPN — route ket qua
    // nay khong tao thong bao nua de tranh trung 2 thong bao/giao dich (L-03).
    if (gd.loai_thanh_toan === "goi_premium") {
      return NextResponse.redirect(
        `${origin}/goi-cua-toi?thanh_toan=thanh_cong&ma=${ketQua.maGiaoDich}`
      );
    }

    // Xử lý khóa học (nếu có khoa_hoc_id)
    if (gd.khoa_hoc_id) {
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

      // Thong bao khoa hoc cung chi tao o IPN (A3) — khong tao o day.
    }

    return NextResponse.redirect(
      `${origin}/khoa-hoc-cua-toi?thanh_toan=thanh_cong&ma=${ketQua.maGiaoDich}`
    );
  } else {
    // Cập nhật thất bại
    await supabase
      .from("thanh_toan")
      .update({
        trang_thai: "that_bai",
        ma_giao_dich_ngoai: params["vnp_TransactionNo"] || null,
        chi_tiet: params,
      })
      .eq("id", gd.id);

    // Huy luon yeu cau nang cap di kem (phong khi IPN chua kip xu ly) — L-01.
    if (gd.loai_thanh_toan === "goi_premium") {
      await huyYeuCauTheoGiaoDich(
        supabase,
        gd.id,
        `${LY_DO_THANH_TOAN_THAT_BAI} (mã phản hồi ${ketQua.maPhanHoi})`
      );
    }

    const redirectPath = gd.loai_thanh_toan === "goi_premium" ? "/goi-cua-toi" : "/khoa-hoc-cua-toi";
    return NextResponse.redirect(
      `${origin}${redirectPath}?thanh_toan=that_bai&ma_loi=${ketQua.maPhanHoi}`
    );
  }
}

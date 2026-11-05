import { NextResponse, type NextRequest } from "next/server";
import {
  laCheDoDemoVNPay,
  taoThamSoKetQuaVNPay,
  xacMinhChuKyVNPay,
} from "@/lib/thanh-toan/vnpay";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

// Xu ly ket qua tai CONG THANH TOAN DEMO (chi hoat dong khi VNPAY_DEMO=true).
// Mo phong dung cach VNPay that van hanh: ky bo tham so ket qua, goi IPN
// server-to-server toi endpoint that cua he thong, roi tra URL ket qua da ky
// de trinh duyet chuyen nguoi dung ve — toan bo logic nghiep vu sau do
// (xac minh chu ky, cap nhat giao dich, thong bao) van la code that.
export async function POST(request: NextRequest) {
  if (!laCheDoDemoVNPay()) {
    return NextResponse.json({ loi: "Cổng demo đang tắt" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      thamSo?: Record<string, string>;
      ketQua?: string;
    };
    const thamSo = body.thamSo;
    const thanhCong = body.ketQua === "thanh_cong";

    if (!thamSo || typeof thamSo !== "object" || !thamSo["vnp_TxnRef"]) {
      return NextResponse.json({ loi: "Thiếu tham số giao dịch" }, { status: 400 });
    }

    // Tham so di vao phai mang chu ky hop le do chinh he thong phat hanh
    const xacMinh = xacMinhChuKyVNPay(thamSo);
    if (!xacMinh.hopLe) {
      return NextResponse.json({ loi: "Chữ ký giao dịch không hợp lệ" }, { status: 400 });
    }

    const supabase = taoSupabaseAdmin();
    const { data: gd } = await supabase
      .from("thanh_toan")
      .select("id, so_tien, trang_thai")
      .eq("ma_giao_dich", thamSo["vnp_TxnRef"])
      .maybeSingle();

    if (!gd) {
      return NextResponse.json({ loi: "Không tìm thấy giao dịch" }, { status: 404 });
    }
    if (gd.trang_thai !== "cho_xu_ly") {
      return NextResponse.json(
        { loi: "Giao dịch này đã được xử lý trước đó" },
        { status: 409 }
      );
    }
    if (xacMinh.soTien !== gd.so_tien) {
      return NextResponse.json({ loi: "Số tiền không khớp với giao dịch" }, { status: 400 });
    }

    const chuoiKetQua = taoThamSoKetQuaVNPay({
      maGiaoDich: thamSo["vnp_TxnRef"],
      soTien: gd.so_tien,
      noiDung: thamSo["vnp_OrderInfo"] || "",
      thanhCong,
    });

    // Goi IPN that (server-to-server) giong het cong VNPay
    const { origin } = new URL(request.url);
    const ipnRes = await fetch(`${origin}/api/thanh-toan/vnpay/ipn?${chuoiKetQua}`);
    const ipnData = (await ipnRes.json().catch(() => null)) as { RspCode?: string } | null;
    if (ipnData?.RspCode === "97" || ipnData?.RspCode === "99") {
      return NextResponse.json(
        { loi: "Hệ thống xác nhận giao dịch thất bại. Vui lòng thử lại." },
        { status: 500 }
      );
    }

    const returnUrl =
      process.env.VNPAY_RETURN_URL || `${origin}/api/thanh-toan/vnpay/ket-qua`;
    return NextResponse.json({ url: `${returnUrl}?${chuoiKetQua}` });
  } catch (e) {
    console.error("[DEMO THANH TOAN LOI]", e);
    return NextResponse.json({ loi: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

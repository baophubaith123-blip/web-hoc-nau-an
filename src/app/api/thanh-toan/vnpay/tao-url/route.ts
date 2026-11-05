import { NextResponse, type NextRequest } from "next/server";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { taoUrlThanhToanVNPay } from "@/lib/thanh-toan/vnpay";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);

export async function POST(request: NextRequest) {
  try {
    const phien = await layPhienHienTai();
    if (!phien) {
      return NextResponse.json({ loi: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const { goiId, khoaHocId } = body;

    if (!goiId && !khoaHocId) {
      return NextResponse.json({ loi: "Thiếu thông tin gói hoặc khóa học cần thanh toán" }, { status: 400 });
    }

    const supabase = await taoSupabaseServer();
    // Ghi thanh_toan/yeu_cau bang service role: RLS cua thanh_toan chi cho phep
    // SERVER tao ban ghi (migration 002 muc 19) — client phien nguoi dung bi chan 42501.
    // nguoi_dung_id luon lay tu phien dang nhap da xac thuc, khong nhan tu body.
    const supabaseAdmin = taoSupabaseAdmin();
    const maGiaoDich = `VN${Date.now()}${nanoid()}`;
    const ipAddr = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. THANH TOÁN GÓI PREMIUM (PRO THÁNG / PRO NĂM)
    if (goiId) {
      const { data: goi, error: errGoi } = await supabase
        .from("goi_premium")
        .select("id, ten, ma_goi, gia, hoat_dong, thoi_han_ngay")
        .eq("id", goiId)
        .single();

      if (errGoi || !goi || !goi.hoat_dong) {
        return NextResponse.json({ loi: "Gói Premium không tồn tại hoặc đã tạm dừng" }, { status: 404 });
      }

      // Lưu bảng thanh_toan
      const { data: ttData, error: errThanhToan } = await supabaseAdmin
        .from("thanh_toan")
        .insert({
          ma_giao_dich: maGiaoDich,
          nguoi_dung_id: phien.user.id,
          goi_id: goi.id,
          khoa_hoc_id: null,
          loai_thanh_toan: "goi_premium",
          so_tien: goi.gia,
          phuong_thuc: "vnpay",
          trang_thai: "cho_xu_ly",
          chi_tiet: { ten_goi: goi.ten, ma_goi: goi.ma_goi, thoi_han_ngay: goi.thoi_han_ngay },
        })
        .select("id")
        .single();

      if (errThanhToan || !ttData) {
        console.error("[THANH TOAN LOI]", errThanhToan);
        return NextResponse.json({ loi: "Không thể tạo giao dịch" }, { status: 500 });
      }

      // Tạo bản ghi yeu_cau_nang_cap chờ duyệt
      const maYeuCau = `YC-${nanoid()}`;
      await supabaseAdmin.from("yeu_cau_nang_cap").insert({
        ma_yeu_cau: maYeuCau,
        nguoi_dung_id: phien.user.id,
        goi_id: goi.id,
        trang_thai: "cho_duyet",
        thanh_toan_id: ttData.id,
      });

      const paymentUrl = taoUrlThanhToanVNPay({
        maGiaoDich,
        soTien: goi.gia,
        noiDung: `Nang cap ${goi.ten}`,
        ipAddr,
      });

      return NextResponse.json({ url: paymentUrl, maGiaoDich, maYeuCau });
    }

    // 2. THANH TOÁN KHÓA HỌC (NẾU CÓ)
    const { data: kh, error: errKh } = await supabase
      .from("khoa_hoc")
      .select("id, tieu_de, trang_thai")
      .eq("id", khoaHocId)
      .single();

    if (errKh || !kh || kh.trang_thai !== "xuat_ban") {
      return NextResponse.json({ loi: "Khóa học không tồn tại hoặc chưa xuất bản" }, { status: 404 });
    }

    const giaKhoaHoc = 299000; // Giá mặc định nếu mua riêng

    const { error: errThanhToan } = await supabaseAdmin.from("thanh_toan").insert({
      ma_giao_dich: maGiaoDich,
      nguoi_dung_id: phien.user.id,
      khoa_hoc_id: kh.id,
      goi_id: null,
      loai_thanh_toan: "khoa_hoc",
      so_tien: giaKhoaHoc,
      phuong_thuc: "vnpay",
      trang_thai: "cho_xu_ly",
      chi_tiet: { tieu_de_khoa_hoc: kh.tieu_de },
    });

    if (errThanhToan) {
      console.error("[THANH TOAN LOI]", errThanhToan);
      return NextResponse.json({ loi: "Không thể tạo giao dịch" }, { status: 500 });
    }

    const paymentUrl = taoUrlThanhToanVNPay({
      maGiaoDich,
      soTien: giaKhoaHoc,
      noiDung: `Thanh toan khoa hoc ${kh.tieu_de}`,
      ipAddr,
    });

    return NextResponse.json({ url: paymentUrl, maGiaoDich });
  } catch (e) {
    console.error("[TAO URL VNPAY LOI]", e);
    return NextResponse.json({ loi: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

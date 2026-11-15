import { NextResponse, type NextRequest } from "next/server";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { taoUrlThanhToanVNPay } from "@/lib/thanh-toan/vnpay";
import { donYeuCauHetHan } from "@/lib/thanh-toan/yeu-cau";
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

      // Chống trùng yêu cầu Pro (quan sát đợt 1, gia cố đợt 2): dọn các yêu
      // cầu đã hết hiệu lực (giao dịch thất bại / treo quá 30 phút) trước.
      // Sau đó xét các yêu cầu còn chờ duyệt của chính người dùng:
      //  - Yêu cầu ĐÃ THANH TOÁN cho CHÍNH gói này, đang chờ duyệt ->
      //    CHẶN tạo thêm (409, trùng thật). Gói khác: giữ nguyên — khi
      //    admin duyệt một yêu cầu, action duyệt tự hủy các yêu cầu chờ
      //    còn lại của người dùng, nên không thể cộng hạn 2 lần.
      //  - Yêu cầu chưa trả tiền (giao dịch còn chờ xử lý/bỏ dở) hoặc yêu
      //    cầu "ma" không gắn giao dịch (dữ liệu cũ) -> TỰ HỦY để yêu cầu
      //    mới thay thế, tránh người dùng bị kẹt vĩnh viễn không mua được.
      await donYeuCauHetHan(supabaseAdmin);
      const { data: cacYcCho } = await supabaseAdmin
        .from("yeu_cau_nang_cap")
        .select("id, ma_yeu_cau, thanh_toan_id, goi_id")
        .eq("nguoi_dung_id", phien.user.id)
        .eq("trang_thai", "cho_duyet");
      let ycTrungGoi: { ma_yeu_cau: string } | null = null;
      for (const yc of cacYcCho ?? []) {
        let daTraTien = false;
        if (yc.thanh_toan_id) {
          const { data: tt } = await supabaseAdmin
            .from("thanh_toan")
            .select("trang_thai")
            .eq("id", yc.thanh_toan_id)
            .maybeSingle();
          daTraTien = tt?.trang_thai === "thanh_cong";
        }
        if (daTraTien) {
          // Đã trả tiền cho CHÍNH gói này và đang chờ duyệt -> trùng thật,
          // chặn rõ ràng. Gói khác thì giữ nguyên (admin xử lý từng yêu
          // cầu; khi duyệt một yêu cầu, các yêu cầu chờ khác của cùng
          // người dùng tự bị hủy ở action duyệt — không cộng hạn 2 lần).
          if (yc.goi_id === goi.id) ycTrungGoi = yc;
          continue;
        }
        await supabaseAdmin
          .from("yeu_cau_nang_cap")
          .update({
            trang_thai: "da_huy",
            ly_do_tu_choi:
              "Được thay thế bởi yêu cầu nâng cấp mới (yêu cầu cũ chưa hoàn tất thanh toán)",
            updated_at: new Date().toISOString(),
          })
          .eq("id", yc.id)
          .eq("trang_thai", "cho_duyet");
      }
      if (ycTrungGoi) {
        return NextResponse.json(
          {
            loi: `Bạn đã có yêu cầu nâng cấp (${ycTrungGoi.ma_yeu_cau}) cho gói này, đã thanh toán và đang chờ duyệt. Vui lòng chờ quản trị viên xử lý hoặc hủy yêu cầu đó ở trang \"Gói của tôi\" trước khi tạo yêu cầu mới.`,
          },
          { status: 409 }
        );
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
      .select("id, tieu_de, trang_thai, gia, mien_phi")
      .eq("id", khoaHocId)
      .single();

    if (errKh || !kh || kh.trang_thai !== "xuat_ban") {
      return NextResponse.json({ loi: "Khóa học không tồn tại hoặc chưa xuất bản" }, { status: 404 });
    }

    // Gia thanh toan lay DUNG tu DB (khoa_hoc.gia) — nguon duy nhat, khong
    // hard-code lech voi gia hien thi tren trang khoa hoc (truoc day co dinh
    // 299000 trong khi trang hien 499000).
    const giaKhoaHoc = kh.gia;
    if (!giaKhoaHoc || giaKhoaHoc <= 0) {
      return NextResponse.json(
        { loi: "Khóa học này là khóa miễn phí hoặc chưa có giá bán riêng, không cần thanh toán" },
        { status: 400 }
      );
    }

    const { error: errThanhToan } = await supabaseAdmin.from("thanh_toan").insert({
      ma_giao_dich: maGiaoDich,
      nguoi_dung_id: phien.user.id,
      khoa_hoc_id: kh.id,
      goi_id: null,
      loai_thanh_toan: "khoa_hoc",
      so_tien: giaKhoaHoc,
      phuong_thuc: "vnpay",
      trang_thai: "cho_xu_ly",
      chi_tiet: { tieu_de_khoa_hoc: kh.tieu_de, gia_khoa_hoc: giaKhoaHoc },
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

import { NextResponse, type NextRequest } from "next/server";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { taoPdfChungChi } from "@/lib/pdf/chung-chi";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ma: string }> }
) {
  try {
    const { ma } = await params;
    if (!ma) {
      return NextResponse.json({ loi: "Thiếu mã chứng chỉ" }, { status: 400 });
    }

    const supabase = taoSupabaseAdmin();

    // Lấy thông tin chứng chỉ
    const { data: cc, error: errCc } = await supabase
      .from("chung_chi")
      .select("id, ma_chung_chi, ngay_cap, nguoi_dung_id, khoa_hoc_id")
      .eq("ma_chung_chi", ma)
      .maybeSingle();

    if (errCc || !cc) {
      return NextResponse.json({ loi: "Không tìm thấy chứng chỉ hợp lệ" }, { status: 404 });
    }

    // Lấy thông tin học viên & khóa học
    const [profileRes, khoaHocRes] = await Promise.all([
      supabase.from("profiles").select("ho_ten, username").eq("id", cc.nguoi_dung_id).single(),
      supabase.from("khoa_hoc").select("tieu_de").eq("id", cc.khoa_hoc_id).single(),
    ]);

    const hoTen = profileRes.data?.ho_ten || profileRes.data?.username || "Học viên";
    const khoaHoc = khoaHocRes.data?.tieu_de || "Khóa học nấu ăn";

    // Sinh file PDF
    const pdfBytes = await taoPdfChungChi({
      hoTen,
      khoaHoc,
      maChungChi: cc.ma_chung_chi,
      ngayCap: cc.ngay_cap,
    });

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="chung-chi-${cc.ma_chung_chi}.pdf"`,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    console.error("[XUAT CHUNG CHI PDF LOI]", e);
    return NextResponse.json({ loi: "Không thể xuất chứng chỉ PDF" }, { status: 500 });
  }
}

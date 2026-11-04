import { NextResponse, type NextRequest } from "next/server";
import { lienHeSchema } from "@/lib/validations/ticket";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const duLieu = lienHeSchema.parse(body);

    const supabase = taoSupabaseAdmin();

    // Lưu nhật ký hoạt động / thông báo quản trị
    await supabase.from("nhat_ky_hoat_dong").insert({
      hanh_dong: "gui_lien_he",
      doi_tuong: "lien_he",
      doi_tuong_id: duLieu.email,
      chi_tiet: duLieu,
      ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      user_agent: request.headers.get("user-agent") || null,
    });

    // Thông báo cho các quản trị viên
    const { data: adminList } = await supabase
      .from("profiles")
      .select("id")
      .in("vai_tro", ["admin", "support"]);

    if (adminList && adminList.length > 0) {
      const thongBaoInserts = adminList.map((adm) => ({
        nguoi_dung_id: adm.id,
        tieu_de: `Tin nhắn liên hệ mới từ ${duLieu.ho_ten}`,
        noi_dung: `[${duLieu.chu_de}]: ${duLieu.noi_dung.slice(0, 100)}...`,
        loai: "lien_he",
        lien_ket: "/quan-tri/quan-ly-ticket",
      }));
      await supabase.from("thong_bao").insert(thongBaoInserts);
    }

    return NextResponse.json({
      thanh_cong: true,
      thong_diep: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
    });
  } catch (e: unknown) {
    console.error("[API LIEN HE LOI]", e);
    return NextResponse.json(
      { thanh_cong: false, loi: "Dữ liệu không hợp lệ hoặc đã có lỗi xảy ra" },
      { status: 400 }
    );
  }
}

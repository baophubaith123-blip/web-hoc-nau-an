import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { TheThongKe } from "@/components/quan-tri/the-thong-ke";
import { BarChart3, BookOpen, Eye } from "lucide-react";
import { dinhDangTien } from "@/lib/utils/dinh-dang";

export default async function BaoCaoThongKePage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const [
    { count: tongDangKy },
    { count: tongChungChi },
    { data: topCongThuc },
    { data: topKhoaHoc },
    { data: tatCaGiaoDich },
  ] = await Promise.all([
    supabase.from("dang_ky_khoa_hoc").select("*", { count: "exact", head: true }),
    supabase.from("chung_chi").select("*", { count: "exact", head: true }),
    supabase.from("cong_thuc").select("tieu_de, luot_xem, slug").is("deleted_at", null).order("luot_xem", { ascending: false }).limit(5),
    supabase.from("khoa_hoc").select("tieu_de, gia, mien_phi, slug").order("created_at", { ascending: false }).limit(5),
    supabase.from("thanh_toan").select("so_tien").eq("trang_thai", "thanh_cong"),
  ]);

  const tongDoanhThu = (tatCaGiaoDich || []).reduce((sum, item) => sum + item.so_tien, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Báo Cáo & Thống Kê</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chỉ số tăng trưởng người học, doanh số khóa học và độ phổ biến nội dung
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TheThongKe
          tieuDe="Tổng doanh số"
          giaTri={dinhDangTien(tongDoanhThu)}
          moTa="Doanh thu tích lũy từ bán khóa học"
          icon="TrendingUp"
        />
        <TheThongKe
          tieuDe="Lượt đăng ký học"
          giaTri={tongDangKy || 0}
          moTa="Tổng số học viên đã ghi danh"
          icon="Users"
        />
        <TheThongKe
          tieuDe="Chứng chỉ đã cấp"
          giaTri={tongChungChi || 0}
          moTa="Học viên hoàn thành 100% khóa học"
          icon="Award"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top công thức */}
        <div className="p-6 border rounded-2xl bg-card shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Top công thức xem nhiều nhất</h2>
          </div>

          <div className="divide-y">
            {(topCongThuc || []).map((ct, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-muted-foreground w-4 text-center">
                    #{idx + 1}
                  </span>
                  <p className="font-semibold text-sm line-clamp-1">{ct.tieu_de}</p>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                  <Eye className="w-3.5 h-3.5" /> {ct.luot_xem} lượt
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top khóa học */}
        <div className="p-6 border rounded-2xl bg-card shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold">Chương trình đào tạo mới nhất</h2>
          </div>

          <div className="divide-y">
            {(topKhoaHoc || []).map((kh, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-muted-foreground w-4 text-center">
                    #{idx + 1}
                  </span>
                  <p className="font-semibold text-sm line-clamp-1">{kh.tieu_de}</p>
                </div>
                <span className="text-xs font-semibold shrink-0">
                  {kh.mien_phi ? "Miễn phí" : dinhDangTien(kh.gia)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

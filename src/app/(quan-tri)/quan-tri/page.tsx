import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { TheThongKe } from "@/components/quan-tri/the-thong-ke";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { dinhDangTien } from "@/lib/utils/dinh-dang";

export default async function QuanTriDashboardPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const [
    { count: tongNguoiDung },
    { count: tongDauBep },
    { count: tongCongThuc },
    { count: congThucChoDuyet },
    { count: tongKhoaHoc },
    { data: dangKyThanhToan },
    { data: danhSachChoDuyet },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("vai_tro", "chef"),
    supabase.from("cong_thuc").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("cong_thuc").select("*", { count: "exact", head: true }).eq("trang_thai", "cho_duyet").is("deleted_at", null),
    supabase.from("khoa_hoc").select("*", { count: "exact", head: true }),
    supabase.from("dang_ky_khoa_hoc").select("khoa_hoc:khoa_hoc(gia)").eq("da_thanh_toan", true),
    supabase
      .from("cong_thuc")
      .select("*, tac_gia:profiles!cong_thuc_tac_gia_id_fkey(ho_ten, username)")
      .eq("trang_thai", "cho_duyet")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const tongDoanhThu = (dangKyThanhToan || []).reduce((tong, item) => {
    return tong + (item.khoa_hoc?.gia || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Hệ Thống Quản Trị Trung Tâm</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Giám sát hoạt động toàn diện, phê duyệt nội dung và quản lý doanh thu nền tảng
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TheThongKe
          tieuDe="Tổng người dùng"
          giaTri={tongNguoiDung || 0}
          moTa={`${tongDauBep || 0} đầu bếp đối tác`}
          icon={<Users className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Công thức món ăn"
          giaTri={tongCongThuc || 0}
          moTa={`${congThucChoDuyet || 0} đang chờ phê duyệt`}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Khóa học trực tuyến"
          giaTri={tongKhoaHoc || 0}
          moTa="Chương trình đào tạo nấu ăn"
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Tổng doanh thu"
          giaTri={dinhDangTien(tongDoanhThu)}
          moTa="Từ đăng ký khóa học trả phí"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Công thức chờ duyệt */}
        <div className="border rounded-2xl bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Công thức chờ phê duyệt</h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/quan-tri/cong-thuc">
                Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {!danhSachChoDuyet || danhSachChoDuyet.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-8 text-center">
              Không có công thức nào đang chờ phê duyệt.
            </p>
          ) : (
            <div className="divide-y">
              {danhSachChoDuyet.map((ct) => (
                <div key={ct.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm line-clamp-1">{ct.tieu_de}</p>
                    <p className="text-xs text-muted-foreground">
                      Tác giả: {ct.tac_gia?.ho_ten || "Ẩn danh"} • {dinhDangTuongDoi(ct.created_at)}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/quan-tri/cong-thuc`}>Kiểm duyệt</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lối tắt quản trị nhanh */}
        <div className="border rounded-2xl bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold tracking-tight border-b pb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-1 justify-start text-left" asChild>
              <Link href="/quan-tri/nguoi-dung">
                <Users className="w-5 h-5 text-primary mb-1" />
                <span className="font-semibold text-sm">Quản lý người dùng</span>
                <span className="text-xs text-muted-foreground font-normal">Phân quyền, khóa tài khoản</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-1 justify-start text-left" asChild>
              <Link href="/quan-tri/danh-muc">
                <BookOpen className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="font-semibold text-sm">Quản lý danh mục</span>
                <span className="text-xs text-muted-foreground font-normal">Thêm danh mục món ăn</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-1 justify-start text-left" asChild>
              <Link href="/quan-tri/thong-bao">
                <AlertCircle className="w-5 h-5 text-purple-500 mb-1" />
                <span className="font-semibold text-sm">Gửi thông báo</span>
                <span className="text-xs text-muted-foreground font-normal">Broadcast toàn hệ thống</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-1 justify-start text-left" asChild>
              <Link href="/quan-tri/cau-hinh">
                <Clock className="w-5 h-5 text-blue-500 mb-1" />
                <span className="font-semibold text-sm">Cấu hình hệ thống</span>
                <span className="text-xs text-muted-foreground font-normal">Tham số & bảo trì web</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

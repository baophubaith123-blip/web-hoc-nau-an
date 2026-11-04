import Link from "next/link";
import { Utensils, BookOpen, Users, Eye, Plus, ArrowRight } from "lucide-react";
import { TheThongKe } from "@/components/quan-tri/the-thong-ke";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function ChefDashboard() {
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // Thống kê đầu bếp
  const [congThucRes, khoaHocRes, hocVienRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("id, luot_xem, trang_thai", { count: "exact" })
      .eq("tac_gia_id", userId)
      .is("deleted_at", null),
    supabase
      .from("khoa_hoc")
      .select("id, tieu_de, gia, so_bai_hoc, trang_thai", { count: "exact" })
      .eq("dau_bep_id", userId),
    supabase
      .from("dang_ky_khoa_hoc")
      .select("id, khoa_hoc!inner(dau_bep_id)", { count: "exact" })
      .eq("khoa_hoc.dau_bep_id", userId),
  ]);

  const soCongThuc = congThucRes.count || 0;
  const tongLuotXem = (congThucRes.data || []).reduce((a, b) => a + (b.luot_xem || 0), 0);
  const soKhoaHoc = khoaHocRes.count || 0;
  const soHocVien = hocVienRes.count || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bếp trưởng {phien.profile.ho_ten || "Đầu bếp"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tổng quan hiệu quả giảng dạy và chia sẻ công thức ẩm thực của bạn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/quan-ly-cong-thuc/moi">
              <Plus className="h-4 w-4" />
              Thêm công thức
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-sm">
            <Link href="/quan-ly-khoa-hoc/moi">
              <Plus className="h-4 w-4" />
              Tạo khóa học mới
            </Link>
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TheThongKe
          tieuDe="Tổng số công thức"
          giaTri={soCongThuc}
          moTa="Đã tạo trên hệ thống"
          icon={<Utensils className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Tổng khóa học"
          giaTri={soKhoaHoc}
          moTa="Lớp học trực tuyến"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Học viên đăng ký"
          giaTri={soHocVien}
          moTa="Học viên đang theo học"
          icon={<Users className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Lượt xem công thức"
          giaTri={new Intl.NumberFormat("vi-VN").format(tongLuotXem)}
          moTa="Lượt quan tâm từ bạn đọc"
          icon={<Eye className="h-4 w-4" />}
        />
      </div>

      {/* KHÓA HỌC CỦA TÔI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Khóa học của bạn</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/quan-ly-khoa-hoc">
              Quản lý khóa học
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {(!khoaHocRes.data || khoaHocRes.data.length === 0) ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            Bạn chưa tạo khóa học nào. Hãy bấm &ldquo;Tạo khóa học mới&rdquo; để bắt đầu chia sẻ kiến thức!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {khoaHocRes.data.map((kh) => (
              <Card key={kh.id} className="p-4 shadow-xs space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-base line-clamp-1">{kh.tieu_de}</h3>
                  <p className="text-xs text-muted-foreground">{kh.so_bai_hoc || 0} bài học</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs font-semibold text-primary">
                    {kh.gia > 0
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(kh.gia)
                      : "Miễn phí"}
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/quan-ly-khoa-hoc/${kh.id}/bai-hoc`}>Quản lý bài học</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

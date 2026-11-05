import type { Bang } from "@/types";
import Link from "next/link";
import { BookOpen, Bookmark, ChefHat, Award, ArrowRight, Crown } from "lucide-react";
import { HienDan } from "@/components/trang-chu/hien-dan";
import { TheThongKe } from "@/components/quan-tri/the-thong-ke";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function BangDieuKhienNguoiDung() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // Truy vấn song song dữ liệu dashboard
  const [khoaHocRes, congThucLuuRes, congThucGuiRes, chungChiRes] = await Promise.all([
    supabase
      .from("dang_ky_khoa_hoc")
      .select("*, khoa_hoc(*, dau_bep:profiles(ho_ten, avatar_url))")
      .eq("nguoi_dung_id", userId)
      .order("ngay_dang_ky", { ascending: false })
      .limit(4),
    supabase
      .from("cong_thuc_da_luu")
      .select("*, cong_thuc(*, tac_gia:profiles(ho_ten, avatar_url))")
      .eq("nguoi_dung_id", userId)
      .order("ngay_luu", { ascending: false })
      .limit(4),
    supabase
      .from("cong_thuc")
      .select("id, trang_thai", { count: "exact" })
      .eq("tac_gia_id", userId)
      .is("deleted_at", null),
    supabase
      .from("chung_chi")
      .select("id", { count: "exact" })
      .eq("nguoi_dung_id", userId),
  ]);

  const dangKyList = khoaHocRes.data || [];
  const daLuuList = (congThucLuuRes.data || []).map((x) => x.cong_thuc).filter(Boolean);
  const soCongThucGui = congThucGuiRes.count || 0;
  const soChungChi = chungChiRes.count || 0;
  const laProHopLe =
    phien.profile.la_pro &&
    phien.profile.goi_het_han &&
    new Date(phien.profile.goi_het_han) > new Date();

  return (
    <div className="space-y-8">
      {/* Dải chào mừng + hạng thành viên */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-amber-500/10 to-background p-6 md:p-8">
        <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Xin chào, {phien.profile.ho_ten || "bạn"}! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Theo dõi tiến độ học tập và quản lý các món ăn yêu thích của bạn
            </p>
            {laProHopLe ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                Thành viên Pro — hạn đến{" "}
                {new Date(phien.profile.goi_het_han as string).toLocaleDateString("vi-VN")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Bạn đang là thành viên thường
              </span>
            )}
          </div>
          {!laProHopLe && (
            <Button asChild className="gap-2 shadow-md">
              <Link href="/bang-gia">
                <Crown className="h-4 w-4" />
                Nâng cấp Pro
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* STATS CARDS */}
      <HienDan>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TheThongKe
          tieuDe="Khóa học đã đăng ký"
          giaTri={dangKyList.length}
          moTa="Đang theo học"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Công thức đã lưu"
          giaTri={daLuuList.length}
          moTa="Bộ sưu tập cá nhân"
          icon={<Bookmark className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Công thức đã gửi"
          giaTri={soCongThucGui}
          moTa="Chia sẻ cộng đồng"
          icon={<ChefHat className="h-4 w-4" />}
        />
        <TheThongKe
          tieuDe="Chứng chỉ đạt được"
          giaTri={soChungChi}
          moTa="Đã tốt nghiệp"
          icon={<Award className="h-4 w-4" />}
        />
      </div>
      </HienDan>

      {/* KHÓA HỌC ĐANG HỌC */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Khóa học đang học</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/khoa-hoc-cua-toi">
              Xem tất cả
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {dangKyList.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Bạn chưa đăng ký khóa học nào.{" "}
            <Link href="/khoa-hoc" className="font-semibold text-primary hover:underline">
              Khám phá khóa học ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dangKyList.map((dk) => {
              const kh = dk.khoa_hoc;
              if (!kh) return null;
              return (
                <div key={dk.id} className="rounded-xl border bg-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base line-clamp-1">{kh.tieu_de}</h3>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {dk.phan_tram_tien_do}%
                    </span>
                  </div>
                  <Progress value={dk.phan_tram_tien_do} className="h-2" />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Chef {kh.dau_bep?.ho_ten || "Master Chef"}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/hoc-bai/${kh.id}`}>Tiếp tục học</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CÔNG THỨC ĐÃ LƯU GẦN ĐÂY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Công thức đã lưu gần đây</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/cong-thuc-cua-toi">
              Xem tất cả
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {daLuuList.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Chưa có công thức nào được lưu.{" "}
            <Link href="/cong-thuc" className="font-semibold text-primary hover:underline">
              Tìm món ngon để lưu ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {daLuuList.map((ct) => (
              <TheCongThuc key={ct!.id} congThuc={ct as Bang<"cong_thuc">} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

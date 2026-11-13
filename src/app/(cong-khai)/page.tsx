import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChefHat, ArrowRight, Utensils, BookOpen, Sparkles, MonitorPlay, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { HeroTrangChu } from "@/components/trang-chu/hero-trang-chu";
import { HienDan } from "@/components/trang-chu/hien-dan";
import { DemSo } from "@/components/trang-chu/dem-so";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { vi } from "@/lib/i18n/vi";

export const metadata: Metadata = {
  title: "Học nấu ăn online — công thức & khóa học từ đầu bếp",
  description:
    "Học nấu ăn online với công thức chi tiết từng bước, khóa học có lộ trình, video hướng dẫn và chứng chỉ hoàn thành tại Học Nấu Ăn.",
};

export default async function TrangChu() {
  const supabase = await taoSupabaseServer();

  // Truy vấn song song dữ liệu trang chủ
  const [congThucRes, khoaHocRes, dauBepRes, baiVietRes, demCongThucRes, demKhoaHocRes, thongKeKhoaHocRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("*, tac_gia:profiles(ho_ten, avatar_url)")
      .eq("trang_thai", "xuat_ban")
      .is("deleted_at", null)
      .order("noi_bat", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("khoa_hoc")
      .select("*, dau_bep:profiles(ho_ten, avatar_url)")
      .eq("trang_thai", "xuat_ban")
      .order("created_at", { ascending: false })
      .limit(3),
    // Đầu bếp là thông tin công khai nhưng RLS profiles chỉ cho đọc hồ sơ của
    // chính mình → client phiên trả 0 dòng và mục "Đầu bếp hàng đầu" không bao
    // giờ hiện. Đọc bằng admin client, chỉ lấy trường công khai (mẫu /dau-bep).
    taoSupabaseAdmin()
      .from("profiles")
      .select("id, ho_ten, avatar_url, bio")
      .eq("vai_tro", "chef")
      .eq("trang_thai", "hoat_dong")
      .limit(4),
    supabase
      .from("bai_viet")
      .select("id, tieu_de, slug, tom_tat, anh_dai_dien, created_at")
      .eq("trang_thai", "xuat_ban")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("cong_thuc")
      .select("id", { count: "exact", head: true })
      .eq("trang_thai", "xuat_ban")
      .is("deleted_at", null),
    supabase
      .from("khoa_hoc")
      .select("id", { count: "exact", head: true })
      .eq("trang_thai", "xuat_ban"),
    supabase
      .from("khoa_hoc")
      .select("so_bai_hoc, tong_thoi_gian")
      .eq("trang_thai", "xuat_ban"),
  ]);

  const congThucNoiBat = congThucRes.data || [];
  const khoaHocMoi = khoaHocRes.data || [];
  const dauBepList = dauBepRes.data || [];
  const baiVietList = baiVietRes.data || [];

  // Số liệu thật cho dải thống kê và hero (chỉ tính nội dung đang xuất bản)
  const tongCongThuc = demCongThucRes.count ?? congThucNoiBat.length;
  const tongKhoaHoc = demKhoaHocRes.count ?? khoaHocMoi.length;
  const thongKeKhoaHoc = thongKeKhoaHocRes.data || [];
  const tongBaiHoc = thongKeKhoaHoc.reduce((tong, kh) => tong + (kh.so_bai_hoc || 0), 0);
  const tongPhutVideo = thongKeKhoaHoc.reduce((tong, kh) => tong + (kh.tong_thoi_gian || 0), 0);
  const slidesHero = congThucNoiBat
    .filter((ct) => ct.anh_dai_dien)
    .slice(0, 4)
    .map((ct) => ({ anh: ct.anh_dai_dien as string, tieu_de: ct.tieu_de, slug: ct.slug }));
  const mucMarquee = [
    ...congThucNoiBat.map((ct) => ct.tieu_de),
    ...khoaHocMoi.map((kh) => kh.tieu_de),
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO TRÌNH CHIẾU ẢNH MÓN ĂN */}
      <HeroTrangChu slides={slidesHero}>
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Nền tảng học nấu ăn trực tuyến số 1</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            {vi.trang_chu.hero_tieu_de}
          </h1>

          <p className="text-base text-white/85 sm:text-lg">
            {vi.trang_chu.hero_mo_ta}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2 shadow-lg">
              <Link href="/cong-thuc">
                <Utensils className="h-4 w-4" />
                {vi.trang_chu.kham_pha_cong_thuc}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            >
              <Link href="/khoa-hoc">
                <BookOpen className="h-4 w-4" />
                {vi.trang_chu.xem_khoa_hoc}
              </Link>
            </Button>
          </div>
        </div>
      </HeroTrangChu>

      {/* DẢI CHỮ CHẠY: TÊN MÓN ĂN & KHÓA HỌC */}
      {mucMarquee.length > 0 && (
        <div className="marquee-pause overflow-hidden rounded-full border bg-card py-3 shadow-xs">
          <div className="animate-marquee flex w-max items-center gap-8 pr-8">
            {[...mucMarquee, ...mucMarquee].map((muc, i) => (
              <span
                key={i}
                aria-hidden={i >= mucMarquee.length}
                className="flex shrink-0 items-center gap-8 whitespace-nowrap text-sm font-medium text-muted-foreground"
              >
                {muc}
                <ChefHat className="h-4 w-4 text-primary/60" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* DẢI THỐNG KÊ THẬT CỦA NỀN TẢNG */}
      <HienDan>
        <section className="grid grid-cols-2 gap-6 rounded-3xl border bg-card p-6 shadow-xs md:grid-cols-4 md:p-8">
          {[
            { icon: Utensils, mau: "bg-primary/10 text-primary", so: tongCongThuc, nhan: "Công thức chi tiết" },
            { icon: BookOpen, mau: "bg-sky-500/10 text-sky-600 dark:text-sky-400", so: tongKhoaHoc, nhan: "Khóa học video" },
            { icon: MonitorPlay, mau: "bg-violet-500/10 text-violet-600 dark:text-violet-400", so: tongBaiHoc, nhan: "Bài học thực hành" },
            { icon: Clock, mau: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", so: tongPhutVideo, nhan: "Phút video bài giảng" },
          ].map((muc) => (
            <div key={muc.nhan} className="flex flex-col items-center gap-2 text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${muc.mau}`}>
                <muc.icon className="h-6 w-6" />
              </span>
              <DemSo giaTri={muc.so} className="text-3xl font-extrabold tracking-tight" />
              <p className="text-sm text-muted-foreground">{muc.nhan}</p>
            </div>
          ))}
        </section>
      </HienDan>

      {/* 2. CÔNG THỨC NỔI BẬT */}
      <HienDan>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {vi.trang_chu.cong_thuc_noi_bat}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Những món ngon được cộng đồng yêu thích và nấu nhiều nhất
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/cong-thuc">
              {vi.chung.xem_tat_ca}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {congThucNoiBat.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            Đang cập nhật công thức mới. Vui lòng quay lại sau!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {congThucNoiBat.map((ct) => (
              <TheCongThuc key={ct.id} congThuc={ct} />
            ))}
          </div>
        )}
      </section>
      </HienDan>

      {/* 3. KHÓA HỌC PHỔ BIẾN */}
      <HienDan>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {vi.trang_chu.khoa_hoc_pho_bien}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Học từng bước qua video cùng đầu bếp chuyên nghiệp, nhận chứng chỉ sau khi hoàn thành
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/khoa-hoc">
              {vi.chung.xem_tat_ca}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {khoaHocMoi.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
            Đang chuẩn bị các khóa học mới.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {khoaHocMoi.map((kh) => (
              <TheKhoaHoc key={kh.id} khoaHoc={kh} />
            ))}
          </div>
        )}
      </section>
      </HienDan>

      {/* 4. ĐẦU BẾP ĐỒNG HÀNH */}
      {dauBepList.length > 0 && (
        <HienDan>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {vi.trang_chu.dau_bep_hang_dau}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Các chuyên gia ẩm thực giàu kinh nghiệm hướng dẫn bạn
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/dau-bep">
                {vi.chung.xem_tat_ca}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dauBepList.map((db) => (
              <div
                key={db.id}
                className="group flex flex-col items-center rounded-2xl border bg-card p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
                  {db.avatar_url ? (
                    <Image
                      src={db.avatar_url}
                      alt={db.ho_ten || "Đầu bếp"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ChefHat className="h-full w-full p-5 text-muted-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {db.ho_ten || "Đầu bếp"}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {db.bio || "Bếp trưởng tâm huyết chia sẻ bí quyết ẩm thực gia đình và chuyên nghiệp."}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link href={`/dau-bep/${db.id}`}>Xem hồ sơ</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
        </HienDan>
      )}

      {/* 5. BÀI VIẾT MỚI */}
      {baiVietList.length > 0 && (
        <HienDan>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {vi.trang_chu.bai_viet_moi}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Mẹo vặt bếp núc, kiến thức dinh dưỡng và phong cách ẩm thực
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/bai-viet">
                {vi.chung.xem_tat_ca}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {baiVietList.map((bv) => (
              <Link
                key={bv.id}
                href={`/bai-viet/${bv.slug}`}
                className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-md block"
              >
                <div className="relative aspect-16/9 w-full bg-muted">
                  {bv.anh_dai_dien ? (
                    <Image
                      src={bv.anh_dai_dien}
                      alt={bv.tieu_de}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary transition-colors">
                    {bv.tieu_de}
                  </h3>
                  {bv.tom_tat && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {bv.tom_tat}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
        </HienDan>
      )}

      {/* 6. CALL TO ACTION */}
      <HienDan>
      <section className="animate-gradient rounded-3xl bg-gradient-to-br from-primary via-orange-600 to-amber-500 text-primary-foreground p-8 md:p-12 text-center space-y-6 shadow-lg">
        <h2 className="text-2xl md:text-4xl font-extrabold max-w-xl mx-auto">
          Sẵn sàng bắt đầu hành trình nấu ăn tuyệt vời của bạn?
        </h2>
        <p className="text-sm md:text-base text-primary-foreground/80 max-w-lg mx-auto">
          Đăng ký tài khoản miễn phí để lưu lại những công thức yêu thích, tương tác cùng đầu bếp và tham gia lớp học ngay hôm nay.
        </p>
        <div className="pt-2">
          <Button asChild size="lg" variant="secondary" className="font-bold shadow-md">
            <Link href="/dang-ky">Đăng ký thành viên miễn phí</Link>
          </Button>
        </div>
      </section>
      </HienDan>
    </div>
  );
}

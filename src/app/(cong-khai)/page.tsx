import Link from "next/link";
import Image from "next/image";
import { ChefHat, ArrowRight, Utensils, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { vi } from "@/lib/i18n/vi";

export default async function TrangChu() {
  const supabase = await taoSupabaseServer();

  // Truy vấn song song dữ liệu trang chủ
  const [congThucRes, khoaHocRes, dauBepRes, baiVietRes] = await Promise.all([
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
    supabase
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
  ]);

  const congThucNoiBat = congThucRes.data || [];
  const khoaHocMoi = khoaHocRes.data || [];
  const dauBepList = dauBepRes.data || [];
  const baiVietList = baiVietRes.data || [];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-primary/10 to-background border p-8 md:p-14">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nền tảng học nấu ăn trực tuyến số 1</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
            {vi.trang_chu.hero_tieu_de}
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg">
            {vi.trang_chu.hero_mo_ta}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link href="/cong-thuc">
                <Utensils className="h-4 w-4" />
                {vi.trang_chu.kham_pha_cong_thuc}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/khoa-hoc">
                <BookOpen className="h-4 w-4" />
                {vi.trang_chu.xem_khoa_hoc}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. CÔNG THỨC NỔI BẬT */}
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

      {/* 3. KHÓA HỌC PHỔ BIẾN */}
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

      {/* 4. ĐẦU BẾP ĐỒNG HÀNH */}
      {dauBepList.length > 0 && (
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
      )}

      {/* 5. BÀI VIẾT MỚI */}
      {baiVietList.length > 0 && (
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
      )}

      {/* 6. CALL TO ACTION */}
      <section className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center space-y-6">
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
    </div>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Award, BookOpen, Clock, FileText, CheckCircle2, ChefHat, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrinhPhatYouTube } from "@/components/khoa-hoc/trinh-phat-youtube";
import { DanhSachBaiHoc } from "@/components/khoa-hoc/danh-sach-bai-hoc";
import { NutMuaKhoaHoc } from "@/components/thanh-toan/nut-mua-khoa-hoc";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ChiTietKhoaHoc({ params }: Props) {
  const { slug } = await params;
  const phien = await layPhienHienTai();
  const userId = phien?.user?.id ?? null;

  const supabase = await taoSupabaseServer();

  // 1. Chi tiết khóa học
  const { data: kh, error } = await supabase
    .from("khoa_hoc")
    .select("*, dau_bep:profiles(id, ho_ten, avatar_url, bio)")
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .maybeSingle();

  if (error || !kh) {
    notFound();
  }

  // 2. Danh sách bài học
  const { data: baiHocList } = await supabase
    .from("bai_hoc")
    .select("*")
    .eq("khoa_hoc_id", kh.id)
    .order("thu_tu", { ascending: true });

  // 3. Trạng thái đã đăng ký
  let daDangKy = false;
  if (userId) {
    const { data: dk } = await supabase
      .from("dang_ky_khoa_hoc")
      .select("id, da_thanh_toan")
      .eq("nguoi_dung_id", userId)
      .eq("khoa_hoc_id", kh.id)
      .maybeSingle();

    daDangKy = !!dk && (kh.mien_phi || dk.da_thanh_toan);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* HEADER: DẢI NỀN ẢNH BÌA + LƯỚI THÔNG TIN */}
      <div className="relative">
        {kh.anh_dai_dien && (
          <div aria-hidden className="relative h-44 overflow-hidden rounded-3xl md:h-56">
            <Image
              src={kh.anh_dai_dien}
              alt=""
              fill
              priority
              className="scale-110 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/60 to-background" />
          </div>
        )}
        <div
          className={`grid grid-cols-1 items-start gap-8 lg:grid-cols-3 ${
            kh.anh_dai_dien ? "relative -mt-24 px-1 md:-mt-32 md:px-4" : ""
          }`}
        >
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary">
              {kh.cap_do === "co_ban" ? "Cơ bản" : kh.cap_do === "trung_cap" ? "Trung cấp" : "Chuyên nghiệp"}
            </Badge>
            {kh.mien_phi && (
              <Badge className="bg-emerald-600 text-white">Miễn phí</Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {kh.tieu_de}
          </h1>

          {kh.mo_ta && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {kh.mo_ta}
            </p>
          )}

          {/* Đầu bếp giảng dạy */}
          {kh.dau_bep && (
            <div className="flex items-center gap-3 pt-2">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border bg-muted">
                {kh.dau_bep.avatar_url ? (
                  <Image
                    src={kh.dau_bep.avatar_url}
                    alt={kh.dau_bep.ho_ten || "Đầu bếp"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ChefHat className="h-full w-full p-2.5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Giảng viên phụ trách</p>
                <Link
                  href={`/dau-bep/${kh.dau_bep.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Chef {kh.dau_bep.ho_ten}
                </Link>
              </div>
            </div>
          )}

          {/* Video giới thiệu hoặc ảnh bìa */}
          <div className="pt-4">
            {kh.video_gioi_thieu ? (
              <TrinhPhatYouTube url={kh.video_gioi_thieu} tieuDe={kh.tieu_de} anhBia={kh.anh_dai_dien} />
            ) : kh.anh_dai_dien ? (
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
                <Image
                  src={kh.anh_dai_dien}
                  alt={kh.tieu_de}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* CỘT PHẢI: MUA KHÓA HỌC / THÔNG TIN ĐẶC QUYỀN */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-1 border-b pb-4">
                <p className="text-xs text-muted-foreground">Học phí trọn gói</p>
                <div className="text-3xl font-extrabold text-primary">
                  {kh.mien_phi
                    ? "Miễn phí"
                    : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(kh.gia)}
                </div>
              </div>

              {/* Nút thanh toán VNPay hoặc vào học */}
              <NutMuaKhoaHoc
                khoaHocId={kh.id}
                gia={kh.gia}
                mienPhi={kh.mien_phi}
                daDangKy={daDangKy}
              />

              {/* Đặc quyền khóa học */}
              <div className="space-y-3 pt-2 text-xs">
                <p className="font-semibold text-sm text-foreground">Khóa học này bao gồm:</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{kh.so_bai_hoc || 0} bài học video thực tế</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{kh.tong_thoi_gian || 0} phút học linh hoạt</span>
                </div>
                {kh.co_chung_chi && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-foreground">Chứng chỉ tốt nghiệp có mã QR</span>
                  </div>
                )}
                {kh.co_tai_lieu && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Tài liệu công thức định lượng chuẩn</span>
                  </div>
                )}
                {kh.ho_tro_1_1 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Hỗ trợ trực tiếp từ đầu bếp giảng dạy</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Truy cập trọn đời trên mọi thiết bị</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      {/* CHI TIẾT NỘI DUNG & GIÁO TRÌNH */}
      <div className="space-y-8 pt-4">
        {kh.mo_ta_chi_tiet && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Giới thiệu khóa học</h2>
            <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {kh.mo_ta_chi_tiet}
            </div>
          </div>
        )}

        {/* GIÁO TRÌNH BÀI HỌC */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold">Nội dung khóa học</h2>
            <span className="text-xs text-muted-foreground font-medium">
              {baiHocList?.length || 0} bài học • {kh.tong_thoi_gian || 0} phút
            </span>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <DanhSachBaiHoc
              khoaHocId={kh.id}
              baiHocList={baiHocList || []}
              daDangKy={daDangKy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

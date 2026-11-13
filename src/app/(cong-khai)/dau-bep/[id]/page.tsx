import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ChefHat, BookOpen, Utensils, Newspaper } from "lucide-react";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const admin = taoSupabaseAdmin();
  const { data: dauBep } = await admin
    .from("profiles")
    .select("ho_ten, bio")
    .eq("id", id)
    .eq("vai_tro", "chef")
    .eq("trang_thai", "hoat_dong")
    .maybeSingle();
  if (!dauBep) return { title: "Đầu bếp" };
  return {
    title: `Chef ${dauBep.ho_ten ?? "Đầu bếp"}`,
    description: dauBep.bio ?? "Hồ sơ đầu bếp tại Học Nấu Ăn — công thức và khóa học nổi bật.",
  };
}

export default async function HoSoDauBep({ params }: Props) {
  const { id } = await params;
  // Trang này CÔNG KHAI cho khách chưa đăng nhập (middleware đã bỏ /dau-bep/[id]
  // khỏi danh sách chi tiết cần đăng nhập). Mọi truy vấn đều qua admin client
  // và chỉ lấy nội dung ĐÃ XUẤT BẢN, vì RLS chặn khách đọc hồ sơ người khác
  // cũng như tác giả đi kèm từng nội dung qua client phiên.
  const supabase = taoSupabaseAdmin();

  // 1. Lấy thông tin đầu bếp — RLS profiles chặn đọc hồ sơ người khác qua client
  // phiên (khách mở trang này từng bị 404 oan) → đọc hồ sơ công khai bằng admin client
  const { data: dauBep } = await supabase
    .from("profiles")
    .select("id, ho_ten, avatar_url, bio")
    .eq("id", id)
    .eq("vai_tro", "chef")
    .eq("trang_thai", "hoat_dong")
    .maybeSingle();

  if (!dauBep) {
    notFound();
  }

  // 2. Lấy danh sách công thức, khóa học và bài viết của đầu bếp
  const [congThucRes, khoaHocRes, baiVietRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("*, tac_gia:profiles(ho_ten, avatar_url)")
      .eq("tac_gia_id", dauBep.id)
      .eq("trang_thai", "xuat_ban")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("khoa_hoc")
      .select("*, dau_bep:profiles(ho_ten, avatar_url)")
      .eq("dau_bep_id", dauBep.id)
      .eq("trang_thai", "xuat_ban")
      .order("created_at", { ascending: false }),
    supabase
      .from("bai_viet")
      .select("id, tieu_de, slug, tom_tat, anh_dai_dien, created_at")
      .eq("tac_gia_id", dauBep.id)
      .eq("trang_thai", "xuat_ban")
      .order("created_at", { ascending: false }),
  ]);

  const congThucList = congThucRes.data || [];
  const khoaHocList = khoaHocRes.data || [];
  const baiVietList = baiVietRes.data || [];

  return (
    <div className="space-y-12 pb-16">
      {/* HEADER PROFILE */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl border bg-card p-8 shadow-xs">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
          {dauBep.avatar_url ? (
            <Image
              src={dauBep.avatar_url}
              alt={dauBep.ho_ten || "Đầu bếp"}
              fill
              className="object-cover"
            />
          ) : (
            <ChefHat className="h-full w-full p-6 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Đầu bếp chuyên nghiệp
            </span>
            <h1 className="text-3xl font-extrabold text-foreground">
              Chef {dauBep.ho_ten}
            </h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {dauBep.bio || "Bếp trưởng tâm huyết chia sẻ bí quyết ẩm thực gia đình và chuyên nghiệp."}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-1.5 font-medium">
              <Utensils className="h-4 w-4 text-primary" />
              <span>{congThucList.length} công thức</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{khoaHocList.length} khóa học</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Newspaper className="h-4 w-4 text-primary" />
              <span>{baiVietList.length} bài viết</span>
            </div>
          </div>
        </div>
      </div>

      {/* KHÓA HỌC CỦA ĐẦU BẾP */}
      {khoaHocList.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Khóa học giảng dạy ({khoaHocList.length})
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {khoaHocList.map((kh) => (
              <TheKhoaHoc key={kh.id} khoaHoc={kh} />
            ))}
          </div>
        </div>
      )}

      {/* CÔNG THỨC CỦA ĐẦU BẾP */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Công thức chia sẻ ({congThucList.length})
        </h2>
        {congThucList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Đầu bếp chưa đăng công thức nào</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {congThucList.map((ct) => (
              <TheCongThuc key={ct.id} congThuc={ct} />
            ))}
          </div>
        )}
      </div>

      {/* BÀI VIẾT CỦA ĐẦU BẾP */}
      {baiVietList.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Bài viết chia sẻ ({baiVietList.length})
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {baiVietList.map((bv) => (
              <Link
                key={bv.id}
                href={`/bai-viet/${bv.slug}`}
                className="group block overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-16/9 w-full bg-muted">
                  {bv.anh_dai_dien ? (
                    <Image
                      src={bv.anh_dai_dien}
                      alt={bv.tieu_de}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Newspaper className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                    {bv.tieu_de}
                  </h3>
                  {bv.tom_tat && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{bv.tom_tat}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

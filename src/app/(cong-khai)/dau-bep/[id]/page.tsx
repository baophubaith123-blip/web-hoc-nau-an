import { notFound } from "next/navigation";
import Image from "next/image";
import { ChefHat, BookOpen, Utensils } from "lucide-react";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { TheKhoaHoc } from "@/components/khoa-hoc/the-khoa-hoc";
import { taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HoSoDauBep({ params }: Props) {
  const { id } = await params;
  const supabase = await taoSupabaseServer();

  // 1. Lấy thông tin đầu bếp
  const { data: dauBep } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("vai_tro", "chef")
    .eq("trang_thai", "hoat_dong")
    .maybeSingle();

  if (!dauBep) {
    notFound();
  }

  // 2. Lấy danh sách công thức của đầu bếp
  const [congThucRes, khoaHocRes] = await Promise.all([
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
  ]);

  const congThucList = congThucRes.data || [];
  const khoaHocList = khoaHocRes.data || [];

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
    </div>
  );
}

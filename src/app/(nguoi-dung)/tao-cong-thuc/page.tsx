import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function TrangTaoCongThuc() {
  await yeuCauVaiTro();
  const supabase = await taoSupabaseServer();

  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tạo công thức món ăn mới</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Chia sẻ bí quyết nấu nướng độc đáo của bạn đến với cộng đồng ẩm thực
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} />
    </div>
  );
}

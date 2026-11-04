import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";

export default async function TaoCongThucDauBepPage() {
  await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thêm công thức mới</h1>
        <p className="text-sm text-muted-foreground">
          Chia sẻ bí quyết và hương vị tuyệt hảo đến cộng đồng ẩm thực
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} />
    </div>
  );
}

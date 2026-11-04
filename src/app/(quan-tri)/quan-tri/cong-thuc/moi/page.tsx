import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";

export default async function TaoCongThucAdminPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thêm công thức chính thức</h1>
        <p className="text-sm text-muted-foreground">
          Công thức do Ban quản trị đăng tải sẽ được xuất bản công khai ngay lập tức
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} />
    </div>
  );
}

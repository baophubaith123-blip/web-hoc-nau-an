import { notFound, redirect } from "next/navigation";
import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TrangSuaCongThuc({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // 1. Lấy công thức
  const { data: ct, error } = await supabase
    .from("cong_thuc")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !ct) {
    notFound();
  }

  // Phải là tác giả hoặc admin
  if (ct.tac_gia_id !== userId && phien.profile.vai_tro !== "admin") {
    redirect("/cong-thuc-da-gui");
  }

  // 2. Lấy danh mục
  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  // 3. Lấy danh mục hiện tại của công thức
  const { data: ctdm } = await supabase
    .from("cong_thuc_danh_muc")
    .select("danh_muc_id")
    .eq("cong_thuc_id", ct.id);

  const danhMucIds = (ctdm || []).map((x) => x.danh_muc_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa công thức</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Cập nhật nội dung, định lượng và hình ảnh cho công thức của bạn
        </p>
      </div>

      <FormCongThuc
        danhMucList={danhMucList || []}
        congThucGoc={{ ...ct, danh_muc_ids: danhMucIds }}
      />
    </div>
  );
}

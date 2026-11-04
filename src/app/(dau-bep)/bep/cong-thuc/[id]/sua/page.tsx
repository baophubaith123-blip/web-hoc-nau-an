import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SuaCongThucDauBepPage({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const [{ data: congThuc }, { data: danhMucList }, { data: dmCongThuc }] = await Promise.all([
    supabase.from("cong_thuc").select("*").eq("id", id).maybeSingle(),
    supabase.from("danh_muc").select("*").eq("trang_thai", "hoat_dong").order("thu_tu"),
    supabase.from("cong_thuc_danh_muc").select("danh_muc_id").eq("cong_thuc_id", id),
  ]);

  if (!congThuc || (congThuc.tac_gia_id !== phien.user.id && phien.profile.vai_tro !== "admin")) {
    notFound();
  }

  const congThucGoc = {
    ...congThuc,
    danh_muc_ids: (dmCongThuc || []).map((d: { danh_muc_id: string }) => d.danh_muc_id),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa công thức</h1>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin chi tiết, nguyên liệu hoặc các bước chế biến
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} congThucGoc={congThucGoc} />
    </div>
  );
}

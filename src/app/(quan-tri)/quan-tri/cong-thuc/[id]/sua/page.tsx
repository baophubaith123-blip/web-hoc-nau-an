import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SuaCongThucAdminPage({ params }: Props) {
  const { id } = await params;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const [{ data: congThuc }, { data: danhMucList }, { data: dmCongThuc }] = await Promise.all([
    supabase.from("cong_thuc").select("*").eq("id", id).maybeSingle(),
    supabase.from("danh_muc").select("*").eq("trang_thai", "hoat_dong").order("thu_tu"),
    supabase.from("cong_thuc_danh_muc").select("danh_muc_id").eq("cong_thuc_id", id),
  ]);

  if (!congThuc) {
    notFound();
  }

  const congThucGoc = {
    ...congThuc,
    danh_muc_ids: (dmCongThuc || []).map((d: { danh_muc_id: string }) => d.danh_muc_id),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Biên tập công thức</h1>
        <p className="text-sm text-muted-foreground">
          Quản trị viên có toàn quyền hiệu chỉnh nội dung, nguyên liệu và bước thực hiện
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} congThucGoc={congThucGoc} />
    </div>
  );
}

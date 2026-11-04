import { Metadata } from "next";
import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormGoi } from "@/components/quan-tri/FormGoi";

export const metadata: Metadata = {
  title: "Chỉnh sửa gói Premium | Quản trị",
};

interface SuaGoiPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuaGoiPage({ params }: SuaGoiPageProps) {
  await yeuCauVaiTro(["admin"]);
  const { id } = await params;
  const supabase = await taoSupabaseServer();

  const { data: goi } = await supabase
    .from("goi_premium")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!goi) {
    notFound();
  }

  return (
    <div className="py-2">
      <FormGoi
        goiBanDau={{
          id: goi.id,
          ma_goi: goi.ma_goi,
          ten: goi.ten,
          mo_ta: goi.mo_ta,
          thoi_han_ngay: goi.thoi_han_ngay,
          gia: Number(goi.gia),
          quyen_loi: goi.quyen_loi as string[],
          thu_tu: goi.thu_tu,
          hoat_dong: goi.hoat_dong,
        }}
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormBaiViet } from "../../form-bai-viet";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SuaBaiVietPage({ params }: Props) {
  const { id } = await params;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: baiViet } = await supabase
    .from("bai_viet")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!baiViet) {
    notFound();
  }

  return <FormBaiViet baiVietHienTai={baiViet} />;
}

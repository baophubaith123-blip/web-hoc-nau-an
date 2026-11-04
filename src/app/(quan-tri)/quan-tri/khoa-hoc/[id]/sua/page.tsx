import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormKhoaHoc } from "@/components/khoa-hoc/form-khoa-hoc";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SuaKhoaHocAdminPage({ params }: Props) {
  const { id } = await params;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: khoaHoc } = await supabase
    .from("khoa_hoc")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!khoaHoc) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <FormKhoaHoc
        khoaHocId={khoaHoc.id}
        duLieuMacDinh={{
          tieu_de: khoaHoc.tieu_de,
          mo_ta: khoaHoc.mo_ta || "",
          mo_ta_chi_tiet: khoaHoc.mo_ta_chi_tiet || "",
          anh_dai_dien: khoaHoc.anh_dai_dien || "",
          video_gioi_thieu: khoaHoc.video_gioi_thieu || "",
          cap_do: khoaHoc.cap_do,
          gia: khoaHoc.gia,
          mien_phi: khoaHoc.mien_phi,
          co_chung_chi: khoaHoc.co_chung_chi,
          co_tai_lieu: khoaHoc.co_tai_lieu,
          co_bai_tap: khoaHoc.co_bai_tap,
          ho_tro_1_1: khoaHoc.ho_tro_1_1,
        }}
        vaiTroNguoiDung="admin"
        urlQuayLai="/quan-tri/khoa-hoc"
      />
    </div>
  );
}

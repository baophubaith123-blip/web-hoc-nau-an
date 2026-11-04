import { notFound, redirect } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ khoaHocId: string }>;
}

export default async function ChuyenHuongHocBai({ params }: Props) {
  const { khoaHocId } = await params;
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // Kiểm tra quyền học
  const { data: kh } = await supabase
    .from("khoa_hoc")
    .select("id, mien_phi")
    .eq("id", khoaHocId)
    .single();

  if (!kh) notFound();

  // Kiểm tra đăng ký
  const { data: dk } = await supabase
    .from("dang_ky_khoa_hoc")
    .select("id, da_thanh_toan")
    .eq("nguoi_dung_id", userId)
    .eq("khoa_hoc_id", kh.id)
    .maybeSingle();

  if (!kh.mien_phi && !dk?.da_thanh_toan) {
    redirect(`/khoa-hoc`);
  }

  // Lấy bài học đầu tiên hoặc bài chưa học
  const { data: baiHocList } = await supabase
    .from("bai_hoc")
    .select("id")
    .eq("khoa_hoc_id", kh.id)
    .order("thu_tu", { ascending: true })
    .limit(1);

  if (!baiHocList || baiHocList.length === 0) {
    redirect(`/khoa-hoc-cua-toi`);
  }

  redirect(`/hoc-bai/${kh.id}/${baiHocList[0].id}`);
}

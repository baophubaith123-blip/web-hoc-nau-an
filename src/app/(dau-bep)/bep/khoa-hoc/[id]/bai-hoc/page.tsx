import { notFound } from "next/navigation";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { QuanLyBaiHocClient } from "./quan-ly-bai-hoc-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuanLyBaiHocPage({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const [{ data: khoaHoc }, { data: danhSachBaiHoc }] = await Promise.all([
    supabase.from("khoa_hoc").select("*").eq("id", id).maybeSingle(),
    supabase.from("bai_hoc").select("*").eq("khoa_hoc_id", id).order("thu_tu", { ascending: true }),
  ]);

  if (!khoaHoc || (khoaHoc.dau_bep_id !== phien.user.id && phien.profile.vai_tro !== "admin")) {
    notFound();
  }

  return (
    <QuanLyBaiHocClient
      khoaHoc={khoaHoc}
      danhSachBaiHoc={danhSachBaiHoc || []}
    />
  );
}

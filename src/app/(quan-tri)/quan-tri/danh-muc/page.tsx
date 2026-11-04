import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { QuanLyDanhMucClient } from "./quan-ly-danh-muc-client";

export default async function QuanLyDanhMucPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachDanhMuc } = await supabase
    .from("danh_muc")
    .select("*")
    .order("thu_tu", { ascending: true });

  return (
    <QuanLyDanhMucClient
      danhSachDanhMuc={danhSachDanhMuc || []}
    />
  );
}

import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { FormCauHinhClient } from "./form-cau-hinh-client";
import type { CauHinhForm } from "@/lib/validations/quan-tri";

export default async function CauHinhHeThongPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachCauHinh } = await supabase
    .from("cau_hinh_he_thong")
    .select("*");

  const cauHinhMap: Record<string, any> = {};
  (danhSachCauHinh || []).forEach((item) => {
    cauHinhMap[item.khoa] = item.gia_tri;
  });

  const cauHinhBanDau: Partial<CauHinhForm> = {
    site: cauHinhMap["cong_khai.site"],
    seo: cauHinhMap["cong_khai.seo"],
    thanh_toan: cauHinhMap["thanh_toan"],
    email: cauHinhMap["email"],
  };

  return <FormCauHinhClient cauHinhBanDau={cauHinhBanDau} />;
}

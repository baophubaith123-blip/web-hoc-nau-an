import { yeuCauVaiTro } from "@/lib/supabase/server";
import { FormKhoaHoc } from "@/components/khoa-hoc/form-khoa-hoc";

export default async function TaoKhoaHocDauBepPage() {
  await yeuCauVaiTro(["chef", "admin"]);

  return (
    <div className="space-y-6">
      <FormKhoaHoc
        vaiTroNguoiDung="chef"
        urlQuayLai="/bep/khoa-hoc"
      />
    </div>
  );
}

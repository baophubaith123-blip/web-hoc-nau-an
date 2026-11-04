import { yeuCauVaiTro } from "@/lib/supabase/server";
import { FormKhoaHoc } from "@/components/khoa-hoc/form-khoa-hoc";

export default async function TaoKhoaHocAdminPage() {
  await yeuCauVaiTro(["admin"]);

  return (
    <div className="space-y-6">
      <FormKhoaHoc
        vaiTroNguoiDung="admin"
        urlQuayLai="/quan-tri/khoa-hoc"
      />
    </div>
  );
}

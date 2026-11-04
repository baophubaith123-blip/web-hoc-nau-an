import { Metadata } from "next";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { FormGoi } from "@/components/quan-tri/FormGoi";

export const metadata: Metadata = {
  title: "Thêm gói Premium mới | Quản trị",
};

export default async function TaoGoiPage() {
  await yeuCauVaiTro(["admin"]);

  return (
    <div className="py-2">
      <FormGoi />
    </div>
  );
}

import { yeuCauVaiTro } from "@/lib/supabase/server";
import { FormBaiViet } from "../form-bai-viet";

export default async function TaoBaiVietPage() {
  await yeuCauVaiTro(["admin"]);

  return <FormBaiViet />;
}

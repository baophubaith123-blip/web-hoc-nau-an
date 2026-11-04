import { yeuCauVaiTro } from "@/lib/supabase/server";
import { FormGuiThongBao } from "./form-gui-thong-bao";

export default async function QuanLyThongBaoPage() {
  await yeuCauVaiTro(["admin"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gửi Thông Báo Hệ Thống</h1>
        <p className="text-sm text-muted-foreground">
          Truyền thông tin quan trọng, thông báo nâng cấp hoặc chương trình ưu đãi tới thành viên
        </p>
      </div>

      <FormGuiThongBao />
    </div>
  );
}

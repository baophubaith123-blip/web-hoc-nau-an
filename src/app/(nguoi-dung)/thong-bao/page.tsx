import { DanhSachThongBaoClient } from "./danh-sach-thong-bao-client";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function TrangThongBao() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  const { data: danhSach } = await supabase
    .from("thong_bao")
    .select("*")
    .eq("nguoi_dung_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thông báo</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Theo dõi các thông tin quan trọng về tài khoản, hoạt động và lớp học của bạn
        </p>
      </div>

      <DanhSachThongBaoClient danhSachBanDau={danhSach || []} />
    </div>
  );
}

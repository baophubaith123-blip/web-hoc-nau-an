import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ThaoTacHoanTien } from "./thao-tac-hoan-tien";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { dinhDangTien, dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

export default async function QuanLyThanhToanPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachGiaoDich } = await supabase
    .from("thanh_toan")
    .select("*, nguoi_dung:profiles!thanh_toan_nguoi_dung_id_fkey(ho_ten, username), khoa_hoc:khoa_hoc!thanh_toan_khoa_hoc_id_fkey(tieu_de)")
    .order("created_at", { ascending: false });

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    thanh_cong: { label: "Thành công", variant: "default" },
    cho_xu_ly: { label: "Chờ xử lý", variant: "secondary" },
    that_bai: { label: "Thất bại", variant: "destructive" },
    hoan_tien: { label: "Đã hoàn tiền", variant: "outline" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản Lý Giao Dịch & Doanh Thu</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi lịch sử thanh toán VNPay, trạng thái giao dịch và xử lý khiếu nại hoàn tiền
        </p>
      </div>

      {!danhSachGiaoDich || danhSachGiaoDich.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có giao dịch thanh toán nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachGiaoDich.map((gd: any) => {
            const tt = mauTrangThai[gd.trang_thai] || { label: gd.trang_thai, variant: "outline" };

            return (
              <div
                key={gd.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {gd.ma_giao_dich}
                    </span>
                    <Badge variant={tt.variant} className="text-[10px]">
                      {tt.label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {gd.phuong_thuc}
                    </Badge>
                  </div>

                  <p className="font-semibold text-sm">
                    Khóa học: {gd.khoa_hoc?.tieu_de || "Khóa học nấu ăn"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Người mua: <span className="font-medium text-foreground">{gd.nguoi_dung?.ho_ten || "Khách"}</span> (@{gd.nguoi_dung?.username || "chua_co"}) • {dinhDangTuongDoi(gd.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <p className="font-extrabold text-base text-foreground">
                      {dinhDangTien(gd.so_tien)}
                    </p>
                  </div>

                  <ThaoTacHoanTien
                    thanhToanId={gd.id}
                    trangThai={gd.trang_thai}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

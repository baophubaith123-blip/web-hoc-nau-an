import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

export default async function QuanTriHoTroPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachTicket } = await supabase
    .from("ticket_ho_tro")
    .select("*, nguoi_tao:profiles!ticket_ho_tro_nguoi_dung_id_fkey(ho_ten, username), nhan_vien:profiles!ticket_ho_tro_nhan_vien_ho_tro_id_fkey(ho_ten)")
    .order("created_at", { ascending: false });

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    moi: { label: "Mới gửi", variant: "secondary" },
    dang_xu_ly: { label: "Đang xử lý", variant: "default" },
    cho_phan_hoi: { label: "Chờ phản hồi", variant: "secondary" },
    da_giai_quyet: { label: "Đã giải quyết", variant: "outline" },
    dong: { label: "Đã đóng", variant: "outline" },
  };

  const mauUuTien: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    thap: "outline",
    trung_binh: "secondary",
    cao: "default",
    khan_cap: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Giám Sát Khiếu Nại & Hỗ Trợ</h1>
          <p className="text-sm text-muted-foreground">
            Quản trị viên có quyền phân công lại nhân sự và giải quyết ticket khẩn cấp
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/nhan-vien/ticket">
            Chuyển sang Giao diện Nhân viên <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </div>

      {!danhSachTicket || danhSachTicket.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">Không có phiếu hỗ trợ nào trong hệ thống.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachTicket.map((tk) => {
            const tt = mauTrangThai[tk.trang_thai] || { label: tk.trang_thai, variant: "outline" };
            const ut = mauUuTien[tk.do_uu_tien] || "secondary";

            return (
              <div
                key={tk.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={ut} className="text-[10px] uppercase">
                      {tk.do_uu_tien}
                    </Badge>
                    <Link
                      href={`/nhan-vien/ticket/${tk.id}`}
                      className="font-bold text-base hover:underline hover:text-primary transition-colors line-clamp-1"
                    >
                      {tk.tieu_de}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Người gửi: <span className="font-semibold text-foreground">{tk.nguoi_tao?.ho_ten || "Khách"}</span> • Phụ trách: <span className="font-medium text-foreground">{tk.nhan_vien?.ho_ten || "Chưa nhận"}</span> • Tạo {dinhDangTuongDoi(tk.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant={tt.variant} className="text-xs">
                    {tt.label}
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href={`/nhan-vien/ticket/${tk.id}`}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Xem & Xử lý
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

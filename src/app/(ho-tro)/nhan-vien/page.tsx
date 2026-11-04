import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { TheThongKe } from "@/components/quan-tri/the-thong-ke";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

export default async function NhanVienDashboardPage() {
  await yeuCauVaiTro(["support", "admin"]);
  const supabase = await taoSupabaseServer();

  const [
    { count: tongChuaXuLy },
    { count: tongDangXuLy },
    { count: tongDaGiaiQuyet },
    { count: tongUuTienCao },
    { data: ticketMoi },
  ] = await Promise.all([
    supabase.from("ticket_ho_tro").select("*", { count: "exact", head: true }).eq("trang_thai", "moi"),
    supabase.from("ticket_ho_tro").select("*", { count: "exact", head: true }).in("trang_thai", ["dang_xu_ly", "cho_phan_hoi"]),
    supabase.from("ticket_ho_tro").select("*", { count: "exact", head: true }).in("trang_thai", ["da_giai_quyet", "dong"]),
    supabase.from("ticket_ho_tro").select("*", { count: "exact", head: true }).in("do_uu_tien", ["cao", "khan_cap"]).eq("trang_thai", "moi"),
    supabase
      .from("ticket_ho_tro")
      .select("*, nguoi_tao:profiles!ticket_ho_tro_nguoi_dung_id_fkey(ho_ten, username)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const mauUuTien: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    thap: "outline",
    trung_binh: "secondary",
    cao: "default",
    khan_cap: "destructive",
  };

  const mauTrangThai: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    moi: { label: "Mới gửi", variant: "secondary" },
    dang_xu_ly: { label: "Đang hỗ trợ", variant: "default" },
    cho_phan_hoi: { label: "Chờ phản hồi", variant: "secondary" },
    da_giai_quyet: { label: "Đã xong", variant: "outline" },
    dong: { label: "Đã đóng", variant: "outline" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Kênh Nhân Viên Hỗ Trợ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hỗ trợ kỹ thuật, giải đáp thắc mắc người học và quản lý khiếu nại dịch vụ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TheThongKe
          tieuDe="Chờ xử lý"
          giaTri={tongChuaXuLy || 0}
          moTa="Yêu cầu mới chưa tiếp nhận"
          icon="Inbox"
        />
        <TheThongKe
          tieuDe="Đang hỗ trợ"
          giaTri={tongDangXuLy || 0}
          moTa="Ticket đang được trao đổi"
          icon="Clock"
        />
        <TheThongKe
          tieuDe="Ưu tiên cao / Khẩn"
          giaTri={tongUuTienCao || 0}
          moTa="Cần xử lý gấp"
          icon="AlertTriangle"
        />
        <TheThongKe
          tieuDe="Đã giải quyết"
          giaTri={tongDaGiaiQuyet || 0}
          moTa="Ticket hoàn tất"
          icon="CheckCircle2"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Yêu cầu hỗ trợ gần đây</h2>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/nhan-vien/ticket">
              Xem toàn bộ <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {!ticketMoi || ticketMoi.length === 0 ? (
          <div className="p-12 border rounded-2xl text-center bg-card">
            <p className="text-sm text-muted-foreground">Hiện tại không có ticket nào cần hỗ trợ.</p>
          </div>
        ) : (
          <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
            {ticketMoi.map((tk) => {
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
                        className="font-semibold text-sm hover:underline hover:text-primary transition-colors line-clamp-1"
                      >
                        {tk.tieu_de}
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Từ: <span className="font-medium text-foreground">{tk.nguoi_tao?.ho_ten || "Khách"}</span> {tk.nguoi_tao?.username ? `(@${tk.nguoi_tao.username})` : ""} • {dinhDangTuongDoi(tk.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge variant={tt.variant} className="text-xs">
                      {tt.label}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/nhan-vien/ticket/${tk.id}`}>
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Xử lý
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

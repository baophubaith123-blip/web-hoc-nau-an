import Link from "next/link";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TaoTicketDialog } from "./tao-ticket-dialog";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

const TRANG_THAI_TICKET: Record<string, { nhan: string; class: string }> = {
  moi: { nhan: "Mới tạo", class: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  dang_xu_ly: { nhan: "Đang xử lý", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  cho_phan_hoi: { nhan: "Chờ phản hồi", class: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  da_giai_quyet: { nhan: "Đã giải quyết", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  dong: { nhan: "Đã đóng", class: "bg-slate-500/10 text-slate-600" },
};

export default async function TrangHoTro() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  const { data: danhSach } = await supabase
    .from("ticket_ho_tro")
    .select("*, nhan_vien:profiles!nhan_vien_ho_tro_id(ho_ten)")
    .eq("nguoi_dung_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hỗ trợ & Khiếu nại</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gửi yêu cầu trợ giúp và trao đổi trực tiếp với nhân viên hỗ trợ
          </p>
        </div>
        <TaoTicketDialog />
      </div>

      {(!danhSach || danhSach.length === 0) ? (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground stroke-1" />
          <p className="text-base font-semibold">Bạn chưa có yêu cầu hỗ trợ nào</p>
          <p className="text-xs text-muted-foreground">
            Nếu gặp khó khăn về tài khoản, thanh toán hoặc bài học, hãy gửi yêu cầu cho chúng tôi
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {danhSach.map((tk) => {
            const tt = TRANG_THAI_TICKET[tk.trang_thai] || TRANG_THAI_TICKET.moi;

            return (
              <Card key={tk.id} className="overflow-hidden hover:shadow-xs transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        #{tk.ma_ticket}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tt.class}`}>
                        {tt.nhan}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(tk.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-foreground">
                      {tk.tieu_de}
                    </h3>

                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {tk.noi_dung}
                    </p>
                  </div>

                  <Button asChild size="sm" variant="outline" className="gap-1.5 shrink-0">
                    <Link href={`/ho-tro/${tk.id}`}>
                      Vào phòng chat
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

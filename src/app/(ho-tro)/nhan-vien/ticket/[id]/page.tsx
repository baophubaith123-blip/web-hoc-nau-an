import { notFound } from "next/navigation";
import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ChatHoTro, type TinNhanItem } from "@/components/ho-tro/chat-ho-tro";
import { ThaoTacTicketClient } from "./thao-tac-ticket-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, AlertCircle } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { nhanCua } from "@/lib/utils/hang-so";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChiTietTicketSupportPage({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro(["support", "admin"]);
  const supabase = await taoSupabaseServer();

  const [{ data: ticket }, { data: tinNhan }] = await Promise.all([
    supabase
      .from("ticket_ho_tro")
      .select("*, nguoi_tao:profiles!ticket_ho_tro_nguoi_dung_id_fkey(id, ho_ten, username, avatar_url), nhan_vien:profiles!ticket_ho_tro_nhan_vien_ho_tro_id_fkey(id, ho_ten)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("tin_nhan_ticket")
      .select("*, nguoi_gui:profiles!tin_nhan_ticket_nguoi_gui_id_fkey(ho_ten, avatar_url, vai_tro)")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!ticket) {
    notFound();
  }

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

  const tt = mauTrangThai[ticket.trang_thai] || { label: ticket.trang_thai, variant: "outline" };
  const ut = mauUuTien[ticket.do_uu_tien] || "secondary";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/nhan-vien/ticket">
              <ArrowLeft className="w-4 h-4 mr-1" /> Danh sách ticket
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={ut} className="text-xs uppercase">
              {nhanCua("do_uu_tien", ticket.do_uu_tien)}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight">{ticket.tieu_de}</h1>
            <Badge variant={tt.variant}>{tt.label}</Badge>
          </div>
        </div>

        <ThaoTacTicketClient
          ticketId={ticket.id}
          trangThaiHienTai={ticket.trang_thai}
          nhanVienIdHienTai={ticket.nhan_vien_ho_tro_id}
          idNhanVienDangDangNhap={phien.user.id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-2xl bg-card text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-foreground">{ticket.nguoi_tao?.ho_ten || "Người dùng"}</p>
            <p>{ticket.nguoi_tao?.username ? `@${ticket.nguoi_tao.username}` : "Thành viên"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Danh mục</p>
            <p>{ticket.danh_muc ? nhanCua("danh_muc_ticket", ticket.danh_muc) : "Hỗ trợ chung"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Thời gian gửi</p>
            <p>{dinhDangTuongDoi(ticket.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-purple-500 shrink-0" />
          <div>
            <p className="font-semibold text-foreground">Phụ trách</p>
            <p>{ticket.nhan_vien?.ho_ten || "Chưa phân công"}</p>
          </div>
        </div>
      </div>

      {ticket.noi_dung && (
        <div className="p-4 border rounded-2xl bg-muted/30 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Mô tả ban đầu từ học viên:
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.noi_dung}</p>
        </div>
      )}

      {/* Khu vực chat realtime */}
      <div className="border rounded-2xl bg-card overflow-hidden shadow-xs">
        <ChatHoTro
          ticketId={ticket.id}
          tinNhanBanDau={(tinNhan || []) as unknown as TinNhanItem[]}
          nguoiDungHienTaiId={phien.user.id}
          laNhanVien={true}
        />
      </div>
    </div>
  );
}

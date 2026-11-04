import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatHoTro, type TinNhanItem } from "@/components/ho-tro/chat-ho-tro";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

const TRANG_THAI_TICKET: Record<string, { nhan: string; class: string }> = {
  moi: { nhan: "Mới tạo", class: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  dang_xu_ly: { nhan: "Đang xử lý", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  cho_phan_hoi: { nhan: "Chờ phản hồi", class: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  da_giai_quyet: { nhan: "Đã giải quyết", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  dong: { nhan: "Đã đóng", class: "bg-slate-500/10 text-slate-600" },
};

export default async function ChiTietTicketNguoiDung({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // 1. Lấy thông tin ticket
  const { data: tk, error } = await supabase
    .from("ticket_ho_tro")
    .select("*, nhan_vien:profiles!nhan_vien_ho_tro_id(ho_ten)")
    .eq("id", id)
    .maybeSingle();

  if (error || !tk) {
    notFound();
  }

  // Quyền: chỉ chủ ticket hoặc nhân viên/admin
  const laNhanVien = phien.profile.vai_tro === "support" || phien.profile.vai_tro === "admin";
  if (tk.nguoi_dung_id !== userId && !laNhanVien) {
    redirect("/ho-tro");
  }

  // 2. Lấy danh sách tin nhắn
  // Người dùng thường không xem được tin nhắn nội bộ (la_noi_bo = true)
  let queryTn = supabase
    .from("tin_nhan_ticket")
    .select("*, nguoi_gui:profiles(ho_ten, avatar_url, vai_tro)")
    .eq("ticket_id", tk.id)
    .order("created_at", { ascending: true });

  if (!laNhanVien) {
    queryTn = queryTn.eq("la_noi_bo", false);
  }

  const { data: tinNhanList } = await queryTn;
  const tt = TRANG_THAI_TICKET[tk.trang_thai] || TRANG_THAI_TICKET.moi;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <Link href="/ho-tro">
              <ArrowLeft className="h-4 w-4" />
              Danh sách ticket
            </Link>
          </Button>
          <span className="font-mono text-sm font-bold text-primary">
            #{tk.ma_ticket}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tt.class}`}>
            {tt.nhan}
          </span>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
        <h2 className="text-lg font-bold text-foreground">{tk.tieu_de}</h2>
        <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
          {tk.noi_dung}
        </p>
      </div>

      {/* KHUNG CHAT REALTIME */}
      <ChatHoTro
        ticketId={tk.id}
        tinNhanBanDau={(tinNhanList as unknown as TinNhanItem[]) || []}
        nguoiDungHienTaiId={userId}
        laNhanVien={laNhanVien}
      />
    </div>
  );
}

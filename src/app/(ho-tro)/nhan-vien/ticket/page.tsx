import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { nhanCua } from "@/lib/utils/hang-so";

interface Props {
  searchParams: Promise<{ trang_thai?: string; uu_tien?: string }>;
}

export default async function DanhSachTicketSupportPage({ searchParams }: Props) {
  const params = await searchParams;
  await yeuCauVaiTro(["support", "admin"]);
  const supabase = await taoSupabaseServer();

  let truyVan = supabase
    .from("ticket_ho_tro")
    .select("*, nguoi_tao:profiles!ticket_ho_tro_nguoi_dung_id_fkey(ho_ten, username)")
    .order("created_at", { ascending: false });

  if (params.trang_thai) {
    truyVan = truyVan.eq("trang_thai", params.trang_thai as "moi" | "dang_xu_ly" | "cho_phan_hoi" | "da_giai_quyet" | "dong");
  }
  if (params.uu_tien) {
    truyVan = truyVan.eq("do_uu_tien", params.uu_tien as "thap" | "trung_binh" | "cao" | "khan_cap");
  }

  const { data: danhSachTicket } = await truyVan;

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

  const boLoc = [
    { label: "Tất cả", val: "" },
    { label: "Mới gửi", val: "moi" },
    { label: "Đang xử lý", val: "dang_xu_ly" },
    { label: "Chờ phản hồi", val: "cho_phan_hoi" },
    { label: "Đã giải quyết", val: "da_giai_quyet" },
    { label: "Đã đóng", val: "dong" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/nhan-vien">
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard Hỗ Trợ
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Hàng Đợi Yêu Cầu Hỗ Trợ</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách toàn bộ phiếu hỗ trợ kỹ thuật và giải đáp người học
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {boLoc.map((item) => {
          const active = (params.trang_thai || "") === item.val;
          return (
            <Button
              key={item.val}
              variant={active ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={
                  item.val
                    ? `/nhan-vien/ticket?trang_thai=${item.val}`
                    : "/nhan-vien/ticket"
                }
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {!danhSachTicket || danhSachTicket.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">Không tìm thấy yêu cầu hỗ trợ nào phù hợp.</p>
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
                      {nhanCua("do_uu_tien", tk.do_uu_tien)}
                    </Badge>
                    <Link
                      href={`/nhan-vien/ticket/${tk.id}`}
                      className="font-bold text-base hover:underline hover:text-primary transition-colors line-clamp-1"
                    >
                      {tk.tieu_de}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Người gửi: <span className="font-semibold text-foreground">{tk.nguoi_tao?.ho_ten || "Khách"}</span> {tk.nguoi_tao?.username ? `(@${tk.nguoi_tao.username})` : ""} • Danh mục: <span className="font-medium">{tk.danh_muc ? nhanCua("danh_muc_ticket", tk.danh_muc) : "Chung"}</span> • Tạo {dinhDangTuongDoi(tk.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant={tt.variant} className="text-xs">
                    {tt.label}
                  </Badge>
                  <Button size="sm" asChild>
                    <Link href={`/nhan-vien/ticket/${tk.id}`}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Mở xử lý
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

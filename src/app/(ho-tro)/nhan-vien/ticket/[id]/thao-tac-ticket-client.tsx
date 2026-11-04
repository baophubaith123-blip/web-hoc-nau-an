"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { doiTrangThaiTicket, phanCongTicket } from "@/lib/actions/ticket";
import { CheckCircle2, Lock, UserCheck, Loader2 } from "lucide-react";

interface ThaoTacTicketProps {
  ticketId: string;
  trangThaiHienTai: string;
  nhanVienIdHienTai: string | null;
  idNhanVienDangDangNhap: string;
}

export function ThaoTacTicketClient({
  ticketId,
  trangThaiHienTai,
  nhanVienIdHienTai,
  idNhanVienDangDangNhap,
}: ThaoTacTicketProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDoiTrangThai = async (trangThaiMoi: "chua_xu_ly" | "dang_xu_ly" | "da_giai_quyet" | "dong") => {
    setDangXuLy(true);
    try {
      const res = await doiTrangThaiTicket({
        ticket_id: ticketId,
        trang_thai: trangThaiMoi,
      });

      if (res.thanh_cong) {
        toast.success("Đã cập nhật trạng thái phiếu hỗ trợ!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyNhanXuLy = async () => {
    setDangXuLy(true);
    try {
      const res = await phanCongTicket({
        ticket_id: ticketId,
        nhan_vien_id: idNhanVienDangDangNhap,
      });

      if (res.thanh_cong) {
        toast.success("Đã tiếp nhận xử lý phiếu hỗ trợ này!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể nhận phân công phiếu");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {nhanVienIdHienTai !== idNhanVienDangDangNhap && (
        <Button
          size="sm"
          variant="outline"
          disabled={dangXuLy}
          onClick={xuLyNhanXuLy}
          className="gap-1.5"
        >
          {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
          Nhận xử lý ticket này
        </Button>
      )}

      {trangThaiHienTai !== "da_giai_quyet" && (
        <Button
          size="sm"
          variant="secondary"
          disabled={dangXuLy}
          onClick={() => xuLyDoiTrangThai("da_giai_quyet")}
          className="gap-1.5"
        >
          {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Đánh dấu đã giải quyết
        </Button>
      )}

      {trangThaiHienTai !== "dong" ? (
        <Button
          size="sm"
          variant="outline"
          disabled={dangXuLy}
          onClick={() => xuLyDoiTrangThai("dong")}
          className="gap-1.5 text-destructive hover:bg-destructive/10"
        >
          {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
          Đóng phiếu
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={dangXuLy}
          onClick={() => xuLyDoiTrangThai("dang_xu_ly")}
        >
          Mở lại phiếu
        </Button>
      )}
    </div>
  );
}

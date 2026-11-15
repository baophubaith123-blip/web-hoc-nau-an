"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  duyetDonUngTuyen,
  tuChoiDonUngTuyen,
} from "@/lib/actions/ung-tuyen-dau-bep";

// Nút Duyệt / Từ chối trên từng đơn ứng tuyển đầu bếp (khu Admin).
// Duyệt: đổi vai trò người gửi thành chef + gửi thông báo (ở action).
// Từ chối: bắt buộc nhập lý do — người gửi thấy lý do và được gửi lại
// sau 7 ngày.
export function ThaoTacDuyetDon({
  donId,
  tenNguoiGui,
}: {
  donId: string;
  tenNguoiGui: string;
}) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);
  const [moTuChoi, setMoTuChoi] = useState(false);
  const [lyDo, setLyDo] = useState("");

  const duyet = async () => {
    setDangXuLy(true);
    try {
      const ketQua = await duyetDonUngTuyen({ don_id: donId });
      if (ketQua.thanh_cong) {
        toast.success(`Đã duyệt đơn — ${tenNguoiGui} chính thức trở thành đầu bếp!`);
        router.refresh();
      } else {
        toast.error(ketQua.loi);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi duyệt đơn. Vui lòng thử lại.");
    } finally {
      setDangXuLy(false);
    }
  };

  const tuChoi = async () => {
    if (lyDo.trim().length < 3) {
      toast.error("Vui lòng nhập lý do từ chối (tối thiểu 3 ký tự) để người gửi biết đường hoàn thiện hồ sơ.");
      return;
    }
    setDangXuLy(true);
    try {
      const ketQua = await tuChoiDonUngTuyen({
        don_id: donId,
        ly_do_tu_choi: lyDo.trim(),
      });
      if (ketQua.thanh_cong) {
        toast.success("Đã từ chối đơn ứng tuyển và gửi lý do cho người gửi.");
        setMoTuChoi(false);
        router.refresh();
      } else {
        toast.error(ketQua.loi);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi từ chối đơn. Vui lòng thử lại.");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={duyet} disabled={dangXuLy}>
        {dangXuLy ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
        )}
        Duyệt thành đầu bếp
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950/30"
        onClick={() => setMoTuChoi(true)}
        disabled={dangXuLy}
      >
        <XCircle className="mr-1.5 h-4 w-4" />
        Từ chối
      </Button>

      <Dialog open={moTuChoi} onOpenChange={setMoTuChoi}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đơn của {tenNguoiGui}?</DialogTitle>
            <DialogDescription>
              Lý do sẽ được gửi cho người ứng tuyển qua thông báo. Họ có thể gửi
              lại đơn sau 7 ngày kể từ hôm nay.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`ly-do-tu-choi-${donId}`}>Lý do từ chối *</Label>
            <Textarea
              id={`ly-do-tu-choi-${donId}`}
              rows={3}
              maxLength={500}
              placeholder="VD: Tiểu sử còn sơ sài, chưa thấy món tủ hay kênh nấu ăn để tham khảo…"
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoTuChoi(false)} disabled={dangXuLy}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={tuChoi} disabled={dangXuLy}>
              {dangXuLy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Từ chối đơn này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

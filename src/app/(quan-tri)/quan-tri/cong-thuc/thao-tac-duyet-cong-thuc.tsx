"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { duyetCongThuc, tuChoiCongThuc, datNoiBat } from "@/lib/actions/quan-tri";
import { xoaCongThuc } from "@/lib/actions/cong-thuc";
import { Check, X, Star, Trash2, Loader2 } from "lucide-react";

interface ThaoTacDuyetCongThucProps {
  congThucId: string;
  trangThai: string;
  noiBat: boolean;
}

export function ThaoTacDuyetCongThuc({
  congThucId,
  trangThai,
  noiBat,
}: ThaoTacDuyetCongThucProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);
  const [moDialogTuChoi, setMoDialogTuChoi] = useState(false);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  const xuLyDuyet = async () => {
    setDangXuLy(true);
    try {
      const res = await duyetCongThuc(congThucId);
      if (res.thanh_cong) {
        toast.success("Đã phê duyệt công thức!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi phê duyệt");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyTuChoi = async () => {
    if (!lyDoTuChoi.trim()) {
      toast.error("Vui lòng nhập lý do từ chối để gửi phản hồi cho tác giả");
      return;
    }

    setDangXuLy(true);
    try {
      const res = await tuChoiCongThuc({
        id: congThucId,
        ly_do: lyDoTuChoi.trim(),
      });

      if (res.thanh_cong) {
        toast.success("Đã từ chối công thức và gửi lý do cho tác giả!");
        setMoDialogTuChoi(false);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi từ chối");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyNoiBat = async () => {
    setDangXuLy(true);
    try {
      const res = await datNoiBat(congThucId, !noiBat);
      if (res.thanh_cong) {
        toast.success(
          !noiBat ? "Đã đặt công thức làm nổi bật!" : "Đã hủy nổi bật công thức!"
        );
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyXoa = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa công thức này khỏi hệ thống?")) return;
    setDangXuLy(true);
    try {
      const res = await xoaCongThuc(congThucId);
      if (res.thanh_cong) {
        toast.success("Đã gỡ công thức thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa công thức");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {trangThai === "cho_duyet" && (
        <>
          <Button
            size="sm"
            variant="default"
            disabled={dangXuLy}
            onClick={xuLyDuyet}
            className="gap-1 bg-emerald-600 hover:bg-emerald-700 h-8"
          >
            {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={dangXuLy}
            onClick={() => setMoDialogTuChoi(true)}
            className="gap-1 h-8"
          >
            <X className="w-3.5 h-3.5" />
            Từ chối
          </Button>
        </>
      )}

      {trangThai === "xuat_ban" && (
        <Button
          size="sm"
          variant={noiBat ? "default" : "outline"}
          disabled={dangXuLy}
          onClick={xuLyNoiBat}
          className={`h-8 gap-1 ${noiBat ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
        >
          <Star className={`w-3.5 h-3.5 ${noiBat ? "fill-current" : ""}`} />
          {noiBat ? "Nổi bật" : "Ghim"}
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={dangXuLy}
        onClick={xuLyXoa}
        className="h-8 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>

      {/* Dialog từ chối */}
      <Dialog open={moDialogTuChoi} onOpenChange={setMoDialogTuChoi}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối công thức</DialogTitle>
            <DialogDescription>
              Nhập rõ lý do vi phạm hoặc cần chỉnh sửa để thông báo qua email và thông báo cho tác giả.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="ly_do">Lý do từ chối *</Label>
            <Textarea
              id="ly_do"
              rows={4}
              placeholder="Ví dụ: Hình ảnh món ăn bị mờ; các bước hướng dẫn chưa đầy đủ định lượng gia vị..."
              value={lyDoTuChoi}
              onChange={(e) => setLyDoTuChoi(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoDialogTuChoi(false)} disabled={dangXuLy}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={xuLyTuChoi} disabled={dangXuLy}>
              {dangXuLy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

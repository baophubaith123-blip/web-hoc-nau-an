"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { duyetBaiViet, tuChoiBaiViet } from "@/lib/actions/bai-viet";

/**
 * Cụm nút duyệt bài viết do người dùng gửi (trạng thái chờ duyệt):
 * Duyệt để xuất bản ngay, hoặc Từ chối kèm lý do bắt buộc.
 */
export function DuyetBaiVietNut({ baiVietId, tieuDe }: { baiVietId: string; tieuDe: string }) {
  const router = useRouter();
  const [dangDuyet, setDangDuyet] = useState(false);
  const [moTuChoi, setMoTuChoi] = useState(false);
  const [lyDo, setLyDo] = useState("");
  const [dangTuChoi, setDangTuChoi] = useState(false);

  const xuLyDuyet = async () => {
    setDangDuyet(true);
    try {
      const res = await duyetBaiViet(baiVietId);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success("Đã duyệt và xuất bản bài viết");
      router.refresh();
    } catch {
      toast.error("Không duyệt được bài viết, vui lòng thử lại");
    } finally {
      setDangDuyet(false);
    }
  };

  const xuLyTuChoi = async () => {
    if (lyDo.trim().length < 5) {
      toast.error("Vui lòng nhập lý do từ chối (ít nhất 5 ký tự)");
      return;
    }
    setDangTuChoi(true);
    try {
      const res = await tuChoiBaiViet({ id: baiVietId, ly_do: lyDo.trim() });
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success("Đã từ chối bài viết và gửi lý do cho tác giả");
      setMoTuChoi(false);
      router.refresh();
    } catch {
      toast.error("Không từ chối được bài viết, vui lòng thử lại");
    } finally {
      setDangTuChoi(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600/90"
        onClick={xuLyDuyet}
        disabled={dangDuyet || dangTuChoi}
      >
        {dangDuyet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Duyệt
      </Button>

      <Dialog open={moTuChoi} onOpenChange={setMoTuChoi}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive" className="gap-1" disabled={dangDuyet || dangTuChoi}>
            <X className="h-4 w-4" />
            Từ chối
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối bài viết</DialogTitle>
            <DialogDescription>
              Bài viết <span className="font-semibold text-foreground">{tieuDe}</span> sẽ được trả
              về cho tác giả kèm lý do để họ chỉnh sửa và gửi lại.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ly-do-tu-choi-bai-viet">Lý do từ chối *</Label>
            <Textarea
              id="ly-do-tu-choi-bai-viet"
              rows={3}
              placeholder="Ví dụ: Nội dung còn sơ sài, thiếu các mục chính và ảnh minh họa chưa phù hợp..."
              value={lyDo}
              onChange={(e) => setLyDo(e.target.value)}
              disabled={dangTuChoi}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" disabled={dangTuChoi} onClick={() => setMoTuChoi(false)}>
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={xuLyTuChoi} disabled={dangTuChoi} className="gap-2">
              {dangTuChoi && <Loader2 className="h-4 w-4 animate-spin" />}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

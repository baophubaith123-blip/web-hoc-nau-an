"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duyetBinhLuan } from "@/lib/actions/quan-tri";
import { xoaBinhLuan } from "@/lib/actions/binh-luan";
import { Check, EyeOff, Trash2, Loader2 } from "lucide-react";

interface ThaoTacBinhLuanProps {
  binhLuanId: string;
  daDuyet: boolean;
}

export function ThaoTacBinhLuan({
  binhLuanId,
  daDuyet,
}: ThaoTacBinhLuanProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDuyetAn = async (moiDuyet: boolean) => {
    setDangXuLy(true);
    try {
      const res = await duyetBinhLuan(binhLuanId, moiDuyet);
      if (res.thanh_cong) {
        toast.success(moiDuyet ? "Đã hiển thị bình luận!" : "Đã ẩn bình luận!");
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

  const xuLyXoa = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    setDangXuLy(true);
    try {
      const res = await xoaBinhLuan(binhLuanId);
      if (res.thanh_cong) {
        toast.success("Đã xóa bình luận thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa bình luận");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant={daDuyet ? "outline" : "default"}
        disabled={dangXuLy}
        onClick={() => xuLyDuyetAn(!daDuyet)}
        className="h-8 gap-1"
      >
        {dangXuLy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : daDuyet ? (
          <>
            <EyeOff className="w-3.5 h-3.5" /> Ẩn
          </>
        ) : (
          <>
            <Check className="w-3.5 h-3.5" /> Duyệt
          </>
        )}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        disabled={dangXuLy}
        onClick={xuLyXoa}
        className="h-8 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

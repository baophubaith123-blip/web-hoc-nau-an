"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { xoaDanhGia } from "@/lib/actions/binh-luan";
import { Trash2, Loader2 } from "lucide-react";

export function XoaDanhGiaNut({ danhGiaId }: { danhGiaId: string }) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyXoa = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    setDangXuLy(true);
    try {
      const res = await xoaDanhGia(danhGiaId);
      if (res.thanh_cong) {
        toast.success("Đã xóa đánh giá thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa đánh giá");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={dangXuLy}
      onClick={xuLyXoa}
      className="h-8 text-destructive hover:bg-destructive/10"
    >
      {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </Button>
  );
}

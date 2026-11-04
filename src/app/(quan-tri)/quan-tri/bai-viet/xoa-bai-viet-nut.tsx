"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { xoaBaiViet } from "@/lib/actions/bai-viet";
import { Trash2, Loader2 } from "lucide-react";

export function XoaBaiVietNut({ baiVietId }: { baiVietId: string }) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyXoa = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    setDangXuLy(true);
    try {
      const res = await xoaBaiViet(baiVietId);
      if (res.thanh_cong) {
        toast.success("Đã xóa bài viết thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa bài viết");
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

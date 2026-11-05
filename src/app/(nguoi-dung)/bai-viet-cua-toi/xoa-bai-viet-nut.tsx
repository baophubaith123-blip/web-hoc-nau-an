"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { xoaBaiVietCuaToi } from "@/lib/actions/bai-viet";

/** Nút xóa bài viết của chính mình (chỉ dùng cho bản nháp / bài bị từ chối). */
export function XoaBaiVietCuaToiNut({ baiVietId, tieuDe }: { baiVietId: string; tieuDe: string }) {
  const router = useRouter();
  const [mo, setMo] = useState(false);
  const [dangXoa, setDangXoa] = useState(false);

  const xuLyXoa = async () => {
    setDangXoa(true);
    try {
      const res = await xoaBaiVietCuaToi(baiVietId);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success("Đã xóa bài viết");
      setMo(false);
      router.refresh();
    } catch {
      toast.error("Không xóa được bài viết, vui lòng thử lại");
    } finally {
      setDangXoa(false);
    }
  };

  return (
    <Dialog open={mo} onOpenChange={setMo}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          Xóa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa bài viết này?</DialogTitle>
          <DialogDescription>
            Bài viết <span className="font-semibold text-foreground">{tieuDe}</span> sẽ bị xóa vĩnh
            viễn và không khôi phục được.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={dangXoa} onClick={() => setMo(false)}>
            Hủy bỏ
          </Button>
          <Button variant="destructive" onClick={xuLyXoa} disabled={dangXoa} className="gap-2">
            {dangXoa && <Loader2 className="h-4 w-4 animate-spin" />}
            Xóa bài viết
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

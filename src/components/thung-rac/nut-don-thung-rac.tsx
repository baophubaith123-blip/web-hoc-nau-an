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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eraser, Loader2 } from "lucide-react";
import { donThungRac } from "@/lib/actions/thung-rac";

/** Nút "Dọn thùng rác" của Admin: xóa vĩnh viễn mọi mục đã quá 30 ngày ở cả 3 loại nội dung. */
export function NutDonThungRac() {
  const router = useRouter();
  const [mo, setMo] = useState(false);
  const [dangDon, setDangDon] = useState(false);

  const xuLyDon = async () => {
    setDangDon(true);
    try {
      const res = await donThungRac();
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      const d = res.du_lieu;
      const tong = (d?.cong_thuc ?? 0) + (d?.khoa_hoc ?? 0) + (d?.bai_viet ?? 0);
      toast.success(
        tong > 0
          ? `Đã dọn ${tong} mục quá 30 ngày (công thức: ${d?.cong_thuc ?? 0}, khóa học: ${d?.khoa_hoc ?? 0}, bài viết: ${d?.bai_viet ?? 0})`
          : "Thùng rác chưa có mục nào quá 30 ngày"
      );
      setMo(false);
      router.refresh();
    } catch {
      toast.error("Không dọn được thùng rác, vui lòng thử lại");
    } finally {
      setDangDon(false);
    }
  };

  return (
    <Dialog open={mo} onOpenChange={setMo}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-1.5">
          <Eraser className="h-4 w-4" />
          Dọn thùng rác
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dọn thùng rác?</DialogTitle>
          <DialogDescription>
            Mọi mục (công thức, khóa học, bài viết) đã nằm trong thùng rác{" "}
            <strong>quá 30 ngày</strong> sẽ bị <strong>xóa vĩnh viễn</strong> và không khôi phục
            được. Các mục chưa quá 30 ngày không bị ảnh hưởng.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={dangDon} onClick={() => setMo(false)}>
            Hủy bỏ
          </Button>
          <Button variant="destructive" onClick={xuLyDon} disabled={dangDon} className="gap-2">
            {dangDon && <Loader2 className="h-4 w-4 animate-spin" />}
            Dọn thùng rác
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

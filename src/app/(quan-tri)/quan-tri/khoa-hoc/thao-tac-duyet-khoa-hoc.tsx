"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { duyetKhoaHoc } from "@/lib/actions/quan-tri";
import { Check, X, Loader2 } from "lucide-react";

interface ThaoTacDuyetKhoaHocProps {
  khoaHocId: string;
  trangThai: string;
}

export function ThaoTacDuyetKhoaHoc({
  khoaHocId,
  trangThai,
}: ThaoTacDuyetKhoaHocProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDuyet = async (duyet: boolean) => {
    setDangXuLy(true);
    try {
      const res = await duyetKhoaHoc(khoaHocId, duyet);
      if (res.thanh_cong) {
        toast.success(
          duyet
            ? "Đã phê duyệt và xuất bản khóa học!"
            : "Đã từ chối khóa học và hoàn trả về bản nháp cho đầu bếp!"
        );
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi phê duyệt khóa học");
    } finally {
      setDangXuLy(false);
    }
  };

  if (trangThai !== "cho_duyet") return null;

  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="default"
        disabled={dangXuLy}
        onClick={() => xuLyDuyet(true)}
        className="gap-1 bg-emerald-600 hover:bg-emerald-700 h-8"
      >
        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        Duyệt
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={dangXuLy}
        onClick={() => xuLyDuyet(false)}
        className="gap-1 h-8 text-destructive hover:bg-destructive/10"
      >
        <X className="w-3.5 h-3.5" />
        Trả về nháp
      </Button>
    </div>
  );
}

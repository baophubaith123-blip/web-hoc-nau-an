"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { hoanTien } from "@/lib/actions/quan-tri";
import { RotateCcw, Loader2 } from "lucide-react";

interface ThaoTacHoanTienProps {
  thanhToanId: string;
  trangThai: string;
}

export function ThaoTacHoanTien({ thanhToanId, trangThai }: ThaoTacHoanTienProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyHoanTien = async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn ghi nhận hoàn tiền cho giao dịch này? Quyền truy cập khóa học và chứng chỉ của học viên sẽ bị thu hồi tự động."
      )
    )
      return;

    setDangXuLy(true);
    try {
      const res = await hoanTien({ thanh_toan_id: thanhToanId });
      if (res.thanh_cong) {
        toast.success("Đã ghi nhận hoàn tiền và thu hồi quyền học thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi thực hiện hoàn tiền");
    } finally {
      setDangXuLy(false);
    }
  };

  if (trangThai !== "thanh_cong") return null;

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={dangXuLy}
      onClick={xuLyHoanTien}
      className="h-8 gap-1.5 text-destructive hover:bg-destructive/10"
    >
      {dangXuLy ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <RotateCcw className="w-3.5 h-3.5" />
      )}
      Hoàn tiền
    </Button>
  );
}

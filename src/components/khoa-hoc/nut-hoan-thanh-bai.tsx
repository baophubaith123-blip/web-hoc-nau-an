"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hoanThanhBai, capChungChi } from "@/lib/actions/bai-hoc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NutHoanThanhBaiProps {
  baiHocId: string;
  khoaHocId: string;
  daHoanThanhBanDau: boolean;
  coChungChi?: boolean;
}

export function NutHoanThanhBai({
  baiHocId,
  khoaHocId,
  daHoanThanhBanDau,
  coChungChi = false,
}: NutHoanThanhBaiProps) {
  const router = useRouter();
  const [daHoanThanh, setDaHoanThanh] = useState(daHoanThanhBanDau);
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDoiTrangThai = async () => {
    setDangXuLy(true);
    const trangThaiMoi = !daHoanThanh;
    setDaHoanThanh(trangThaiMoi);

    try {
      const res = await hoanThanhBai(baiHocId, trangThaiMoi);
      if (res.thanh_cong) {
        toast.success(
          trangThaiMoi
            ? "Đã đánh dấu hoàn thành bài học!"
            : "Đã hủy đánh dấu hoàn thành"
        );

        // Nếu hoàn thành 100% và khóa có chứng chỉ, kiểm tra cấp chứng chỉ tự động
        if (trangThaiMoi && coChungChi) {
          const resCc = await capChungChi(khoaHocId);
          if (resCc.thanh_cong) {
            toast.success("Chúc mừng! Bạn đã hoàn thành khóa học và được cấp chứng chỉ!");
          }
        }

        router.refresh();
      } else {
        setDaHoanThanh(daHoanThanhBanDau);
        toast.error(res.loi);
      }
    } catch {
      setDaHoanThanh(daHoanThanhBanDau);
      toast.error("Không thể cập nhật tiến độ");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Button
      variant={daHoanThanh ? "outline" : "default"}
      onClick={xuLyDoiTrangThai}
      disabled={dangXuLy}
      className={`gap-2 font-medium ${
        daHoanThanh
          ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
          : ""
      }`}
    >
      {dangXuLy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : daHoanThanh ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      <span>{daHoanThanh ? "Đã hoàn thành bài học" : "Đánh dấu đã hoàn thành"}</span>
    </Button>
  );
}

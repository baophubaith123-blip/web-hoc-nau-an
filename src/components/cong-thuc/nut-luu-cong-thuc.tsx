"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { luuHoacBoLuu } from "@/lib/actions/cong-thuc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NutLuuCongThucProps {
  congThucId: string;
  daLuuBanDau: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

export function NutLuuCongThuc({
  congThucId,
  daLuuBanDau,
  className,
  variant = "outline",
}: NutLuuCongThucProps) {
  const router = useRouter();
  const [daLuu, setDaLuu] = useState(daLuuBanDau);
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyLuu = async () => {
    setDangXuLy(true);
    // Optimistic UI update
    setDaLuu((prev) => !prev);

    try {
      const res = await luuHoacBoLuu(congThucId);
      if (res.thanh_cong) {
        setDaLuu(res.du_lieu.da_luu);
        toast.success(
          res.du_lieu.da_luu
            ? "Đã lưu công thức vào bộ sưu tập"
            : "Đã bỏ lưu công thức"
        );
      } else {
        // Revert if error
        setDaLuu(daLuuBanDau);
        if (res.loi.includes("đăng nhập") || res.loi.includes("quyền")) {
          toast.error("Vui lòng đăng nhập để lưu công thức");
          router.push(`/dang-nhap?next=/cong-thuc`);
        } else {
          toast.error(res.loi);
        }
      }
    } catch {
      setDaLuu(daLuuBanDau);
      toast.error("Không thể lưu công thức, vui lòng thử lại");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={xuLyLuu}
      disabled={dangXuLy}
      className={`gap-1.5 ${daLuu ? "text-primary border-primary/50 bg-primary/5" : ""} ${className || ""}`}
    >
      <Bookmark className={`h-4 w-4 ${daLuu ? "fill-primary" : ""}`} />
      <span>{daLuu ? "Đã lưu" : "Lưu công thức"}</span>
    </Button>
  );
}

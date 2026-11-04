"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { huyYeuCauNangCapAction } from "@/lib/actions/goi";
import { toast } from "sonner";

export function NutHuyYeuCau({ yeuCauId }: { yeuCauId: string }) {
  const router = useRouter();
  const [dangHuy, setDangHuy] = useState(false);

  const handleHuy = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy yêu cầu nâng cấp này không?")) {
      return;
    }

    setDangHuy(true);
    try {
      const res = await huyYeuCauNangCapAction({ yeu_cau_id: yeuCauId });
      if (!res.thanh_cong) {
        toast.error(res.loi || "Không thể hủy yêu cầu.");
        setDangHuy(false);
        return;
      }

      toast.info("Đã hủy yêu cầu nâng cấp thành công.");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xử lý hủy yêu cầu.");
      setDangHuy(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleHuy}
      disabled={dangHuy}
      className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 gap-1.5 h-8 shrink-0"
    >
      {dangHuy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
      <span>Hủy yêu cầu</span>
    </Button>
  );
}

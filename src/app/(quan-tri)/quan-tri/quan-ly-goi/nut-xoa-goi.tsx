"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { xoaGoiAction } from "@/lib/actions/quan-tri-goi";
import { toast } from "sonner";

export function NutXoaGoi({ id, ten }: { id: string; ten: string }) {
  const router = useRouter();
  const [dangXoa, setDangXoa] = useState(false);

  const handleXoa = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hoặc ngừng bán gói "${ten}" không?`)) {
      return;
    }

    setDangXoa(true);
    try {
      const res = await xoaGoiAction(id);
      if (!res.thanh_cong) {
        toast.error(res.loi || "Xóa gói thất bại.");
        setDangXoa(false);
        return;
      }

      toast.success(`Đã xử lý gói "${ten}".`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Lỗi xử lý xóa gói.");
      setDangXoa(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleXoa}
      disabled={dangXoa}
      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
    >
      {dangXoa ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      <span>Xóa</span>
    </Button>
  );
}

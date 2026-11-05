"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Form the thanh toan mo phong: thong tin the chi de trang tri (disabled),
// hai nut bam quyet dinh ket qua giao dich — xu ly that nam o API demo.
export function FormThanhToanDemo({ thamSo }: { thamSo: Record<string, string> }) {
  const [dangXuLy, setDangXuLy] = useState<"thanh_cong" | "huy" | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  async function xuLy(ketQua: "thanh_cong" | "huy") {
    setDangXuLy(ketQua);
    setLoi(null);
    try {
      const res = await fetch("/api/thanh-toan/demo/xu-ly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thamSo, ketQua }),
      });
      const data = (await res.json()) as { url?: string; loi?: string };
      if (!res.ok || !data.url) {
        setLoi(data.loi || "Không xử lý được giao dịch. Vui lòng thử lại.");
        setDangXuLy(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setLoi("Mất kết nối tới cổng thanh toán. Vui lòng thử lại.");
      setDangXuLy(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="h-5 w-5" />
          Thẻ ATM nội địa — Ngân hàng NCB
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Số thẻ</Label>
          <Input value="9704 0000 0000 0018" disabled readOnly />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Tên chủ thẻ</Label>
            <Input value="NGUYEN VAN A" disabled readOnly />
          </div>
          <div className="space-y-2">
            <Label>Ngày phát hành</Label>
            <Input value="07/15" disabled readOnly />
          </div>
        </div>

        {loi && <p className="text-sm font-medium text-destructive">{loi}</p>}

        <div className="flex flex-col gap-2 pt-1">
          <Button
            size="lg"
            className="w-full bg-[#1a3f7c] text-white hover:bg-[#16355f]"
            disabled={dangXuLy !== null}
            onClick={() => xuLy("thanh_cong")}
          >
            {dangXuLy === "thanh_cong" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Thanh toán thành công
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            disabled={dangXuLy !== null}
            onClick={() => xuLy("huy")}
          >
            {dangXuLy === "huy" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hủy thanh toán
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Ở môi trường demo, hai nút trên đóng vai trò kết quả giao dịch tại ngân hàng.
        </p>
      </CardContent>
    </Card>
  );
}

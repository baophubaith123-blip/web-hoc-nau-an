"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, CreditCard, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGiaVND } from "@/lib/utils/goi";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

interface GoiItem {
  id: string;
  ma_goi: string;
  ten: string;
  mo_ta: string | null;
  thoi_han_ngay: number;
  gia: number;
  quyen_loi?: string[] | null;
  thu_tu: number;
  hoat_dong: boolean;
}

interface FormMuaGoiProps {
  danhSachGoi: GoiItem[];
  goiMacDinhId?: string;
  daDangNhap: boolean;
  laPro?: boolean;
  ngayHetHanHienTai?: string | null;
}

export function FormMuaGoi({
  danhSachGoi,
  goiMacDinhId,
  daDangNhap,
  laPro = false,
  ngayHetHanHienTai,
}: FormMuaGoiProps) {
  const router = useRouter();

  // Chọn mặc định gói năm nếu có, hoặc gói được chỉ định
  const goiUuTien =
    danhSachGoi.find((g) => g.id === goiMacDinhId) ||
    danhSachGoi.find((g) => g.ma_goi === "pro_nam") ||
    danhSachGoi[0];

  const [goiDuocChon, setGoiDuocChon] = useState<string>(goiUuTien?.id || "");
  const [dangXuLy, setDangXuLy] = useState<boolean>(false);

  const goiHienTai = danhSachGoi.find((g) => g.id === goiDuocChon);

  const handleThanhToan = async () => {
    if (!daDangNhap) {
      toast.info("Vui lòng đăng nhập để nâng cấp tài khoản!");
      router.push(`/dang-nhap?tiep_tuc=/nang-cap-pro`);
      return;
    }

    if (!goiHienTai) {
      toast.error("Vui lòng chọn gói dịch vụ!");
      return;
    }

    setDangXuLy(true);
    try {
      const res = await fetch("/api/thanh-toan/vnpay/tao-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goiId: goiHienTai.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo liên kết thanh toán VNPay");
      }

      if (data.url) {
        toast.success("Đang chuyển hướng đến cổng thanh toán VNPay...");
        window.location.href = data.url;
      } else {
        throw new Error("Không nhận được URL thanh toán từ hệ thống.");
      }
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Đã xảy ra lỗi khi khởi tạo thanh toán.");
      setDangXuLy(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Thông báo nếu user đã có Pro */}
      {laPro && (
        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Bạn hiện đang là thành viên PRO!</p>
            <p className="mt-0.5 text-muted-foreground">
              {ngayHetHanHienTai
                ? `Thời hạn hiện tại đến ngày ${new Date(ngayHetHanHienTai).toLocaleDateString("vi-VN")}. Mua thêm gói sẽ được cộng dồn tiếp thời hạn sử dụng.`
                : "Tài khoản của bạn đang có hiệu lực gói Pro."}
            </p>
          </div>
        </div>
      )}

      {/* Grid lựa chọn các gói */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {danhSachGoi.map((goi) => {
          const laNam = goi.thoi_han_ngay >= 365 || goi.ma_goi === "pro_nam";
          const duocChon = goi.id === goiDuocChon;

          return (
            <div
              key={goi.id}
              onClick={() => setGoiDuocChon(goi.id)}
              className={cn(
                "relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 flex flex-col justify-between",
                duocChon
                  ? "border-amber-500 bg-amber-500/[0.04] shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30"
                  : "border-border/70 hover:border-amber-400/50 bg-card hover:bg-muted/10",
                laNam && "md:scale-[1.02]"
              )}
            >
              {laNam && (
                <div className="absolute -top-3.5 right-6">
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold px-3 py-1 shadow-sm gap-1 border-0">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    TIẾT KIỆM 33%
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        duocChon
                          ? "border-amber-500 bg-amber-500"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {duocChon && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                    <h3 className="text-xl font-bold">{goi.ten}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {goi.thoi_han_ngay >= 365 ? "365 ngày" : "30 ngày"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-2 min-h-[36px]">
                  {goi.mo_ta || "Trải nghiệm đầy đủ tính năng cao cấp không giới hạn."}
                </p>

                <div className="mt-4 pb-4 border-b border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {formatGiaVND(goi.gia)}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      /{laNam ? "năm" : "tháng"}
                    </span>
                  </div>
                  {laNam && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                      Chỉ tương đương {formatGiaVND(Math.round(goi.gia / 12))}/tháng
                    </p>
                  )}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-foreground/90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Xem video chất lượng Full HD 1080p</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tải cẩm nang & công thức chuẩn PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Làm bài tập & nhận chứng chỉ chính thức</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Quyền đăng tải công thức lên trang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Huy hiệu Pro vương miện vàng uy tín</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-2">
                <Button
                  type="button"
                  variant={duocChon ? "default" : "outline"}
                  className={cn(
                    "w-full font-bold",
                    duocChon &&
                      "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-600 hover:to-yellow-600 shadow-sm"
                  )}
                >
                  {duocChon ? "Đang chọn gói này" : "Chọn gói"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tóm tắt thanh toán & CTA */}
      {goiHienTai && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div>
              <p className="text-sm text-muted-foreground">Gói đã chọn:</p>
              <h4 className="text-lg font-bold text-foreground">
                {goiHienTai.ten} ({goiHienTai.thoi_han_ngay} ngày)
              </h4>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Tổng thanh toán:</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatGiaVND(goiHienTai.gia)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Thanh toán bảo mật qua cổng VNPay với thẻ ATM, Visa, QR Code ngân hàng.</span>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleThanhToan}
              disabled={dangXuLy}
              className="w-full sm:w-auto px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold hover:from-amber-600 hover:to-yellow-600 shadow-md transition-all gap-2"
            >
              {dangXuLy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý kết nối...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Thanh toán qua VNPay</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGiaVND, QUYEN_LOI_PRO } from "@/lib/utils/goi";
import { cn } from "@/lib/utils/cn";

export interface GoiProps {
  id: string;
  ma_goi: string;
  ten: string;
  mo_ta: string | null;
  thoi_han_ngay: number;
  gia: number;
  quyen_loi?: string[] | null;
  noi_bat?: boolean;
  daChon?: boolean;
  onChon?: (id: string) => void;
  ctaText?: string;
  ctaHref?: string;
}

export function TheGoi({
  id,
  ma_goi,
  ten,
  mo_ta,
  thoi_han_ngay,
  gia,
  quyen_loi = [],
  noi_bat = false,
  daChon = false,
  onChon,
  ctaText = "Chọn gói",
  ctaHref,
}: GoiProps) {
  const laNam = thoi_han_ngay >= 365 || ma_goi === "pro_nam";
  const giaMoiThang = laNam ? Math.round(gia / 12) : gia;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 transition-all duration-300",
        noi_bat
          ? "border-2 border-amber-500 bg-gradient-to-b from-amber-500/[0.07] via-background to-background shadow-xl shadow-amber-500/10 scale-[1.02]"
          : "border border-border/80 bg-card hover:border-amber-400/50 shadow-sm",
        daChon && "ring-2 ring-amber-500 ring-offset-2"
      )}
    >
      {/* Badge nổi bật */}
      {noi_bat && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold px-3 py-1 shadow-sm gap-1 border-0">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            TIẾT KIỆM 33% • KHUYÊN DÙNG
          </Badge>
        </div>
      )}

      {/* Header gói */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Crown
              className={cn(
                "w-5 h-5",
                noi_bat ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
              )}
            />
            {ten}
          </h3>
          <Badge variant={noi_bat ? "secondary" : "outline"} className="text-xs font-medium">
            {thoi_han_ngay >= 365 ? "12 tháng" : "30 ngày"}
          </Badge>
        </div>
        {mo_ta && <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{mo_ta}</p>}
      </div>

      {/* Giá */}
      <div className="my-4 pb-4 border-b border-border/60">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {formatGiaVND(gia)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            /{thoi_han_ngay >= 365 ? "năm" : "tháng"}
          </span>
        </div>
        {laNam && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
            Chỉ khoảng {formatGiaVND(giaMoiThang)}/tháng (tiết kiệm đáng kể)
          </p>
        )}
      </div>

      {/* Danh sách quyền lợi */}
      <div className="flex-1 space-y-3 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Đặc quyền bao gồm:
        </p>
        <ul className="space-y-2.5 text-sm">
          {(quyen_loi && quyen_loi.length > 0
            ? quyen_loi
            : [
                "Xem video Full HD 1080p sắc nét",
                "Tải trọn bộ tài liệu công thức PDF",
                "Làm bài tập trắc nghiệm có chấm điểm",
                "Nhận chứng chỉ tốt nghiệp chính thức",
                "Quyền đăng tải công thức chia sẻ cộng đồng",
                "Huy hiệu Pro vương miện vàng uy tín",
                "Học tập 100% không quảng cáo phiền toái",
              ]
          ).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
              <div className="rounded-full p-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="leading-snug">
                {/* Dịch mã quyền lợi (vd: xem_video_hd) sang tên tiếng Việt nếu khớp danh mục chuẩn */}
                {QUYEN_LOI_PRO.find((q) => q.id === item)?.ten ?? item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="mt-auto pt-2">
        {onChon ? (
          <Button
            type="button"
            onClick={() => onChon(id)}
            className={cn(
              "w-full font-bold transition-all",
              noi_bat
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-600 hover:to-yellow-600 shadow-sm"
                : ""
            )}
            variant={noi_bat ? "default" : "outline"}
          >
            {ctaText}
          </Button>
        ) : ctaHref ? (
          <Button
            asChild
            className={cn(
              "w-full font-bold transition-all",
              noi_bat
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-600 hover:to-yellow-600 shadow-sm"
                : ""
            )}
            variant={noi_bat ? "default" : "outline"}
          >
            <Link href={ctaHref}>{ctaText}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

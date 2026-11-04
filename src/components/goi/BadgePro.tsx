import React from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BadgeProProps {
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function BadgePro({ size = "sm", showText = true, className }: BadgeProProps) {
  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-[10px] gap-1",
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-3 py-1.5 text-sm gap-2 font-bold",
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold shadow-sm border border-amber-300/40 select-none",
        sizeClasses[size],
        className
      )}
      title="Thành viên Pro"
    >
      <Crown
        size={iconSizes[size]}
        className="fill-slate-950 text-slate-950 shrink-0 drop-shadow-sm"
      />
      {showText && <span>PRO</span>}
    </span>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface NutNangCapProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary";
  text?: string;
}

export function NutNangCap({
  className,
  size = "default",
  text = "Nâng cấp Pro",
}: NutNangCapProps) {
  return (
    <Button
      asChild
      size={size}
      className={cn(
        "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold hover:from-amber-600 hover:to-yellow-600 shadow-sm transition-all duration-300 hover:shadow-amber-500/25 hover:shadow-md border border-amber-300/40",
        className
      )}
    >
      <Link href="/nang-cap-pro" className="inline-flex items-center gap-2">
        <Crown className="w-4 h-4 fill-slate-950 shrink-0 animate-pulse" />
        <span>{text}</span>
      </Link>
    </Button>
  );
}

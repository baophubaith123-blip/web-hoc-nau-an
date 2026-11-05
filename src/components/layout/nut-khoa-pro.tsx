"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

/**
 * Hộp thoại thông báo tính năng bị khóa theo gói Pro.
 * Dùng cho tài khoản thường bấm vào chức năng chỉ dành cho thành viên Pro.
 */
export function HopThoaiNangCapPro({
  mo,
  onMoChange,
  tinhNang,
}: {
  mo: boolean;
  onMoChange: (mo: boolean) => void;
  tinhNang: string;
}) {
  return (
    <Dialog open={mo} onOpenChange={onMoChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15">
            <Crown className="h-7 w-7 fill-amber-500 text-amber-500" />
          </span>
          <DialogTitle>Tính năng dành cho thành viên Pro</DialogTitle>
          <DialogDescription className="text-center">
            <span className="font-semibold text-foreground">{tinhNang}</span> là đặc quyền của
            thành viên Pro. Nâng cấp tài khoản để tự đăng công thức và bài viết của bạn, chờ quản
            trị viên duyệt rồi chia sẻ với cộng đồng Học Nấu Ăn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onMoChange(false)}>
            Để sau
          </Button>
          <Button asChild className="gap-2">
            <Link href="/bang-gia" onClick={() => onMoChange(false)}>
              <Crown className="h-4 w-4" />
              Nâng cấp Pro ngay
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Nút hiển thị ở trạng thái bị khóa (mờ + biểu tượng khóa) cho tài khoản thường.
 * Bấm vào sẽ mở hộp thoại thông báo nâng cấp Pro thay vì điều hướng.
 */
export function NutKhoaPro({
  tinhNang,
  className,
  children,
}: {
  tinhNang: string;
  className?: string;
  children: ReactNode;
}) {
  const [mo, setMo] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setMo(true)}
        aria-disabled="true"
        title="Chỉ dành cho thành viên Pro"
        className={cn("relative cursor-not-allowed opacity-60 saturate-50", className)}
      >
        {children}
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/80 text-background shadow">
          <Lock className="h-3.5 w-3.5" />
        </span>
      </button>
      <HopThoaiNangCapPro mo={mo} onMoChange={setMo} tinhNang={tinhNang} />
    </>
  );
}

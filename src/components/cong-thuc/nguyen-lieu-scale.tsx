"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NguyenLieu } from "@/types";

interface NguyenLieuScaleProps {
  nguyenLieuGoc: NguyenLieu[];
  khauPhanGoc: number;
}

export function NguyenLieuScale({
  nguyenLieuGoc,
  khauPhanGoc = 2,
}: NguyenLieuScaleProps) {
  const [khauPhan, setKhauPhan] = useState(khauPhanGoc > 0 ? khauPhanGoc : 2);
  const tiLe = khauPhan / (khauPhanGoc > 0 ? khauPhanGoc : 2);

  const tangKhauPhan = () => setKhauPhan((prev) => Math.min(prev + 1, 50));
  const giamKhauPhan = () => setKhauPhan((prev) => Math.max(prev - 1, 1));

  const dinhDangSoLuong = (so: number): string => {
    const tinhToan = Math.round(so * tiLe * 10) / 10;
    return tinhToan.toString().replace(".", ",");
  };

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>Nguyên liệu</span>
        </h3>

        <div className="flex items-center gap-2 bg-muted/60 rounded-lg p-1">
          <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{khauPhan} người</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md"
            onClick={giamKhauPhan}
            disabled={khauPhan <= 1}
            aria-label="Giảm khẩu phần"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md"
            onClick={tangKhauPhan}
            disabled={khauPhan >= 50}
            aria-label="Tăng khẩu phần"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {nguyenLieuGoc && nguyenLieuGoc.length > 0 ? (
        <ul className="divide-y divide-border/60">
          {nguyenLieuGoc.map((nl, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between py-2.5 text-sm hover:bg-muted/30 px-2 rounded-md transition-colors"
            >
              <span className="font-medium text-foreground">{nl.ten}</span>
              <span className="text-muted-foreground font-mono">
                {dinhDangSoLuong(nl.so_luong)} {nl.don_vi}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Chưa cập nhật nguyên liệu cho món này
        </p>
      )}
    </div>
  );
}

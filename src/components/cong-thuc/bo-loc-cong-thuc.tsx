"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Bang } from "@/types";

interface BoLocCongThucProps {
  danhMucList: Bang<"danh_muc">[];
}

export function BoLocCongThuc({ danhMucList }: BoLocCongThucProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tuKhoa = searchParams.get("tu_khoa") || "";
  const danhMuc = searchParams.get("danh_muc") || "tat_ca";
  const doKho = searchParams.get("do_kho") || "tat_ca";
  const sapXep = searchParams.get("sap_xep") || "moi_nhat";

  // Ô tìm kiếm giữ chữ tại chỗ, chỉ cập nhật URL sau khi ngừng gõ 400ms (tránh chuyển trang từng ký tự)
  const [tuKhoaNhap, setTuKhoaNhap] = useState(tuKhoa);
  useEffect(() => {
    setTuKhoaNhap(tuKhoa);
  }, [tuKhoa]);
  useEffect(() => {
    if (tuKhoaNhap === tuKhoa) return;
    const henGio = setTimeout(() => capNhatThamSo("tu_khoa", tuKhoaNhap), 400);
    return () => clearTimeout(henGio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuKhoaNhap]);

  // Bảng nhãn hiển thị cho Select (Base UI mặc định hiện giá trị thô như "tat_ca")
  const nhanDanhMuc: Record<string, string> = {
    tat_ca: "Tất cả danh mục",
    ...Object.fromEntries(danhMucList.map((dm) => [dm.slug, dm.ten])),
  };
  const nhanDoKho: Record<string, string> = {
    tat_ca: "Mọi độ khó",
    de: "Dễ làm",
    trung_binh: "Trung bình",
    kho: "Kỳ công / Khó",
  };
  const nhanSapXep: Record<string, string> = {
    moi_nhat: "Mới nhất",
    xem_nhieu: "Xem nhiều nhất",
    thoi_gian_ngan: "Nấu nhanh nhất",
  };

  const capNhatThamSo = (khoa: string, giaTri: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (giaTri && giaTri !== "tat_ca") {
      params.set(khoa, giaTri);
    } else {
      params.delete(khoa);
    }
    params.delete("trang"); // Reset về trang 1 khi lọc
    router.push(`${pathname}?${params.toString()}`);
  };

  const xoaTatCaLoc = () => {
    router.push(pathname);
  };

  const coBoLoc = tuKhoa || (danhMuc && danhMuc !== "tat_ca") || (doKho && doKho !== "tat_ca");

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-xs">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={tuKhoaNhap}
            onChange={(e) => setTuKhoaNhap(e.target.value)}
            placeholder="Tìm tên món, nguyên liệu..."
            className="pl-9"
          />
        </div>

        {/* Danh mục */}
        <Select
          value={danhMuc}
          onValueChange={(val) => capNhatThamSo("danh_muc", val ?? "tat_ca")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Danh mục món ăn">
              {(value: string) => nhanDanhMuc[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tat_ca">Tất cả danh mục</SelectItem>
            {danhMucList.map((dm) => (
              <SelectItem key={dm.id} value={dm.slug}>
                {dm.ten}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Độ khó */}
        <Select
          value={doKho}
          onValueChange={(val) => capNhatThamSo("do_kho", val ?? "tat_ca")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Độ khó">
              {(value: string) => nhanDoKho[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tat_ca">Mọi độ khó</SelectItem>
            <SelectItem value="de">Dễ làm</SelectItem>
            <SelectItem value="trung_binh">Trung bình</SelectItem>
            <SelectItem value="kho">Kỳ công / Khó</SelectItem>
          </SelectContent>
        </Select>

        {/* Sắp xếp */}
        <Select
          value={sapXep}
          onValueChange={(val) => capNhatThamSo("sap_xep", val ?? "moi_nhat")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sắp xếp">
              {(value: string) => nhanSapXep[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moi_nhat">Mới nhất</SelectItem>
            <SelectItem value="xem_nhieu">Xem nhiều nhất</SelectItem>
            <SelectItem value="thoi_gian_ngan">Nấu nhanh nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {coBoLoc && (
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>Đang lọc theo tiêu chí</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={xoaTatCaLoc}
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}

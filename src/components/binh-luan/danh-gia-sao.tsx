"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { guiDanhGia } from "@/lib/actions/binh-luan";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DanhGiaSaoProps {
  congThucId: string;
  diemHienTai?: number;
  nhanXetHienTai?: string | null;
  chiDoc?: boolean;
  kichThuoc?: "sm" | "md" | "lg";
}

export function DanhGiaSao({
  congThucId,
  diemHienTai = 0,
  nhanXetHienTai = "",
  chiDoc = false,
  kichThuoc = "md",
}: DanhGiaSaoProps) {
  const router = useRouter();
  const [diem, setDiem] = useState(diemHienTai);
  const [diemHover, setDiemHover] = useState(0);
  const [nhanXet, setNhanXet] = useState(nhanXetHienTai || "");
  const [dangGui, setDangGui] = useState(false);
  const [hienForm, setHienForm] = useState(false);

  const sizeClass =
    kichThuoc === "sm"
      ? "h-3.5 w-3.5"
      : kichThuoc === "lg"
        ? "h-6 w-6"
        : "h-5 w-5";

  if (chiDoc) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${sizeClass} ${
              s <= diem
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  }

  const xuLyGui = async () => {
    if (diem < 1 || diem > 5) {
      toast.error("Vui lòng chọn từ 1 đến 5 sao");
      return;
    }
    setDangGui(true);
    try {
      const res = await guiDanhGia({
        cong_thuc_id: congThucId,
        diem,
        nhan_xet: nhanXet.trim() || undefined,
      });

      if (res.thanh_cong) {
        toast.success("Cảm ơn bạn đã gửi đánh giá!");
        setHienForm(false);
        router.refresh();
      } else {
        if (res.loi.includes("đăng nhập") || res.loi.includes("quyền")) {
          toast.error("Vui lòng đăng nhập để đánh giá");
          router.push("/dang-nhap");
        } else {
          toast.error(res.loi);
        }
      }
    } catch {
      toast.error("Không thể gửi đánh giá, vui lòng thử lại");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Đánh giá món ăn này</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              disabled={dangGui}
              onMouseEnter={() => setDiemHover(s)}
              onMouseLeave={() => setDiemHover(0)}
              onClick={() => {
                setDiem(s);
                setHienForm(true);
              }}
              className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-transform hover:scale-110"
              aria-label={`Đánh giá ${s} sao`}
            >
              <Star
                className={`${sizeClass} ${
                  s <= (diemHover || diem)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {hienForm && (
        <div className="space-y-3 pt-2 border-t">
          <Textarea
            value={nhanXet}
            onChange={(e) => setNhanXet(e.target.value)}
            placeholder="Chia sẻ cảm nhận hoặc lưu ý khi làm món này (tùy chọn)..."
            rows={3}
            disabled={dangGui}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setHienForm(false)}
              disabled={dangGui}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={xuLyGui}
              disabled={dangGui}
            >
              {dangGui ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

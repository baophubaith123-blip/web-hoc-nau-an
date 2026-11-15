"use client";

import { useState } from "react";
import { BookOpen, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dangKyMienPhi } from "@/lib/actions/khoa-hoc";

interface NutMuaKhoaHocProps {
  khoaHocId: string;
  gia: number;
  mienPhi?: boolean;
  daDangKy?: boolean;
}

export function NutMuaKhoaHoc({
  khoaHocId,
  gia,
  mienPhi = false,
  daDangKy = false,
}: NutMuaKhoaHocProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  if (daDangKy) {
    return (
      <Button
        onClick={() => router.push(`/hoc-bai/${khoaHocId}`)}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
      >
        Vào học ngay
      </Button>
    );
  }

  // Khóa MIỄN PHÍ: ghi danh trực tiếp bằng server action dangKyMienPhi.
  // (Trước đây nút này vẫn gọi API tạo URL VNPay — API đó từ chối khóa
  // miễn phí với lỗi 400 nên học viên không bao giờ đăng ký được khóa
  // miễn phí; action dangKyMienPhi đã có sẵn nhưng chưa từng được nối.)
  const xuLyDangKyMienPhi = async () => {
    setDangXuLy(true);
    try {
      const res = await dangKyMienPhi(khoaHocId);
      if (!res.thanh_cong) {
        toast.error(res.loi || "Không đăng ký được khóa học, vui lòng thử lại");
        return;
      }
      toast.success("Đăng ký học thành công! Chúc bạn học vui.");
      router.refresh();
    } catch {
      toast.error("Không đăng ký được khóa học, vui lòng thử lại");
    } finally {
      setDangXuLy(false);
    }
  };

  if (mienPhi) {
    return (
      <Button
        onClick={xuLyDangKyMienPhi}
        disabled={dangXuLy}
        size="lg"
        className="w-full gap-2 font-bold shadow-md"
      >
        {dangXuLy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          <>
            <BookOpen className="h-4 w-4" />
            Đăng ký học miễn phí
          </>
        )}
      </Button>
    );
  }

  const xuLyThanhToan = async () => {
    setDangXuLy(true);
    try {
      const res = await fetch("/api/thanh-toan/vnpay/tao-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ khoaHocId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Vui lòng đăng nhập để mua khóa học");
          router.push(`/dang-nhap?next=/khoa-hoc`);
          return;
        }
        throw new Error(data.loi || "Không thể tạo liên kết thanh toán");
      }

      if (data.url) {
        toast.info("Đang chuyển hướng tới cổng thanh toán VNPay...");
        window.location.href = data.url;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Đã có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Button
      onClick={xuLyThanhToan}
      disabled={dangXuLy}
      size="lg"
      className="w-full gap-2 font-bold shadow-md"
    >
      {dangXuLy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang khởi tạo giao dịch...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          {`Mua khóa học - ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(gia)}`}
        </>
      )}
    </Button>
  );
}

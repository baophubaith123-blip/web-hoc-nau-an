import { FormDangNhap } from "@/components/auth/form-dang-nhap";
import { Suspense } from "react";

export default function TrangDangNhap() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center text-sm">Đang tải...</div>}>
        <FormDangNhap />
      </Suspense>
    </div>
  );
}

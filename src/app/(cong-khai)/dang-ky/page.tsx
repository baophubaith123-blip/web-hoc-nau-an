import { FormDangKy } from "@/components/auth/form-dang-ky";
import { Suspense } from "react";

export default function TrangDangKy() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center text-sm">Đang tải...</div>}>
        <FormDangKy />
      </Suspense>
    </div>
  );
}

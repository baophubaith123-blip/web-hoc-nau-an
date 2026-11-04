import { FormQuenMatKhau } from "@/components/auth/form-quen-mat-khau";
import { Suspense } from "react";

export default function TrangQuenMatKhau() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center text-sm">Đang tải...</div>}>
        <FormQuenMatKhau />
      </Suspense>
    </div>
  );
}

import { FormDatLaiMatKhau } from "@/components/auth/form-dat-lai-mat-khau";
import { Suspense } from "react";

export default function TrangDatLaiMatKhau() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center text-sm">Đang tải...</div>}>
        <FormDatLaiMatKhau />
      </Suspense>
    </div>
  );
}

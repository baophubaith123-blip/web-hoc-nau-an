"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  GraduationCap,
  LifeBuoy,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { dangNhapNhanhDemo } from "@/lib/actions/auth";
import { vi } from "@/lib/i18n/vi";

type NutDemo = {
  khoa: string;
  nhan: string;
  moTa: string;
  icon: LucideIcon;
  lopMau: string;
  testId: string;
};

// DEMO: 4 nút này đăng nhập bằng tài khoản mẫu CÔNG KHAI trong README để bấm
// nhanh vào 4 giao diện khi demo/test. Màu riêng theo từng khu vực (Admin đỏ,
// Học viên teal, Đầu bếp cam, Hỗ trợ xanh dương — không dùng tím). Khi triển
// khai thật cho người dùng thật thì xóa component này và action dangNhapNhanhDemo.
const CAC_NUT_DEMO: NutDemo[] = [
  {
    khoa: "admin",
    nhan: "Admin",
    moTa: "Khu quản trị",
    icon: ShieldCheck,
    lopMau: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600",
    testId: "nut-demo-admin",
  },
  {
    khoa: "hoc_vien",
    nhan: "Học viên",
    moTa: "Học viên Pro",
    icon: GraduationCap,
    lopMau: "bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-600",
    testId: "nut-demo-hoc-vien",
  },
  {
    khoa: "dau_bep",
    nhan: "Đầu bếp",
    moTa: "Khu đầu bếp",
    icon: ChefHat,
    lopMau: "bg-orange-600 hover:bg-orange-700 focus-visible:ring-orange-600",
    testId: "nut-demo-dau-bep",
  },
  {
    khoa: "ho_tro",
    nhan: "Hỗ trợ",
    moTa: "Khu hỗ trợ",
    icon: LifeBuoy,
    lopMau: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600",
    testId: "nut-demo-ho-tro",
  },
];

export function DangNhapNhanhDemo() {
  const router = useRouter();
  const [khoaDangVao, setKhoaDangVao] = useState<string | null>(null);

  const vaoNhanh = async (nut: NutDemo) => {
    setKhoaDangVao(nut.khoa);
    try {
      const res = await dangNhapNhanhDemo(nut.khoa);
      if (res.thanh_cong) {
        toast.success(vi.auth.dang_nhap_thanh_cong);
        router.push(res.du_lieu.chuyen_den);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error(vi.loi.chung);
    } finally {
      setKhoaDangVao(null);
    }
  };

  return (
    <div className="border-t px-6 py-5">
      <p className="text-center text-sm font-semibold">Truy cập nhanh để demo</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Bấm một nút để vào thẳng giao diện tương ứng bằng tài khoản mẫu — tiện
        kiểm tra nhanh khi demo, không cần gõ mật khẩu.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {CAC_NUT_DEMO.map((nut) => {
          const Icon = nut.icon;
          const dangVao = khoaDangVao === nut.khoa;
          return (
            <button
              key={nut.khoa}
              type="button"
              data-testid={nut.testId}
              disabled={khoaDangVao !== null}
              onClick={() => vaoNhanh(nut)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${nut.lopMau}`}
            >
              {dangVao ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
              ) : (
                <Icon className="h-5 w-5 shrink-0" />
              )}
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">
                  {dangVao ? "Đang vào..." : nut.nhan}
                </span>
                <span className="block truncate text-[11px] leading-tight text-white/80">
                  {nut.moTa}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

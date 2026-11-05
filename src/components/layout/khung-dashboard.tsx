import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { ThongBaoProvider } from "@/providers/thong-bao-provider";
import type { NguoiDungHeader } from "./nguoi-dung-header";
import type { MucMenu } from "@/lib/utils/vai-tro";

// Khung chung cho 4 khu vực: người dùng, đầu bếp, quản trị, hỗ trợ
export function KhungDashboard({
  nguoiDung, menu, tieuDe, children,
}: { nguoiDung: NguoiDungHeader; menu: MucMenu[]; tieuDe: string; children: ReactNode }) {
  return (
    <ThongBaoProvider nguoiDungId={nguoiDung.id}>
      <div className="flex min-h-screen flex-col">
        <Header nguoiDung={nguoiDung} menuVaiTro={menu} />
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1">
          <Sidebar menu={menu} tieuDe={tieuDe} nguoiDung={nguoiDung} />
          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ThongBaoProvider>
  );
}
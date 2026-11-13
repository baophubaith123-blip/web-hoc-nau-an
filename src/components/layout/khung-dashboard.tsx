import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { TopbarVaiTro } from "./topbar-vai-tro";
import { ThongBaoProvider } from "@/providers/thong-bao-provider";
import type { NguoiDungHeader } from "./nguoi-dung-header";
import { mauNhanVaiTro, type MucMenu } from "@/lib/utils/vai-tro";

// Khung chung cho 4 khu vực: người dùng, đầu bếp, quản trị, hỗ trợ.
// 3 khu vực vai trò (khuVaiTro = true) dùng TopbarVaiTro riêng, TUYỆT ĐỐI không hiện
// header trang công khai; khu vực thành viên giữ Header công khai như cũ.
export function KhungDashboard({
  nguoiDung, menu, tieuDe, khuVaiTro, children,
}: { nguoiDung: NguoiDungHeader; menu: MucMenu[]; tieuDe: string; khuVaiTro?: boolean; children: ReactNode }) {
  return (
    <ThongBaoProvider nguoiDungId={nguoiDung.id}>
      <div className="flex min-h-screen flex-col">
        {khuVaiTro ? (
          <TopbarVaiTro nguoiDung={nguoiDung} menu={menu} tieuDe={tieuDe} />
        ) : (
          <Header nguoiDung={nguoiDung} menuVaiTro={menu} />
        )}
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1">
          <Sidebar
            menu={menu}
            tieuDe={tieuDe}
            nguoiDung={nguoiDung}
            mauDangChon={khuVaiTro ? mauNhanVaiTro(nguoiDung.vai_tro)?.mucDangChon : undefined}
          />
          <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ThongBaoProvider>
  );
}
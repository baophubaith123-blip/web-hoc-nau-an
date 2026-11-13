import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { taoNguoiDungHeader } from "@/components/layout/nguoi-dung-header";
import { ThongBaoProvider } from "@/providers/thong-bao-provider";
import { layPhienHienTai } from "@/lib/supabase/server";
import { NutNoiCokba } from "@/components/tro-ly/nut-noi-cokba";

export default async function CongKhaiLayout({ children }: { children: React.ReactNode }) {
  const phien = await layPhienHienTai();
  const nguoiDung = phien ? taoNguoiDungHeader(phien) : null;
  return (
    <ThongBaoProvider nguoiDungId={nguoiDung?.id ?? null}>
      <div className="flex min-h-screen flex-col">
        <Header nguoiDung={nguoiDung} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <NutNoiCokba nguoiDungId={nguoiDung?.id ?? null} />
    </ThongBaoProvider>
  );
}
import type { Metadata } from "next";
import { ChefHat } from "lucide-react";
import { PanelCokba } from "@/components/tro-ly/panel-cokba";
import { layPhienHienTai } from "@/lib/supabase/server";
import { vi } from "@/lib/i18n/vi";

export const metadata: Metadata = {
  title: "Cokba — Trợ lý bếp",
  description:
    "Cokba là trợ lý bếp của Học Nấu Ăn: gợi ý món theo nguyên liệu bạn đang có, tra cứu công thức, khóa học, đầu bếp và bài viết ẩm thực.",
};

export default async function TroLyPage() {
  const phien = await layPhienHienTai();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <ChefHat className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {vi.tro_ly.tieu_de}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {vi.tro_ly.mo_ta}
          </p>
        </div>
      </div>
      <div className="h-[70vh] min-h-[540px]">
        <PanelCokba cheDo="trang" nguoiDungId={phien?.user.id ?? null} />
      </div>
    </div>
  );
}

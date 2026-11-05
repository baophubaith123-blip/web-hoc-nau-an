import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Flame, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BadgePro } from "@/components/goi/BadgePro";
import type { Bang } from "@/types";

type CongThucItem = Bang<"cong_thuc"> & {
  tac_gia?: {
    ho_ten: string | null;
    avatar_url: string | null;
  } | null;
  diem_trung_binh?: number;
  so_danh_gia?: number;
};

const DO_KHO_MAP: Record<string, { nhan: string; class: string }> = {
  de: { nhan: "Dễ", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  trung_binh: { nhan: "Trung bình", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  kho: { nhan: "Khó", class: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
};

export function TheCongThuc({ congThuc }: { congThuc: CongThucItem }) {
  const tongThoiGian = (congThuc.thoi_gian_chuan_bi || 0) + (congThuc.thoi_gian_nau || 0);
  const doKhoInfo = DO_KHO_MAP[congThuc.do_kho] || DO_KHO_MAP.de;

  return (
    <Card className="group h-full overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl">
      <Link href={`/cong-thuc/${congThuc.slug}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {congThuc.anh_dai_dien ? (
            <Image
              src={congThuc.anh_dai_dien}
              alt={congThuc.tieu_de}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <ChefHat className="h-12 w-12 stroke-[1.5]" />
            </div>
          )}

          {congThuc.noi_bat && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-primary text-primary-foreground shadow-sm">
                Nổi bật
              </Badge>
            </div>
          )}

          <div className="absolute right-3 top-3">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium backdrop-blur-md ${doKhoInfo.class}`}>
              {doKhoInfo.nhan}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {congThuc.tieu_de}
          </h3>

          {congThuc.mo_ta && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {congThuc.mo_ta}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{tongThoiGian} phút</span>
            </div>

            {congThuc.calories && (
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span>{congThuc.calories} kcal</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>{congThuc.luot_xem || 0}</span>
            </div>
          </div>

          {congThuc.tac_gia && (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground truncate">
                {congThuc.tac_gia.ho_ten || "Đầu bếp"}
              </span>
              {congThuc.tac_gia_la_pro && <BadgePro size="xs" />}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Award, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Bang } from "@/types";

// Chỉ Pick đúng các trường thẻ hiển thị (Đợt 6) — xem the-cong-thuc.tsx.
type KhoaHocItem = Pick<
  Bang<"khoa_hoc">,
  | "id"
  | "slug"
  | "tieu_de"
  | "mo_ta"
  | "anh_dai_dien"
  | "cap_do"
  | "co_chung_chi"
  | "so_bai_hoc"
  | "tong_thoi_gian"
  | "mien_phi"
  | "gia"
> & {
  dau_bep?: {
    ho_ten: string | null;
    avatar_url: string | null;
  } | null;
};

const CAP_DO_MAP: Record<string, { nhan: string; class: string }> = {
  co_ban: { nhan: "Cơ bản", class: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  trung_cap: { nhan: "Trung cấp", class: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  nang_cao: { nhan: "Chuyên nghiệp", class: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
};

export function TheKhoaHoc({ khoaHoc }: { khoaHoc: KhoaHocItem }) {
  const capDoInfo = CAP_DO_MAP[khoaHoc.cap_do] || CAP_DO_MAP.co_ban;

  return (
    <Card className="group h-full overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl">
      <Link href={`/khoa-hoc/${khoaHoc.slug}`} className="block">
        <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
          {khoaHoc.anh_dai_dien ? (
            <Image
              src={khoaHoc.anh_dai_dien}
              alt={khoaHoc.tieu_de}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <ChefHat className="h-12 w-12 stroke-[1.5]" />
            </div>
          )}

          <div className="absolute left-3 top-3">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium backdrop-blur-md ${capDoInfo.class}`}>
              {capDoInfo.nhan}
            </span>
          </div>

          {khoaHoc.co_chung_chi && (
            <div className="absolute right-3 top-3">
              <Badge variant="secondary" className="gap-1 bg-background/80 backdrop-blur-md shadow-xs text-xs">
                <Award className="h-3 w-3 text-amber-500" />
                Chứng chỉ
              </Badge>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {khoaHoc.tieu_de}
          </h3>

          {khoaHoc.mo_ta && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {khoaHoc.mo_ta}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{khoaHoc.so_bai_hoc || 0} bài học</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{khoaHoc.tong_thoi_gian || 0} phút</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-muted-foreground truncate">
              {khoaHoc.dau_bep?.ho_ten ? `Chef ${khoaHoc.dau_bep.ho_ten}` : "Master Chef"}
            </div>

            <div className="text-right">
              {khoaHoc.mien_phi ? (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Miễn phí
                </span>
              ) : (
                <span className="text-sm font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(khoaHoc.gia)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

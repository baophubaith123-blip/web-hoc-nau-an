import Link from "next/link";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Bang } from "@/types";

interface DanhSachBaiHocProps {
  khoaHocId: string;
  baiHocList: (Bang<"bai_hoc"> & { da_hoan_thanh?: boolean })[];
  baiHocHienTaiId?: string;
  daDangKy: boolean;
  baseHocPath?: string;
}

export function DanhSachBaiHoc({
  khoaHocId,
  baiHocList,
  baiHocHienTaiId,
  daDangKy,
  baseHocPath = "/hoc-bai",
}: DanhSachBaiHocProps) {
  return (
    <div className="space-y-1">
      {baiHocList.map((bh, idx) => {
        const duocXem = daDangKy || bh.xem_truoc;
        const dangHoc = bh.id === baiHocHienTaiId;

        const content = (
          <div
            className={`flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
              dangHoc
                ? "bg-primary/10 text-primary font-medium"
                : duocXem
                  ? "hover:bg-muted text-foreground"
                  : "opacity-60 cursor-not-allowed text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              {bh.da_hoan_thanh ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : dangHoc ? (
                <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
              ) : duocXem ? (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">
                {idx + 1}. {bh.tieu_de}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
              {bh.xem_truoc && !daDangKy && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary text-primary">
                  Xem trước
                </Badge>
              )}
              <span>{bh.thoi_gian_phut} phút</span>
            </div>
          </div>
        );

        if (duocXem) {
          return (
            <Link
              key={bh.id}
              href={`${baseHocPath}/${khoaHocId}/${bh.id}`}
              className="block"
            >
              {content}
            </Link>
          );
        }

        return <div key={bh.id}>{content}</div>;
      })}
    </div>
  );
}

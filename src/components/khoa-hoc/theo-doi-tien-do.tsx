import Link from "next/link";
import { Award, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface TheoDoiTienDoProps {
  phanTram: number;
  coChungChi?: boolean;
  maChungChi?: string | null;
  soBaiDaHoc: number;
  tongSoBai: number;
}

export function TheoDoiTienDo({
  phanTram,
  coChungChi = false,
  maChungChi,
  soBaiDaHoc,
  tongSoBai,
}: TheoDoiTienDoProps) {
  const daXong = phanTram >= 100;

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">Tiến độ khóa học</span>
        <span className="font-mono font-medium text-primary">{phanTram}%</span>
      </div>

      <Progress value={phanTram} className="h-2" />

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Đã hoàn thành {soBaiDaHoc}/{tongSoBai} bài
        </span>
        {daXong && (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            Đã hoàn thành khóa học
          </span>
        )}
      </div>

      {coChungChi && daXong && maChungChi && (
        <div className="mt-3 border-t pt-3">
          <Button asChild size="sm" className="w-full gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
            <Link href={`/api/chung-chi/${maChungChi}/pdf`} target="_blank">
              <Award className="h-4 w-4" />
              Xem chứng chỉ hoàn thành
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

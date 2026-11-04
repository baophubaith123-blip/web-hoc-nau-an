import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TheThongKeProps {
  tieuDe: string;
  giaTri: string | number;
  moTa?: string;
  icon: ReactNode;
  xuHuong?: {
    phanTram: number;
    tang: boolean;
  };
}

export function TheThongKe({
  tieuDe,
  giaTri,
  moTa,
  icon,
  xuHuong,
}: TheThongKeProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {tieuDe}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold tracking-tight">{giaTri}</div>
        {(moTa || xuHuong) && (
          <p className="text-xs text-muted-foreground">
            {xuHuong && (
              <span
                className={`font-semibold mr-1 ${
                  xuHuong.tang
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {xuHuong.tang ? "+" : "-"}
                {xuHuong.phanTram}%
              </span>
            )}
            {moTa}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface TrangThaiTrongProps {
  icon: LucideIcon;
  tieuDe: string;
  moTa: string;
  children?: ReactNode;
}

/** Khung hiển thị khi danh sách trống — dùng chung toàn site thay cho dòng chữ đơn điệu. */
export function TrangThaiTrong({ icon: Icon, tieuDe, moTa, children }: TrangThaiTrongProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed bg-card/50 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </span>
      <p className="text-base font-semibold">{tieuDe}</p>
      <p className="max-w-md text-sm text-muted-foreground">{moTa}</p>
      {children}
    </div>
  );
}

import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Trạng thái rỗng dùng chung (danh sách chưa có dữ liệu)
export function TrangTrong({
  tieuDe, moTa, icon: Icon = Inbox, children,
}: { tieuDe: string; moTa?: string; icon?: LucideIcon; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <Icon className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">{tieuDe}</p>
      {moTa && <p className="max-w-sm text-sm text-muted-foreground">{moTa}</p>}
      {children}
    </div>
  );
}
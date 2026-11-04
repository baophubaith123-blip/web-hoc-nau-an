import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CotDuLieu<T> {
  tieuDe: string;
  truong?: keyof T;
  render?: (hang: T, index: number) => ReactNode;
  className?: string;
}

interface BangDuLieuProps<T> {
  cot: CotDuLieu<T>[];
  duLieu: T[];
  layKhoa: (hang: T, index: number) => string;
  thongBaoTrong?: string;
}

export function BangDuLieu<T>({
  cot,
  duLieu,
  layKhoa,
  thongBaoTrong = "Không có dữ liệu hiển thị",
}: BangDuLieuProps<T>) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {cot.map((c, i) => (
              <TableHead key={i} className={c.className}>
                {c.tieuDe}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {duLieu.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={cot.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {thongBaoTrong}
              </TableCell>
            </TableRow>
          ) : (
            duLieu.map((hang, hangIdx) => (
              <TableRow key={layKhoa(hang, hangIdx)}>
                {cot.map((c, cotIdx) => (
                  <TableCell key={cotIdx} className={c.className}>
                    {c.render
                      ? c.render(hang, hangIdx)
                      : c.truong
                        ? String(hang[c.truong] ?? "")
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Crown, Plus, Edit, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatGiaVND } from "@/lib/utils/goi";
import { NutXoaGoi } from "./nut-xoa-goi";

export const metadata: Metadata = {
  title: "Quản lý gói Premium | Quản trị",
};

export default async function QuanLyGoiPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachGoi } = await supabase
    .from("goi_premium")
    .select("*")
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>Quản lý gói hội viên Premium</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cấu hình các gói Pro Tháng, Pro Năm, giá bán và đặc quyền cho học viên.
          </p>
        </div>

        <Button asChild className="gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
          <Link href="/quan-tri/quan-ly-goi/moi">
            <Plus className="w-4 h-4" />
            <span>Thêm gói mới</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Danh sách gói dịch vụ</CardTitle>
          <CardDescription>
            Các gói đang hoạt động sẽ xuất hiện trên trang bảng giá và trang nâng cấp Pro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Mã gói</TableHead>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Giá cước</TableHead>
                <TableHead>Thứ tự</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {danhSachGoi && danhSachGoi.length > 0 ? (
                danhSachGoi.map((goi) => (
                  <TableRow key={goi.id}>
                    <TableCell className="font-mono font-medium text-xs">
                      {goi.ma_goi}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm">{goi.ten}</div>
                      {goi.mo_ta && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {goi.mo_ta}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {goi.thoi_han_ngay} ngày
                    </TableCell>
                    <TableCell className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {formatGiaVND(Number(goi.gia))}
                    </TableCell>
                    <TableCell className="text-sm">{goi.thu_tu}</TableCell>
                    <TableCell>
                      {goi.hoat_dong ? (
                        <Badge className="bg-emerald-600 text-white gap-1 text-[11px]">
                          <Check className="w-3 h-3" />
                          Đang mở bán
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1 text-[11px]">
                          <X className="w-3 h-3" />
                          Ngừng bán
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 gap-1.5 text-xs"
                        >
                          <Link href={`/quan-tri/quan-ly-goi/${goi.id}/sua`}>
                            <Edit className="w-3.5 h-3.5" />
                            <span>Sửa</span>
                          </Link>
                        </Button>
                        <NutXoaGoi id={goi.id} ten={goi.ten} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                    Chưa có gói Premium nào. Bấm &quot;Thêm gói mới&quot; để tạo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Plus, Edit3, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

const TRANG_THAI_MAP: Record<string, { nhan: string; class: string }> = {
  nhap: { nhan: "Bản nháp", class: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  cho_duyet: { nhan: "Chờ phê duyệt", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  xuat_ban: { nhan: "Đã xuất bản", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  tu_choi: { nhan: "Cần chỉnh sửa", class: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  luu_tru: { nhan: "Đã lưu trữ", class: "bg-zinc-500/10 text-zinc-600" },
};

export default async function CongThucDaGui() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  const { data: danhSach } = await supabase
    .from("cong_thuc")
    .select("*")
    .eq("tac_gia_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Công thức của tôi</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Theo dõi trạng thái kiểm duyệt và chỉnh sửa các công thức do bạn tạo
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/tao-cong-thuc">
            <Plus className="h-4 w-4" />
            Tạo công thức mới
          </Link>
        </Button>
      </div>

      {(!danhSach || danhSach.length === 0) ? (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <p className="text-base font-semibold">Bạn chưa đăng công thức nào</p>
          <p className="text-xs text-muted-foreground">
            Hãy bắt đầu chia sẻ công thức đầu tiên của bạn cho cộng đồng!
          </p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/tao-cong-thuc">Tạo công thức ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {danhSach.map((ct) => {
            const tt = TRANG_THAI_MAP[ct.trang_thai] || TRANG_THAI_MAP.nhap;

            return (
              <Card key={ct.id} className="overflow-hidden shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tt.class}`}>
                        {tt.nhan}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ngày tạo: {new Date(ct.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      {ct.tieu_de}
                    </h3>

                    {ct.trang_thai === "tu_choi" && ct.ly_do_tu_choi && (
                      <div className="flex items-start gap-1.5 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400 mt-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          <strong>Lý do từ chối:</strong> {ct.ly_do_tu_choi}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ct.trang_thai === "xuat_ban" && (
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <Link href={`/cong-thuc/${ct.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          Xem bài
                        </Link>
                      </Button>
                    )}

                    <Button asChild size="sm" className="gap-1.5">
                      <Link href={`/tao-cong-thuc/${ct.id}/sua`}>
                        <Edit3 className="h-4 w-4" />
                        Chỉnh sửa
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

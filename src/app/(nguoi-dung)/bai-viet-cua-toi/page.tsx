import Link from "next/link";
import { Plus, Edit3, Eye, AlertCircle, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrangThaiTrong } from "@/components/layout/trang-thai-trong";
import { NutKhoaPro } from "@/components/layout/nut-khoa-pro";
import { XoaBaiVietCuaToiNut } from "./xoa-bai-viet-nut";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { laProConHan } from "@/lib/actions/chung";

const TRANG_THAI_MAP: Record<string, { nhan: string; class: string }> = {
  nhap: { nhan: "Bản nháp", class: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  cho_duyet: { nhan: "Chờ phê duyệt", class: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  xuat_ban: { nhan: "Đã xuất bản", class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  tu_choi: { nhan: "Cần chỉnh sửa", class: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  luu_tru: { nhan: "Đã lưu trữ", class: "bg-zinc-500/10 text-zinc-600" },
};

export default async function BaiVietCuaToi() {
  const phien = await yeuCauVaiTro();
  const supabase = await taoSupabaseServer();
  const quyenCao = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  const duocVietBai = quyenCao || laProConHan(phien.profile);

  const { data: danhSach } = await supabase
    .from("bai_viet")
    .select("*")
    .eq("tac_gia_id", phien.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bài viết của tôi</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Theo dõi trạng thái kiểm duyệt và chỉnh sửa các bài viết do bạn chia sẻ
          </p>
        </div>
        {duocVietBai ? (
          <Button asChild size="sm" className="gap-1.5 shadow-md">
            <Link href="/tao-bai-viet">
              <Plus className="h-4 w-4" />
              Viết bài mới
            </Link>
          </Button>
        ) : (
          <NutKhoaPro
            tinhNang="Viết bài viết"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md"
          >
            <span className="flex items-center gap-1.5 pr-5">
              <Plus className="h-4 w-4" />
              Viết bài mới
            </span>
          </NutKhoaPro>
        )}
      </div>

      {!danhSach || danhSach.length === 0 ? (
        <TrangThaiTrong
          icon={PenLine}
          tieuDe="Bạn chưa viết bài viết nào"
          moTa="Hãy chia sẻ mẹo bếp hoặc câu chuyện ẩm thực đầu tiên của bạn. Bài viết sẽ được quản trị viên duyệt trước khi xuất hiện công khai."
        >
          {duocVietBai && (
            <Button asChild size="sm" className="mt-1">
              <Link href="/tao-bai-viet">Viết bài ngay</Link>
            </Button>
          )}
        </TrangThaiTrong>
      ) : (
        <div className="space-y-4">
          {danhSach.map((bv) => {
            const tt = TRANG_THAI_MAP[bv.trang_thai] || TRANG_THAI_MAP.nhap;
            const duocSua = bv.trang_thai === "nhap" || bv.trang_thai === "tu_choi";

            return (
              <Card key={bv.id} className="overflow-hidden shadow-xs">
                <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tt.class}`}>
                        {tt.nhan}
                      </span>
                      {bv.danh_muc && (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                          {bv.danh_muc}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Ngày tạo: {new Date(bv.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">{bv.tieu_de}</h3>

                    {bv.tom_tat && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{bv.tom_tat}</p>
                    )}

                    {bv.trang_thai === "tu_choi" && bv.ly_do_tu_choi && (
                      <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          <strong>Lý do từ chối:</strong> {bv.ly_do_tu_choi}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {bv.trang_thai === "xuat_ban" && (
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <Link href={`/bai-viet/${bv.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          Xem bài
                        </Link>
                      </Button>
                    )}
                    {duocSua && (
                      <>
                        <Button asChild size="sm" className="gap-1.5">
                          <Link href={`/tao-bai-viet/${bv.id}/sua`}>
                            <Edit3 className="h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </Button>
                        <XoaBaiVietCuaToiNut baiVietId={bv.id} tieuDe={bv.tieu_de} />
                      </>
                    )}
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

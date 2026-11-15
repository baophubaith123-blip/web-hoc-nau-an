import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Trash2, Info } from "lucide-react";
import { NutThaoTacThungRac } from "@/components/thung-rac/nut-thao-tac-thung-rac";
import { laLoiThieuCot, soNgayConLai, NHAN_TRANG_THAI_THUNG_RAC } from "@/lib/thung-rac";

type DongRac = {
  id: string;
  tieu_de: string;
  trang_thai: string;
  deleted_at: string;
};

function DanhSachRac({
  cacDong,
  loai,
  choXoaVinhVien,
}: {
  cacDong: DongRac[];
  loai: "cong_thuc" | "khoa_hoc";
  choXoaVinhVien: boolean;
}) {
  if (cacDong.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Chưa có mục nào trong thùng rác.
      </div>
    );
  }
  return (
    <div className="divide-y rounded-2xl border bg-card">
      {cacDong.map((dong) => {
        const conLai = soNgayConLai(dong.deleted_at);
        return (
          <div
            key={dong.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="truncate font-semibold">{dong.tieu_de}</p>
              <p className="text-xs text-muted-foreground">
                Ngày xóa:{" "}
                {new Date(dong.deleted_at).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge variant="outline">
                  Trước khi xóa: {NHAN_TRANG_THAI_THUNG_RAC[dong.trang_thai] ?? dong.trang_thai}
                </Badge>
                {conLai > 0 ? (
                  <Badge variant="secondary">Còn {conLai} ngày</Badge>
                ) : (
                  <Badge variant="destructive">Đã quá 30 ngày — chờ Admin dọn</Badge>
                )}
              </div>
            </div>
            <NutThaoTacThungRac
              loai={loai}
              id={dong.id}
              tieuDe={dong.tieu_de}
              choXoaVinhVien={choXoaVinhVien}
            />
          </div>
        );
      })}
    </div>
  );
}

export default async function ThungRacDauBepPage() {
  const phien = await yeuCauVaiTro(["chef", "admin"]);
  const supabase = await taoSupabaseServer();

  const [ctRes, khRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("id, tieu_de, trang_thai, deleted_at")
      .eq("tac_gia_id", phien.user.id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("khoa_hoc")
      .select("id, tieu_de, trang_thai, deleted_at")
      .eq("dau_bep_id", phien.user.id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  const congThuc: DongRac[] = (ctRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
  }));
  const khoaHoc: DongRac[] = (khRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
  }));
  const khChuaKichHoat = laLoiThieuCot(khRes.error);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Trash2 className="h-6 w-6" />
          Thùng rác
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Khóa học và công thức bạn đã xóa được giữ tại đây 30 ngày. Khôi phục để đưa nội dung trở
          lại đúng trạng thái trước khi xóa.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Khóa học đã xóa <span className="text-sm font-medium text-muted-foreground">({khoaHoc.length})</span>
        </h2>
        {khChuaKichHoat ? (
          <div className="flex items-start gap-2 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Mục này sẽ kích hoạt sau khi cập nhật cơ sở dữ liệu (migration 009). Trước thời điểm
              đó, thao tác xóa khóa học vẫn chạy theo hành vi cũ (chuyển sang lưu trữ).
            </span>
          </div>
        ) : (
          <>
            <DanhSachRac cacDong={khoaHoc} loai="khoa_hoc" choXoaVinhVien={false} />
            <p className="text-xs text-muted-foreground">
              Lưu ý: Xóa vĩnh viễn khóa học do Admin thực hiện. Khóa học quá 30 ngày trong thùng
              rác sẽ được Admin dọn vĩnh viễn.
            </p>
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Công thức đã xóa <span className="text-sm font-medium text-muted-foreground">({congThuc.length})</span>
        </h2>
        <DanhSachRac cacDong={congThuc} loai="cong_thuc" choXoaVinhVien />
      </section>
    </div>
  );
}

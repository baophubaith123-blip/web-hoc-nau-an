import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  tenLoai,
}: {
  cacDong: DongRac[];
  loai: "cong_thuc" | "bai_viet";
  tenLoai: string;
}) {
  if (cacDong.length === 0) {
    return (
      <div className="space-y-3 rounded-2xl border border-dashed p-10 text-center">
        <p className="text-base font-semibold">Chưa có {tenLoai} nào trong thùng rác</p>
        <p className="text-xs text-muted-foreground">
          {tenLoai.charAt(0).toUpperCase() + tenLoai.slice(1)} bạn xóa sẽ xuất hiện tại đây trong 30
          ngày để bạn khôi phục khi cần.
        </p>
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
            <NutThaoTacThungRac loai={loai} id={dong.id} tieuDe={dong.tieu_de} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Thùng rác của người dùng: công thức + bài viết do chính mình
 * đăng đã bị xóa — khôi phục về đúng trạng thái trước khi xóa
 * hoặc xóa vĩnh viễn.
 */
export default async function ThungRacNguoiDungPage() {
  const phien = await yeuCauVaiTro();
  const supabase = await taoSupabaseServer();

  const [ctRes, bvRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("id, tieu_de, trang_thai, deleted_at")
      .eq("tac_gia_id", phien.user.id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("bai_viet")
      .select("id, tieu_de, trang_thai, deleted_at")
      .eq("tac_gia_id", phien.user.id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  const congThuc: DongRac[] = (ctRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
  }));
  const baiViet: DongRac[] = (bvRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
  }));
  const bvChuaKichHoat = laLoiThieuCot(bvRes.error);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Trash2 className="h-6 w-6" />
            Thùng rác
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Nội dung bạn đã xóa được giữ tại đây 30 ngày. Khôi phục để đưa nội dung trở lại đúng
            trạng thái trước khi xóa.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/cong-thuc-da-gui">Công thức của tôi</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Công thức đã xóa{" "}
          <span className="text-sm font-medium text-muted-foreground">({congThuc.length})</span>
        </h2>
        <DanhSachRac cacDong={congThuc} loai="cong_thuc" tenLoai="công thức" />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Bài viết đã xóa{" "}
          <span className="text-sm font-medium text-muted-foreground">({baiViet.length})</span>
        </h2>
        {bvChuaKichHoat ? (
          <div className="flex items-start gap-2 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Mục này sẽ kích hoạt sau khi cập nhật cơ sở dữ liệu (migration 009). Trước thời điểm
              đó, thao tác xóa bài viết vẫn chạy theo hành vi cũ (xóa hẳn).
            </span>
          </div>
        ) : (
          <DanhSachRac cacDong={baiViet} loai="bai_viet" tenLoai="bài viết" />
        )}
      </section>
    </div>
  );
}

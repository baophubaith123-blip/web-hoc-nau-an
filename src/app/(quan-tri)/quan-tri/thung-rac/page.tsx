import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Trash2, Info } from "lucide-react";
import { NutThaoTacThungRac } from "@/components/thung-rac/nut-thao-tac-thung-rac";
import { NutDonThungRac } from "@/components/thung-rac/nut-don-thung-rac";
import { laLoiThieuCot, soNgayConLai, NHAN_TRANG_THAI_THUNG_RAC } from "@/lib/thung-rac";

type DongRac = {
  id: string;
  tieu_de: string;
  trang_thai: string;
  deleted_at: string;
  nguoi_dang: string;
};

function MucThungRac({
  tieuDeMuc,
  cacDong,
  loai,
  chuaKichHoat,
}: {
  tieuDeMuc: string;
  cacDong: DongRac[];
  loai: "cong_thuc" | "khoa_hoc" | "bai_viet";
  chuaKichHoat?: boolean;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold tracking-tight">
        {tieuDeMuc} <span className="text-sm font-medium text-muted-foreground">({cacDong.length})</span>
      </h2>

      {chuaKichHoat ? (
        <div className="flex items-start gap-2 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Mục này sẽ kích hoạt sau khi cập nhật cơ sở dữ liệu (migration 009). Trước thời điểm đó,
            thao tác xóa của mục này vẫn chạy theo hành vi cũ.
          </span>
        </div>
      ) : cacDong.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Chưa có mục nào trong thùng rác.
        </div>
      ) : (
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
                    Người đăng: <span className="font-medium text-foreground">{dong.nguoi_dang}</span>
                    {" · "}Ngày xóa:{" "}
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
                      <Badge variant="destructive">Đã quá 30 ngày — có thể dọn vĩnh viễn</Badge>
                    )}
                  </div>
                </div>
                <NutThaoTacThungRac loai={loai} id={dong.id} tieuDe={dong.tieu_de} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default async function ThungRacAdminPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const [ctRes, khRes, bvRes] = await Promise.all([
    supabase
      .from("cong_thuc")
      .select("id, tieu_de, trang_thai, deleted_at, tac_gia:profiles!cong_thuc_tac_gia_id_fkey(ho_ten)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("khoa_hoc")
      .select("id, tieu_de, trang_thai, deleted_at, dau_bep:profiles!khoa_hoc_dau_bep_id_fkey(ho_ten)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
    supabase
      .from("bai_viet")
      .select("id, tieu_de, trang_thai, deleted_at, tac_gia:profiles!bai_viet_tac_gia_id_fkey(ho_ten)")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false }),
  ]);

  const congThuc: DongRac[] = (ctRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
    nguoi_dang: d.tac_gia?.ho_ten || "Không rõ",
  }));
  const khoaHoc: DongRac[] = (khRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
    nguoi_dang: d.dau_bep?.ho_ten || "Không rõ",
  }));
  const baiViet: DongRac[] = (bvRes.data ?? []).map((d) => ({
    id: d.id,
    tieu_de: d.tieu_de,
    trang_thai: d.trang_thai,
    deleted_at: d.deleted_at as string,
    nguoi_dang: d.tac_gia?.ho_ten || "Không rõ",
  }));

  const khChuaKichHoat = laLoiThieuCot(khRes.error);
  const bvChuaKichHoat = laLoiThieuCot(bvRes.error);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Trash2 className="h-6 w-6" />
            Thùng rác
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nội dung đã xóa của mọi người dùng. Mục được giữ 30 ngày kể từ ngày xóa — khôi phục để
            đưa nội dung trở lại đúng trạng thái trước khi xóa, hoặc xóa vĩnh viễn ngay.
          </p>
        </div>
        <NutDonThungRac />
      </div>

      {(khChuaKichHoat || bvChuaKichHoat) && (
        <div className="flex items-start gap-2 rounded-2xl border bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Thùng rác sẽ kích hoạt đầy đủ sau khi cập nhật cơ sở dữ liệu (migration 009). Hiện tại
            mục Công thức đã hoạt động; các mục còn lại đang chờ cập nhật.
          </span>
        </div>
      )}

      <MucThungRac tieuDeMuc="Công thức đã xóa" cacDong={congThuc} loai="cong_thuc" />
      <MucThungRac tieuDeMuc="Khóa học đã xóa" cacDong={khoaHoc} loai="khoa_hoc" chuaKichHoat={khChuaKichHoat} />
      <MucThungRac tieuDeMuc="Bài viết đã xóa" cacDong={baiViet} loai="bai_viet" chuaKichHoat={bvChuaKichHoat} />
    </div>
  );
}

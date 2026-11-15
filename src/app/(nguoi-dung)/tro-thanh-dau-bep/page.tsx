import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChefHat,
  Clock,
  GraduationCap,
  Info,
  UserRound,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormUngTuyenDauBep } from "@/components/dau-bep/form-ung-tuyen";
import { taoSupabaseServer, yeuCauVaiTro } from "@/lib/supabase/server";
import {
  SO_NGAY_GUI_LAI_SAU_TU_CHOI,
  THONG_BAO_CHUA_KICH_HOAT_010,
  laLoiThieuBang,
} from "@/lib/ung-tuyen";
import type { Bang } from "@/types";

type DonUngTuyen = Bang<"don_ung_tuyen_dau_bep">;

const dinhDangNgay = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Đợt 5 — Trang ứng tuyển trở thành đầu bếp (phương án A). Người gửi
// xem được trạng thái đơn của mình ngay tại đây: đang chờ duyệt / đã
// duyệt / bị từ chối kèm lý do và ngày được gửi lại (sau 7 ngày).
// Chưa có bảng (migration 010 chưa chạy) -> hiện thông báo thân thiện.
export default async function TroThanhDauBepPage() {
  const phien = await yeuCauVaiTro();
  const vaiTro = phien.profile.vai_tro;

  let cacDon: DonUngTuyen[] = [];
  let chuaKichHoat = false;
  if (vaiTro === "user") {
    const supabase = await taoSupabaseServer();
    const { data, error } = await supabase
      .from("don_ung_tuyen_dau_bep")
      .select("*")
      .eq("nguoi_dung_id", phien.user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) {
      chuaKichHoat = laLoiThieuBang(error);
      if (!chuaKichHoat) cacDon = [];
    } else {
      cacDon = (data ?? []) as DonUngTuyen[];
    }
  }

  const donCho = cacDon.find((d) => d.trang_thai === "cho_duyet");
  const donTuChoiMoiNhat = cacDon.find((d) => d.trang_thai === "tu_choi");
  const mocTuChoi = donTuChoiMoiNhat
    ? new Date(
        donTuChoiMoiNhat.duyet_luc ?? donTuChoiMoiNhat.created_at
      ).getTime()
    : null;
  const ngayGuiLaiDuoc =
    mocTuChoi !== null
      ? new Date(mocTuChoi + SO_NGAY_GUI_LAI_SAU_TU_CHOI * 24 * 60 * 60 * 1000)
      : null;
  const dangBiChanGuiLai =
    ngayGuiLaiDuoc !== null && ngayGuiLaiDuoc.getTime() > Date.now();
  const lichSu = cacDon.filter((d) => d.trang_thai !== "cho_duyet");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <ChefHat className="h-7 w-7 text-primary" />
          Trở thành đầu bếp
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Bạn yêu bếp và muốn chia sẻ món ngon của mình? Hãy gửi đơn ứng tuyển —
          quản trị viên sẽ xem hồ sơ, duyệt và thông báo kết quả cho bạn. Được
          duyệt xong, bạn có ngay khu vực đầu bếp riêng để đăng công thức và mở
          khóa học.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: BookOpen,
            tieuDe: "Đăng công thức của bạn",
            moTa: "Chia sẻ món tủ với cộng đồng học viên trên toàn nền tảng.",
          },
          {
            icon: GraduationCap,
            tieuDe: "Mở khóa học riêng",
            moTa: "Xây dựng lộ trình nấu ăn bài bản với bài học và video của bạn.",
          },
          {
            icon: UserRound,
            tieuDe: "Hồ sơ đầu bếp công khai",
            moTa: "Xuất hiện trong trang Đội ngũ đầu bếp với số liệu nội dung thật.",
          },
        ].map((muc) => (
          <Card key={muc.tieuDe}>
            <CardContent className="space-y-1.5 p-4">
              <muc.icon className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">{muc.tieuDe}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{muc.moTa}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {vaiTro !== "user" ? (
        <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold">
                {vaiTro === "chef"
                  ? "Bạn đã là đầu bếp của Học Nấu Ăn rồi!"
                  : "Tài khoản của bạn thuộc đội ngũ Học Nấu Ăn"}
              </p>
              <p className="text-sm text-muted-foreground">
                {vaiTro === "chef"
                  ? "Bạn không cần ứng tuyển nữa — hãy vào khu vực đầu bếp để đăng công thức và mở khóa học."
                  : "Tài khoản quản trị/nhân viên không cần gửi đơn ứng tuyển đầu bếp."}
              </p>
            </div>
            {vaiTro === "chef" && (
              <Button asChild>
                <Link href="/bep">Vào khu vực đầu bếp</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : chuaKichHoat ? (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="flex items-start gap-3 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-semibold">Tính năng sắp mở</p>
              <p className="text-sm text-muted-foreground">{THONG_BAO_CHUA_KICH_HOAT_010}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {donCho && (
            <Card className="border-amber-300 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/20">
              <CardContent className="flex items-start gap-3 p-5">
                <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                <div className="space-y-1">
                  <p className="font-semibold">Đơn ứng tuyển của bạn đang chờ duyệt</p>
                  <p className="text-sm text-muted-foreground">
                    Gửi lúc {dinhDangNgay(donCho.created_at)} · Chuyên môn:{" "}
                    {donCho.chuyen_mon} · Kinh nghiệm: {donCho.so_nam_kinh_nghiem} năm
                    {donCho.mon_tu ? ` · Món tủ: ${donCho.mon_tu}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quản trị viên sẽ phản hồi qua mục Thông báo. Trong lúc chờ, bạn
                    vẫn học và nấu như bình thường.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!donCho && dangBiChanGuiLai && donTuChoiMoiNhat && (
            <Card className="border-red-200 bg-red-50/70 dark:border-red-900/40 dark:bg-red-950/20">
              <CardContent className="flex items-start gap-3 p-5">
                <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                <div className="space-y-1">
                  <p className="font-semibold">Đơn gần nhất chưa được duyệt</p>
                  <p className="text-sm text-muted-foreground">
                    Lý do: {donTuChoiMoiNhat.ly_do_tu_choi || "Quản trị viên chưa ghi lý do."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể hoàn thiện hồ sơ và gửi lại từ ngày{" "}
                    {ngayGuiLaiDuoc
                      ? ngayGuiLaiDuoc.toLocaleDateString("vi-VN")
                      : ""}{" "}
                    (quy định chờ {SO_NGAY_GUI_LAI_SAU_TU_CHOI} ngày sau mỗi lần từ chối).
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!donCho && !dangBiChanGuiLai && (
            <>
              {donTuChoiMoiNhat && (
                <Card>
                  <CardContent className="flex items-start gap-3 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Đơn trước của bạn chưa được duyệt — lý do:{" "}
                      <span className="font-medium text-foreground">
                        {donTuChoiMoiNhat.ly_do_tu_choi || "không ghi"}
                      </span>
                      . Bạn đã có thể gửi đơn mới; hãy bổ sung những điểm còn thiếu nhé.
                    </p>
                  </CardContent>
                </Card>
              )}
              <FormUngTuyenDauBep />
            </>
          )}

          {lichSu.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold">Lịch sử đơn của bạn</h2>
              <div className="divide-y rounded-2xl border bg-card">
                {lichSu.map((don) => (
                  <div key={don.id} className="flex items-start gap-3 p-4">
                    {don.trang_thai === "da_duyet" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    )}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-sm font-medium">
                        {don.trang_thai === "da_duyet"
                          ? "Đã được duyệt — bạn đã trở thành đầu bếp"
                          : "Chưa được duyệt"}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          gửi {dinhDangNgay(don.created_at)}
                          {don.duyet_luc
                            ? ` · xử lý ${dinhDangNgay(don.duyet_luc)}`
                            : ""}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {don.chuyen_mon} · {don.so_nam_kinh_nghiem} năm kinh nghiệm
                      </p>
                      {don.trang_thai === "tu_choi" && don.ly_do_tu_choi && (
                        <p className="text-sm text-muted-foreground">
                          Lý do: {don.ly_do_tu_choi}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

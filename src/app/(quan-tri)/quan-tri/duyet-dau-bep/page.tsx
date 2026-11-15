import Link from "next/link";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  ExternalLink,
  Info,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TieuDeTrang } from "@/components/layout/tieu-de-trang";
import { TuCapNhatDanhSach } from "@/components/realtime/tu-cap-nhat-danh-sach";
import { ThaoTacDuyetDon } from "./thao-tac-duyet-don";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import {
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

// Đợt 5 — Admin duyệt đơn ứng tuyển đầu bếp (theo khuôn Duyệt Pro:
// danh sách tự cập nhật realtime, duyệt xong người gửi nhận thông
// báo và vào được khu /bep). Chưa chạy migration 010 -> thông báo.
export default async function DuyetDauBepPage() {
  const admin = taoSupabaseAdmin();
  const { data, error } = await admin
    .from("don_ung_tuyen_dau_bep")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const chuaKichHoat = error ? laLoiThieuBang(error) : false;
  const cacDon: DonUngTuyen[] = !error && data ? (data as DonUngTuyen[]) : [];

  // Ghép hồ sơ người gửi (tên, avatar, ngày tham gia) bằng admin client
  const ids = [...new Set(cacDon.map((d) => d.nguoi_dung_id))];
  const hoSoMap = new Map<
    string,
    { ho_ten: string | null; avatar_url: string | null; created_at: string }
  >();
  if (ids.length > 0) {
    const { data: hoSo } = await admin
      .from("profiles")
      .select("id, ho_ten, avatar_url, created_at")
      .in("id", ids);
    for (const hs of hoSo ?? []) {
      hoSoMap.set(hs.id, {
        ho_ten: hs.ho_ten,
        avatar_url: hs.avatar_url,
        created_at: hs.created_at,
      });
    }
  }

  const donCho = cacDon.filter((d) => d.trang_thai === "cho_duyet");
  const donDaXuLy = cacDon.filter((d) => d.trang_thai !== "cho_duyet");

  return (
    <div className="space-y-6">
      <TuCapNhatDanhSach cacBang={["don_ung_tuyen_dau_bep"]} />
      <TieuDeTrang
        icon={ChefHat}
        tieuDe="Duyệt đầu bếp"
        moTa="Đơn ứng tuyển trở thành đầu bếp do học viên tự gửi. Duyệt xong, tài khoản của họ chuyển thành đầu bếp, vào được khu vực /bep và xuất hiện ở trang Đội ngũ đầu bếp."
      />

      {error && !chuaKichHoat ? (
        <Card className="border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <CardContent className="p-5 text-sm">
            Không đọc được danh sách đơn ứng tuyển. Vui lòng tải lại trang.
          </CardContent>
        </Card>
      ) : chuaKichHoat ? (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="flex items-start gap-3 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-semibold">Chưa kích hoạt</p>
              <p className="text-sm text-muted-foreground">
                {THONG_BAO_CHUA_KICH_HOAT_010} Sau khi chạy migration, học viên
                gửi đơn ở trang &quot;Trở thành đầu bếp&quot; và đơn sẽ hiện tại đây.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Clock className="h-5 w-5 text-amber-600" />
              Đang chờ duyệt
              <Badge variant="secondary">{donCho.length}</Badge>
            </h2>
            {donCho.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  Chưa có đơn ứng tuyển nào đang chờ. Đơn mới sẽ tự hiện ở đây
                  ngay khi học viên gửi.
                </CardContent>
              </Card>
            ) : (
              donCho.map((don) => {
                const hs = hoSoMap.get(don.nguoi_dung_id);
                const ten = hs?.ho_ten || "Học viên";
                return (
                  <Card key={don.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex flex-wrap items-center gap-3 text-base">
                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {hs?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={hs.avatar_url}
                              alt={ten}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            ten.charAt(0).toUpperCase()
                          )}
                        </span>
                        <span>{ten}</span>
                        <Badge variant="outline">
                          {don.so_nam_kinh_nghiem} năm kinh nghiệm
                        </Badge>
                        <span className="text-xs font-normal text-muted-foreground">
                          gửi {dinhDangNgay(don.created_at)}
                          {hs
                            ? ` · thành viên từ ${new Date(hs.created_at).toLocaleDateString("vi-VN")}`
                            : ""}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="font-medium text-muted-foreground">Chuyên môn</p>
                          <p>{don.chuyen_mon}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Món tủ</p>
                          <p>{don.mon_tu || "—"}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Tiểu sử</p>
                        <p className="whitespace-pre-line leading-relaxed">{don.tieu_su}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground">Lý do ứng tuyển</p>
                        <p className="whitespace-pre-line leading-relaxed">{don.ly_do}</p>
                      </div>
                      {don.lien_ket_mang_xa_hoi && (
                        <p className="text-sm">
                          <a
                            href={don.lien_ket_mang_xa_hoi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            Kênh/mạng xã hội của ứng viên
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <ThaoTacDuyetDon donId={don.id} tenNguoiGui={ten} />
                        <Link
                          href={`/quan-tri/nguoi-dung`}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Xem quản lý người dùng
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {donDaXuLy.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Đã xử lý gần đây</h2>
              <div className="divide-y rounded-2xl border bg-card">
                {donDaXuLy.slice(0, 20).map((don) => {
                  const hs = hoSoMap.get(don.nguoi_dung_id);
                  const ten = hs?.ho_ten || "Học viên";
                  return (
                    <div key={don.id} className="flex items-start gap-3 p-4">
                      {don.trang_thai === "da_duyet" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      ) : (
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                      )}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-sm font-medium">
                          {ten} —{" "}
                          {don.trang_thai === "da_duyet"
                            ? "đã duyệt thành đầu bếp"
                            : "đã từ chối"}
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
                            Lý do từ chối: {don.ly_do_tu_choi}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

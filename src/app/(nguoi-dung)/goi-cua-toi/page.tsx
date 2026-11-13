import { Metadata } from "next";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Crown, Sparkles, Clock, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NutNangCap } from "@/components/goi/NutNangCap";
import { BadgePro } from "@/components/goi/BadgePro";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { donYeuCauHetHan } from "@/lib/thanh-toan/yeu-cau";
import { formatGiaVND } from "@/lib/utils/goi";
import Link from "next/link";
import { NutHuyYeuCau } from "./nut-huy-yeu-cau";

export const metadata: Metadata = {
  title: "Gói dịch vụ của tôi | Học Nấu Ăn Online",
  description: "Quản lý gói thành viên PRO, theo dõi thời hạn sử dụng và lịch sử giao dịch.",
};

export default async function GoiCuaToiPage() {
  const phien = await yeuCauVaiTro();

  // Don yeu cau "ma" cua chinh minh truoc khi hien thi (L-01)
  await donYeuCauHetHan(taoSupabaseAdmin());

  const supabase = await taoSupabaseServer();
  const userId = phien.user.id;

  // 1. Lấy thông tin profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("la_pro, goi_het_han")
    .eq("id", userId)
    .single();

  // 2. Lấy gói đang hoạt động
  const { data: goiHoatDong } = await supabase
    .from("goi_nguoi_dung")
    .select("*, goi:goi_premium(*)")
    .eq("nguoi_dung_id", userId)
    .eq("trang_thai", "hoat_dong")
    .order("ngay_het_han", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Lấy toàn bộ yêu cầu nâng cấp của người dùng
  const { data: tatCaYeuCau } = await supabase
    .from("yeu_cau_nang_cap")
    .select("*, goi:goi_premium(*), thanh_toan(*)")
    .eq("nguoi_dung_id", userId)
    .order("created_at", { ascending: false });

  // Banner "cho duyet" CHI hien khi giao dich da thanh toan thanh cong (L-01/L-02)
  const yeuCauChoDuyet = (tatCaYeuCau ?? []).filter(
    (yc) => yc.trang_thai === "cho_duyet" && yc.thanh_toan?.trang_thai === "thanh_cong"
  );
  // Yeu cau da huy / bi tu choi / giao dich that bai -> vao lich su nhan "Da huy"
  const yeuCauDaHuy = (tatCaYeuCau ?? []).filter(
    (yc) =>
      yc.trang_thai === "da_huy" ||
      yc.trang_thai === "tu_choi" ||
      (yc.trang_thai === "cho_duyet" && yc.thanh_toan?.trang_thai === "that_bai")
  );

  // 4. Lấy lịch sử gói
  const { data: lichSu } = await supabase
    .from("goi_nguoi_dung")
    .select("*, goi:goi_premium(*)")
    .eq("nguoi_dung_id", userId)
    .order("created_at", { ascending: false });

  const laPro = !!profile?.la_pro;
  const hetHan = profile?.goi_het_han ? new Date(profile.goi_het_han) : null;
  const conHan = hetHan ? hetHan > new Date() : false;
  const soNgayConLai = hetHan && conHan ? Math.ceil((hetHan.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Gói thành viên của tôi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Theo dõi trạng thái thành viên PRO, thời hạn sử dụng và lịch sử kích hoạt.
        </p>
      </div>

      {/* Trạng thái hiện tại Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] via-card to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                <CardTitle className="text-lg">Trạng thái gói hội viên</CardTitle>
              </div>
              {laPro && conHan ? (
                <BadgePro size="md" />
              ) : (
                <Badge variant="outline">Tài khoản Miễn phí</Badge>
              )}
            </div>
            <CardDescription>
              {laPro && conHan
                ? "Bạn đang tận hưởng trọn vẹn mọi đặc quyền cao cấp của nền tảng."
                : "Nâng cấp lên PRO để mở khóa video Full HD, chứng chỉ và bài tập có chấm điểm."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {laPro && conHan ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-background/80 border">
                  <div>
                    <span className="text-xs text-muted-foreground">Gói đang sử dụng</span>
                    <p className="font-bold text-base mt-0.5">
                      {goiHoatDong?.goi?.ten || "Hội viên PRO"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Hạn sử dụng đến</span>
                    <p className="font-bold text-base mt-0.5 text-amber-600 dark:text-amber-400">
                      {hetHan?.toLocaleDateString("vi-VN")} ({soNgayConLai} ngày nữa)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <NutNangCap text="Gia hạn thêm thời hạn" />
                  <Button variant="outline" asChild>
                    <Link href="/bang-gia">Xem quyền lợi Pro</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background/80 border space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Lợi ích khi nâng cấp ngay hôm nay:</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Xem video HD 1080p toàn bộ khóa học</li>
                    <li>Tải tài liệu PDF công thức độc quyền</li>
                    <li>Làm bài tập & nhận chứng chỉ chính thức</li>
                    <li>Đăng tải công thức nấu ăn của riêng bạn</li>
                  </ul>
                </div>

                <NutNangCap size="lg" text="Nâng cấp tài khoản PRO ngay" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Link Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Hỗ trợ hội viên</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Mọi thắc mắc về kích hoạt gói hoặc thanh toán, vui lòng liên hệ ban hỗ trợ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" asChild className="w-full justify-start text-xs">
              <Link href="/ho-tro">
                <span>Gửi yêu cầu hỗ trợ</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start text-xs">
              <Link href="/tao-cong-thuc">
                <span>Tạo công thức mới (Chỉ dành cho Pro)</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Yêu cầu nâng cấp đang chờ xử lý */}
      {yeuCauChoDuyet && yeuCauChoDuyet.length > 0 && (
        <Card className="border-amber-400/60 bg-amber-500/[0.03]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500 animate-spin" />
              <CardTitle className="text-base">Yêu cầu nâng cấp đang chờ duyệt</CardTitle>
            </div>
            <CardDescription>
              Yêu cầu của bạn đã được tiếp nhận và đang được ban quản trị xét duyệt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {yeuCauChoDuyet.map((yc) => (
                <div
                  key={yc.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-background gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{yc.ma_yeu_cau}</span>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 text-xs">
                        Chờ duyệt
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      Gói: {yc.goi?.ten || "Gói Pro"} ({yc.goi?.thoi_han_ngay} ngày)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ngày gửi: {new Date(yc.created_at).toLocaleString("vi-VN")}
                      {yc.thanh_toan && ` • Số tiền: ${formatGiaVND(yc.thanh_toan.so_tien)}`}
                    </p>
                  </div>

                  <NutHuyYeuCau yeuCauId={yc.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Yêu cầu nâng cấp đã hủy / bị từ chối */}
      {yeuCauDaHuy.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yêu cầu nâng cấp đã hủy</CardTitle>
            <CardDescription>
              Các yêu cầu không hoàn tất thanh toán hoặc không được duyệt sẽ nằm ở đây, không còn ở trạng thái chờ duyệt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {yeuCauDaHuy.map((yc) => (
                <div
                  key={yc.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{yc.ma_yeu_cau}</span>
                      <Badge variant="outline" className="text-destructive text-xs">
                        {yc.trang_thai === "tu_choi" ? "Bị từ chối" : "Đã hủy"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">
                      Gói: {yc.goi?.ten || "Gói Pro"}
                      {yc.thanh_toan && ` • ${formatGiaVND(yc.thanh_toan.so_tien)} • ${yc.thanh_toan.ma_giao_dich}`}
                    </p>
                    {yc.ly_do_tu_choi && (
                      <p className="text-xs text-muted-foreground">Lý do: {yc.ly_do_tu_choi}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(yc.created_at).toLocaleString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lịch sử mua & kích hoạt gói */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Lịch sử sử dụng gói</span>
          </CardTitle>
          <CardDescription>
            Danh sách các gói dịch vụ bạn đã từng đăng ký hoặc được cấp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Gói dịch vụ</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Hình thức</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lichSu && lichSu.length > 0 ? (
                lichSu.map((ls) => {
                  const hetHanLs = new Date(ls.ngay_het_han);
                  const conHieuLuc = ls.trang_thai === "hoat_dong" && hetHanLs > new Date();

                  return (
                    <TableRow key={ls.id}>
                      <TableCell className="font-semibold text-sm">
                        {ls.goi?.ten || "Hội viên PRO"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(ls.ngay_bat_dau).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {hetHanLs.toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {ls.cap_boi_admin ? (
                          <Badge variant="secondary" className="text-[11px]">
                            Admin cấp
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px]">
                            Thanh toán VNPay
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {conHieuLuc ? (
                          <Badge className="bg-emerald-600 text-white text-[11px]">
                            Đang hoạt động
                          </Badge>
                        ) : ls.trang_thai === "huy" ? (
                          <Badge variant="outline" className="text-destructive text-[11px]">
                            Đã hủy
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-[11px]">
                            Đã hết hạn
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm">
                    Bạn chưa có lịch sử đăng ký gói nào.
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

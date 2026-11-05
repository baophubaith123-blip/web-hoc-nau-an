import { notFound } from "next/navigation";
import { ShieldCheck, Landmark, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { laCheDoDemoVNPay, xacMinhChuKyVNPay } from "@/lib/thanh-toan/vnpay";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { FormThanhToanDemo } from "./form-thanh-toan-demo";

// Trang cong thanh toan MO PHONG (chi bat khi VNPAY_DEMO=true).
// Nhan dung bo tham so da ky nhu cong VNPay that, hien thi thong tin don hang
// de nguoi dung "thanh toan" — IPN va trang ket qua phia sau van la code that.
export default async function TrangThanhToanDemo({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!laCheDoDemoVNPay()) {
    notFound();
  }

  const sp = await searchParams;
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") params[k] = v;
  }

  const xacMinh = xacMinhChuKyVNPay(params);
  const maGiaoDich = params["vnp_TxnRef"] || "";
  const soTienHienThi = params["vnp_Amount"] ? parseInt(params["vnp_Amount"], 10) / 100 : 0;

  let tenSanPham = params["vnp_OrderInfo"] || "Thanh toán Học Nấu Ăn";
  let trangThai = "cho_xu_ly";
  let timThay = false;

  if (xacMinh.hopLe && maGiaoDich) {
    const supabase = taoSupabaseAdmin();
    const { data: gd } = await supabase
      .from("thanh_toan")
      .select("so_tien, trang_thai, chi_tiet")
      .eq("ma_giao_dich", maGiaoDich)
      .maybeSingle();
    if (gd) {
      timThay = true;
      trangThai = gd.trang_thai;
      const chiTiet = gd.chi_tiet as Record<string, unknown> | null;
      if (chiTiet && typeof chiTiet["ten_goi"] === "string") {
        tenSanPham = `Nâng cấp ${chiTiet["ten_goi"]}`;
      } else if (chiTiet && typeof chiTiet["tieu_de_khoa_hoc"] === "string") {
        tenSanPham = `Khóa học ${chiTiet["tieu_de_khoa_hoc"]}`;
      }
    }
  }

  const loiTrang = !xacMinh.hopLe
    ? "Chữ ký giao dịch không hợp lệ. Vui lòng quay lại trang nâng cấp và thử lại."
    : !timThay
      ? "Không tìm thấy giao dịch. Vui lòng quay lại trang nâng cấp và thử lại."
      : null;

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a3f7c] text-white">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold leading-tight">Cổng thanh toán VNPay</p>
              <p className="text-xs text-muted-foreground">Thanh toán an toàn qua ngân hàng nội địa</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            MÔI TRƯỜNG DEMO
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Nhà cung cấp</span>
              <span className="font-medium">Học Nấu Ăn Online</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mã giao dịch</span>
              <span className="font-mono text-xs">{maGiaoDich || "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Nội dung</span>
              <span className="text-right font-medium">{tenSanPham}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t pt-3">
              <span className="text-muted-foreground">Số tiền thanh toán</span>
              <span className="text-2xl font-bold text-[#1a3f7c] dark:text-blue-400">
                {soTienHienThi.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </CardContent>
        </Card>

        {loiTrang ? (
          <Card className="border-destructive/40">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm">{loiTrang}</p>
            </CardContent>
          </Card>
        ) : trangThai !== "cho_xu_ly" ? (
          <Card>
            <CardContent className="pt-6 text-sm">
              Giao dịch này đã được xử lý trước đó (trạng thái: {trangThai}). Vui lòng kiểm tra trong
              mục &quot;Gói Pro của tôi&quot;.
            </CardContent>
          </Card>
        ) : (
          <FormThanhToanDemo thamSo={params} />
        )}

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Đây là cổng thanh toán mô phỏng phục vụ demo — không phát sinh giao dịch tiền thật.
        </p>
      </div>
    </div>
  );
}

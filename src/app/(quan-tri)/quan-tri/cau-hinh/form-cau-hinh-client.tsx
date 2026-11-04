"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { luuCauHinh } from "@/lib/actions/quan-tri";
import type { CauHinhForm } from "@/lib/validations/quan-tri";
import { Save, Loader2, Globe, Search, CreditCard, Mail } from "lucide-react";

interface FormCauHinhClientProps {
  cauHinhBanDau?: Partial<CauHinhForm>;
}

export function FormCauHinhClient({ cauHinhBanDau }: FormCauHinhClientProps) {
  const router = useRouter();
  const [dangLuu, setDangLuu] = useState(false);

  // Site info
  const [tenSite, setTenSite] = useState(cauHinhBanDau?.site?.ten_site || "Web Học Nấu Ăn Online");
  const [slogan, setSlogan] = useState(cauHinhBanDau?.site?.slogan || "Khơi dậy đam mê ẩm thực Việt");
  const [emailLienHe, setEmailLienHe] = useState(cauHinhBanDau?.site?.email_lien_he || "contact@webhocnauan.vn");
  const [soDienThoai, setSoDienThoai] = useState(cauHinhBanDau?.site?.so_dien_thoai || "1900 8888");
  const [diaChi, setDiaChi] = useState(cauHinhBanDau?.site?.dia_chi || "Hà Nội, Việt Nam");

  // SEO info
  const [seoTieuDe, setSeoTieuDe] = useState(cauHinhBanDau?.seo?.tieu_de || "Học Nấu Ăn Online - Nền tảng ẩm thực hàng đầu");
  const [seoMoTa, setSeoMoTa] = useState(cauHinhBanDau?.seo?.mo_ta || "Hàng ngàn công thức nấu ăn ngon và các khóa học video chuyên nghiệp cùng đầu bếp");
  const [seoTuKhoa, setSeoTuKhoa] = useState(cauHinhBanDau?.seo?.tu_khoa || "nấu ăn, công thức, ẩm thực việt, khóa học nấu ăn");

  // Payment info
  const [vnpayBat, setVnpayBat] = useState(cauHinhBanDau?.thanh_toan?.vnpay_bat ?? true);
  const [momoBat, setMomoBat] = useState(cauHinhBanDau?.thanh_toan?.momo_bat ?? false);
  const [stripeBat, setStripeBat] = useState(cauHinhBanDau?.thanh_toan?.stripe_bat ?? false);

  // Email info
  const [guiTu, setGuiTu] = useState(cauHinhBanDau?.email?.gui_tu || "Học Nấu Ăn <no-reply@webhocnauan.vn>");
  const [batEmailThanhToan, setBatEmailThanhToan] = useState(cauHinhBanDau?.email?.bat_email_thanh_toan ?? true);

  const xuLyLuu = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangLuu(true);

    try {
      const payload: CauHinhForm = {
        site: {
          ten_site: tenSite,
          slogan: slogan || "",
          logo_url: "",
          email_lien_he: emailLienHe,
          so_dien_thoai: soDienThoai || "",
          dia_chi: diaChi || "",
        },
        seo: {
          tieu_de: seoTieuDe,
          mo_ta: seoMoTa || "",
          tu_khoa: seoTuKhoa || "",
        },
        thanh_toan: {
          vnpay_bat: vnpayBat,
          momo_bat: momoBat,
          stripe_bat: stripeBat,
        },
        email: {
          gui_tu: guiTu,
          bat_email_thanh_toan: batEmailThanhToan,
        },
      };

      const res = await luuCauHinh(payload);
      if (res.thanh_cong) {
        toast.success("Đã cập nhật cấu hình hệ thống thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu cấu hình");
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <form onSubmit={xuLyLuu} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cấu Hình Toàn Hệ Thống</h1>
          <p className="text-sm text-muted-foreground">
            Thông tin website, tham số SEO, cổng thanh toán và cấu hình email gửi đi
          </p>
        </div>

        <Button type="submit" disabled={dangLuu}>
          {dangLuu ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu cấu hình
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin Site */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Thông tin Website
            </CardTitle>
            <CardDescription>Tên thương hiệu, thông tin liên hệ chân trang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ten_site">Tên website *</Label>
              <Input
                id="ten_site"
                value={tenSite}
                onChange={(e) => setTenSite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Khẩu hiệu (Slogan)</Label>
              <Input
                id="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_lh">Email liên hệ *</Label>
              <Input
                id="email_lh"
                type="email"
                value={emailLienHe}
                onChange={(e) => setEmailLienHe(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sdt">Hotline</Label>
                <Input
                  id="sdt"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dc">Địa chỉ</Label>
                <Input
                  id="dc"
                  value={diaChi}
                  onChange={(e) => setDiaChi(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" /> Cấu hình SEO
            </CardTitle>
            <CardDescription>Tối ưu hóa công cụ tìm kiếm và thẻ Open Graph</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_tieu_de">Tiêu đề trang chủ (Title tag) *</Label>
              <Input
                id="seo_tieu_de"
                value={seoTieuDe}
                onChange={(e) => setSeoTieuDe(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_mo_ta">Mô tả Meta (Meta Description)</Label>
              <Textarea
                id="seo_mo_ta"
                rows={3}
                value={seoMoTa}
                onChange={(e) => setSeoMoTa(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_tu_khoa">Từ khóa Meta (Keywords)</Label>
              <Input
                id="seo_tu_khoa"
                value={seoTuKhoa}
                onChange={(e) => setSeoTuKhoa(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cổng thanh toán */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Cổng thanh toán
            </CardTitle>
            <CardDescription>Bật/tắt các phương thức nạp tiền và học phí</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold text-sm">Cổng VNPay (Thẻ ATM/QR/Visa)</Label>
                <p className="text-xs text-muted-foreground">Kích hoạt VNPay Sandbox / Production</p>
              </div>
              <Switch checked={vnpayBat} onCheckedChange={setVnpayBat} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Label className="font-semibold text-sm">Ví MoMo</Label>
                <p className="text-xs text-muted-foreground">Thanh toán qua ví điện tử MoMo</p>
              </div>
              <Switch checked={momoBat} onCheckedChange={setMomoBat} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Label className="font-semibold text-sm">Stripe International</Label>
                <p className="text-xs text-muted-foreground">Hỗ trợ học viên quốc tế</p>
              </div>
              <Switch checked={stripeBat} onCheckedChange={setStripeBat} />
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-500" /> Email hệ thống (Resend)
            </CardTitle>
            <CardDescription>Cấu hình định dạng hòm thư gửi tự động</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gui_tu">Tên & Email gửi đi (Sender Header) *</Label>
              <Input
                id="gui_tu"
                value={guiTu}
                onChange={(e) => setGuiTu(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <Label className="font-semibold text-sm">Gửi biên lai học phí tự động</Label>
                <p className="text-xs text-muted-foreground">Gửi email xác nhận kèm hóa đơn khi thanh toán thành công</p>
              </div>
              <Switch checked={batEmailThanhToan} onCheckedChange={setBatEmailThanhToan} />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

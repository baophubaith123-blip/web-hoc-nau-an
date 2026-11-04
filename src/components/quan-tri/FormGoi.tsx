"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { taoGoiAction, suaGoiAction } from "@/lib/actions/quan-tri-goi";

interface FormGoiProps {
  goiBanDau?: {
    id: string;
    ma_goi: string;
    ten: string;
    mo_ta: string | null;
    thoi_han_ngay: number;
    gia: number;
    quyen_loi: string[] | null;
    thu_tu: number;
    hoat_dong: boolean;
  };
}

export function FormGoi({ goiBanDau }: FormGoiProps) {
  const router = useRouter();
  const laSua = !!goiBanDau;

  const [maGoi, setMaGoi] = useState(goiBanDau?.ma_goi || "pro_thang");
  const [ten, setTen] = useState(goiBanDau?.ten || "");
  const [moTa, setMoTa] = useState(goiBanDau?.mo_ta || "");
  const [thoiHanNgay, setThoiHanNgay] = useState(goiBanDau?.thoi_han_ngay || 30);
  const [gia, setGia] = useState(goiBanDau?.gia || 99000);
  const [quyenLoiText, setQuyenLoiText] = useState(
    goiBanDau?.quyen_loi ? (Array.isArray(goiBanDau.quyen_loi) ? goiBanDau.quyen_loi.join("\n") : "") : ""
  );
  const [thuTu, setThuTu] = useState(goiBanDau?.thu_tu ?? 0);
  const [hoatDong, setHoatDong] = useState(goiBanDau?.hoat_dong ?? true);

  const [dangLuu, setDangLuu] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ten.trim()) {
      toast.error("Vui lòng nhập tên gói.");
      return;
    }

    if (thoiHanNgay <= 0) {
      toast.error("Thời hạn ngày phải lớn hơn 0 (không hỗ trợ gói vĩnh viễn).");
      return;
    }

    const quyenLoi = quyenLoiText
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);

    setDangLuu(true);
    try {
      if (laSua) {
        const res = await suaGoiAction({
          id: goiBanDau.id,
          ten,
          mo_ta: moTa,
          thoi_han_ngay: Number(thoiHanNgay),
          gia: Number(gia),
          quyen_loi: quyenLoi,
          thu_tu: Number(thuTu),
          hoat_dong: hoatDong,
        });

        if (!res.thanh_cong) {
          toast.error(res.loi || "Cập nhật gói thất bại");
          setDangLuu(false);
          return;
        }

        toast.success("Cập nhật gói thành công!");
      } else {
        const res = await taoGoiAction({
          ma_goi: maGoi,
          ten,
          mo_ta: moTa,
          thoi_han_ngay: Number(thoiHanNgay),
          gia: Number(gia),
          quyen_loi: quyenLoi,
          thu_tu: Number(thuTu),
          hoat_dong: hoatDong,
        });

        if (!res.thanh_cong) {
          toast.error(res.loi || "Tạo gói thất bại");
          setDangLuu(false);
          return;
        }

        toast.success("Tạo gói Premium mới thành công!");
      }

      router.push("/quan-tri/quan-ly-goi");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xử lý dữ liệu");
      setDangLuu(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild type="button" className="gap-2">
          <Link href="/quan-tri/quan-ly-goi">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách gói</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{laSua ? "Chỉnh sửa gói Premium" : "Thêm gói Premium mới"}</CardTitle>
          <CardDescription>
            Cấu hình thời hạn, giá và các quyền lợi đặc quyền dành cho gói thành viên Pro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ma_goi">Mã gói (định danh)</Label>
              <Input
                id="ma_goi"
                value={maGoi}
                onChange={(e) => setMaGoi(e.target.value)}
                disabled={laSua}
                placeholder="ví dụ: pro_thang, pro_nam"
                required
              />
              <p className="text-xs text-muted-foreground">Chỉ gồm chữ thường, số, dấu gạch dưới.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ten">Tên hiển thị</Label>
              <Input
                id="ten"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                placeholder="ví dụ: Pro Tháng, Pro Năm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mo_ta">Mô tả ngắn</Label>
            <Textarea
              id="mo_ta"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Mô tả giá trị nổi bật của gói này..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thoi_han_ngay">Thời hạn sử dụng (Số ngày)</Label>
              <Input
                id="thoi_han_ngay"
                type="number"
                min={1}
                value={thoiHanNgay}
                onChange={(e) => setThoiHanNgay(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">Ví dụ: 30 ngày (Tháng) hoặc 365 ngày (Năm). Không có gói vĩnh viễn.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gia">Giá cước (VNĐ)</Label>
              <Input
                id="gia"
                type="number"
                min={0}
                step={1000}
                value={gia}
                onChange={(e) => setGia(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quyen_loi">Quyền lợi chi tiết (Mỗi dòng một đặc quyền)</Label>
            <Textarea
              id="quyen_loi"
              value={quyenLoiText}
              onChange={(e) => setQuyenLoiText(e.target.value)}
              placeholder="Xem video Full HD 1080p&#10;Tải tài liệu PDF công thức độc quyền&#10;Làm bài tập trắc nghiệm có chấm điểm&#10;Nhận chứng chỉ tốt nghiệp chính thức"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="thu_tu">Thứ tự hiển thị</Label>
              <Input
                id="thu_tu"
                type="number"
                value={thuTu}
                onChange={(e) => setThuTu(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="hoat_dong" className="font-semibold block cursor-pointer">
                  Mở bán gói này
                </Label>
                <p className="text-xs text-muted-foreground">Hiển thị trên bảng giá công khai</p>
              </div>
              <Switch
                id="hoat_dong"
                checked={hoatDong}
                onCheckedChange={setHoatDong}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/quan-tri/quan-ly-goi")}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={dangLuu} className="gap-2">
              {dangLuu ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{laSua ? "Lưu thay đổi" : "Tạo gói mới"}</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

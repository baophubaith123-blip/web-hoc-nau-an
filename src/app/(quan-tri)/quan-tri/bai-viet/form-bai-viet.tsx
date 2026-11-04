"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { taoBaiViet, capNhatBaiViet } from "@/lib/actions/bai-viet";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { Bang } from "@/types";

interface FormBaiVietProps {
  baiVietHienTai?: Bang<"bai_viet"> | null;
}

export function FormBaiViet({ baiVietHienTai }: FormBaiVietProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const [tieuDe, setTieuDe] = useState(baiVietHienTai?.tieu_de || "");
  const [tomTat, setTomTat] = useState(baiVietHienTai?.tom_tat || "");
  const [noiDung, setNoiDung] = useState(baiVietHienTai?.noi_dung || "");
  const [anhDaiDien, setAnhDaiDien] = useState(baiVietHienTai?.anh_dai_dien || "");
  const [danhMuc, setDanhMuc] = useState(baiVietHienTai?.danh_muc || "Cẩm nang ẩm thực");
  const [trangThai, setTrangThai] = useState<"nhap" | "xuat_ban" | "luu_tru">(
    baiVietHienTai?.trang_thai || "xuat_ban"
  );

  const xuLyLuu = async () => {
    if (!tieuDe.trim() || !noiDung.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung bài viết!");
      return;
    }

    setDangXuLy(true);
    try {
      const payload = {
        tieu_de: tieuDe.trim(),
        tom_tat: tomTat.trim() || undefined,
        noi_dung: noiDung.trim(),
        anh_dai_dien: anhDaiDien.trim() || undefined,
        danh_muc: danhMuc.trim() || undefined,
        trang_thai: trangThai,
      };

      let res;
      if (baiVietHienTai) {
        res = await capNhatBaiViet(baiVietHienTai.id, payload);
      } else {
        res = await taoBaiViet(payload);
      }

      if (res.thanh_cong) {
        toast.success(
          baiVietHienTai ? "Đã cập nhật bài viết thành công!" : "Đã tạo bài viết mới thành công!"
        );
        router.push("/quan-tri/bai-viet");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu bài viết");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/quan-tri/bai-viet">
              <ArrowLeft className="w-4 h-4 mr-1" /> Danh sách bài viết
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {baiVietHienTai ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </h1>
        </div>

        <Button onClick={xuLyLuu} disabled={dangXuLy}>
          {dangXuLy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {baiVietHienTai ? "Lưu thay đổi" : "Xuất bản bài viết"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tieu_de_bv">Tiêu đề bài viết *</Label>
                <Input
                  id="tieu_de_bv"
                  placeholder="Ví dụ: Bí quyết ướp thịt nướng chuẩn vị nhà hàng 5 sao"
                  value={tieuDe}
                  onChange={(e) => setTieuDe(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tom_tat_bv">Tóm tắt ngắn</Label>
                <Textarea
                  id="tom_tat_bv"
                  rows={3}
                  placeholder="Đoạn văn ngắn giới thiệu nội dung hiển thị ở danh sách bài viết..."
                  value={tomTat}
                  onChange={(e) => setTomTat(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noi_dung_bv">Nội dung chi tiết *</Label>
                <Textarea
                  id="noi_dung_bv"
                  rows={15}
                  placeholder="Viết toàn bộ nội dung bài hướng dẫn hoặc chia sẻ ẩm thực tại đây..."
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phân loại & Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={trangThai}
                  onValueChange={(val) => {
                    if (val) setTrangThai(val as "nhap" | "xuat_ban" | "luu_tru");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái">
                      {(value: string) =>
                        value
                          ? ({
                              xuat_ban: "Xuất bản công khai",
                              nhap: "Bản nháp",
                              luu_tru: "Lưu trữ (Ẩn)",
                            } as Record<string, string>)[value] ?? value
                          : "Chọn trạng thái"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xuat_ban">Xuất bản công khai</SelectItem>
                    <SelectItem value="nhap">Bản nháp</SelectItem>
                    <SelectItem value="luu_tru">Lưu trữ (Ẩn)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="danh_muc_bv">Chuyên mục</Label>
                <Input
                  id="danh_muc_bv"
                  placeholder="VD: Mẹo vặt nhà bếp"
                  value={danhMuc}
                  onChange={(e) => setDanhMuc(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anh_bv">Link ảnh bìa (URL)</Label>
                <Input
                  id="anh_bv"
                  placeholder="https://..."
                  value={anhDaiDien}
                  onChange={(e) => setAnhDaiDien(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { khoaHocSchema, type KhoaHocForm } from "@/lib/validations/khoa-hoc";
import { taoKhoaHoc, capNhatKhoaHoc } from "@/lib/actions/khoa-hoc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

interface FormKhoaHocProps {
  khoaHocId?: string;
  duLieuMacDinh?: Partial<KhoaHocForm>;
  vaiTroNguoiDung?: "chef" | "admin";
  urlQuayLai?: string;
}

export function FormKhoaHoc({
  khoaHocId,
  duLieuMacDinh,
  vaiTroNguoiDung = "chef",
  urlQuayLai = "/bep/quan-ly-khoa-hoc",
}: FormKhoaHocProps) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KhoaHocForm>({
    resolver: zodResolver(khoaHocSchema),
    defaultValues: {
      tieu_de: duLieuMacDinh?.tieu_de || "",
      mo_ta: duLieuMacDinh?.mo_ta || "",
      mo_ta_chi_tiet: duLieuMacDinh?.mo_ta_chi_tiet || "",
      anh_dai_dien: duLieuMacDinh?.anh_dai_dien || "",
      video_gioi_thieu: duLieuMacDinh?.video_gioi_thieu || "",
      cap_do: duLieuMacDinh?.cap_do || "co_ban",
      gia: duLieuMacDinh?.gia || 0,
      mien_phi: duLieuMacDinh?.mien_phi ?? true,
      co_chung_chi: duLieuMacDinh?.co_chung_chi ?? false,
      co_tai_lieu: duLieuMacDinh?.co_tai_lieu ?? false,
      co_bai_tap: duLieuMacDinh?.co_bai_tap ?? false,
      ho_tro_1_1: duLieuMacDinh?.ho_tro_1_1 ?? false,
    },
  });

  const mienPhi = watch("mien_phi");
  const capDo = watch("cap_do");

  const xuLyLuu = async (duLieu: KhoaHocForm, mucDich: "luu" | "gui") => {
    setDangXuLy(true);
    try {
      let kq;
      if (khoaHocId) {
        kq = await capNhatKhoaHoc(khoaHocId, duLieu, mucDich);
      } else {
        kq = await taoKhoaHoc(duLieu, mucDich);
      }

      if (kq.thanh_cong) {
        toast.success(
          mucDich === "gui"
            ? vaiTroNguoiDung === "admin"
              ? "Xuất bản khóa học thành công!"
              : "Đã gửi khóa học chờ duyệt!"
            : "Đã lưu nháp khóa học!"
        );
        router.push(urlQuayLai);
        router.refresh();
      } else {
        toast.error(kq.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <form className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={urlQuayLai}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {khoaHocId ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={dangXuLy}
            onClick={handleSubmit((data) => xuLyLuu(data, "luu"))}
          >
            {dangXuLy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Lưu nháp
          </Button>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={dangXuLy}
            onClick={handleSubmit((data) => xuLyLuu(data, "gui"))}
          >
            {dangXuLy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {vaiTroNguoiDung === "admin" ? "Xuất bản ngay" : "Gửi phê duyệt"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin chính */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Tiêu đề, mô tả và giới thiệu tổng quan khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tieu_de">Tiêu đề khóa học *</Label>
                <Input
                  id="tieu_de"
                  placeholder="Ví dụ: Kỹ thuật làm bánh Âu chuyên nghiệp"
                  {...register("tieu_de")}
                />
                {errors.tieu_de && (
                  <p className="text-sm text-destructive">{errors.tieu_de.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mo_ta">Mô tả ngắn gọn *</Label>
                <Textarea
                  id="mo_ta"
                  rows={3}
                  placeholder="Giới thiệu tóm tắt mục tiêu và đối tượng của khóa học..."
                  {...register("mo_ta")}
                />
                {errors.mo_ta && (
                  <p className="text-sm text-destructive">{errors.mo_ta.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mo_ta_chi_tiet">Mô tả chi tiết</Label>
                <Textarea
                  id="mo_ta_chi_tiet"
                  rows={8}
                  placeholder="Nội dung khóa học, kỹ năng đạt được, lộ trình từng tuần..."
                  {...register("mo_ta_chi_tiet")}
                />
                {errors.mo_ta_chi_tiet && (
                  <p className="text-sm text-destructive">{errors.mo_ta_chi_tiet.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh & Video giới thiệu</CardTitle>
              <CardDescription>Hình ảnh thu hút và trailer khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anh_dai_dien">Link ảnh bìa (URL)</Label>
                <Input
                  id="anh_dai_dien"
                  placeholder="https://images.unsplash.com/photo-..."
                  {...register("anh_dai_dien")}
                />
                {errors.anh_dai_dien && (
                  <p className="text-sm text-destructive">{errors.anh_dai_dien.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_gioi_thieu">Link YouTube giới thiệu (Trailer)</Label>
                <Input
                  id="video_gioi_thieu"
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...register("video_gioi_thieu")}
                />
                {errors.video_gioi_thieu && (
                  <p className="text-sm text-destructive">{errors.video_gioi_thieu.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thiết lập và quyền lợi */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cấp độ & Học phí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cấp độ phù hợp</Label>
                <Select
                  value={capDo}
                  onValueChange={(val) => {
                    if (val) setValue("cap_do", val as "co_ban" | "trung_cap" | "nang_cao");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="co_ban">Cơ bản cho người mới</SelectItem>
                    <SelectItem value="trung_cap">Trung cấp / Thực hành</SelectItem>
                    <SelectItem value="nang_cao">Nâng cao / Chuyên nghiệp</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cap_do && (
                  <p className="text-sm text-destructive">{errors.cap_do.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <Label htmlFor="mien_phi" className="font-medium">Khóa học miễn phí</Label>
                  <p className="text-xs text-muted-foreground">Mọi học viên đều có thể tham gia</p>
                </div>
                <Switch
                  id="mien_phi"
                  checked={mienPhi}
                  onCheckedChange={(checked) => {
                    setValue("mien_phi", checked);
                    if (checked) {
                      setValue("gia", 0);
                      setValue("co_chung_chi", false);
                      setValue("co_tai_lieu", false);
                      setValue("co_bai_tap", false);
                      setValue("ho_tro_1_1", false);
                    }
                  }}
                />
              </div>

              {!mienPhi && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="gia">Học phí (VNĐ) *</Label>
                  <Input
                    id="gia"
                    type="number"
                    step="1000"
                    placeholder="299000"
                    {...register("gia", { valueAsNumber: true })}
                  />
                  {errors.gia && (
                    <p className="text-sm text-destructive">{errors.gia.message}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quyền lợi học viên</CardTitle>
              <CardDescription>
                {mienPhi ? "Khóa miễn phí không bao gồm chứng chỉ và hỗ trợ 1-1" : "Chọn các quyền lợi đi kèm"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Cấp chứng chỉ hoàn thành</Label>
                  <p className="text-xs text-muted-foreground">PDF có mã QR xác minh</p>
                </div>
                <Switch
                  disabled={mienPhi}
                  checked={watch("co_chung_chi")}
                  onCheckedChange={(c) => setValue("co_chung_chi", c)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Tài liệu đính kèm bài học</Label>
                  <p className="text-xs text-muted-foreground">Tải file công thức & mẹo</p>
                </div>
                <Switch
                  disabled={mienPhi}
                  checked={watch("co_tai_lieu")}
                  onCheckedChange={(c) => setValue("co_tai_lieu", c)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Bài tập trắc nghiệm</Label>
                  <p className="text-xs text-muted-foreground">Kiểm tra kiến thức cuối bài</p>
                </div>
                <Switch
                  disabled={mienPhi}
                  checked={watch("co_bai_tap")}
                  onCheckedChange={(c) => setValue("co_bai_tap", c)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Hỗ trợ 1-1 cùng đầu bếp</Label>
                  <p className="text-xs text-muted-foreground">Hỏi đáp trực tiếp qua chat</p>
                </div>
                <Switch
                  disabled={mienPhi}
                  checked={watch("ho_tro_1_1")}
                  onCheckedChange={(c) => setValue("ho_tro_1_1", c)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

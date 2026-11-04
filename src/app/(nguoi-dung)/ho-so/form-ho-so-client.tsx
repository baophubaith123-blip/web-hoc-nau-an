"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hoSoSchema, doiMatKhauSchema, type HoSoForm, type DoiMatKhauForm } from "@/lib/validations/ho-so";
import { capNhatHoSo, doiMatKhau } from "@/lib/actions/ho-so";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, KeyRound } from "lucide-react";
import type { Bang } from "@/types";

interface FormHoSoClientProps {
  profile: Bang<"profiles">;
}

export function FormHoSoClient({ profile }: FormHoSoClientProps) {
  const [dangLuuHoSo, setDangLuuHoSo] = useState(false);
  const [dangDoiMk, setDangDoiMk] = useState(false);

  // Form hồ sơ
  const formHoSo = useForm<HoSoForm>({
    resolver: zodResolver(hoSoSchema),
    defaultValues: {
      ho_ten: profile.ho_ten || "",
      username: profile.username || "",
      bio: profile.bio || "",
      so_dien_thoai: profile.so_dien_thoai || "",
      dia_chi: profile.dia_chi || "",
      ngay_sinh: profile.ngay_sinh || "",
      gioi_tinh: profile.gioi_tinh || "",
    },
  });

  // Form đổi mật khẩu
  const formDoiMk = useForm<DoiMatKhauForm>({
    resolver: zodResolver(doiMatKhauSchema),
    defaultValues: {
      mat_khau_hien_tai: "",
      mat_khau_moi: "",
      xac_nhan_mat_khau: "",
    },
  });

  const onSubmitHoSo = async (data: HoSoForm) => {
    setDangLuuHoSo(true);
    try {
      const res = await capNhatHoSo(data);
      if (res.thanh_cong) {
        toast.success("Cập nhật thông tin hồ sơ thành công!");
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể cập nhật hồ sơ");
    } finally {
      setDangLuuHoSo(false);
    }
  };

  const onSubmitDoiMk = async (data: DoiMatKhauForm) => {
    setDangDoiMk(true);
    try {
      const res = await doiMatKhau(data);
      if (res.thanh_cong) {
        toast.success("Đổi mật khẩu thành công!");
        formDoiMk.reset();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể đổi mật khẩu");
    } finally {
      setDangDoiMk(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* THÔNG TIN CÁ NHÂN */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
          <CardDescription>
            Cập nhật tên hiển thị, tiểu sử và thông tin liên lạc của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formHoSo.handleSubmit(onSubmitHoSo)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ho_ten">Họ và tên *</Label>
                <Input
                  id="ho_ten"
                  disabled={dangLuuHoSo}
                  {...formHoSo.register("ho_ten")}
                />
                {formHoSo.formState.errors.ho_ten && (
                  <p className="text-xs text-destructive">
                    {formHoSo.formState.errors.ho_ten.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Tên người dùng (username) *</Label>
                <Input
                  id="username"
                  disabled={dangLuuHoSo}
                  {...formHoSo.register("username")}
                />
                {formHoSo.formState.errors.username && (
                  <p className="text-xs text-destructive">
                    {formHoSo.formState.errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Tiểu sử</Label>
              <Textarea
                id="bio"
                placeholder="Giới thiệu đôi nét về bản thân hoặc sở thích ẩm thực..."
                rows={3}
                disabled={dangLuuHoSo}
                {...formHoSo.register("bio")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                <Input
                  id="so_dien_thoai"
                  disabled={dangLuuHoSo}
                  {...formHoSo.register("so_dien_thoai")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gioi_tinh">Giới tính</Label>
                <Select
                  value={formHoSo.watch("gioi_tinh") || ""}
                  onValueChange={(val) => formHoSo.setValue("gioi_tinh", val as any)}
                  disabled={dangLuuHoSo}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính">
                      {(value: string) =>
                        value
                          ? ({ nam: "Nam", nu: "Nữ", khac: "Khác" } as Record<string, string>)[value] ?? value
                          : "Chọn giới tính"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nam">Nam</SelectItem>
                    <SelectItem value="nu">Nữ</SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dia_chi">Địa chỉ</Label>
              <Input
                id="dia_chi"
                disabled={dangLuuHoSo}
                {...formHoSo.register("dia_chi")}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={dangLuuHoSo} className="gap-2">
                {dangLuuHoSo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ĐỔI MẬT KHẨU */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <span>Đổi mật khẩu</span>
          </CardTitle>
          <CardDescription>
            Đảm bảo mật khẩu của bạn có tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formDoiMk.handleSubmit(onSubmitDoiMk)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mat_khau_hien_tai">Mật khẩu hiện tại</Label>
              <Input
                id="mat_khau_hien_tai"
                type="password"
                disabled={dangDoiMk}
                {...formDoiMk.register("mat_khau_hien_tai")}
              />
              {formDoiMk.formState.errors.mat_khau_hien_tai && (
                <p className="text-xs text-destructive">
                  {formDoiMk.formState.errors.mat_khau_hien_tai.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mat_khau_moi">Mật khẩu mới</Label>
                <Input
                  id="mat_khau_moi"
                  type="password"
                  disabled={dangDoiMk}
                  {...formDoiMk.register("mat_khau_moi")}
                />
                {formDoiMk.formState.errors.mat_khau_moi && (
                  <p className="text-xs text-destructive">
                    {formDoiMk.formState.errors.mat_khau_moi.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="xac_nhan_mk">Xác nhận mật khẩu mới</Label>
                <Input
                  id="xac_nhan_mk"
                  type="password"
                  disabled={dangDoiMk}
                  {...formDoiMk.register("xac_nhan_mat_khau")}
                />
                {formDoiMk.formState.errors.xac_nhan_mat_khau && (
                  <p className="text-xs text-destructive">
                    {formDoiMk.formState.errors.xac_nhan_mat_khau.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline" disabled={dangDoiMk} className="gap-2">
                {dangDoiMk ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

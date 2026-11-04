"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dangKySchema, type DangKyForm } from "@/lib/validations/auth";
import { dangKy } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { vi } from "@/lib/i18n/vi";
import { CheckCircle2, Loader2 } from "lucide-react";

export function FormDangKy() {
  const router = useRouter();
  const [dangGui, setDangGui] = useState(false);
  const [thanhCong, setThanhCong] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DangKyForm>({
    resolver: zodResolver(dangKySchema),
    defaultValues: {
      ho_ten: "",
      email: "",
      mat_khau: "",
      xac_nhan_mat_khau: "",
      dong_y: false,
    },
  });

  const dongY = watch("dong_y");

  const onSubmit = async (data: DangKyForm) => {
    setDangGui(true);
    try {
      const res = await dangKy(data);
      if (res.thanh_cong) {
        if (res.du_lieu.can_xac_nhan) {
          setThanhCong(true);
        } else {
          toast.success(vi.auth.dang_ky_thanh_cong);
          router.push("/bang-dieu-khien");
          router.refresh();
        }
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error(vi.loi.chung);
    } finally {
      setDangGui(false);
    }
  };

  if (thanhCong) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md text-center p-6 space-y-4">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-xl font-bold">{vi.auth.dang_ky_thanh_cong}</CardTitle>
        <p className="text-sm text-muted-foreground">{vi.auth.email_chua_xac_nhan}</p>
        <Button asChild className="w-full mt-4">
          <Link href="/dang-nhap">{vi.auth.dang_nhap}</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{vi.auth.dang_ky}</CardTitle>
        <CardDescription>{vi.auth.tao_tai_khoan}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ho_ten">{vi.auth.ho_ten}</Label>
            <Input
              id="ho_ten"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              disabled={dangGui}
              {...register("ho_ten")}
            />
            {errors.ho_ten && (
              <p className="text-xs text-destructive">{errors.ho_ten.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{vi.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="ban@example.com"
              autoComplete="email"
              disabled={dangGui}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mat_khau">{vi.auth.mat_khau}</Label>
            <Input
              id="mat_khau"
              type="password"
              placeholder="Tối thiểu 8 ký tự, có chữ hoa, thường, số"
              autoComplete="new-password"
              disabled={dangGui}
              {...register("mat_khau")}
            />
            {errors.mat_khau && (
              <p className="text-xs text-destructive">{errors.mat_khau.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="xac_nhan_mat_khau">{vi.auth.xac_nhan_mat_khau}</Label>
            <Input
              id="xac_nhan_mat_khau"
              type="password"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              disabled={dangGui}
              {...register("xac_nhan_mat_khau")}
            />
            {errors.xac_nhan_mat_khau && (
              <p className="text-xs text-destructive">{errors.xac_nhan_mat_khau.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="dong_y"
              checked={dongY}
              onCheckedChange={(c) => setValue("dong_y", !!c)}
              disabled={dangGui}
            />
            <Label htmlFor="dong_y" className="text-xs cursor-pointer text-muted-foreground">
              {vi.auth.dong_y_dieu_khoan}
            </Label>
          </div>
          {errors.dong_y && (
            <p className="text-xs text-destructive">{errors.dong_y.message}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={dangGui}>
            {dangGui ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {vi.chung.dang_xu_ly}
              </>
            ) : (
              vi.auth.dang_ky
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {vi.auth.da_co_tai_khoan}{" "}
            <Link href="/dang-nhap" className="font-semibold text-primary hover:underline">
              {vi.auth.dang_nhap}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

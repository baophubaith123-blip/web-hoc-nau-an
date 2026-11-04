"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { datLaiMatKhauSchema, type DatLaiMatKhauForm } from "@/lib/validations/auth";
import { datLaiMatKhau } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { vi } from "@/lib/i18n/vi";
import { Loader2 } from "lucide-react";

export function FormDatLaiMatKhau() {
  const router = useRouter();
  const [dangGui, setDangGui] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatLaiMatKhauForm>({
    resolver: zodResolver(datLaiMatKhauSchema),
    defaultValues: {
      mat_khau: "",
      xac_nhan_mat_khau: "",
    },
  });

  const onSubmit = async (data: DatLaiMatKhauForm) => {
    setDangGui(true);
    try {
      const res = await datLaiMatKhau(data);
      if (res.thanh_cong) {
        toast.success(vi.auth.dat_lai_thanh_cong);
        router.push("/dang-nhap");
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error(vi.loi.chung);
    } finally {
      setDangGui(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{vi.auth.dat_lai_mat_khau}</CardTitle>
        <CardDescription>{vi.auth.mat_khau_moi}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mat_khau">{vi.auth.mat_khau_moi}</Label>
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
              placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
              disabled={dangGui}
              {...register("xac_nhan_mat_khau")}
            />
            {errors.xac_nhan_mat_khau && (
              <p className="text-xs text-destructive">{errors.xac_nhan_mat_khau.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={dangGui}>
            {dangGui ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {vi.chung.dang_xu_ly}
              </>
            ) : (
              vi.chung.luu
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/dang-nhap" className="text-primary hover:underline">
              {vi.chung.quay_lai} {vi.auth.dang_nhap}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

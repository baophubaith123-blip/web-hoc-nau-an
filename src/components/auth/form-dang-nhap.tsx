"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dangNhapSchema, type DangNhapForm } from "@/lib/validations/auth";
import { dangNhap } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { vi } from "@/lib/i18n/vi";
import { Loader2 } from "lucide-react";

export function FormDangNhap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quayLai = searchParams.get("chuyen_den") || searchParams.get("next");
  const [dangGui, setDangGui] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DangNhapForm>({
    resolver: zodResolver(dangNhapSchema),
    defaultValues: {
      email: "",
      mat_khau: "",
    },
  });

  const onSubmit = async (data: DangNhapForm) => {
    setDangGui(true);
    try {
      const res = await dangNhap(data, quayLai);
      if (res.thanh_cong) {
        toast.success(vi.auth.dang_nhap_thanh_cong);
        router.push(res.du_lieu.chuyen_den);
        router.refresh();
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
        <CardTitle className="text-2xl font-bold">{vi.auth.dang_nhap}</CardTitle>
        <CardDescription>{vi.auth.chao_mung_quay_lai}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="mat_khau">{vi.auth.mat_khau}</Label>
              <Link
                href="/quen-mat-khau"
                className="text-xs text-primary hover:underline"
              >
                {vi.auth.quen_mat_khau}
              </Link>
            </div>
            <Input
              id="mat_khau"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={dangGui}
              {...register("mat_khau")}
            />
            {errors.mat_khau && (
              <p className="text-xs text-destructive">{errors.mat_khau.message}</p>
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
              vi.auth.dang_nhap
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {vi.auth.chua_co_tai_khoan}{" "}
            <Link href="/dang-ky" className="font-semibold text-primary hover:underline">
              {vi.auth.dang_ky}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

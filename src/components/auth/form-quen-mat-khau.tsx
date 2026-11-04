"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quenMatKhauSchema, type QuenMatKhauForm } from "@/lib/validations/auth";
import { quenMatKhau } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { vi } from "@/lib/i18n/vi";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export function FormQuenMatKhau() {
  const [dangGui, setDangGui] = useState(false);
  const [daGui, setDaGui] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuenMatKhauForm>({
    resolver: zodResolver(quenMatKhauSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: QuenMatKhauForm) => {
    setDangGui(true);
    try {
      const res = await quenMatKhau(data);
      if (res.thanh_cong) {
        setDaGui(true);
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error(vi.loi.chung);
    } finally {
      setDangGui(false);
    }
  };

  if (daGui) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md text-center p-6 space-y-4">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-xl font-bold">{vi.auth.da_gui_email_dat_lai}</CardTitle>
        <p className="text-sm text-muted-foreground">{vi.auth.quen_mat_khau_mo_ta}</p>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link href="/dang-nhap">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {vi.chung.quay_lai} {vi.auth.dang_nhap}
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{vi.auth.quen_mat_khau}</CardTitle>
        <CardDescription>{vi.auth.quen_mat_khau_mo_ta}</CardDescription>
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
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={dangGui}>
            {dangGui ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {vi.chung.dang_xu_ly}
              </>
            ) : (
              vi.auth.gui_lien_ket
            )}
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/dang-nhap">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {vi.chung.quay_lai} {vi.auth.dang_nhap}
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

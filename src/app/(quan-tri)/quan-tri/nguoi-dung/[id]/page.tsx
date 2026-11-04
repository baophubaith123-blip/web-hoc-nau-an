import { notFound } from "next/navigation";
import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ChiTietNguoiDungClient } from "./chi-tiet-nguoi-dung-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, MapPin, Calendar } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChiTietNguoiDungPage({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: nguoiDung } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!nguoiDung) {
    notFound();
  }

  const { data: danhSachGoi } = await supabase
    .from("goi_premium")
    .select("id, ma_goi, ten, thoi_han_ngay")
    .eq("hoat_dong", true)
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Button variant="outline" size="sm" asChild className="mb-2">
          <Link href="/quan-tri/nguoi-dung">
            <ArrowLeft className="w-4 h-4 mr-1" /> Danh sách người dùng
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Chi Tiết Tài Khoản</h1>
      </div>

      {/* Thông tin hồ sơ */}
      <div className="p-6 border rounded-2xl bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={nguoiDung.avatar_url || undefined} />
          <AvatarFallback className="text-xl">{(nguoiDung.ho_ten || "U")[0]}</AvatarFallback>
        </Avatar>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{nguoiDung.ho_ten || "Chưa đặt tên"}</h2>
            <Badge variant="outline" className="capitalize">
              {nguoiDung.vai_tro}
            </Badge>
            {nguoiDung.trang_thai === "khoa" && (
              <Badge variant="destructive">Đã khóa</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Username: <span className="font-mono text-foreground">@{nguoiDung.username || "chua_co"}</span>
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            {nguoiDung.so_dien_thoai && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {nguoiDung.so_dien_thoai}
              </span>
            )}
            {nguoiDung.dia_chi && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {nguoiDung.dia_chi}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Tham gia: {dinhDangTuongDoi(nguoiDung.created_at)}
            </span>
          </div>

          {nguoiDung.bio && (
            <p className="text-xs text-muted-foreground italic pt-1 border-t">
              &quot;{nguoiDung.bio}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Phân quyền và Thao tác */}
      <ChiTietNguoiDungClient
        nguoiDung={nguoiDung}
        idAdminHienTai={phien.user.id}
        danhSachGoi={danhSachGoi ?? []}
      />
    </div>
  );
}

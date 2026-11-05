import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ChefHat,
  Crown,
  PenLine,
  PlusCircle,
  Send,
  Newspaper,
} from "lucide-react";
import { FormHoSoClient } from "./form-ho-so-client";
import { TaiAvatar } from "./tai-avatar";
import { NutKhoaPro } from "@/components/layout/nut-khoa-pro";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { laProConHan } from "@/lib/actions/chung";

const NHAN_VAI_TRO: Record<string, string> = {
  user: "Học viên",
  chef: "Đầu bếp",
  support: "Nhân viên hỗ trợ",
  admin: "Quản trị viên",
};

export default async function TrangHoSo() {
  const phien = await yeuCauVaiTro();
  const profile = phien.profile;
  const supabase = await taoSupabaseServer();

  const proHopLe = laProConHan(profile);
  const quyenCao = profile.vai_tro === "chef" || profile.vai_tro === "admin";
  const duocDangBai = quyenCao || proHopLe;

  // Gói Pro hiện tại + thống kê nội dung của tôi (chạy song song)
  const [goiRes, congThucRes, baiVietRes] = await Promise.all([
    profile.goi_hien_tai_id
      ? supabase
          .from("goi_premium")
          .select("ten, thoi_han_ngay")
          .eq("id", profile.goi_hien_tai_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("cong_thuc").select("trang_thai").eq("tac_gia_id", phien.user.id).is("deleted_at", null),
    supabase.from("bai_viet").select("id", { count: "exact", head: true }).eq("tac_gia_id", phien.user.id),
  ]);

  const goi = goiRes.data;
  const congThucCuaToi = congThucRes.data || [];
  const soCongThucChoDuyet = congThucCuaToi.filter((c) => c.trang_thai === "cho_duyet").length;
  const soBaiViet = baiVietRes.count || 0;

  const soNgayConLai = profile.goi_het_han
    ? Math.max(0, Math.ceil((new Date(profile.goi_het_han).getTime() - Date.now()) / 86400000))
    : 0;
  const phanTramConLai =
    goi && goi.thoi_han_ngay > 0
      ? Math.min(100, Math.round((soNgayConLai / goi.thoi_han_ngay) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Quản lý thông tin cá nhân, hạng thành viên và nội dung bạn chia sẻ
        </p>
      </div>

      {/* THẺ ĐẦU TRANG: avatar + tên + huy hiệu */}
      <div className="overflow-hidden rounded-3xl border bg-card shadow-xs">
        <div className="animate-gradient h-24 bg-gradient-to-r from-primary via-orange-600 to-amber-500 md:h-28" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="-mt-12 shrink-0 md:-mt-14">
            <TaiAvatar
              userId={phien.user.id}
              avatarUrl={profile.avatar_url}
              hoTen={profile.ho_ten || profile.username || "Bạn"}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 sm:pb-1">
            <h2 className="truncate text-xl font-bold">{profile.ho_ten || "Chưa đặt tên"}</h2>
            <p className="text-sm text-muted-foreground">
              @{profile.username || "nguoi-dung"} • Thành viên từ{" "}
              {new Date(profile.created_at).toLocaleDateString("vi-VN")}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                {NHAN_VAI_TRO[profile.vai_tro] || profile.vai_tro}
              </Badge>
              {proHopLe ? (
                <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                  <Crown className="h-3.5 w-3.5 fill-white" />
                  Thành viên Pro
                </Badge>
              ) : profile.vai_tro === "user" ? (
                <Badge variant="outline">Thành viên thường</Badge>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* THẺ HẠNG THÀNH VIÊN */}
      {profile.vai_tro === "user" &&
        (proHopLe ? (
          <div className="gradient-border rounded-3xl">
            <div className="space-y-4 rounded-[calc(1.5rem-1px)] bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15">
                    <Crown className="h-6 w-6 fill-amber-500 text-amber-500" />
                  </span>
                  <div>
                    <p className="font-bold">
                      Bạn đang là thành viên Pro{goi ? ` — ${goi.ten}` : ""}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      Hết hạn{" "}
                      {new Date(profile.goi_het_han as string).toLocaleDateString("vi-VN")} • còn{" "}
                      {soNgayConLai} ngày
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="gap-1">
                  <Link href="/goi-cua-toi">
                    Quản lý gói của tôi
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {goi && (
                <div className="space-y-1.5">
                  <Progress value={phanTramConLai} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Đã dùng {100 - phanTramConLai}% thời hạn gói {goi.thoi_han_ngay} ngày
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
                  <Crown className="h-6 w-6 text-muted-foreground" />
                </span>
                <div>
                  <p className="font-bold">Bạn đang là thành viên thường</p>
                  <p className="text-sm text-muted-foreground">
                    Nâng cấp Pro để tự đăng công thức &amp; bài viết, học không giới hạn mọi khóa
                    học và nhận chứng chỉ.
                  </p>
                </div>
              </div>
              <Button asChild className="gap-2 shadow-md">
                <Link href="/bang-gia">
                  <Crown className="h-4 w-4" />
                  Nâng cấp Pro
                </Link>
              </Button>
            </div>
          </div>
        ))}

      {/* NỘI DUNG CỦA TÔI */}
      <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <ChefHat className="h-5 w-5 text-primary" />
            Nội dung của tôi
          </h3>
          <p className="text-sm text-muted-foreground">
            {congThucCuaToi.length} công thức ({soCongThucChoDuyet} đang chờ duyệt) • {soBaiViet}{" "}
            bài viết
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Ô thêm công thức */}
          {duocDangBai ? (
            <Link
              href="/tao-cong-thuc"
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <PlusCircle className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold">Thêm công thức của tôi</span>
                <span className="block text-sm text-muted-foreground">
                  Chia sẻ món ngon của bạn, quản trị viên sẽ duyệt trước khi đăng
                </span>
              </span>
            </Link>
          ) : (
            <NutKhoaPro
              tinhNang="Đăng công thức"
              className="flex w-full items-center gap-4 rounded-2xl border p-5 text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PlusCircle className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold">Thêm công thức của tôi</span>
                <span className="block text-sm text-muted-foreground">
                  Chỉ dành cho thành viên Pro
                </span>
              </span>
            </NutKhoaPro>
          )}

          {/* Ô viết bài viết */}
          {duocDangBai ? (
            <Link
              href="/tao-bai-viet"
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <PenLine className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold">Viết bài viết</span>
                <span className="block text-sm text-muted-foreground">
                  Chia sẻ mẹo bếp và kinh nghiệm của bạn với cộng đồng
                </span>
              </span>
            </Link>
          ) : (
            <NutKhoaPro
              tinhNang="Viết bài viết"
              className="flex w-full items-center gap-4 rounded-2xl border p-5 text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PenLine className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold">Viết bài viết</span>
                <span className="block text-sm text-muted-foreground">
                  Chỉ dành cho thành viên Pro
                </span>
              </span>
            </NutKhoaPro>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/cong-thuc-da-gui">
              <Send className="h-4 w-4" />
              Công thức đã gửi
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/bai-viet-cua-toi">
              <Newspaper className="h-4 w-4" />
              Bài viết của tôi
            </Link>
          </Button>
        </div>
      </div>

      {/* FORM THÔNG TIN + ĐỔI MẬT KHẨU */}
      <FormHoSoClient profile={profile} />
    </div>
  );
}

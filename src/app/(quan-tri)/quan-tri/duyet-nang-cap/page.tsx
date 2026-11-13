import { Metadata } from "next";
import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ShieldCheck, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BangDuyetNangCap } from "@/components/quan-tri/BangDuyetNangCap";
import { Button } from "@/components/ui/button";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { donYeuCauHetHan } from "@/lib/thanh-toan/yeu-cau";

export const metadata: Metadata = {
  title: "Phê duyệt nâng cấp Pro | Quản trị",
};

interface DuyetNangCapPageProps {
  searchParams: Promise<{ trang_thai?: string }>;
}

export default async function DuyetNangCapPage({ searchParams }: DuyetNangCapPageProps) {
  await yeuCauVaiTro(["admin"]);
  const params = await searchParams;
  const trangThaiLoc = params?.trang_thai || "cho_duyet";

  // Don yeu cau "ma" truoc khi dem/hien thi: giao dich that bai hoac treo
  // qua 30 phut thi yeu cau tu chuyen Da huy, khong con o hang cho (L-01).
  await donYeuCauHetHan(taoSupabaseAdmin());

  const supabase = await taoSupabaseServer();

  // Đếm số lượng theo trạng thái
  const [
    { count: soChoDuyet },
    { count: soDaDuyet },
    { count: soTuChoi },
    { count: tongSo },
  ] = await Promise.all([
    supabase
      .from("yeu_cau_nang_cap")
      .select("*", { count: "exact", head: true })
      .eq("trang_thai", "cho_duyet"),
    supabase
      .from("yeu_cau_nang_cap")
      .select("*", { count: "exact", head: true })
      .eq("trang_thai", "da_duyet"),
    supabase
      .from("yeu_cau_nang_cap")
      .select("*", { count: "exact", head: true })
      .eq("trang_thai", "tu_choi"),
    supabase
      .from("yeu_cau_nang_cap")
      .select("*", { count: "exact", head: true }),
  ]);

  // Lấy danh sách yêu cầu
  let query = supabase
    .from("yeu_cau_nang_cap")
    .select("*, nguoi_dung:profiles!yeu_cau_nang_cap_nguoi_dung_id_fkey(*), goi:goi_premium(*), thanh_toan(*)")
    .order("created_at", { ascending: false });

  if (trangThaiLoc && trangThaiLoc !== "tat_ca") {
    query = query.eq("trang_thai", trangThaiLoc as "cho_duyet" | "da_duyet" | "tu_choi" | "da_huy");
  }

  const { data: danhSach } = await query.limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          <span>Duyệt yêu cầu nâng cấp Pro</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kiểm tra thông tin giao dịch và phê duyệt quyền thành viên Pro cho học viên.
        </p>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-amber-500/[0.04] border-amber-300/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Chờ duyệt</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{soChoDuyet ?? 0}</p>
            </div>
            <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/[0.04] border-emerald-300/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Đã duyệt</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{soDaDuyet ?? 0}</p>
            </div>
            <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-500/[0.04] border-rose-300/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Đã từ chối</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{soTuChoi ?? 0}</p>
            </div>
            <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Tổng yêu cầu</p>
              <p className="text-2xl font-black text-foreground mt-1">{tongSo ?? 0}</p>
            </div>
            <div className="p-2.5 rounded-full bg-muted text-muted-foreground">
              <Filter className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs lọc */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        <Button
          variant={trangThaiLoc === "da_huy" ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 text-xs font-semibold"
        >
          <Link href="/quan-tri/duyet-nang-cap?trang_thai=da_huy">
            Đã hủy
          </Link>
        </Button>
        <Button
          variant={trangThaiLoc === "cho_duyet" ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 text-xs font-semibold"
        >
          <Link href="/quan-tri/duyet-nang-cap?trang_thai=cho_duyet">
            Chờ duyệt ({soChoDuyet ?? 0})
          </Link>
        </Button>
        <Button
          variant={trangThaiLoc === "da_duyet" ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 text-xs font-semibold"
        >
          <Link href="/quan-tri/duyet-nang-cap?trang_thai=da_duyet">
            Đã duyệt ({soDaDuyet ?? 0})
          </Link>
        </Button>
        <Button
          variant={trangThaiLoc === "tu_choi" ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 text-xs font-semibold"
        >
          <Link href="/quan-tri/duyet-nang-cap?trang_thai=tu_choi">
            Từ chối ({soTuChoi ?? 0})
          </Link>
        </Button>
        <Button
          variant={trangThaiLoc === "tat_ca" ? "default" : "outline"}
          size="sm"
          asChild
          className="h-8 text-xs font-semibold"
        >
          <Link href="/quan-tri/duyet-nang-cap?trang_thai=tat_ca">
            Tất cả ({tongSo ?? 0})
          </Link>
        </Button>
      </div>

      {/* Bảng danh sách yêu cầu */}
      <BangDuyetNangCap danhSach={danhSach ?? []} />
    </div>
  );
}

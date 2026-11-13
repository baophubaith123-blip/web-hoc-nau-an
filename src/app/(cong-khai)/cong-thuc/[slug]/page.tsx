import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, Calendar, CheckSquare, ChevronRight, CookingPot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NutLuuCongThuc } from "@/components/cong-thuc/nut-luu-cong-thuc";
import { NguyenLieuScale } from "@/components/cong-thuc/nguyen-lieu-scale";
import { TrinhPhatYouTube } from "@/components/khoa-hoc/trinh-phat-youtube";
import { DanhGiaSao } from "@/components/binh-luan/danh-gia-sao";
import { KhuBinhLuan, type BinhLuanItem } from "@/components/binh-luan/khu-binh-luan";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import type { BuocNau, NguyenLieu } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ChiTietCongThuc({ params }: Props) {
  const { slug } = await params;
  const phien = await layPhienHienTai();
  const userId = phien?.user?.id ?? null;

  const supabase = await taoSupabaseServer();

  // 1. Lấy chi tiết công thức
  const { data: ct, error } = await supabase
    .from("cong_thuc")
    .select("*, tac_gia:profiles(id, ho_ten, avatar_url, bio)")
    .eq("slug", slug)
    .eq("trang_thai", "xuat_ban")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !ct) {
    notFound();
  }

  // Tăng lượt xem ngầm
  await supabase.rpc("tang_luot_xem_cong_thuc", { p_id: ct.id });

  // 2. Kiểm tra đã lưu chưa
  let daLuu = false;
  let danhGiaCuaToi = null;

  if (userId) {
    const [luuRes, dgRes] = await Promise.all([
      supabase
        .from("cong_thuc_da_luu")
        .select("id")
        .eq("nguoi_dung_id", userId)
        .eq("cong_thuc_id", ct.id)
        .maybeSingle(),
      supabase
        .from("danh_gia")
        .select("diem, nhan_xet")
        .eq("nguoi_dung_id", userId)
        .eq("cong_thuc_id", ct.id)
        .maybeSingle(),
    ]);
    daLuu = !!luuRes.data;
    danhGiaCuaToi = dgRes.data;
  }

  // 3. Lấy đánh giá trung bình
  const { data: tatCaDanhGia } = await supabase
    .from("danh_gia")
    .select("diem")
    .eq("cong_thuc_id", ct.id);

  const soDanhGia = tatCaDanhGia?.length || 0;
  const diemTrungBinh =
    soDanhGia > 0
      ? Math.round((tatCaDanhGia!.reduce((a, b) => a + b.diem, 0) / soDanhGia) * 10) / 10
      : 0;

  // 4. Lấy bình luận kèm phân cấp con
  const { data: binhLuanRaw } = await supabase
    .from("binh_luan")
    .select("*, nguoi_dung:profiles(id, ho_ten, avatar_url)")
    .eq("cong_thuc_id", ct.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Cấu trúc phân cấp cha - con
  const binhLuanList: BinhLuanItem[] = [];
  const mapChaCon = new Map<string, BinhLuanItem[]>();

  (binhLuanRaw || []).forEach((bl) => {
    if (bl.binh_luan_cha_id) {
      const arr = mapChaCon.get(bl.binh_luan_cha_id) || [];
      arr.push(bl as BinhLuanItem);
      mapChaCon.set(bl.binh_luan_cha_id, arr);
    }
  });

  (binhLuanRaw || []).forEach((bl) => {
    if (!bl.binh_luan_cha_id) {
      const item = bl as BinhLuanItem;
      item.tra_loi = mapChaCon.get(bl.id) || [];
      binhLuanList.push(item);
    }
  });

  const nguyenLieuList = (ct.nguyen_lieu as unknown as NguyenLieu[]) || [];
  const cacBuocList = (ct.cac_buoc as unknown as BuocNau[]) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="text-primary border-primary">
            {ct.do_kho === "de" ? "Dễ làm" : ct.do_kho === "trung_binh" ? "Trung bình" : "Kỳ công"}
          </Badge>

          <NutLuuCongThuc congThucId={ct.id} daLuuBanDau={daLuu} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {ct.tieu_de}
        </h1>

        {ct.mo_ta && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {ct.mo_ta}
          </p>
        )}

        {/* Tác giả & metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ct.tac_gia?.avatar_url || undefined} />
              <AvatarFallback>{(ct.tac_gia?.ho_ten || "U").charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {ct.tac_gia?.ho_ten || "Đầu bếp"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Calendar className="h-3 w-3" />
                <span>{new Date(ct.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{ct.luot_xem || 0} lượt xem</span>
            </div>
            {soDanhGia > 0 && (
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <span className="text-amber-500">★</span>
                <span>{diemTrungBinh}</span>
                <span className="text-muted-foreground font-normal">({soDanhGia})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MEDIA BANNER */}
      {ct.video_url ? (
        <div className="space-y-2">
          <TrinhPhatYouTube url={ct.video_url} tieuDe={ct.tieu_de} anhBia={ct.anh_dai_dien} />
        </div>
      ) : ct.anh_dai_dien ? (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
          <Image
            src={ct.anh_dai_dien}
            alt={ct.tieu_de}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* THÔNG SỐ NHANH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border bg-muted/30 text-center">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Chuẩn bị</p>
          <p className="text-base font-bold text-foreground">{ct.thoi_gian_chuan_bi || 0} phút</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Nấu nướng</p>
          <p className="text-base font-bold text-foreground">{ct.thoi_gian_nau || 0} phút</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Khẩu phần</p>
          <p className="text-base font-bold text-foreground">{ct.khau_phan || 2} người</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Năng lượng</p>
          <p className="text-base font-bold text-foreground">
            {ct.calories ? `${ct.calories} kcal` : "Chưa rõ"}
          </p>
        </div>
      </div>

      {/* NẤU RẢNH TAY (Đợt 4 — Cokba): nấu từng bước với đồng hồ hẹn giờ */}
      <Link
        href={`/nau/${ct.slug}`}
        className="group flex items-center gap-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-md transition hover:opacity-95"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
          <CookingPot className="h-7 w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold sm:text-lg">Nấu rảnh tay</span>
          <span className="block text-xs leading-relaxed opacity-90 sm:text-sm">
            Nấu từng bước với đồng hồ hẹn giờ, đọc bước bằng giọng nói — không cần chạm màn hình
          </span>
        </span>
        <ChevronRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* NGUYÊN LIỆU SCALE */}
      <NguyenLieuScale nguyenLieuGoc={nguyenLieuList} khauPhanGoc={ct.khau_phan || 2} />

      {/* CÁC BƯỚC THỰC HIỆN */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span>Các bước thực hiện</span>
        </h3>

        {cacBuocList.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">Chưa có hướng dẫn các bước</p>
        ) : (
          <div className="space-y-6">
            {cacBuocList.map((buoc, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl border bg-card">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                    {buoc.noi_dung}
                  </p>
                  {buoc.anh && (
                    <div className="relative aspect-16/9 w-full max-w-md overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={buoc.anh}
                        alt={`Bước ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ĐÁNH GIÁ SAO */}
      <DanhGiaSao
        congThucId={ct.id}
        diemHienTai={danhGiaCuaToi?.diem ?? 0}
        nhanXetHienTai={danhGiaCuaToi?.nhan_xet}
      />

      {/* KHU BÌNH LUẬN REALTIME */}
      <KhuBinhLuan
        congThucId={ct.id}
        binhLuanBanDau={binhLuanList}
        nguoiDungHienTaiId={userId}
      />
    </div>
  );
}

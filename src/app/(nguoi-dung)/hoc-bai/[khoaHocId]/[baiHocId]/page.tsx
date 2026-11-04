import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrinhPhatYouTube } from "@/components/khoa-hoc/trinh-phat-youtube";
import { DanhSachBaiHoc } from "@/components/khoa-hoc/danh-sach-bai-hoc";
import { TheoDoiTienDo } from "@/components/khoa-hoc/theo-doi-tien-do";
import { NutHoanThanhBai } from "@/components/khoa-hoc/nut-hoan-thanh-bai";
import { KhuBaiTap } from "@/components/khoa-hoc/khu-bai-tap";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import type { BaiTap, TaiLieu } from "@/types";

interface Props {
  params: Promise<{ khoaHocId: string; baiHocId: string }>;
}

export default async function TrangHocBai({ params }: Props) {
  const { khoaHocId, baiHocId } = await params;
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // 1. Kiểm tra khóa học & quyền học
  const { data: kh } = await supabase
    .from("khoa_hoc")
    .select("*, dau_bep:profiles(ho_ten, avatar_url)")
    .eq("id", khoaHocId)
    .single();

  if (!kh) notFound();

  // 2. Lấy thông tin bài học hiện tại
  const { data: bhHienTai } = await supabase
    .from("bai_hoc")
    .select("*")
    .eq("id", baiHocId)
    .eq("khoa_hoc_id", kh.id)
    .single();

  if (!bhHienTai) notFound();

  // Kiểm tra quyền học Pro
  const laDauBepHoacAdmin = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  const laPro = !!phien.profile.la_pro && !!phien.profile.goi_het_han && new Date(phien.profile.goi_het_han) > new Date();
  const duocHocFull = laDauBepHoacAdmin || laPro;

  // Nếu bài học không cho xem trước mà tài khoản chưa có gói Pro -> redirect sang nâng cấp
  if (!bhHienTai.xem_truoc && !duocHocFull) {
    redirect(`/nang-cap-pro?ly_do=khoa_hoc`);
  }

  // 3. Lấy tất cả bài học kèm tiến độ từng bài
  const [baiHocRes, tienDoRes, chungChiRes] = await Promise.all([
    supabase
      .from("bai_hoc")
      .select("*")
      .eq("khoa_hoc_id", kh.id)
      .order("thu_tu", { ascending: true }),
    supabase
      .from("tien_do_bai_hoc")
      .select("bai_hoc_id, hoan_thanh")
      .eq("nguoi_dung_id", userId),
    supabase
      .from("chung_chi")
      .select("ma_chung_chi")
      .eq("nguoi_dung_id", userId)
      .eq("khoa_hoc_id", kh.id)
      .maybeSingle(),
  ]);

  const mapTienDo = new Map<string, boolean>();
  (tienDoRes.data || []).forEach((t) => mapTienDo.set(t.bai_hoc_id, t.hoan_thanh));

  const allBaiHoc = (baiHocRes.data || []).map((b) => ({
    ...b,
    da_hoan_thanh: !!mapTienDo.get(b.id),
  }));

  const soBaiXong = allBaiHoc.filter((b) => b.da_hoan_thanh).length;
  const baiHienTaiDaXong = !!mapTienDo.get(bhHienTai.id);
  const maChungChi = chungChiRes.data?.ma_chung_chi;

  const taiLieuList = (bhHienTai.tai_lieu as unknown as TaiLieu[]) || [];
  const baiTapList = (bhHienTai.bai_tap as unknown as BaiTap[]) || [];

  const phanTramTienDo = allBaiHoc.length > 0 ? Math.round((soBaiXong / allBaiHoc.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* THANH ĐIỀU HƯỚNG TRÊN */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <Link href="/khoa-hoc-cua-toi">
              <ArrowLeft className="h-4 w-4" />
              Khóa học của tôi
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-base font-bold text-foreground line-clamp-1">
            {kh.tieu_de}
          </h1>
        </div>

        <NutHoanThanhBai
          baiHocId={bhHienTai.id}
          khoaHocId={kh.id}
          daHoanThanhBanDau={baiHienTaiDaXong}
          coChungChi={kh.co_chung_chi}
        />
      </div>

      {/* KHUNG NỘI DUNG 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CỘT TRÁI: VIDEO PLAYER & BÀI HỌC */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <TrinhPhatYouTube
              url={duocHocFull && bhHienTai.video_hd_url ? bhHienTai.video_hd_url : bhHienTai.video_url}
              tieuDe={bhHienTai.tieu_de}
            />
            {duocHocFull && bhHienTai.video_hd_url && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
                <span>👑</span> Đang phát chế độ Full HD 1080p dành cho hội viên Pro
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{bhHienTai.tieu_de}</h2>
            {bhHienTai.mo_ta && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {bhHienTai.mo_ta}
              </p>
            )}
          </div>

          {/* TÀI LIỆU BÀI HỌC */}
          {taiLieuList.length > 0 && (
            <div className="space-y-3 rounded-2xl border bg-card p-5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Tài liệu đính kèm ({taiLieuList.length})</span>
              </h3>
              {duocHocFull ? (
                <div className="space-y-2">
                  {taiLieuList.map((tl, i) => (
                    <a
                      key={i}
                      href={tl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border text-xs hover:bg-muted font-medium transition-colors"
                    >
                      <span className="truncate">{tl.ten}</span>
                      <span className="text-primary text-[11px]">Tải về / Xem</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-300/40 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>Tài liệu PDF độc quyền chỉ dành riêng cho hội viên Pro.</span>
                  <Link href="/nang-cap-pro" className="font-bold underline text-amber-700 dark:text-amber-400">
                    Nâng cấp Pro
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* BÀI TẬP TRẮC NGHIỆM */}
          {baiTapList.length > 0 && (
            <KhuBaiTap baiHocId={bhHienTai.id} danhSachBaiTap={baiTapList} />
          )}
        </div>

        {/* CỘT PHẢI: TIẾN ĐỘ & DANH SÁCH BÀI HỌC */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <TheoDoiTienDo
            phanTram={phanTramTienDo}
            coChungChi={kh.co_chung_chi}
            maChungChi={maChungChi}
            soBaiDaHoc={soBaiXong}
            tongSoBai={allBaiHoc.length}
          />

          <div className="rounded-xl border bg-card p-4 space-y-3">
            <h3 className="font-bold text-sm">Danh sách bài học</h3>
            <DanhSachBaiHoc
              khoaHocId={kh.id}
              baiHocList={allBaiHoc}
              baiHocHienTaiId={bhHienTai.id}
              daDangKy={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

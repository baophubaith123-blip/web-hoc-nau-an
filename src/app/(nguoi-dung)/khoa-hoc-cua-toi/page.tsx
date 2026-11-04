import Link from "next/link";
import Image from "next/image";
import { Award, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function KhoaHocCuaToi() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  // Truy vấn khóa học đã đăng ký kèm chứng chỉ (nếu có)
  const [dangKyRes, chungChiRes] = await Promise.all([
    supabase
      .from("dang_ky_khoa_hoc")
      .select("*, khoa_hoc(*, dau_bep:profiles(ho_ten, avatar_url))")
      .eq("nguoi_dung_id", userId)
      .order("ngay_dang_ky", { ascending: false }),
    supabase
      .from("chung_chi")
      .select("khoa_hoc_id, ma_chung_chi")
      .eq("nguoi_dung_id", userId),
  ]);

  const dangKyList = dangKyRes.data || [];
  const mapChungChi = new Map<string, string>();
  (chungChiRes.data || []).forEach((c) => {
    mapChungChi.set(c.khoa_hoc_id, c.ma_chung_chi);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Khóa học của tôi</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý tiến độ học tập và chứng nhận kỹ năng ẩm thực đã đạt được
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/khoa-hoc">Tìm thêm khóa học</Link>
        </Button>
      </div>

      {dangKyList.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <p className="text-base font-semibold">Bạn chưa tham gia khóa học nào</p>
          <p className="text-xs text-muted-foreground">
            Bắt đầu nâng tầm kỹ năng làm bếp với hàng loạt khóa học hấp dẫn
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/khoa-hoc">Khám phá khóa học ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dangKyList.map((dk) => {
            const kh = dk.khoa_hoc;
            if (!kh) return null;
            const maChungChi = mapChungChi.get(kh.id);
            const daXong = dk.phan_tram_tien_do >= 100;

            return (
              <Card key={dk.id} className="overflow-hidden border shadow-xs hover:shadow-md transition-shadow">
                <div className="relative aspect-16/9 w-full bg-muted">
                  {kh.anh_dai_dien ? (
                    <Image
                      src={kh.anh_dai_dien}
                      alt={kh.tieu_de}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  {daXong && (
                    <div className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                      <CheckCircle className="h-3 w-3" />
                      Hoàn thành
                    </div>
                  )}
                </div>

                <CardContent className="p-5 space-y-4">
                  <h3 className="font-bold text-base line-clamp-2 leading-snug">
                    {kh.tieu_de}
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-semibold text-primary">{dk.phan_tram_tien_do}%</span>
                    </div>
                    <Progress value={dk.phan_tram_tien_do} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span className="truncate">Chef {kh.dau_bep?.ho_ten || "Master Chef"}</span>
                    <span>{kh.so_bai_hoc || 0} bài học</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild className="w-full gap-1.5 font-semibold">
                      <Link href={`/hoc-bai/${kh.id}`}>
                        <PlayCircle className="h-4 w-4" />
                        {daXong ? "Ôn lại bài học" : "Tiếp tục học"}
                      </Link>
                    </Button>

                    {maChungChi && (
                      <Button asChild variant="outline" size="sm" className="w-full gap-1.5 text-amber-600 hover:text-amber-700">
                        <Link href={`/api/chung-chi/${maChungChi}/pdf`} target="_blank">
                          <Award className="h-4 w-4" />
                          Xem chứng chỉ PDF
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChefHat, Utensils, BookOpen, Newspaper, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Đội ngũ đầu bếp",
  description:
    "Gặp gỡ các đầu bếp và Master Chef đồng hành cùng Học Nấu Ăn — xem hồ sơ, công thức và khóa học của từng đầu bếp.",
};

type SoLieu = { congThuc: number; khoaHoc: number; baiViet: number };

export default async function DanhSachDauBep() {
  // RLS của bảng profiles chỉ cho đọc hồ sơ của chính mình nên khách (và cả
  // người dùng thường) không thấy được đầu bếp nào qua client phiên. Danh sách
  // đầu bếp là thông tin công khai → đọc bằng admin client, chỉ lấy đúng các
  // trường hiển thị công khai (không email/số điện thoại).
  const supabase = taoSupabaseAdmin();

  const { data: dauBepList } = await supabase
    .from("profiles")
    .select("id, ho_ten, avatar_url, bio")
    .eq("vai_tro", "chef")
    .eq("trang_thai", "hoat_dong")
    .order("created_at", { ascending: false });

  const danhSach = dauBepList || [];
  const ids = danhSach.map((db) => db.id);

  // Số liệu THẬT của từng đầu bếp: đếm nội dung ĐÃ XUẤT BẢN theo trường tác giả
  // (cong_thuc.tac_gia_id · khoa_hoc.dau_bep_id · bai_viet.tac_gia_id).
  const soLieu = new Map<string, SoLieu>();
  ids.forEach((id) => soLieu.set(id, { congThuc: 0, khoaHoc: 0, baiViet: 0 }));
  if (ids.length > 0) {
    const [ctRes, khRes, bvRes] = await Promise.all([
      supabase
        .from("cong_thuc")
        .select("tac_gia_id")
        .in("tac_gia_id", ids)
        .eq("trang_thai", "xuat_ban")
        .is("deleted_at", null),
      supabase
        .from("khoa_hoc")
        .select("dau_bep_id")
        .in("dau_bep_id", ids)
        .eq("trang_thai", "xuat_ban"),
      supabase
        .from("bai_viet")
        .select("tac_gia_id")
        .in("tac_gia_id", ids)
        .eq("trang_thai", "xuat_ban"),
    ]);
    (ctRes.data || []).forEach((r) => {
      const s = soLieu.get(r.tac_gia_id);
      if (s) s.congThuc += 1;
    });
    (khRes.data || []).forEach((r) => {
      const s = soLieu.get(r.dau_bep_id);
      if (s) s.khoaHoc += 1;
    });
    (bvRes.data || []).forEach((r) => {
      const s = soLieu.get(r.tac_gia_id);
      if (s) s.baiViet += 1;
    });
  }

  const tongNoiDung = (id: string) => {
    const s = soLieu.get(id);
    return s ? s.congThuc + s.khoaHoc + s.baiViet : 0;
  };

  // Đầu bếp nổi bật = người có tổng nội dung đã xuất bản nhiều nhất (tính động từ DB)
  const noiBat =
    danhSach.length > 0
      ? danhSach.reduce((max, db) => (tongNoiDung(db.id) > tongNoiDung(max.id) ? db : max), danhSach[0])
      : null;
  const soLieuNoiBat = noiBat ? soLieu.get(noiBat.id) : undefined;

  const dongSoLieu = (s: SoLieu | undefined, gon = false) => (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground ${gon ? "" : "border-t pt-4"}`}
    >
      <span className="inline-flex items-center gap-1.5 font-medium">
        <Utensils className="h-4 w-4 text-primary" /> {s?.congThuc ?? 0} công thức
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium">
        <BookOpen className="h-4 w-4 text-primary" /> {s?.khoaHoc ?? 0} khóa học
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium">
        <Newspaper className="h-4 w-4 text-primary" /> {s?.baiViet ?? 0} bài viết
      </span>
    </div>
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Đội ngũ đầu bếp</h1>
        <p className="text-sm text-muted-foreground">
          Gặp gỡ các chuyên gia ẩm thực, Master Chef đồng hành hướng dẫn bạn trong từng món ăn
        </p>
      </div>

      {danhSach.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-card/50 px-6 py-14 text-center">
          <ChefHat className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">Đội ngũ đầu bếp đang được cập nhật</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Danh sách đầu bếp sẽ sớm xuất hiện tại đây. Trong lúc chờ, bạn có thể khám phá các
            công thức và khóa học đang có trên Học Nấu Ăn.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/cong-thuc">Khám phá công thức</Link>
          </Button>
        </div>
      )}

      {/* ĐẦU BẾP NỔI BẬT — nhiều nội dung nhất trên nền tảng */}
      {noiBat && (
        <section className="overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6 shadow-xs dark:border-orange-900/40 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-orange-950/30 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-orange-300/60 bg-white/70">
              {noiBat.avatar_url ? (
                <Image
                  src={noiBat.avatar_url}
                  alt={noiBat.ho_ten || "Đầu bếp nổi bật"}
                  fill
                  className="object-cover"
                />
              ) : (
                <ChefHat className="h-full w-full p-7 text-orange-500" />
              )}
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
                <Star className="h-3.5 w-3.5" /> Đầu bếp nổi bật
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Chef {noiBat.ho_ten || "Đầu bếp"}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mx-0">
                {noiBat.bio ||
                  "Bếp trưởng tâm huyết chia sẻ bí quyết ẩm thực gia đình và chuyên nghiệp."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                {dongSoLieu(soLieuNoiBat, true)}
                <Button asChild size="sm">
                  <Link href={`/dau-bep/${noiBat.id}`}>Xem hồ sơ</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {danhSach.map((db) => (
          <Card
            key={db.id}
            className="group overflow-hidden rounded-2xl border text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
                {db.avatar_url ? (
                  <Image
                    src={db.avatar_url}
                    alt={db.ho_ten || "Đầu bếp"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <ChefHat className="h-full w-full p-6 text-muted-foreground" />
                )}
              </div>

              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                Chef {db.ho_ten || "Đầu bếp"}
              </h3>

              <p className="mt-2 line-clamp-3 text-xs text-muted-foreground leading-relaxed">
                {db.bio || "Bếp trưởng tâm huyết chia sẻ bí quyết ẩm thực gia đình và chuyên nghiệp."}
              </p>

              <div className="mt-4 w-full">{dongSoLieu(soLieu.get(db.id))}</div>

              <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                <Link href={`/dau-bep/${db.id}`}>Xem hồ sơ</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

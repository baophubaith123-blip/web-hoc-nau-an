import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Đội ngũ đầu bếp",
  description:
    "Gặp gỡ các đầu bếp và Master Chef đồng hành cùng Học Nấu Ăn — xem hồ sơ, công thức và khóa học của từng đầu bếp.",
};

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

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Đội ngũ đầu bếp</h1>
        <p className="text-sm text-muted-foreground">
          Gặp gỡ các chuyên gia ẩm thực, Master Chef đồng hành hướng dẫn bạn trong từng món ăn
        </p>
      </div>

      {(dauBepList ?? []).length === 0 && (
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(dauBepList || []).map((db) => (
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

              <Button asChild variant="outline" size="sm" className="mt-6 w-full">
                <Link href={`/dau-bep/${db.id}`}>Xem các khóa học & công thức</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

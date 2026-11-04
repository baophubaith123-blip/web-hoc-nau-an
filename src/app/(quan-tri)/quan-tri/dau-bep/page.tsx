import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChefHat, BookOpen, GraduationCap, Eye, Settings } from "lucide-react";

export default async function QuanLyDauBepPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachDauBep } = await supabase
    .from("profiles")
    .select("*, cong_thuc:cong_thuc(count), khoa_hoc:khoa_hoc(count)")
    .eq("vai_tro", "chef")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản Lý Đầu Bếp</h1>
        <p className="text-sm text-muted-foreground">
          Danh sách các chuyên gia ẩm thực và đối tác giảng dạy trên hệ thống
        </p>
      </div>

      {!danhSachDauBep || danhSachDauBep.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <ChefHat className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có đầu bếp nào trong hệ thống.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachDauBep.map((db) => {
            const soCongThuc = db.cong_thuc?.[0]?.count || 0;
            const soKhoaHoc = db.khoa_hoc?.[0]?.count || 0;

            return (
              <div key={db.id} className="border rounded-2xl bg-card p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={db.avatar_url || undefined} />
                      <AvatarFallback>{(db.ho_ten || "C")[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base line-clamp-1">{db.ho_ten || "Đầu bếp"}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">@{db.username || db.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  {db.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {db.bio}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t text-center">
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> Công thức
                      </p>
                      <p className="font-bold text-base mt-0.5">{soCongThuc}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Khóa học
                      </p>
                      <p className="font-bold text-base mt-0.5">{soKhoaHoc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dau-bep/${db.id}`} target="_blank">
                      <Eye className="w-3.5 h-3.5 mr-1" /> Profile
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild className="flex-1">
                    <Link href={`/quan-tri/nguoi-dung/${db.id}`}>
                      <Settings className="w-3.5 h-3.5 mr-1" /> Quản lý
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

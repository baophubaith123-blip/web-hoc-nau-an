import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import type { Bang, VaiTro } from "@/types";

interface Props {
  searchParams: Promise<{ tu_khoa?: string; vai_tro?: string }>;
}

export default async function QuanLyNguoiDungPage({ searchParams }: Props) {
  const params = await searchParams;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  let truyVan = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.vai_tro) {
    truyVan = truyVan.eq("vai_tro", params.vai_tro as VaiTro);
  }
  if (params.tu_khoa) {
    truyVan = truyVan.or(`ho_ten.ilike.%${params.tu_khoa}%,username.ilike.%${params.tu_khoa}%`);
  }

  const { data: danhSachNguoiDung } = await truyVan;

  const mauVaiTro: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    admin: { label: "Quản trị viên", variant: "destructive" },
    chef: { label: "Đầu bếp", variant: "default" },
    support: { label: "Hỗ trợ viên", variant: "secondary" },
    user: { label: "Học viên", variant: "outline" },
  };

  const boLocVaiTro = [
    { label: "Tất cả", val: "" },
    { label: "Học viên", val: "user" },
    { label: "Đầu bếp", val: "chef" },
    { label: "Hỗ trợ viên", val: "support" },
    { label: "Quản trị viên", val: "admin" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Người Dùng</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách toàn bộ tài khoản học viên, đầu bếp và nhân sự hệ thống
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {boLocVaiTro.map((item) => {
          const active = (params.vai_tro || "") === item.val;
          return (
            <Button
              key={item.val}
              variant={active ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={
                  item.val
                    ? `/quan-tri/nguoi-dung?vai_tro=${item.val}`
                    : "/quan-tri/nguoi-dung"
                }
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {!danhSachNguoiDung || danhSachNguoiDung.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <p className="text-sm text-muted-foreground">Không tìm thấy tài khoản người dùng nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachNguoiDung.map((nd: Bang<"profiles">) => {
            const vt = mauVaiTro[nd.vai_tro] || { label: nd.vai_tro, variant: "outline" };
            const biKhoa = nd.trang_thai === "khoa";

            return (
              <div
                key={nd.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={nd.avatar_url || undefined} />
                    <AvatarFallback>{(nd.ho_ten || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{nd.ho_ten || "Chưa cập nhật"}</span>
                      <Badge variant={vt.variant} className="text-[10px]">
                        {vt.label}
                      </Badge>
                      {biKhoa && (
                        <Badge variant="destructive" className="text-[10px]">
                          Đã khóa
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      @{nd.username || nd.id.slice(0, 8)} • Tham gia {dinhDangTuongDoi(nd.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/quan-tri/nguoi-dung/${nd.id}`}>
                      Chi tiết & Phân quyền
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

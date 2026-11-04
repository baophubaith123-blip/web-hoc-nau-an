import Link from "next/link";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { ThaoTacBinhLuan } from "./thao-tac-binh-luan";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

interface Props {
  searchParams: Promise<{ trang_thai?: string }>;
}

export default async function QuanLyBinhLuanPage({ searchParams }: Props) {
  const params = await searchParams;
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  let truyVan = supabase
    .from("binh_luan")
    .select("*, nguoi_dung:profiles!binh_luan_nguoi_dung_id_fkey(ho_ten, username, avatar_url), cong_thuc:cong_thuc!binh_luan_cong_thuc_id_fkey(tieu_de, slug)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (params.trang_thai === "cho_duyet") {
    truyVan = truyVan.eq("da_duyet", false);
  } else if (params.trang_thai === "da_duyet") {
    truyVan = truyVan.eq("da_duyet", true);
  }

  const { data: danhSachBinhLuan } = await truyVan;

  const boLoc = [
    { label: "Tất cả", val: "" },
    { label: "Chưa duyệt / Đã ẩn", val: "cho_duyet" },
    { label: "Đã hiển thị", val: "da_duyet" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kiểm Duyệt Bình Luận</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý thảo luận cộng đồng, xử lý nội dung spam hoặc vi phạm tiêu chuẩn cộng đồng
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {boLoc.map((item) => {
          const active = (params.trang_thai || "") === item.val;
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
                    ? `/quan-tri/binh-luan?trang_thai=${item.val}`
                    : "/quan-tri/binh-luan"
                }
              >
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {!danhSachBinhLuan || danhSachBinhLuan.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Không có bình luận nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachBinhLuan.map((bl) => (
            <div
              key={bl.id}
              className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <Avatar className="h-9 w-9 mt-0.5">
                  <AvatarImage src={bl.nguoi_dung?.avatar_url || undefined} />
                  <AvatarFallback>{(bl.nguoi_dung?.ho_ten || "U")[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">
                      {bl.nguoi_dung?.ho_ten || "Thành viên"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{bl.nguoi_dung?.username || "an_danh"}
                    </span>
                    <span className="text-xs text-muted-foreground">• {dinhDangTuongDoi(bl.created_at)}</span>
                    <Badge variant={bl.da_duyet ? "default" : "secondary"} className="text-[10px]">
                      {bl.da_duyet ? "Hiển thị" : "Đã ẩn"}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-wrap">{bl.noi_dung}</p>

                  {bl.cong_thuc && (
                    <div className="pt-1">
                      <Link
                        href={`/cong-thuc/${bl.cong_thuc.slug}`}
                        target="_blank"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Bài viết: {bl.cong_thuc.tieu_de} <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="self-end sm:self-center">
                <ThaoTacBinhLuan
                  binhLuanId={bl.id}
                  daDuyet={bl.da_duyet}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

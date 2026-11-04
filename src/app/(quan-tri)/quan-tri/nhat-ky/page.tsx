import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ScrollText } from "lucide-react";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";

export default async function NhatKyHoatDongPage() {
  await yeuCauVaiTro(["admin"]);
  const supabase = await taoSupabaseServer();

  const { data: danhSachNhatKy } = await supabase
    .from("nhat_ky_hoat_dong")
    .select("*, nguoi_dung:profiles!nhat_ky_he_thong_nguoi_dung_id_fkey(ho_ten, username, vai_tro)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nhật Ký Hoạt Động (Audit Log)</h1>
        <p className="text-sm text-muted-foreground">
          Ghi nhận toàn bộ thao tác bảo mật, thay đổi vai trò, phê duyệt và thanh toán hệ thống
        </p>
      </div>

      {!danhSachNhatKy || danhSachNhatKy.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <ScrollText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có bản ghi hoạt động nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachNhatKy.map((nk) => (
            <div
              key={nk.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs uppercase">
                    {nk.hanh_dong}
                  </Badge>
                  {nk.doi_tuong && (
                    <span className="text-xs text-muted-foreground font-medium">
                      đối tượng: <span className="text-foreground">{nk.doi_tuong}</span>
                    </span>
                  )}
                  {nk.doi_tuong_id && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ({nk.doi_tuong_id.slice(0, 8)}...)
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Thực hiện bởi: <span className="font-semibold text-foreground">{nk.nguoi_dung?.ho_ten || "Hệ thống"}</span>{" "}
                  {nk.nguoi_dung?.username ? `(@${nk.nguoi_dung.username})` : ""}{" "}
                  {nk.nguoi_dung?.vai_tro ? `[${nk.nguoi_dung.vai_tro}]` : ""} • {dinhDangTuongDoi(nk.created_at)}
                </p>
              </div>

              {nk.ip_address && (
                <span className="font-mono text-[11px] text-muted-foreground/80 self-end sm:self-center">
                  IP: {nk.ip_address}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

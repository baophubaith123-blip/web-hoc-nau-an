import type { Metadata } from "next";
import Link from "next/link";
import { Bot, DatabaseZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";
import { yeuCauVaiTro } from "@/lib/supabase/server";
import { cn } from "@/lib/utils/cn";
import { ThaoTacNhatKyCokba } from "./thao-tac-nhat-ky-cokba";

export const metadata: Metadata = {
  title: "Nhật ký Cokba",
};

type DongNhatKy = {
  id: string;
  cau_hoi: string;
  so_lan: number;
  lan_hoi_gan_nhat: string;
  trang_thai: string;
  tao_luc: string;
};

const CAC_TRANG_THAI = [
  { khoa: "", nhan: "Tất cả" },
  { khoa: "cho_xu_ly", nhan: "Chờ xử lý" },
  { khoa: "da_xu_ly", nhan: "Đã xử lý" },
  { khoa: "bo_qua", nhan: "Bỏ qua" },
] as const;

const NHAN_TRANG_THAI: Record<string, string> = {
  cho_xu_ly: "Chờ xử lý",
  da_xu_ly: "Đã xử lý",
  bo_qua: "Bỏ qua",
};

interface Props {
  searchParams: Promise<{ trang_thai?: string }>;
}

export default async function NhatKyCokbaPage({ searchParams }: Props) {
  await yeuCauVaiTro(["admin"]);
  const { trang_thai: locTrangThai } = await searchParams;
  const locHopLe =
    locTrangThai && ["cho_xu_ly", "da_xu_ly", "bo_qua"].includes(locTrangThai)
      ? locTrangThai
      : "";

  // Bảng cau_hoi_chua_tra_loi chỉ tồn tại sau khi chạy migration
  // 008 — chưa chạy thì hiện thông báo thân thiện, không crash.
  let chuaKichHoat = false;
  let danhSach: DongNhatKy[] = [];
  try {
    const admin = taoSupabaseAdmin();
    let truyVan = admin
      .from("cau_hoi_chua_tra_loi")
      .select("id, cau_hoi, so_lan, lan_hoi_gan_nhat, trang_thai, tao_luc")
      .order("so_lan", { ascending: false })
      .order("lan_hoi_gan_nhat", { ascending: false })
      .limit(100);
    if (locHopLe) truyVan = truyVan.eq("trang_thai", locHopLe);
    const { data, error } = await truyVan;
    if (error) chuaKichHoat = true;
    else danhSach = (data ?? []) as DongNhatKy[];
  } catch {
    chuaKichHoat = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Bot className="h-6 w-6 text-primary" /> Nhật ký Cokba — câu hỏi chưa trả lời được
        </h1>
        <p className="text-sm text-muted-foreground">
          Các câu Cokba chưa trả lời được hoặc nằm ngoài phạm vi, xếp theo số lần được hỏi.
          Dùng danh sách này để quyết định bổ sung dữ liệu hoặc cải thiện bộ não trợ lý.
        </p>
      </div>

      {chuaKichHoat ? (
        <div className="rounded-2xl border bg-card p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <DatabaseZap className="mt-0.5 h-8 w-8 shrink-0 text-primary" />
            <div className="space-y-2 text-sm leading-relaxed">
              <p className="text-base font-semibold">
                Tính năng nhật ký chưa được kích hoạt
              </p>
              <p className="text-muted-foreground">
                Cần chạy migration 008 trong Supabase SQL Editor để tạo bảng nhật ký
                Cokba. Cách làm: mở Supabase Dashboard của dự án → SQL Editor → dán
                toàn bộ nội dung file{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  supabase/migrations/008_cokba.sql
                </code>{" "}
                trong mã nguồn → Run. Sau khi chạy xong, tải lại trang này là dùng được.
                Trong lúc chưa kích hoạt, Cokba vẫn hỏi–đáp bình thường (chỉ chưa ghi
                lại được các câu chưa trả lời được).
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {CAC_TRANG_THAI.map((tt) => (
              <Link
                key={tt.khoa}
                href={
                  tt.khoa ? `/quan-tri/nhat-ky-cokba?trang_thai=${tt.khoa}` : "/quan-tri/nhat-ky-cokba"
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  locHopLe === tt.khoa
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                )}
              >
                {tt.nhan}
              </Link>
            ))}
          </div>

          {danhSach.length === 0 ? (
            <div className="rounded-2xl border bg-card py-16 text-center">
              <Bot className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Chưa có câu hỏi nào trong mục này. Khi người dùng hỏi câu Cokba chưa
                trả lời được, câu hỏi sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Câu hỏi</th>
                      <th className="w-20 px-4 py-3 text-center font-semibold">Số lần</th>
                      <th className="w-44 px-4 py-3 font-semibold">Lần gần nhất</th>
                      <th className="w-32 px-4 py-3 font-semibold">Trạng thái</th>
                      <th className="w-64 px-4 py-3 font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {danhSach.map((dong) => (
                      <tr key={dong.id} className="align-top transition-colors hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium">{dong.cau_hoi}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="secondary" className="font-mono">
                            {dong.so_lan}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(dong.lan_hoi_gan_nhat).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              dong.trang_thai === "cho_xu_ly"
                                ? "default"
                                : dong.trang_thai === "da_xu_ly"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {NHAN_TRANG_THAI[dong.trang_thai] ?? dong.trang_thai}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <ThaoTacNhatKyCokba id={dong.id} trangThai={dong.trang_thai} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

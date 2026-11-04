import type { Bang } from "@/types";
import Link from "next/link";
import { TheCongThuc } from "@/components/cong-thuc/the-cong-thuc";
import { Button } from "@/components/ui/button";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function CongThucCuaToi() {
  const phien = await yeuCauVaiTro();
  const userId = phien.user.id;
  const supabase = await taoSupabaseServer();

  const { data: danhSachLuu } = await supabase
    .from("cong_thuc_da_luu")
    .select("*, cong_thuc(*, tac_gia:profiles(ho_ten, avatar_url))")
    .eq("nguoi_dung_id", userId)
    .order("ngay_luu", { ascending: false });

  const congThucList = (danhSachLuu || [])
    .map((x) => x.cong_thuc)
    .filter((ct) => ct && !ct.deleted_at);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Công thức đã lưu</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Bộ sưu tập các món ăn yêu thích bạn đã lưu lại để thực hành
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/cong-thuc">Khám phá thêm công thức</Link>
        </Button>
      </div>

      {congThucList.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center space-y-3">
          <p className="text-base font-semibold">Bạn chưa lưu công thức nào</p>
          <p className="text-xs text-muted-foreground">
            Bấm vào nút biểu tượng bookmark ở bất kỳ công thức nào để lưu vào đây
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/cong-thuc">Xem danh sách công thức</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {congThucList.map((ct) => (
            <TheCongThuc key={ct!.id} congThuc={ct as Bang<"cong_thuc">} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { Award, BadgeCheck, Search, CircleAlert, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { taoSupabaseAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Tra cứu chứng chỉ",
  description:
    "Tra cứu và xác thực chứng chỉ hoàn thành khóa học tại Học Nấu Ăn bằng mã chứng chỉ in trên chứng chỉ của bạn.",
};

interface Props {
  searchParams: Promise<{ ma?: string }>;
}

type KetQuaTraCuu = {
  ma_chung_chi: string;
  ngay_cap: string;
  ho_ten: string;
  khoa_hoc: string;
};

// Tra cứu bằng admin client nhưng CHỈ với điều kiện khớp mã chứng chỉ CHÍNH XÁC
// duy nhất — không liệt kê, không trả bất kỳ dữ liệu nào ngoài đúng mã được nhập.
async function traCuu(ma: string): Promise<KetQuaTraCuu | null> {
  const supabase = taoSupabaseAdmin();
  const { data: cc } = await supabase
    .from("chung_chi")
    .select("ma_chung_chi, ngay_cap, nguoi_dung_id, khoa_hoc_id")
    .eq("ma_chung_chi", ma)
    .maybeSingle();
  if (!cc) return null;

  const [profileRes, khoaHocRes] = await Promise.all([
    supabase.from("profiles").select("ho_ten, username").eq("id", cc.nguoi_dung_id).maybeSingle(),
    supabase.from("khoa_hoc").select("tieu_de").eq("id", cc.khoa_hoc_id).maybeSingle(),
  ]);

  return {
    ma_chung_chi: cc.ma_chung_chi,
    ngay_cap: cc.ngay_cap,
    ho_ten: profileRes.data?.ho_ten || profileRes.data?.username || "Học viên",
    khoa_hoc: khoaHocRes.data?.tieu_de || "Khóa học nấu ăn",
  };
}

export default async function TrangTraCuuChungChi({ searchParams }: Props) {
  const { ma: maTho } = await searchParams;
  const ma = maTho?.trim().toUpperCase() ?? "";
  const daTraCuu = ma.length > 0;
  const ketQua = daTraCuu ? await traCuu(ma) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16">
      <div className="space-y-2 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
          <Award className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Tra cứu chứng chỉ</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Nhập mã chứng chỉ in trên chứng chỉ hoàn thành khóa học của bạn để xác thực
          tính hợp lệ của chứng chỉ.
        </p>
      </div>

      <form
        method="get"
        className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-xs sm:flex-row"
      >
        <Input
          name="ma"
          defaultValue={ma}
          placeholder="Ví dụ: CC-C42B598529"
          autoComplete="off"
          className="flex-1"
          aria-label="Mã chứng chỉ"
        />
        <Button type="submit" className="gap-2">
          <Search className="h-4 w-4" />
          Tra cứu
        </Button>
      </form>

      {daTraCuu && !ketQua && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Không tìm thấy chứng chỉ</p>
            <p className="mt-1">
              Mã <span className="font-mono font-semibold">{ma}</span> không hợp lệ hoặc chưa được
              cấp trên hệ thống. Vui lòng kiểm tra lại mã in trên chứng chỉ của bạn.
            </p>
          </div>
        </div>
      )}

      {ketQua && (
        <section className="overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-sm dark:border-amber-800/60 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30">
          <div className="space-y-5 p-6 text-center sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              <BadgeCheck className="h-3.5 w-3.5" /> Chứng chỉ hợp lệ
            </span>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-700 dark:text-amber-400">
                Chứng chỉ hoàn thành khóa học
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight">{ketQua.khoa_hoc}</h2>
            </div>
            <dl className="mx-auto grid max-w-md grid-cols-1 gap-4 text-left sm:grid-cols-2">
              <div className="rounded-xl bg-white/70 p-3 dark:bg-white/5">
                <dt className="text-xs text-muted-foreground">Học viên</dt>
                <dd className="mt-0.5 font-semibold">{ketQua.ho_ten}</dd>
              </div>
              <div className="rounded-xl bg-white/70 p-3 dark:bg-white/5">
                <dt className="text-xs text-muted-foreground">Ngày cấp</dt>
                <dd className="mt-0.5 font-semibold">
                  {new Date(ketQua.ngay_cap).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="rounded-xl bg-white/70 p-3 dark:bg-white/5 sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Mã chứng chỉ</dt>
                <dd className="mt-0.5 font-mono font-semibold">{ketQua.ma_chung_chi}</dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="gap-2">
              <Link href={`/api/chung-chi/${ketQua.ma_chung_chi}/pdf`} target="_blank">
                <FileDown className="h-4 w-4" />
                Xem chứng chỉ PDF
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

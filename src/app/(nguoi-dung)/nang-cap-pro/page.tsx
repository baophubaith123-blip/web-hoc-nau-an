import { Metadata } from "next";
import { layPhienHienTai, taoSupabaseServer } from "@/lib/supabase/server";
import { FormMuaGoi } from "@/components/goi/FormMuaGoi";
import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nâng cấp tài khoản PRO | Học Nấu Ăn Online",
  description: "Chọn gói thành viên PRO để mở khóa toàn bộ quyền lợi và video chất lượng cao.",
};

interface NangCapProPageProps {
  searchParams: Promise<{ goi?: string }>;
}

export default async function NangCapProPage({ searchParams }: NangCapProPageProps) {
  const params = await searchParams;
  const phien = await layPhienHienTai();
  const supabase = await taoSupabaseServer();

  const { data: packages } = await supabase
    .from("goi_premium")
    .select("*")
    .eq("hoat_dong", true)
    .order("thu_tu", { ascending: true });

  const danhSachGoi = (packages && packages.length > 0)
    ? packages.map((g) => ({
        ...g,
        quyen_loi: (Array.isArray(g.quyen_loi) ? g.quyen_loi : []) as string[],
      }))
    : [
        {
          id: "pro_thang",
          ma_goi: "pro_thang",
          ten: "Pro Tháng",
          mo_ta: "Trải nghiệm trọn vẹn toàn bộ tính năng cao cấp trong 30 ngày.",
          thoi_han_ngay: 30,
          gia: 99000,
          quyen_loi: [
            "Xem video bài học Full HD 1080p",
            "Tải trọn bộ tài liệu công thức PDF",
            "Làm bài tập trắc nghiệm có chấm điểm",
            "Nhận chứng chỉ tốt nghiệp chính thức",
            "Đăng tải công thức chia sẻ cộng đồng",
            "Huy hiệu Pro vương miện vàng uy tín",
            "Trải nghiệm 100% không quảng cáo",
          ],
          thu_tu: 1,
          hoat_dong: true,
        },
        {
          id: "pro_nam",
          ma_goi: "pro_nam",
          ten: "Pro Năm",
          mo_ta: "Gói tiết kiệm 33% chi phí, thỏa sức nấu nướng và nhận chứng chỉ trọn năm.",
          thoi_han_ngay: 365,
          gia: 799000,
          quyen_loi: [
            "Tất cả quyền lợi của gói Pro Tháng",
            "Tiết kiệm đến 33% so với đóng theo tháng",
            "Ưu tiên hỗ trợ 1-1 trực tiếp cùng đầu bếp",
            "Nhận huy hiệu Pro vàng độc quyền trọn năm",
            "Truy cập sớm các chuyên đề ẩm thực mới",
          ],
          thu_tu: 2,
          hoat_dong: true,
        },
      ];

  const goiMacDinh = danhSachGoi.find((g) => g.ma_goi === params?.goi);

  const laPro = !!phien?.profile?.la_pro;
  const ngayHetHanHienTai = phien?.profile?.goi_het_han;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-300/40 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>HỘI VIÊN CAO CẤP</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Nâng cấp tài khoản{" "}
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
            PRO
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          Đăng ký gói PRO để trở thành học viên ưu tú, xem trọn bộ video HD, nhận chứng chỉ tốt nghiệp và chia sẻ công thức của riêng bạn.
        </p>
      </div>

      {/* Form mua gói */}
      <FormMuaGoi
        danhSachGoi={danhSachGoi}
        goiMacDinhId={goiMacDinh?.id}
        daDangNhap={!!phien}
        laPro={laPro}
        ngayHetHanHienTai={ngayHetHanHienTai}
      />

      {/* Footer navigation */}
      <div className="pt-4 flex items-center justify-center gap-4 text-sm">
        <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/bang-gia">Xem bảng so sánh chi tiết</Link>
        </Button>
        <span className="text-muted-foreground">•</span>
        <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/goi-cua-toi">Quản lý gói của tôi</Link>
        </Button>
      </div>
    </div>
  );
}

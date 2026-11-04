import { Metadata } from "next";
import { taoSupabaseServer } from "@/lib/supabase/server";
import { TheGoi } from "@/components/goi/TheGoi";
import { BangSoSanh } from "@/components/goi/BangSoSanh";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Crown, Sparkles, ShieldCheck, Zap, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng giá gói thành viên PRO | Học Nấu Ăn Online",
  description:
    "Đăng ký gói PRO để mở khóa video Full HD, chứng chỉ bếp trưởng, tải tài liệu PDF và quyền đăng tải công thức nấu ăn cá nhân.",
};

export const revalidate = 60; // ISR 60s

export default async function BangGiaPage() {
  const supabase = await taoSupabaseServer();

  const { data: danhSachGoi } = await supabase
    .from("goi_premium")
    .select("*")
    .eq("hoat_dong", true)
    .order("thu_tu", { ascending: true });

  const gois = danhSachGoi && danhSachGoi.length > 0
    ? danhSachGoi
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
        },
      ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-300/40 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>NÂNG TẦM KỸ NĂNG NẤU NƯỚNG CÙNG PRO</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Chọn gói thành viên{" "}
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
            PRO
          </span>{" "}
          phù hợp với bạn
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Mở khóa toàn bộ video HD, chứng chỉ bếp trưởng, tài liệu công thức độc quyền và không còn quảng cáo làm phiền.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {gois.map((goi) => (
          <TheGoi
            key={goi.id}
            id={goi.id}
            ma_goi={goi.ma_goi}
            ten={goi.ten}
            mo_ta={goi.mo_ta}
            thoi_han_ngay={goi.thoi_han_ngay}
            gia={Number(goi.gia)}
            quyen_loi={goi.quyen_loi as string[]}
            noi_bat={goi.ma_goi === "pro_nam" || goi.thoi_han_ngay >= 365}
            ctaText={
              goi.ma_goi === "pro_nam" || goi.thoi_han_ngay >= 365
                ? "Nâng cấp Pro Năm (Tiết kiệm 33%)"
                : "Nâng cấp Pro Tháng"
            }
            ctaHref={`/nang-cap-pro?goi=${goi.ma_goi}`}
          />
        ))}
      </div>

      {/* Cam kết & Giá trị */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
        <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Thanh toán an toàn</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Bảo mật 100% qua cổng thanh toán VNPay chuẩn ngân hàng quốc gia.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Kích hoạt nhanh chóng</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Đội ngũ kiểm duyệt duyệt tài khoản trong vài phút sau khi hoàn tất.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-card/50">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Cộng dồn thời hạn</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Gia hạn trước khi hết hạn sẽ được cộng dồn tiếp số ngày sử dụng.
            </p>
          </div>
        </div>
      </div>

      {/* Bảng so sánh tính năng Free vs Pro */}
      <div className="space-y-6 max-w-4xl mx-auto pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            So sánh quyền lợi chi tiết
          </h2>
          <p className="text-sm text-muted-foreground">
            Khám phá sự khác biệt khi nâng cấp lên tài khoản thành viên PRO
          </p>
        </div>

        <BangSoSanh />
      </div>

      {/* Câu hỏi thường gặp FAQ */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
        </div>

        <Accordion className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-medium">
              Gói Pro có thời hạn vĩnh viễn không?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Không, nền tảng không hỗ trợ gói vĩnh viễn. Hiện tại có 2 gói dịch vụ rõ ràng: gói <strong>Pro Tháng (30 ngày)</strong> và gói <strong>Pro Năm (365 ngày)</strong> để đảm bảo chi phí duy trì chất lượng bài giảng và hỗ trợ 1-1 tốt nhất cho học viên.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-medium">
              Sau khi thanh toán VNPay thì bao lâu tôi được kích hoạt Pro?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Sau khi thanh toán thành công qua VNPay, yêu cầu nâng cấp được ghi nhận ngay lập tức vào hệ thống. Đội ngũ quản trị viên sẽ kiểm tra và kích hoạt tài khoản trong vòng ít phút. Bạn sẽ nhận được thông báo trên website và email chúc mừng ngay khi hoàn tất.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-medium">
              Nếu tôi còn hạn Pro Tháng mà mua thêm Pro Năm thì sao?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Thời hạn sử dụng sẽ được tự động cộng dồn tiếp tục kể từ ngày hết hạn của gói hiện tại. Bạn hoàn toàn không bị mất bất kỳ ngày sử dụng nào!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-medium">
              Thành viên Pro có quyền đăng công thức không?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Có! Thành viên Pro sở hữu quyền tạo và chia sẻ các công thức nấu ăn của riêng mình với cộng đồng. Sau khi gửi, ban biên tập ẩm thực sẽ kiểm duyệt và xuất bản bài viết của bạn.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

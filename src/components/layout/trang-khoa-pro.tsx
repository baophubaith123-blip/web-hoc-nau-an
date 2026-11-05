import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Trang chặn hiển thị khi tài khoản thường truy cập trực tiếp
 * vào chức năng chỉ dành cho thành viên Pro (vd /tao-cong-thuc).
 */
export function TrangKhoaPro({ tinhNang }: { tinhNang: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card/50 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15">
        <Crown className="h-8 w-8 fill-amber-500 text-amber-500" />
      </span>
      <div className="space-y-2">
        <h1 className="text-xl font-bold">Tính năng dành cho thành viên Pro</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{tinhNang}</span> là đặc quyền của thành
          viên Pro. Nâng cấp tài khoản để tự đăng công thức và bài viết của bạn — quản trị viên sẽ
          duyệt trước khi nội dung xuất hiện công khai.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild className="gap-2 shadow-md">
          <Link href="/bang-gia">
            <Crown className="h-4 w-4" />
            Nâng cấp Pro ngay
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/bang-dieu-khien">Về bảng điều khiển</Link>
        </Button>
      </div>
    </div>
  );
}

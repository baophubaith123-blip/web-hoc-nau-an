import { FormBaiVietNguoiDung } from "@/components/bai-viet/form-bai-viet-nguoi-dung";
import { TrangKhoaPro } from "@/components/layout/trang-khoa-pro";
import { laProConHan } from "@/lib/actions/chung";
import { yeuCauVaiTro } from "@/lib/supabase/server";

export default async function TrangTaoBaiViet() {
  const phien = await yeuCauVaiTro();
  // Tài khoản thường: hiện trang khóa Pro thay vì biểu mẫu
  const quyenCao = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  if (!quyenCao && !laProConHan(phien.profile)) {
    return <TrangKhoaPro tinhNang="Viết bài viết" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Viết bài viết mới</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Chia sẻ mẹo bếp, kinh nghiệm chọn nguyên liệu và câu chuyện ẩm thực của bạn. Bài viết sẽ
          được quản trị viên duyệt trước khi xuất hiện công khai.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-xs">
        <FormBaiVietNguoiDung />
      </div>
    </div>
  );
}

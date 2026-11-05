import { FormCongThuc } from "@/components/cong-thuc/form-cong-thuc";
import { TrangKhoaPro } from "@/components/layout/trang-khoa-pro";
import { laProConHan } from "@/lib/actions/chung";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

export default async function TrangTaoCongThuc() {
  const phien = await yeuCauVaiTro();
  // Tài khoản thường: hiện trang khóa Pro thay vì biểu mẫu
  const quyenCao = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  if (!quyenCao && !laProConHan(phien.profile)) {
    return <TrangKhoaPro tinhNang="Tạo công thức" />;
  }
  const supabase = await taoSupabaseServer();

  const { data: danhMucList } = await supabase
    .from("danh_muc")
    .select("*")
    .eq("trang_thai", "hoat_dong")
    .order("thu_tu", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tạo công thức món ăn mới</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Chia sẻ bí quyết nấu nướng độc đáo của bạn đến với cộng đồng ẩm thực
        </p>
      </div>

      <FormCongThuc danhMucList={danhMucList || []} />
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { FormBaiVietNguoiDung } from "@/components/bai-viet/form-bai-viet-nguoi-dung";
import { TrangKhoaPro } from "@/components/layout/trang-khoa-pro";
import { laProConHan } from "@/lib/actions/chung";
import { yeuCauVaiTro, taoSupabaseServer } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TrangSuaBaiViet({ params }: Props) {
  const { id } = await params;
  const phien = await yeuCauVaiTro();
  const quyenCao = phien.profile.vai_tro === "chef" || phien.profile.vai_tro === "admin";
  if (!quyenCao && !laProConHan(phien.profile)) {
    return <TrangKhoaPro tinhNang="Viết bài viết" />;
  }

  const supabase = await taoSupabaseServer();
  const { data: bv, error } = await supabase
    .from("bai_viet")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !bv) {
    notFound();
  }
  // Chỉ tác giả mới sửa được, và chỉ khi bài đang là bản nháp hoặc bị từ chối
  if (bv.tac_gia_id !== phien.user.id) {
    redirect("/bai-viet-cua-toi");
  }
  if (bv.trang_thai !== "nhap" && bv.trang_thai !== "tu_choi") {
    redirect("/bai-viet-cua-toi");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sửa bài viết</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Chỉnh sửa nội dung rồi lưu nháp hoặc gửi duyệt lại khi bạn đã sẵn sàng.
        </p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-xs">
        <FormBaiVietNguoiDung baiVietGoc={bv} />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  baiVietNguoiDungSchema,
  type BaiVietNguoiDungForm,
} from "@/lib/validations/bai-viet";
import { guiBaiViet, capNhatBaiVietCuaToi } from "@/lib/actions/bai-viet";
import type { Bang } from "@/types";

interface FormBaiVietNguoiDungProps {
  baiVietGoc?: Bang<"bai_viet">;
}

const GOI_Y_DANH_MUC = ["Mẹo nhà bếp", "Nguyên liệu", "Dinh dưỡng", "Văn hóa ẩm thực", "Dụng cụ bếp", "Bảo quản thực phẩm"];

/**
 * Biểu mẫu viết bài dành cho thành viên Pro: lưu nháp hoặc gửi duyệt.
 * Bài gửi duyệt sẽ ở trạng thái chờ duyệt cho đến khi admin phê duyệt.
 */
export function FormBaiVietNguoiDung({ baiVietGoc }: FormBaiVietNguoiDungProps) {
  const router = useRouter();
  const [dangGui, setDangGui] = useState<"nhap" | "gui" | null>(null);

  const form = useForm<BaiVietNguoiDungForm>({
    resolver: zodResolver(baiVietNguoiDungSchema),
    defaultValues: {
      tieu_de: baiVietGoc?.tieu_de || "",
      tom_tat: baiVietGoc?.tom_tat || "",
      noi_dung: baiVietGoc?.noi_dung || "",
      anh_dai_dien: baiVietGoc?.anh_dai_dien || "",
      danh_muc: baiVietGoc?.danh_muc || "",
    },
  });

  const anhXemTruoc = form.watch("anh_dai_dien");

  const xuLyGui = async (mucDich: "nhap" | "gui") => {
    const hopLe = await form.trigger();
    if (!hopLe) {
      toast.error("Vui lòng kiểm tra lại các trường còn thiếu hoặc chưa đúng");
      return;
    }
    setDangGui(mucDich);
    try {
      const duLieu = form.getValues();
      const res = baiVietGoc
        ? await capNhatBaiVietCuaToi(baiVietGoc.id, duLieu, mucDich)
        : await guiBaiViet(duLieu, mucDich);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success(
        mucDich === "gui"
          ? "Đã gửi bài viết! Quản trị viên sẽ duyệt trong thời gian sớm nhất."
          : "Đã lưu bản nháp bài viết."
      );
      router.push("/bai-viet-cua-toi");
      router.refresh();
    } catch {
      toast.error("Không gửi được bài viết, vui lòng thử lại");
    } finally {
      setDangGui(null);
    }
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {baiVietGoc?.trang_thai === "tu_choi" && baiVietGoc.ly_do_tu_choi && (
        <div className="flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">Bài viết đã bị từ chối</p>
            <p className="mt-1 text-muted-foreground">
              Lý do: {baiVietGoc.ly_do_tu_choi}. Bạn hãy chỉnh sửa lại nội dung rồi gửi duyệt lại
              nhé.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tieu_de">Tiêu đề bài viết *</Label>
        <Input
          id="tieu_de"
          placeholder="Ví dụ: 7 mẹo giữ rau xanh tươi cả tuần trong tủ lạnh"
          disabled={dangGui !== null}
          {...form.register("tieu_de")}
        />
        {form.formState.errors.tieu_de && (
          <p className="text-xs text-destructive">{form.formState.errors.tieu_de.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tom_tat">Tóm tắt ngắn</Label>
        <Textarea
          id="tom_tat"
          rows={2}
          placeholder="Một hai câu giới thiệu nội dung chính của bài viết (tối đa 300 ký tự)"
          disabled={dangGui !== null}
          {...form.register("tom_tat")}
        />
        {form.formState.errors.tom_tat && (
          <p className="text-xs text-destructive">{form.formState.errors.tom_tat.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="danh_muc">Chuyên mục</Label>
          <Input
            id="danh_muc"
            placeholder="Chọn hoặc tự nhập chuyên mục"
            list="goi-y-danh-muc-bai-viet"
            disabled={dangGui !== null}
            {...form.register("danh_muc")}
          />
          <datalist id="goi-y-danh-muc-bai-viet">
            {GOI_Y_DANH_MUC.map((dm) => (
              <option key={dm} value={dm} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anh_dai_dien">Ảnh bìa (đường dẫn URL)</Label>
          <Input
            id="anh_dai_dien"
            placeholder="https://..."
            disabled={dangGui !== null}
            {...form.register("anh_dai_dien")}
          />
          {form.formState.errors.anh_dai_dien && (
            <p className="text-xs text-destructive">{form.formState.errors.anh_dai_dien.message}</p>
          )}
        </div>
      </div>

      {anhXemTruoc && (
        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-2xl border bg-muted">
          {/* Ảnh do người dùng dán URL tùy ý nên dùng thẻ img thường thay cho next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={anhXemTruoc} alt="Xem trước ảnh bìa" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="noi_dung">Nội dung bài viết *</Label>
        <Textarea
          id="noi_dung"
          rows={16}
          placeholder={
            "Viết nội dung chi tiết tại đây. Hỗ trợ định dạng Markdown:\n## Tiêu đề mục\n- Ý gạch đầu dòng\n**Chữ đậm**"
          }
          className="font-mono text-sm leading-relaxed"
          disabled={dangGui !== null}
          {...form.register("noi_dung")}
        />
        <p className="text-xs text-muted-foreground">
          Nội dung tối thiểu 20 ký tự, nên chia thành các mục nhỏ với tiêu đề bắt đầu bằng ## để
          người đọc dễ theo dõi.
        </p>
        {form.formState.errors.noi_dung && (
          <p className="text-xs text-destructive">{form.formState.errors.noi_dung.message}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={dangGui !== null}
          onClick={() => xuLyGui("nhap")}
        >
          {dangGui === "nhap" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu bản nháp
        </Button>
        <Button
          type="button"
          className="gap-2 shadow-md"
          disabled={dangGui !== null}
          onClick={() => xuLyGui("gui")}
        >
          {dangGui === "gui" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Gửi duyệt bài viết
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { xoaCongThuc } from "@/lib/actions/cong-thuc";
import { xoaKhoaHoc } from "@/lib/actions/khoa-hoc";
import { xoaBaiViet, xoaBaiVietCuaToi } from "@/lib/actions/bai-viet";
import type { KetQua } from "@/lib/utils/phan-hoi-loi";

export type LoaiXoaVaoThungRac = "cong_thuc" | "khoa_hoc" | "bai_viet_admin" | "bai_viet_cua_toi";

const HANH_DONG_XOA: Record<LoaiXoaVaoThungRac, (id: unknown) => Promise<KetQua>> = {
  cong_thuc: xoaCongThuc,
  khoa_hoc: xoaKhoaHoc,
  bai_viet_admin: xoaBaiViet,
  bai_viet_cua_toi: xoaBaiVietCuaToi,
};

const NHAN_LOAI: Record<LoaiXoaVaoThungRac, string> = {
  cong_thuc: "công thức",
  khoa_hoc: "khóa học",
  bai_viet_admin: "bài viết",
  bai_viet_cua_toi: "bài viết",
};

/**
 * Nút Xóa → chuyển vào Thùng rác (đợt 3). Hộp xác nhận nêu rõ
 * khôi phục được trong 30 ngày. Dùng cho các danh sách chưa có
 * nút xóa (khóa học ở khu bếp/admin — lỗi L-04 đợt 1; công thức
 * ở khu bếp và "Công thức của tôi" của người dùng).
 */
export function NutXoaVaoThungRac({
  loai,
  id,
  tieuDe,
  nhanNut = "Xóa",
}: {
  loai: LoaiXoaVaoThungRac;
  id: string;
  tieuDe: string;
  nhanNut?: string;
}) {
  const router = useRouter();
  const [mo, setMo] = useState(false);
  const [dangXoa, setDangXoa] = useState(false);
  const nhanLoai = NHAN_LOAI[loai];

  const xuLyXoa = async () => {
    setDangXoa(true);
    try {
      const res = await HANH_DONG_XOA[loai](id);
      if (!res.thanh_cong) {
        toast.error(res.loi);
        return;
      }
      toast.success(`Đã chuyển ${nhanLoai} vào thùng rác`);
      setMo(false);
      router.refresh();
    } catch {
      toast.error("Không xóa được, vui lòng thử lại");
    } finally {
      setDangXoa(false);
    }
  };

  return (
    <Dialog open={mo} onOpenChange={setMo}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {nhanNut}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa {nhanLoai} này?</DialogTitle>
          <DialogDescription>
            {loai === "khoa_hoc" ? "Khóa học" : nhanLoai.charAt(0).toUpperCase() + nhanLoai.slice(1)}{" "}
            <span className="font-semibold text-foreground">{tieuDe}</span> sẽ được chuyển vào{" "}
            <strong>Thùng rác</strong> và ẩn khỏi mọi trang hiển thị. Bạn có thể{" "}
            <strong>khôi phục trong vòng 30 ngày</strong>; sau 30 ngày mục sẽ bị xóa vĩnh viễn.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={dangXoa} onClick={() => setMo(false)}>
            Hủy bỏ
          </Button>
          <Button variant="destructive" onClick={xuLyXoa} disabled={dangXoa} className="gap-2">
            {dangXoa && <Loader2 className="h-4 w-4 animate-spin" />}
            Chuyển vào thùng rác
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

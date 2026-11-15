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
} from "@/components/ui/dialog";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { khoiPhucCongThuc, xoaVinhVienCongThuc } from "@/lib/actions/cong-thuc";
import { khoiPhucKhoaHoc, xoaVinhVienKhoaHoc } from "@/lib/actions/khoa-hoc";
import { khoiPhucBaiViet, xoaVinhVienBaiViet } from "@/lib/actions/bai-viet";
import type { KetQua } from "@/lib/utils/phan-hoi-loi";

type LoaiNoiDung = "cong_thuc" | "khoa_hoc" | "bai_viet";

const HANH_DONG: Record<
  LoaiNoiDung,
  { khoiPhuc: (id: unknown) => Promise<KetQua>; xoaVinhVien: (id: unknown) => Promise<KetQua> }
> = {
  cong_thuc: { khoiPhuc: khoiPhucCongThuc, xoaVinhVien: xoaVinhVienCongThuc },
  khoa_hoc: { khoiPhuc: khoiPhucKhoaHoc, xoaVinhVien: xoaVinhVienKhoaHoc },
  bai_viet: { khoiPhuc: khoiPhucBaiViet, xoaVinhVien: xoaVinhVienBaiViet },
};

const NHAN_LOAI: Record<LoaiNoiDung, string> = {
  cong_thuc: "công thức",
  khoa_hoc: "khóa học",
  bai_viet: "bài viết",
};

/**
 * Cặp nút Khôi phục / Xóa vĩnh viễn cho 1 dòng trong thùng rác
 * (dùng ở cả 3 khu: admin, đầu bếp, người dùng — khung trang của
 * từng khu vẫn riêng). Xóa vĩnh viễn có hộp xác nhận 2 lớp.
 * Riêng khóa học: nơi gọi truyền choXoaVinhVien = false ở khu bếp
 * (chỉ Admin mới được xóa vĩnh viễn khóa học — chốt F.3).
 */
export function NutThaoTacThungRac({
  loai,
  id,
  tieuDe,
  choXoaVinhVien = true,
}: {
  loai: LoaiNoiDung;
  id: string;
  tieuDe: string;
  choXoaVinhVien?: boolean;
}) {
  const router = useRouter();
  const [dangXuLy, setDangXuLy] = useState(false);
  // 0 = đóng, 1 = lớp xác nhận 1, 2 = lớp xác nhận cuối
  const [buocXacNhan, setBuocXacNhan] = useState(0);
  const hanhDong = HANH_DONG[loai];

  const xuLyKhoiPhuc = async () => {
    setDangXuLy(true);
    try {
      const res = await hanhDong.khoiPhuc(id);
      if (res.thanh_cong) {
        toast.success(`Đã khôi phục ${NHAN_LOAI[loai]} "${tieuDe}"`);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không khôi phục được, vui lòng thử lại");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyXoaVinhVien = async () => {
    setDangXuLy(true);
    try {
      const res = await hanhDong.xoaVinhVien(id);
      if (res.thanh_cong) {
        toast.success(`Đã xóa vĩnh viễn ${NHAN_LOAI[loai]} "${tieuDe}"`);
        setBuocXacNhan(0);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không xóa vĩnh viễn được, vui lòng thử lại");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" className="gap-1.5" disabled={dangXuLy} onClick={xuLyKhoiPhuc}>
        {dangXuLy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
        Khôi phục
      </Button>

      {choXoaVinhVien && (
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={dangXuLy}
          onClick={() => setBuocXacNhan(1)}
        >
          <Trash2 className="h-4 w-4" />
          Xóa vĩnh viễn
        </Button>
      )}

      <Dialog open={buocXacNhan > 0} onOpenChange={(mo) => !mo && setBuocXacNhan(0)}>
        <DialogContent className="sm:max-w-md">
          {buocXacNhan === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Xóa vĩnh viễn {NHAN_LOAI[loai]} này?</DialogTitle>
                <DialogDescription>
                  {NHAN_LOAI[loai]} <span className="font-semibold text-foreground">{tieuDe}</span> sẽ bị
                  xóa hẳn khỏi hệ thống và <strong>không khôi phục được</strong>.
                  {loai === "khoa_hoc" && (
                    <>
                      {" "}
                      Toàn bộ bài học, ghi danh, tiến độ học tập và chứng chỉ liên quan đến khóa học
                      này cũng sẽ bị mất theo.
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBuocXacNhan(0)}>
                  Hủy bỏ
                </Button>
                <Button variant="destructive" onClick={() => setBuocXacNhan(2)}>
                  Tôi hiểu, tiếp tục
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Xác nhận lần cuối</DialogTitle>
                <DialogDescription>
                  Đây là bước xác nhận thứ hai. Sau khi bấm nút dưới đây, {NHAN_LOAI[loai]}{" "}
                  <span className="font-semibold text-foreground">{tieuDe}</span> sẽ biến mất vĩnh
                  viễn — không còn cách nào lấy lại được.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" disabled={dangXuLy} onClick={() => setBuocXacNhan(0)}>
                  Hủy bỏ
                </Button>
                <Button variant="destructive" className="gap-2" disabled={dangXuLy} onClick={xuLyXoaVinhVien}>
                  {dangXuLy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Xóa vĩnh viễn
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

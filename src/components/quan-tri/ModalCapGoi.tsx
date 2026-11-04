"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Sparkles, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capGoiThuCongAction, thuHoiGoiAction } from "@/lib/actions/quan-tri-goi";
import { toast } from "sonner";

interface GoiOption {
  id: string;
  ma_goi: string;
  ten: string;
  thoi_han_ngay: number;
}

interface ModalCapGoiProps {
  mo: boolean;
  onDong: () => void;
  nguoiDung: {
    id: string;
    ho_ten: string | null;
    username: string;
    la_pro?: boolean;
    goi_het_han?: string | null;
  } | null;
  danhSachGoi: GoiOption[];
}

export function ModalCapGoi({
  mo,
  onDong,
  nguoiDung,
  danhSachGoi,
}: ModalCapGoiProps) {
  const router = useRouter();

  const [goiDuocChon, setGoiDuocChon] = useState<string>(
    danhSachGoi[0]?.id || ""
  );
  const [ghiChu, setGhiChu] = useState("");
  const [lyDoThuHoi, setLyDoThuHoi] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);
  const [cheDoThuHoi, setCheDoThuHoi] = useState(false);

  if (!nguoiDung) return null;

  const handleCapGoi = async () => {
    if (!goiDuocChon) {
      toast.error("Vui lòng chọn gói dịch vụ cần cấp.");
      return;
    }

    setDangXuLy(true);
    try {
      const res = await capGoiThuCongAction({
        nguoi_dung_id: nguoiDung.id,
        goi_id: goiDuocChon,
        ghi_chu: ghiChu,
      });

      if (!res.thanh_cong) {
        toast.error(res.loi || "Cấp gói thất bại.");
        setDangXuLy(false);
        return;
      }

      toast.success(`Đã cấp gói Pro thành công cho @${nguoiDung.username}!`);
      onDong();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Lỗi xử lý cấp gói.");
    } finally {
      setDangXuLy(false);
    }
  };

  const handleThuHoiGoi = async () => {
    setDangXuLy(true);
    try {
      const res = await thuHoiGoiAction({
        nguoi_dung_id: nguoiDung.id,
        ly_do: lyDoThuHoi,
      });

      if (!res.thanh_cong) {
        toast.error(res.loi || "Thu hồi quyền Pro thất bại.");
        setDangXuLy(false);
        return;
      }

      toast.info(`Đã thu hồi quyền Pro của @${nguoiDung.username}.`);
      onDong();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Lỗi xử lý thu hồi gói.");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Dialog open={mo} onOpenChange={(open) => !open && onDong()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Quản lý gói Pro của người dùng</span>
          </DialogTitle>
          <DialogDescription>
            Tài khoản: <strong>{nguoiDung.ho_ten || nguoiDung.username}</strong> (@{nguoiDung.username})
            {nguoiDung.la_pro && nguoiDung.goi_het_han && (
              <span className="block mt-1 text-emerald-600 dark:text-emerald-400 font-medium">
                Đang là Pro (Hạn đến: {new Date(nguoiDung.goi_het_han).toLocaleDateString("vi-VN")})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {!cheDoThuHoi ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="chon_goi">Chọn gói Premium cần cấp</Label>
              <Select value={goiDuocChon} onValueChange={(val) => { if (val) setGoiDuocChon(val); }}>
                <SelectTrigger id="chon_goi">
                  <SelectValue placeholder="Chọn gói dịch vụ...">
                    {(value: string) => {
                      const goi = danhSachGoi.find((g) => g.id === value);
                      return goi
                        ? `${goi.ten} (${goi.thoi_han_ngay} ngày)`
                        : "Chọn gói dịch vụ...";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {danhSachGoi.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.ten} ({g.thoi_han_ngay} ngày)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Thời hạn gói sẽ được kích hoạt ngay và cộng dồn nếu người dùng đang có Pro.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ghi_chu_cap">Ghi chú cấp gói (tùy chọn)</Label>
              <Textarea
                id="ghi_chu_cap"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder="Ví dụ: Cấp gói tri ân giảng viên, đối tác tài trợ..."
                rows={2}
              />
            </div>

            {nguoiDung.la_pro && (
              <div className="pt-2 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                  onClick={() => setCheDoThuHoi(true)}
                >
                  Chuyển sang chế độ Thu hồi quyền Pro
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-2 border-l-2 border-destructive pl-3 my-2 bg-destructive/5 rounded-r p-3">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Thu hồi gói Pro</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Người dùng này sẽ bị hủy toàn bộ quyền Pro và chuyển về tài khoản thường (Free).
            </p>

            <div className="space-y-2">
              <Label htmlFor="ly_do_thu_hoi">Lý do thu hồi</Label>
              <Textarea
                id="ly_do_thu_hoi"
                value={lyDoThuHoi}
                onChange={(e) => setLyDoThuHoi(e.target.value)}
                placeholder="Ví dụ: Vi phạm chính sách cộng đồng..."
                rows={2}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCheDoThuHoi(false)}
            >
              Hủy thu hồi
            </Button>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onDong} disabled={dangXuLy}>
            Đóng
          </Button>

          {!cheDoThuHoi ? (
            <Button
              type="button"
              onClick={handleCapGoi}
              disabled={dangXuLy}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2"
            >
              {dangXuLy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Cấp gói Pro</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              onClick={handleThuHoiGoi}
              disabled={dangXuLy}
              className="gap-2 font-semibold"
            >
              {dangXuLy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              <span>Xác nhận thu hồi</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

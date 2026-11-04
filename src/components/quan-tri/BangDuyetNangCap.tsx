"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X, Clock, AlertCircle, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatGiaVND } from "@/lib/utils/goi";
import { duyetYeuCauNangCapAction, tuChoiYeuCauNangCapAction } from "@/lib/actions/quan-tri-goi";
import { toast } from "sonner";

interface YeuCauItem {
  id: string;
  ma_yeu_cau: string;
  trang_thai: string;
  ngay_tao?: string;
  created_at: string;
  ly_do_tu_choi?: string | null;
  ghi_chu?: string | null;
  nguoi_dung?: {
    id: string;
    ho_ten: string | null;
    username: string | null;
    avatar_url: string | null;
    email?: string;
  } | null;
  goi?: {
    id: string;
    ma_goi: string;
    ten: string;
    gia: number;
    thoi_han_ngay: number;
  } | null;
  thanh_toan?: {
    id: string;
    ma_giao_dich: string;
    so_tien: number;
    trang_thai: string;
    phuong_thuc: string;
  } | null;
}

interface BangDuyetNangCapProps {
  danhSach: YeuCauItem[];
}

export function BangDuyetNangCap({ danhSach }: BangDuyetNangCapProps) {
  const router = useRouter();

  const [yeuCauDangDuyet, setYeuCauDangDuyet] = useState<YeuCauItem | null>(null);
  const [yeuCauDangTuChoi, setYeuCauDangTuChoi] = useState<YeuCauItem | null>(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");
  const [ghiChuDuyet, setGhiChuDuyet] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  const xuLyDuyet = async () => {
    if (!yeuCauDangDuyet) return;
    setDangXuLy(true);
    try {
      const res = await duyetYeuCauNangCapAction({
        yeu_cau_id: yeuCauDangDuyet.id,
        ghi_chu: ghiChuDuyet,
      });

      if (!res.thanh_cong) {
        toast.error(res.loi || "Duyệt yêu cầu thất bại.");
        setDangXuLy(false);
        return;
      }

      toast.success(`Đã duyệt yêu cầu ${yeuCauDangDuyet.ma_yeu_cau}! Người dùng đã được cấp gói Pro.`);
      setYeuCauDangDuyet(null);
      setGhiChuDuyet("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Lỗi xử lý duyệt yêu cầu.");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyTuChoi = async () => {
    if (!yeuCauDangTuChoi) return;
    if (!lyDoTuChoi.trim() || lyDoTuChoi.trim().length < 3) {
      toast.error("Vui lòng nhập lý do từ chối cụ thể (tối thiểu 3 ký tự).");
      return;
    }

    setDangXuLy(true);
    try {
      const res = await tuChoiYeuCauNangCapAction({
        yeu_cau_id: yeuCauDangTuChoi.id,
        ly_do_tu_choi: lyDoTuChoi.trim(),
      });

      if (!res.thanh_cong) {
        toast.error(res.loi || "Từ chối yêu cầu thất bại.");
        setDangXuLy(false);
        return;
      }

      toast.info(`Đã từ chối yêu cầu ${yeuCauDangTuChoi.ma_yeu_cau}.`);
      setYeuCauDangTuChoi(null);
      setLyDoTuChoi("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Lỗi xử lý từ chối yêu cầu.");
    } finally {
      setDangXuLy(false);
    }
  };

  const layBadgeTrangThai = (tt: string) => {
    switch (tt) {
      case "cho_duyet":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 gap-1 font-semibold">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </Badge>
        );
      case "da_duyet":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1 font-semibold">
            <Check className="w-3 h-3" />
            Đã duyệt
          </Badge>
        );
      case "tu_choi":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-300 gap-1 font-semibold">
            <X className="w-3 h-3" />
            Từ chối
          </Badge>
        );
      case "da_huy":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground gap-1">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{tt}</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[140px]">Mã yêu cầu</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Gói Pro</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {danhSach.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Hiện chưa có yêu cầu nâng cấp nào.
                </TableCell>
              </TableRow>
            ) : (
              danhSach.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/20">
                  <TableCell className="font-mono font-medium text-xs">
                    {item.ma_yeu_cau}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        {item.nguoi_dung?.avatar_url ? (
                          <Image
                            src={item.nguoi_dung.avatar_url}
                            alt=""
                            width={28}
                            height={28}
                            unoptimized
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-none">
                          {item.nguoi_dung?.ho_ten || item.nguoi_dung?.username || "Ẩn danh"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          @{item.nguoi_dung?.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-sm text-foreground">
                      {item.goi?.ten || "Gói Pro"}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {item.goi?.thoi_han_ngay} ngày
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-sm">
                      {item.thanh_toan ? formatGiaVND(item.thanh_toan.so_tien) : (item.goi ? formatGiaVND(item.goi.gia) : "0 ₫")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.thanh_toan?.phuong_thuc?.toUpperCase() || "VNPAY"}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>

                  <TableCell>{layBadgeTrangThai(item.trang_thai)}</TableCell>

                  <TableCell className="text-right">
                    {item.trang_thai === "cho_duyet" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-emerald-500/50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold gap-1"
                          onClick={() => setYeuCauDangDuyet(item)}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Duyệt</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-rose-500/50 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold gap-1"
                          onClick={() => setYeuCauDangTuChoi(item)}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Từ chối</span>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        {item.trang_thai === "da_duyet" ? "Đã cấp Pro" : "Đã xong"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận Duyệt */}
      <Dialog open={!!yeuCauDangDuyet} onOpenChange={(open) => !open && setYeuCauDangDuyet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Phê duyệt nâng cấp tài khoản Pro</span>
            </DialogTitle>
            <DialogDescription>
              Hệ thống sẽ tự động cấp quyền Pro ({yeuCauDangDuyet?.goi?.thoi_han_ngay} ngày) cho người dùng{" "}
              <strong>{yeuCauDangDuyet?.nguoi_dung?.ho_ten || yeuCauDangDuyet?.nguoi_dung?.username}</strong>,
              đồng thời gửi thông báo và email kích hoạt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="ghi_chu">Ghi chú duyệt (tùy chọn)</Label>
            <Textarea
              id="ghi_chu"
              value={ghiChuDuyet}
              onChange={(e) => setGhiChuDuyet(e.target.value)}
              placeholder="Nhập ghi chú cho bản ghi này (nếu có)..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setYeuCauDangDuyet(null)}
              disabled={dangXuLy}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={xuLyDuyet}
              disabled={dangXuLy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold"
            >
              {dangXuLy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Xác nhận Duyệt Pro</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Từ chối */}
      <Dialog open={!!yeuCauDangTuChoi} onOpenChange={(open) => !open && setYeuCauDangTuChoi(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Từ chối yêu cầu nâng cấp</span>
            </DialogTitle>
            <DialogDescription>
              Vui lòng cung cấp lý do từ chối để người dùng nắm rõ thông tin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="ly_do_tu_choi">
              Lý do từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ly_do_tu_choi"
              value={lyDoTuChoi}
              onChange={(e) => setLyDoTuChoi(e.target.value)}
              placeholder="Ví dụ: Giao dịch VNPay chưa khớp với sao kê, thông tin thanh toán không hợp lệ..."
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setYeuCauDangTuChoi(null)}
              disabled={dangXuLy}
            >
              Quay lại
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={xuLyTuChoi}
              disabled={dangXuLy}
              className="gap-2 font-semibold"
            >
              {dangXuLy ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              <span>Xác nhận Từ chối</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

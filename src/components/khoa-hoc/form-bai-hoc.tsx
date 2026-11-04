"use client";

import { useState } from "react";
import { toast } from "sonner";
import { luuBaiHoc } from "@/lib/actions/bai-hoc";
import type { BaiTap } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Video, FileText, CheckCircle2 } from "lucide-react";

interface TaiLieuItem {
  ten: string;
  url: string;
}

interface FormBaiHocProps {
  khoaHocId: string;
  coTaiLieu?: boolean;
  coBaiTap?: boolean;
  baiHocHienTai?: {
    id: string;
    tieu_de: string;
    mo_ta: string | null;
    video_url: string | null;
    thoi_gian_phut: number;
    thu_tu: number;
    xem_truoc: boolean;
    tai_lieu: unknown;
    bai_tap: unknown;
  } | null;
  moDialog: boolean;
  onDong: () => void;
  onThanhCong: () => void;
}

export function FormBaiHoc({
  khoaHocId,
  coTaiLieu = true,
  coBaiTap = true,
  baiHocHienTai,
  moDialog,
  onDong,
  onThanhCong,
}: FormBaiHocProps) {
  const [dangXuLy, setDangXuLy] = useState(false);
  const [tieuDe, setTieuDe] = useState(baiHocHienTai?.tieu_de || "");
  const [moTa, setMoTa] = useState(baiHocHienTai?.mo_ta || "");
  const [videoUrl, setVideoUrl] = useState(baiHocHienTai?.video_url || "");
  const [thoiGianPhut, setThoiGianPhut] = useState(baiHocHienTai?.thoi_gian_phut || 15);
  const [thuTu, setThuTu] = useState(baiHocHienTai?.thu_tu || 1);
  const [xemTruoc, setXemTruoc] = useState(baiHocHienTai?.xem_truoc || false);

  const [taiLieu, setTaiLieu] = useState<TaiLieuItem[]>(
    Array.isArray(baiHocHienTai?.tai_lieu) ? (baiHocHienTai?.tai_lieu as TaiLieuItem[]) : []
  );

  const [baiTap, setBaiTap] = useState<BaiTap[]>(
    Array.isArray(baiHocHienTai?.bai_tap) ? (baiHocHienTai?.bai_tap as BaiTap[]) : []
  );

  const themTaiLieu = () => {
    setTaiLieu([...taiLieu, { ten: "", url: "" }]);
  };

  const xoaTaiLieu = (index: number) => {
    setTaiLieu(taiLieu.filter((_, i) => i !== index));
  };

  const capNhatTaiLieu = (index: number, field: "ten" | "url", val: string) => {
    const moi = [...taiLieu];
    moi[index][field] = val;
    setTaiLieu(moi);
  };

  const themCauHoi = () => {
    setBaiTap([
      ...baiTap,
      {
        cau_hoi: "",
        lua_chon: ["", "", "", ""],
        dap_an_dung: 0,
        diem: 10,
      },
    ]);
  };

  const xoaCauHoi = (index: number) => {
    setBaiTap(baiTap.filter((_, i) => i !== index));
  };

  const capNhatCauHoi = (index: number, val: string) => {
    const moi = [...baiTap];
    moi[index].cau_hoi = val;
    setBaiTap(moi);
  };

  const capNhatLuaChon = (qIdx: number, optIdx: number, val: string) => {
    const moi = [...baiTap];
    moi[qIdx].lua_chon[optIdx] = val;
    setBaiTap(moi);
  };

  const chonDapAnDung = (qIdx: number, optIdx: number) => {
    const moi = [...baiTap];
    moi[qIdx].dap_an_dung = optIdx;
    setBaiTap(moi);
  };

  const xuLyLuu = async () => {
    if (!tieuDe.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài học!");
      return;
    }

    setDangXuLy(true);
    try {
      const payload = {
        khoa_hoc_id: khoaHocId,
        tieu_de: tieuDe.trim(),
        mo_ta: moTa.trim() || undefined,
        video_url: videoUrl.trim() || undefined,
        tai_lieu: coTaiLieu ? taiLieu.filter((t) => t.ten.trim() && t.url.trim()) : [],
        bai_tap: coBaiTap
          ? baiTap.filter((b) => b.cau_hoi.trim() && b.lua_chon.every((o) => o.trim()))
          : [],
        thoi_gian_phut: Number(thoiGianPhut) || 0,
        thu_tu: Number(thuTu) || 1,
        xem_truoc: xemTruoc,
      };

      const kq = await luuBaiHoc(baiHocHienTai ? baiHocHienTai.id : null, payload);
      if (kq.thanh_cong) {
        toast.success(baiHocHienTai ? "Đã cập nhật bài học!" : "Đã tạo bài học mới!");
        onThanhCong();
        onDong();
      } else {
        toast.error(kq.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu bài học!");
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Dialog open={moDialog} onOpenChange={(open) => !open && onDong()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{baiHocHienTai ? "Chỉnh sửa bài học" : "Thêm bài học mới"}</DialogTitle>
          <DialogDescription>
            Điền nội dung video, tài liệu tham khảo và trắc nghiệm kiểm tra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="tieu_de_bh">Tiêu đề bài học *</Label>
              <Input
                id="tieu_de_bh"
                value={tieuDe}
                onChange={(e) => setTieuDe(e.target.value)}
                placeholder="VD: Bài 1: Kỹ năng cầm dao và cắt thái cơ bản"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thu_tu_bh">Thứ tự bài</Label>
              <Input
                id="thu_tu_bh"
                type="number"
                min="1"
                value={thuTu}
                onChange={(e) => setThuTu(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video_url_bh" className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-primary" /> Link video YouTube
              </Label>
              <Input
                id="video_url_bh"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thoi_gian_bh">Thời lượng dự tính (phút)</Label>
              <Input
                id="thoi_gian_bh"
                type="number"
                min="0"
                value={thoiGianPhut}
                onChange={(e) => setThoiGianPhut(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mo_ta_bh">Mô tả tóm tắt nội dung</Label>
            <Textarea
              id="mo_ta_bh"
              rows={3}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Tóm tắt những kiến thức quan trọng người học sẽ nắm được..."
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
            <div>
              <Label className="font-medium">Cho phép học thử (Xem trước)</Label>
              <p className="text-xs text-muted-foreground">
                Học viên chưa mua khóa học vẫn có thể xem bài này
              </p>
            </div>
            <Switch checked={xemTruoc} onCheckedChange={setXemTruoc} />
          </div>

          {/* Tài liệu đính kèm */}
          {coTaiLieu && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Tài liệu đính kèm
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={themTaiLieu}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm tài liệu
                </Button>
              </div>

              {taiLieu.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Chưa có tài liệu đính kèm.</p>
              ) : (
                <div className="space-y-2">
                  {taiLieu.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="Tên tài liệu (VD: Công thức PDF)"
                        value={item.ten}
                        onChange={(e) => capNhatTaiLieu(idx, "ten", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Link tải về (URL)"
                        value={item.url}
                        onChange={(e) => capNhatTaiLieu(idx, "url", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => xoaTaiLieu(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bài tập trắc nghiệm */}
          {coBaiTap && (
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Bài tập trắc nghiệm
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={themCauHoi}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm câu hỏi
                </Button>
              </div>

              {baiTap.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Chưa có bài tập trắc nghiệm nào.</p>
              ) : (
                <div className="space-y-4">
                  {baiTap.map((bt, qIdx) => (
                    <Card key={qIdx} className="bg-muted/20">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-sm mt-2 text-muted-foreground">
                            Câu {qIdx + 1}:
                          </span>
                          <Input
                            placeholder="Nhập nội dung câu hỏi..."
                            value={bt.cau_hoi}
                            onChange={(e) => capNhatCauHoi(qIdx, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => xoaCauHoi(qIdx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2 pl-6">
                          <p className="text-xs text-muted-foreground">
                            Nhập 4 lựa chọn và tích chọn vào ô tròn bên cạnh đáp án đúng:
                          </p>
                          {bt.lua_chon.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`dap_an_${qIdx}`}
                                checked={bt.dap_an_dung === optIdx}
                                onChange={() => chonDapAnDung(qIdx, optIdx)}
                                className="w-4 h-4 accent-primary cursor-pointer"
                              />
                              <Input
                                placeholder={`Lựa chọn ${optIdx + 1}`}
                                value={opt}
                                onChange={(e) => capNhatLuaChon(qIdx, optIdx, e.target.value)}
                                className="h-8 text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" type="button" onClick={onDong} disabled={dangXuLy}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={xuLyLuu}
            disabled={dangXuLy}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {dangXuLy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {baiHocHienTai ? "Lưu thay đổi" : "Thêm bài học"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

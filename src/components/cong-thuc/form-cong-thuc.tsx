"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { taoCongThuc, capNhatCongThuc } from "@/lib/actions/cong-thuc";
import { toast } from "sonner";
import type { Bang, NguyenLieu, BuocNau } from "@/types";

interface FormCongThucProps {
  danhMucList: Bang<"danh_muc">[];
  congThucGoc?: Bang<"cong_thuc"> & { danh_muc_ids?: string[] };
}

export function FormCongThuc({ danhMucList, congThucGoc }: FormCongThucProps) {
  const router = useRouter();
  const [dangGui, setDangGui] = useState(false);

  // Form states
  const [tieuDe, setTieuDe] = useState(congThucGoc?.tieu_de || "");
  const [moTa, setMoTa] = useState(congThucGoc?.mo_ta || "");
  const [anhDaiDien, setAnhDaiDien] = useState(congThucGoc?.anh_dai_dien || "");
  const [videoUrl, setVideoUrl] = useState(congThucGoc?.video_url || "");
  const [doKho, setDoKho] = useState<"de" | "trung_binh" | "kho">(
    congThucGoc?.do_kho || "de"
  );
  const [thoiGianChuanBi, setThoiGianChuanBi] = useState(
    congThucGoc?.thoi_gian_chuan_bi?.toString() || "15"
  );
  const [thoiGianNau, setThoiGianNau] = useState(
    congThucGoc?.thoi_gian_nau?.toString() || "30"
  );
  const [khauPhan, setKhauPhan] = useState(
    congThucGoc?.khau_phan?.toString() || "2"
  );
  const [calories, setCalories] = useState(
    congThucGoc?.calories?.toString() || ""
  );
  const [danhMucIds, setDanhMucIds] = useState<string[]>(
    congThucGoc?.danh_muc_ids || []
  );

  // Dynamic lists
  const [nguyenLieu, setNguyenLieu] = useState<NguyenLieu[]>(
    (congThucGoc?.nguyen_lieu as unknown as NguyenLieu[])?.length
      ? (congThucGoc?.nguyen_lieu as unknown as NguyenLieu[])
      : [
          { ten: "Thịt heo ba chỉ", so_luong: 300, don_vi: "g" },
          { ten: "Hành tím", so_luong: 3, don_vi: "củ" },
        ]
  );

  const [cacBuoc, setCacBuoc] = useState<BuocNau[]>(
    (congThucGoc?.cac_buoc as unknown as BuocNau[])?.length
      ? (congThucGoc?.cac_buoc as unknown as BuocNau[])
      : [
          { thu_tu: 1, noi_dung: "Sơ chế và rửa sạch nguyên liệu để ráo nước." },
          { thu_tu: 2, noi_dung: "Bật bếp và tiến hành chế biến theo khẩu vị." },
        ]
  );

  // Handlers for NguyenLieu
  const themNguyenLieu = () => {
    setNguyenLieu([...nguyenLieu, { ten: "", so_luong: 100, don_vi: "g" }]);
  };

  const xoaNguyenLieu = (index: number) => {
    setNguyenLieu(nguyenLieu.filter((_, i) => i !== index));
  };

  const suaNguyenLieu = (index: number, key: keyof NguyenLieu, val: any) => {
    const copy = [...nguyenLieu];
    copy[index] = { ...copy[index], [key]: val };
    setNguyenLieu(copy);
  };

  // Handlers for CacBuoc
  const themBuoc = () => {
    setCacBuoc([...cacBuoc, { thu_tu: cacBuoc.length + 1, noi_dung: "" }]);
  };

  const xoaBuoc = (index: number) => {
    const filtered = cacBuoc.filter((_, i) => i !== index);
    setCacBuoc(filtered.map((b, i) => ({ ...b, thu_tu: i + 1 })));
  };

  const suaBuoc = (index: number, noiDungMoi: string) => {
    const copy = [...cacBuoc];
    copy[index] = { ...copy[index], noi_dung: noiDungMoi };
    setCacBuoc(copy);
  };

  const xuLyLuu = async (guiDuyet: boolean) => {
    if (!tieuDe.trim()) {
      toast.error("Vui lòng nhập tên món ăn");
      return;
    }

    if (nguyenLieu.length === 0 || nguyenLieu.some((nl) => !nl.ten.trim())) {
      toast.error("Vui lòng điền đầy đủ tên cho các nguyên liệu");
      return;
    }

    if (cacBuoc.length === 0 || cacBuoc.some((b) => !b.noi_dung.trim())) {
      toast.error("Vui lòng điền đầy đủ nội dung các bước thực hiện");
      return;
    }

    setDangGui(true);
    try {
      const payload = {
        tieu_de: tieuDe.trim(),
        mo_ta: moTa.trim() || undefined,
        anh_dai_dien: anhDaiDien.trim() || undefined,
        video_url: videoUrl.trim() || undefined,
        do_kho: doKho,
        thoi_gian_chuan_bi: parseInt(thoiGianChuanBi, 10) || 0,
        thoi_gian_nau: parseInt(thoiGianNau, 10) || 0,
        khau_phan: parseInt(khauPhan, 10) || 1,
        calories: calories ? parseInt(calories, 10) : null,
        danh_muc_ids: danhMucIds,
        nguyen_lieu: nguyenLieu.map((nl) => ({
          ten: nl.ten.trim(),
          so_luong: Number(nl.so_luong) || 1,
          don_vi: nl.don_vi.trim() || "phần",
        })),
        cac_buoc: cacBuoc.map((b, idx) => ({
          thu_tu: idx + 1,
          noi_dung: b.noi_dung.trim(),
          anh: b.anh || undefined,
        })),
      };

      let res;
      const mucDich = guiDuyet ? "gui" : "nhap";
      if (congThucGoc) {
        res = await capNhatCongThuc(congThucGoc.id, payload, mucDich);
      } else {
        res = await taoCongThuc(payload, mucDich);
      }

      if (res.thanh_cong) {
        toast.success(
          guiDuyet
            ? "Đã gửi công thức phê duyệt thành công!"
            : "Đã lưu bản nháp công thức!"
        );
        router.push("/cong-thuc-da-gui");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Đã có lỗi xảy ra khi lưu công thức");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* 1. THÔNG TIN CƠ BẢN */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Thông tin món ăn</h2>

          <div className="space-y-2">
            <Label htmlFor="tieu_de">Tên món ăn *</Label>
            <Input
              id="tieu_de"
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              placeholder="Ví dụ: Thịt kho tàu nước dừa miền Tây"
              disabled={dangGui}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mo_ta">Mô tả ngắn</Label>
            <Textarea
              id="mo_ta"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Chia sẻ hương vị, nguồn gốc hoặc điểm đặc sắc của món này..."
              rows={3}
              disabled={dangGui}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anh">Link ảnh đại diện</Label>
              <Input
                id="anh"
                value={anhDaiDien}
                onChange={(e) => setAnhDaiDien(e.target.value)}
                placeholder="https://example.com/anh-mon-an.jpg"
                disabled={dangGui}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Link video YouTube (tùy chọn)</Label>
              <Input
                id="video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={dangGui}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="space-y-2">
              <Label>Độ khó</Label>
              <Select
                value={doKho}
                onValueChange={(val) => setDoKho(val as any)}
                disabled={dangGui}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: string) =>
                      ({ de: "Dễ", trung_binh: "Trung bình", kho: "Khó" } as Record<string, string>)[value] ?? value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Dễ</SelectItem>
                  <SelectItem value="trung_binh">Trung bình</SelectItem>
                  <SelectItem value="kho">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chuan_bi">Chuẩn bị (phút)</Label>
              <Input
                id="chuan_bi"
                type="number"
                value={thoiGianChuanBi}
                onChange={(e) => setThoiGianChuanBi(e.target.value)}
                disabled={dangGui}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nau">Nấu (phút)</Label>
              <Input
                id="nau"
                type="number"
                value={thoiGianNau}
                onChange={(e) => setThoiGianNau(e.target.value)}
                disabled={dangGui}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="khau_phan">Khẩu phần (người)</Label>
              <Input
                id="khau_phan"
                type="number"
                value={khauPhan}
                onChange={(e) => setKhauPhan(e.target.value)}
                disabled={dangGui}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. NGUYÊN LIỆU */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-bold">Nguyên liệu cần chuẩn bị</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={themNguyenLieu}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Thêm nguyên liệu
            </Button>
          </div>

          <div className="space-y-3">
            {nguyenLieu.map((nl, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={nl.ten}
                  onChange={(e) => suaNguyenLieu(idx, "ten", e.target.value)}
                  placeholder="Tên nguyên liệu (Ví dụ: Trứng gà)"
                  className="flex-3"
                  disabled={dangGui}
                />
                <Input
                  type="number"
                  value={nl.so_luong}
                  onChange={(e) =>
                    suaNguyenLieu(idx, "so_luong", parseFloat(e.target.value) || 0)
                  }
                  placeholder="Số lượng"
                  className="flex-1 min-w-[70px]"
                  disabled={dangGui}
                />
                <Input
                  value={nl.don_vi}
                  onChange={(e) => suaNguyenLieu(idx, "don_vi", e.target.value)}
                  placeholder="Đơn vị (g, quả, muỗng...)"
                  className="flex-1 min-w-[80px]"
                  disabled={dangGui}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => xoaNguyenLieu(idx)}
                  disabled={nguyenLieu.length <= 1 || dangGui}
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. CÁC BƯỚC NẤU */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-bold">Các bước thực hiện</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={themBuoc}
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Thêm bước
            </Button>
          </div>

          <div className="space-y-4">
            {cacBuoc.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/20">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary mt-1">
                  {idx + 1}
                </span>

                <div className="flex-1 space-y-2">
                  <Textarea
                    value={b.noi_dung}
                    onChange={(e) => suaBuoc(idx, e.target.value)}
                    placeholder={`Mô tả chi tiết bước ${idx + 1}...`}
                    rows={2}
                    disabled={dangGui}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => xoaBuoc(idx)}
                  disabled={cacBuoc.length <= 1 || dangGui}
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. ACTIONS */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => xuLyLuu(false)}
          disabled={dangGui}
          className="gap-2"
        >
          {dangGui ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu bản nháp
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={() => xuLyLuu(true)}
          disabled={dangGui}
          className="gap-2 shadow-md"
        >
          {dangGui ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Gửi duyệt công thức
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { taoDanhMuc, capNhatDanhMuc, xoaDanhMuc } from "@/lib/actions/quan-tri";
import type { Bang } from "@/types";
import { Plus, Edit2, Trash2, Loader2, FolderTree } from "lucide-react";

interface QuanLyDanhMucClientProps {
  danhSachDanhMuc: Bang<"danh_muc">[];
}

export function QuanLyDanhMucClient({
  danhSachDanhMuc,
}: QuanLyDanhMucClientProps) {
  const router = useRouter();
  const [moDialog, setMoDialog] = useState(false);
  const [danhMucSua, setDanhMucSua] = useState<Bang<"danh_muc"> | null>(null);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangXoaId, setDangXoaId] = useState<string | null>(null);

  // Form states
  const [ten, setTen] = useState("");
  const [slug, setSlug] = useState("");
  const [moTa, setMoTa] = useState("");
  const [anhDaiDien, setAnhDaiDien] = useState("");
  const [thuTu, setThuTu] = useState(0);

  const xuLyMoThem = () => {
    setDanhMucSua(null);
    setTen("");
    setSlug("");
    setMoTa("");
    setAnhDaiDien("");
    setThuTu(danhSachDanhMuc.length);
    setMoDialog(true);
  };

  const xuLyMoSua = (dm: Bang<"danh_muc">) => {
    setDanhMucSua(dm);
    setTen(dm.ten);
    setSlug(dm.slug);
    setMoTa(dm.mo_ta || "");
    setAnhDaiDien(dm.anh_dai_dien || "");
    setThuTu(dm.thu_tu);
    setMoDialog(true);
  };

  const taoSlugTuDong = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const xuLyLuu = async () => {
    if (!ten.trim() || !slug.trim()) {
      toast.error("Vui lòng nhập tên danh mục và đường dẫn (slug)!");
      return;
    }

    setDangXuLy(true);
    try {
      const payload = {
        ten: ten.trim(),
        slug: slug.trim(),
        mo_ta: moTa.trim() || undefined,
        anh_dai_dien: anhDaiDien.trim() || undefined,
        danh_muc_cha_id: null,
        thu_tu: Number(thuTu) || 0,
        trang_thai: "hoat_dong" as const,
      };

      let res;
      if (danhMucSua) {
        res = await capNhatDanhMuc(danhMucSua.id, payload);
      } else {
        res = await taoDanhMuc(payload);
      }

      if (res.thanh_cong) {
        toast.success(
          danhMucSua ? "Đã cập nhật danh mục!" : "Đã tạo danh mục mới thành công!"
        );
        setMoDialog(false);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu danh mục");
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyXoa = async (id: string, tenDm: string) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${tenDm}"? Các công thức thuộc danh mục này sẽ không bị xóa.`)) return;

    setDangXoaId(id);
    try {
      const res = await xoaDanhMuc(id);
      if (res.thanh_cong) {
        toast.success("Đã xóa danh mục thành công!");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa danh mục");
    } finally {
      setDangXoaId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản Lý Danh Mục</h1>
          <p className="text-sm text-muted-foreground">
            Phân loại thực đơn, vùng miền và phong cách ẩm thực cho toàn hệ thống
          </p>
        </div>

        <Button onClick={xuLyMoThem} className="gap-2">
          <Plus className="w-4 h-4" /> Thêm danh mục mới
        </Button>
      </div>

      {danhSachDanhMuc.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-card">
          <FolderTree className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">Chưa có danh mục nào.</p>
        </div>
      ) : (
        <div className="border rounded-2xl divide-y bg-card overflow-hidden shadow-xs">
          {danhSachDanhMuc.map((dm) => (
            <div
              key={dm.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{dm.ten}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    /{dm.slug}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Thứ tự: {dm.thu_tu}
                  </Badge>
                </div>
                {dm.mo_ta && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{dm.mo_ta}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => xuLyMoSua(dm)}
                  className="gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={dangXoaId === dm.id}
                  onClick={() => xuLyXoa(dm.id, dm.ten)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  {dangXoaId === dm.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog thêm/sửa */}
      <Dialog open={moDialog} onOpenChange={setMoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {danhMucSua ? "Chỉnh sửa danh mục" : "Tạo danh mục món ăn mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập tên và đường dẫn thân thiện (slug) cho danh mục ẩm thực
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ten_dm">Tên danh mục *</Label>
              <Input
                id="ten_dm"
                value={ten}
                placeholder="Ví dụ: Món Ăn Miền Bắc"
                onChange={(e) => {
                  setTen(e.target.value);
                  if (!danhMucSua) setSlug(taoSlugTuDong(e.target.value));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug_dm">Đường dẫn tĩnh (Slug) *</Label>
              <Input
                id="slug_dm"
                value={slug}
                placeholder="mon-an-mien-bac"
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thu_tu_dm">Thứ tự ưu tiên hiển thị</Label>
              <Input
                id="thu_tu_dm"
                type="number"
                value={thuTu}
                onChange={(e) => setThuTu(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anh_dm">Link ảnh đại diện (URL)</Label>
              <Input
                id="anh_dm"
                placeholder="https://..."
                value={anhDaiDien}
                onChange={(e) => setAnhDaiDien(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mo_ta_dm">Mô tả tóm tắt</Label>
              <Textarea
                id="mo_ta_dm"
                rows={3}
                placeholder="Mô tả phong vị đặc trưng..."
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoDialog(false)} disabled={dangXuLy}>
              Hủy
            </Button>
            <Button onClick={xuLyLuu} disabled={dangXuLy}>
              {dangXuLy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {danhMucSua ? "Cập nhật" : "Tạo danh mục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Reply, Send, Trash2, Edit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { guiBinhLuan, suaBinhLuan, xoaBinhLuan } from "@/lib/actions/binh-luan";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BadgePro } from "@/components/goi/BadgePro";
import type { Bang } from "@/types";

export type BinhLuanItem = Bang<"binh_luan"> & {
  nguoi_dung?: {
    id: string;
    ho_ten: string | null;
    avatar_url: string | null;
    la_pro?: boolean | null;
  } | null;
  tra_loi?: BinhLuanItem[];
};

interface KhuBinhLuanProps {
  congThucId: string;
  binhLuanBanDau: BinhLuanItem[];
  nguoiDungHienTaiId?: string | null;
}

export function KhuBinhLuan({
  congThucId,
  binhLuanBanDau,
  nguoiDungHienTaiId,
}: KhuBinhLuanProps) {
  const router = useRouter();
  const [danhSach, setDanhSach] = useState<BinhLuanItem[]>(binhLuanBanDau);
  const [noiDung, setNoiDung] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [traLoiChoId, setTraLoiChoId] = useState<string | null>(null);
  const [noiDungTraLoi, setNoiDungTraLoi] = useState("");
  const [dangSuaId, setDangSuaId] = useState<string | null>(null);
  const [noiDungSua, setNoiDungSua] = useState("");

  // Đồng bộ lại khi prop thay đổi
  useEffect(() => {
    setDanhSach(binhLuanBanDau);
  }, [binhLuanBanDau]);

  // Realtime subscription qua Supabase
  useEffect(() => {
    const supabase = taoSupabaseClient();
    const channel = supabase
      .channel(`binh_luan_${congThucId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "binh_luan",
          filter: `cong_thuc_id=eq.${congThucId}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [congThucId, router]);

  const xuLyGuiBinhLuan = async (chaId?: string) => {
    const text = chaId ? noiDungTraLoi.trim() : noiDung.trim();
    if (!text) return;

    if (!nguoiDungHienTaiId) {
      toast.error("Vui lòng đăng nhập để bình luận");
      router.push("/dang-nhap");
      return;
    }

    setDangGui(true);
    try {
      const res = await guiBinhLuan({
        cong_thuc_id: congThucId,
        noi_dung: text,
        binh_luan_cha_id: chaId || null,
      });

      if (res.thanh_cong) {
        toast.success("Đã gửi bình luận");
        if (chaId) {
          setTraLoiChoId(null);
          setNoiDungTraLoi("");
        } else {
          setNoiDung("");
        }
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể gửi bình luận");
    } finally {
      setDangGui(false);
    }
  };

  const xuLySua = async (id: string) => {
    if (!noiDungSua.trim()) return;
    setDangGui(true);
    try {
      const res = await suaBinhLuan({ id, noi_dung: noiDungSua.trim() });
      if (res.thanh_cong) {
        toast.success("Đã cập nhật bình luận");
        setDangSuaId(null);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể sửa bình luận");
    } finally {
      setDangGui(false);
    }
  };

  const xuLyXoa = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      const res = await xoaBinhLuan(id);
      if (res.thanh_cong) {
        toast.success("Đã xóa bình luận");
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể xóa bình luận");
    }
  };

  const layTen = (item: BinhLuanItem) =>
    item.nguoi_dung?.ho_ten || "Thành viên";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-3">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Bình luận & Thảo luận</h3>
      </div>

      {/* Form viết bình luận mới */}
      <div className="space-y-3">
        <Textarea
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          placeholder={
            nguoiDungHienTaiId
              ? "Viết bình luận hoặc câu hỏi của bạn..."
              : "Đăng nhập để tham gia thảo luận..."
          }
          rows={3}
          disabled={dangGui || !nguoiDungHienTaiId}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => xuLyGuiBinhLuan()}
            disabled={dangGui || !noiDung.trim() || !nguoiDungHienTaiId}
            className="gap-1.5"
          >
            <Send className="h-4 w-4" />
            Gửi bình luận
          </Button>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-4 divide-y divide-border/60">
        {danhSach.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!
          </p>
        ) : (
          danhSach.map((bl) => {
            const laCuaToi = nguoiDungHienTaiId === bl.nguoi_dung_id;

            return (
              <div key={bl.id} className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={bl.nguoi_dung?.avatar_url || undefined} />
                    <AvatarFallback>{layTen(bl).charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {layTen(bl)}
                        </span>
                        {bl.nguoi_dung?.la_pro && <BadgePro size="xs" />}
                        <span className="text-xs text-muted-foreground">
                          {dinhDangTuongDoi(bl.created_at)}
                        </span>
                      </div>

                      {laCuaToi && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setDangSuaId(bl.id);
                              setNoiDungSua(bl.noi_dung);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => xuLyXoa(bl.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {dangSuaId === bl.id ? (
                      <div className="space-y-2 pt-1">
                        <Textarea
                          value={noiDungSua}
                          onChange={(e) => setNoiDungSua(e.target.value)}
                          rows={2}
                        />
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDangSuaId(null)}
                          >
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => xuLySua(bl.id)}
                            disabled={dangGui}
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                        {bl.noi_dung}
                      </p>
                    )}

                    <div className="pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-primary gap-1"
                        onClick={() =>
                          setTraLoiChoId(traLoiChoId === bl.id ? null : bl.id)
                        }
                      >
                        <Reply className="h-3 w-3" />
                        Trả lời
                      </Button>
                    </div>

                    {/* Form trả lời */}
                    {traLoiChoId === bl.id && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/30">
                        <Textarea
                          value={noiDungTraLoi}
                          onChange={(e) => setNoiDungTraLoi(e.target.value)}
                          placeholder={`Trả lời ${layTen(bl)}...`}
                          rows={2}
                          disabled={dangGui}
                        />
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTraLoiChoId(null)}
                          >
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => xuLyGuiBinhLuan(bl.id)}
                            disabled={dangGui || !noiDungTraLoi.trim()}
                          >
                            Gửi
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Danh sách trả lời con */}
                    {bl.tra_loi && bl.tra_loi.length > 0 && (
                      <div className="mt-3 space-y-3 pl-4 border-l-2 border-border/80">
                        {bl.tra_loi.map((tl: BinhLuanItem) => (
                          <div key={tl.id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold">
                                {layTen(tl)}
                              </span>
                              {tl.nguoi_dung?.la_pro && <BadgePro size="xs" />}
                              <span className="text-[11px] text-muted-foreground">
                                {dinhDangTuongDoi(tl.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/90 whitespace-pre-line">
                              {tl.noi_dung}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

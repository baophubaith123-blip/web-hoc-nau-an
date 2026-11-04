"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ShieldAlert, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { guiTinNhan } from "@/lib/actions/ticket";
import { taoSupabaseClient } from "@/lib/supabase/client";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Bang } from "@/types";

export type TinNhanItem = Bang<"tin_nhan_ticket"> & {
  nguoi_gui?: {
    ho_ten: string | null;
    avatar_url: string | null;
    vai_tro: string;
  } | null;
};

interface ChatHoTroProps {
  ticketId: string;
  tinNhanBanDau: TinNhanItem[];
  nguoiDungHienTaiId: string;
  laNhanVien?: boolean;
}

export function ChatHoTro({
  ticketId,
  tinNhanBanDau,
  nguoiDungHienTaiId,
  laNhanVien = false,
}: ChatHoTroProps) {
  const router = useRouter();
  const [danhSach, setDanhSach] = useState<TinNhanItem[]>(tinNhanBanDau);
  const [noiDung, setNoiDung] = useState("");
  const [laNoiBo, setLaNoiBo] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const cuonCuoiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDanhSach(tinNhanBanDau);
  }, [tinNhanBanDau]);

  useEffect(() => {
    cuonCuoiRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [danhSach]);

  // Realtime subscription
  useEffect(() => {
    const supabase = taoSupabaseClient();
    const channel = supabase
      .channel(`ticket_${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tin_nhan_ticket",
          filter: `ticket_id=eq.${ticketId}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, router]);

  const xuLyGui = async () => {
    if (!noiDung.trim()) return;
    setDangGui(true);
    try {
      const res = await guiTinNhan({
        ticket_id: ticketId,
        noi_dung: noiDung.trim(),
        la_noi_bo: laNhanVien ? laNoiBo : false,
      });

      if (res.thanh_cong) {
        setNoiDung("");
        setLaNoiBo(false);
        router.refresh();
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="flex flex-col h-[580px] rounded-xl border bg-card overflow-hidden">
      {/* Khung tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {danhSach.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Chưa có tin nhắn phản hồi nào
          </p>
        ) : (
          danhSach.map((tn) => {
            const laToi = tn.nguoi_gui_id === nguoiDungHienTaiId;
            const vaiTroNguoiGui = tn.nguoi_gui?.vai_tro || "user";
            const laQuanTri = vaiTroNguoiGui === "admin" || vaiTroNguoiGui === "support";

            return (
              <div
                key={tn.id}
                className={`flex gap-3 ${laToi ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={tn.nguoi_gui?.avatar_url || undefined} />
                  <AvatarFallback>
                    {(tn.nguoi_gui?.ho_ten || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`max-w-[75%] space-y-1 ${
                    laToi ? "items-end text-right" : "items-start text-left"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {tn.nguoi_gui?.ho_ten || "Người dùng"}
                    </span>
                    {laQuanTri && (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1">
                        Hỗ trợ viên
                      </Badge>
                    )}
                    {tn.la_noi_bo && (
                      <Badge variant="destructive" className="text-[10px] py-0 px-1 gap-0.5">
                        <ShieldAlert className="h-3 w-3" />
                        Nội bộ
                      </Badge>
                    )}
                    <span>{dinhDangTuongDoi(tn.created_at)}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-3 text-sm leading-relaxed ${
                      tn.la_noi_bo
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200"
                        : laToi
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-muted text-foreground rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{tn.noi_dung}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={cuonCuoiRef} />
      </div>

      {/* Form gửi */}
      <div className="border-t p-3 bg-muted/20 space-y-3">
        {laNhanVien && (
          <div className="flex items-center gap-2 px-1">
            <Checkbox
              id="noi_bo"
              checked={laNoiBo}
              onCheckedChange={(c) => setLaNoiBo(!!c)}
            />
            <Label htmlFor="noi_bo" className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
              Ghi chú nội bộ (chỉ nhân viên hỗ trợ & admin nhìn thấy)
            </Label>
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            value={noiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                xuLyGui();
              }
            }}
            placeholder={
              laNoiBo
                ? "Ghi chú nội bộ cho đồng nghiệp..."
                : "Nhập tin nhắn phản hồi (Enter để gửi)..."
            }
            rows={2}
            disabled={dangGui}
            className="resize-none"
          />
          <Button
            onClick={xuLyGui}
            disabled={dangGui || !noiDung.trim()}
            className="h-auto px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

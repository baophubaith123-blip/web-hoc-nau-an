"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { taoSupabaseClient } from "@/lib/supabase/client";
import type { Bang } from "@/types";

export type ThongBao = Bang<"thong_bao">;
const TOI_DA = 30;

// Tải 30 thông báo gần nhất + lắng nghe thông báo mới qua Supabase Realtime (RLS tự lọc theo user)
export function useRealtimeThongBao(nguoiDungId: string | null) {
  const supabase = useMemo(() => taoSupabaseClient(), []);
  const [danhSach, setDanhSach] = useState<ThongBao[]>([]);
  const [dangTai, setDangTai] = useState(!!nguoiDungId);

  useEffect(() => {
    if (!nguoiDungId) {
      setDanhSach([]);
      setDangTai(false);
      return;
    }
    let daHuy = false;

    supabase
      .from("thong_bao")
      .select("*")
      .eq("nguoi_dung_id", nguoiDungId)
      .order("created_at", { ascending: false })
      .limit(TOI_DA)
      .then(({ data }) => {
        if (daHuy) return;
        setDanhSach(data ?? []);
        setDangTai(false);
      });

    const kenh = supabase
      .channel(`thong-bao:${nguoiDungId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "thong_bao", filter: `nguoi_dung_id=eq.${nguoiDungId}` },
        (goi) => {
          const moi = goi.new as ThongBao;
          setDanhSach((cu) => [moi, ...cu.filter((x) => x.id !== moi.id)].slice(0, TOI_DA));
          toast(moi.tieu_de, { description: moi.noi_dung ?? undefined });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "thong_bao", filter: `nguoi_dung_id=eq.${nguoiDungId}` },
        (goi) => {
          const capNhat = goi.new as ThongBao;
          setDanhSach((cu) => cu.map((x) => (x.id === capNhat.id ? capNhat : x)));
        }
      )
      .subscribe();

    return () => {
      daHuy = true;
      supabase.removeChannel(kenh);
    };
  }, [nguoiDungId, supabase]);

  const soChuaDoc = danhSach.filter((x) => !x.da_doc).length;

  const danhDauDaDoc = useCallback(
    async (id: string) => {
      setDanhSach((cu) => cu.map((x) => (x.id === id ? { ...x, da_doc: true } : x))); // cập nhật ngay trên UI
      await supabase.from("thong_bao").update({ da_doc: true }).eq("id", id);
    },
    [supabase]
  );

  const docTatCa = useCallback(async () => {
    if (!nguoiDungId) return;
    setDanhSach((cu) => cu.map((x) => ({ ...x, da_doc: true })));
    await supabase.from("thong_bao").update({ da_doc: true }).eq("nguoi_dung_id", nguoiDungId).eq("da_doc", false);
  }, [nguoiDungId, supabase]);

  const xoa = useCallback(
    async (id: string) => {
      setDanhSach((cu) => cu.filter((x) => x.id !== id));
      await supabase.from("thong_bao").delete().eq("id", id);
    },
    [supabase]
  );

  return { danhSach, dangTai, soChuaDoc, danhDauDaDoc, docTatCa, xoa };
}
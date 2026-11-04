"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRealtimeThongBao } from "@/hooks/use-realtime-thong-bao";

type GiaTri = ReturnType<typeof useRealtimeThongBao>;
const NguCanh = createContext<GiaTri | null>(null);

// Bọc các layout của người đã đăng nhập. nguoiDungId = null thì không mở kênh realtime
export function ThongBaoProvider({ nguoiDungId, children }: { nguoiDungId: string | null; children: ReactNode }) {
  const giaTri = useRealtimeThongBao(nguoiDungId);
  return <NguCanh.Provider value={giaTri}>{children}</NguCanh.Provider>;
}

export function useThongBao() {
  const ngu = useContext(NguCanh);
  if (!ngu) throw new Error("useThongBao phải nằm trong ThongBaoProvider");
  return ngu;
}
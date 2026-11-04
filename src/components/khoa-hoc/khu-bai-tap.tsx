"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nopBaiTap } from "@/lib/actions/bai-hoc";
import { toast } from "sonner";
import type { BaiTap } from "@/types";

interface KhuBaiTapProps {
  baiHocId: string;
  danhSachBaiTap: BaiTap[];
}

export function KhuBaiTap({ baiHocId, danhSachBaiTap }: KhuBaiTapProps) {
  const [cauTraLoi, setCauTraLoi] = useState<number[]>(
    danhSachBaiTap.map(() => -1)
  );
  const [ketQua, setKetQua] = useState<{
    diem: number;
    tong_diem: number;
    phan_tram: number;
    chi_tiet: { cau_so: number; dung: boolean; diem: number }[];
  } | null>(null);
  const [dangCham, setDangCham] = useState(false);

  const chonDapAn = (cauIdx: number, luaChonIdx: number) => {
    setCauTraLoi((prev) => {
      const copy = [...prev];
      copy[cauIdx] = luaChonIdx;
      return copy;
    });
  };

  const xuLyNopBai = async () => {
    if (cauTraLoi.some((ans) => ans === -1)) {
      toast.error("Vui lòng trả lời tất cả các câu hỏi");
      return;
    }

    setDangCham(true);
    try {
      const res = await nopBaiTap(baiHocId, cauTraLoi);
      if (res.thanh_cong) {
        const phanTram =
          res.du_lieu.tong > 0 ? Math.round((res.du_lieu.diem / res.du_lieu.tong) * 100) : 0;
        setKetQua({
          diem: res.du_lieu.diem,
          tong_diem: res.du_lieu.tong,
          phan_tram: phanTram,
          chi_tiet: res.du_lieu.chi_tiet.map((ct, idx) => ({
            cau_so: idx + 1,
            dung: ct.dung,
            diem: 0,
          })),
        });
        toast.success(
          `Bạn đạt ${res.du_lieu.diem}/${res.du_lieu.tong} điểm (${phanTram}%)!`
        );
      } else {
        toast.error(res.loi);
      }
    } catch {
      toast.error("Không thể chấm bài tập");
    } finally {
      setDangCham(false);
    }
  };

  if (!danhSachBaiTap || danhSachBaiTap.length === 0) return null;

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Bài tập củng cố kiến thức</h3>
        </div>
        {ketQua && (
          <span className="font-mono text-sm font-bold text-primary">
            Điểm: {ketQua.diem}/{ketQua.tong_diem} ({ketQua.phan_tram}%)
          </span>
        )}
      </div>

      <div className="space-y-6">
        {danhSachBaiTap.map((bt, cIdx) => {
          const kqCau = ketQua?.chi_tiet[cIdx];

          return (
            <div key={cIdx} className="space-y-3">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>Câu {cIdx + 1}: {bt.cau_hoi}</span>
                {kqCau && (
                  kqCau.dung ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  )
                )}
              </p>

              <div className="space-y-2 pl-4">
                {bt.lua_chon.map((lc, lcIdx) => {
                  const daChon = cauTraLoi[cIdx] === lcIdx;

                  return (
                    <label
                      key={lcIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                        daChon
                          ? "border-primary bg-primary/5 font-medium"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`cau_${cIdx}`}
                        checked={daChon}
                        onChange={() => chonDapAn(cIdx, lcIdx)}
                        disabled={dangCham}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>{lc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={xuLyNopBai} disabled={dangCham}>
          {dangCham ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang chấm điểm...
            </>
          ) : (
            "Nộp bài tập"
          )}
        </Button>
      </div>
    </div>
  );
}

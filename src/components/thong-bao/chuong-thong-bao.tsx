"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThongBao } from "@/providers/thong-bao-provider";
import { dinhDangTuongDoi } from "@/lib/utils/dinh-dang";
import { cn } from "@/lib/utils/cn";
import { vi } from "@/lib/i18n/vi";

export function ChuongThongBao() {
  const { danhSach, soChuaDoc, danhDauDaDoc, docTatCa } = useThongBao();
  const [mo, setMo] = useState(false);
  const gan = danhSach.slice(0, 6);

  return (
    <Popover open={mo} onOpenChange={setMo}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={vi.thong_bao.tieu_de}>
          <Bell className="h-5 w-5" />
          {soChuaDoc > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {soChuaDoc > 9 ? "9+" : soChuaDoc}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">{vi.thong_bao.tieu_de}</p>
          {soChuaDoc > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={docTatCa}>
              {vi.thong_bao.doc_tat_ca}
            </Button>
          )}
        </div>
        {gan.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">{vi.thong_bao.chua_co}</p>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto">
            {gan.map((tb) => (
              <li key={tb.id}>
                <Link
                  href={tb.lien_ket ?? "/thong-bao"}
                  onClick={() => {
                    if (!tb.da_doc) danhDauDaDoc(tb.id);
                    setMo(false);
                  }}
                  className={cn("block px-3 py-2.5 text-sm hover:bg-muted", !tb.da_doc && "bg-primary/5")}
                >
                  <p className={cn("line-clamp-1", !tb.da_doc && "font-semibold")}>{tb.tieu_de}</p>
                  {tb.noi_dung && <p className="line-clamp-2 text-xs text-muted-foreground">{tb.noi_dung}</p>}
                  <p className="mt-1 text-[11px] text-muted-foreground">{dinhDangTuongDoi(tb.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t p-2 text-center">
          <Link href="/thong-bao" onClick={() => setMo(false)} className="text-sm text-primary hover:underline">
            {vi.chung.xem_tat_ca}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
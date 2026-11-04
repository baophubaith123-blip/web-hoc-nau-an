import React from "react";
import { Check, X, Crown, User } from "lucide-react";
import { SO_SANH_QUYEN_LOI } from "@/lib/utils/goi";

export function BangSoSanh() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="py-4 px-6 text-sm font-semibold text-foreground/80 w-1/2">
                Tính năng & Quyền lợi
              </th>
              <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground w-1/4">
                <div className="flex items-center justify-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Miễn phí (Free)</span>
                </div>
              </th>
              <th className="py-4 px-4 text-center text-sm font-bold text-amber-600 dark:text-amber-400 w-1/4 bg-amber-500/5">
                <div className="flex items-center justify-center gap-1.5">
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Thành viên PRO</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {SO_SANH_QUYEN_LOI.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="py-3.5 px-6 font-medium text-foreground">
                  {item.tieu_de}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {item.free ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/40 text-muted-foreground/40">
                      <X className="w-3.5 h-3.5" />
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center bg-amber-500/5">
                  {item.pro ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/40 text-muted-foreground/40">
                      <X className="w-3.5 h-3.5" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

// Panel trò chuyện Cokba (Đợt 3) — dùng chung cho nút nổi ở khu
// công khai và trang đầy đủ /tro-ly. Chỉ là tầng hiển thị: mọi suy
// luận nằm ở bộ não src/lib/tro-ly qua server action hoiCokba.
//
// Trí nhớ phiên (slot): khởi tạo từ localStorage; nếu đã đăng nhập
// thì hợp nhất với trí nhớ server (server là nguồn chính) và lưu
// đồng thời cả hai nơi sau mỗi lượt. Lịch sử chat chỉ giữ trong
// phiên component.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChefHat,
  CookingPot,
  GraduationCap,
  Loader2,
  Newspaper,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { docTriNhoCokba, ghiTriNhoCokba, hoiCokba } from "@/lib/actions/tro-ly";
import {
  taoSlotTrong,
  type CauTraLoi,
  type SlotTriNho,
  type TheHienThi,
} from "@/lib/tro-ly/kieu-du-lieu";
import { vi } from "@/lib/i18n/vi";
import { cn } from "@/lib/utils/cn";

const t = vi.tro_ly;
const KHOA_LOCAL = "cokba-tri-nho";

export const CAU_HOI_MAU = [
  "Món nào làm bằng cà chua?",
  "Mình có trứng, cà chua thì nấu được gì?",
  "Khóa đầu tiên cho người mới là gì?",
  "Có đầu bếp nào chuyên món Âu không?",
  "Có bài nào về chọn dao không?",
];

type TinNhan = {
  id: number;
  vai: "nguoi" | "cokba";
  /** Bong bóng người dùng / dòng lỗi đơn giản. */
  vanBan?: string;
  /** Câu trả lời đầy đủ của Cokba (kèm thẻ, gợi ý, cờ gia vị...). */
  traLoi?: CauTraLoi;
  /** Câu hỏi gốc đã sinh ra câu trả lời này (để gửi lại sau khi xác nhận gia vị). */
  cauHoiGoc?: string;
};

// ---------------------------------------------------------------------------
// Thẻ nội dung (TheHienThi của bộ não)
// ---------------------------------------------------------------------------

function duongDanThe(the: TheHienThi): string {
  switch (the.loai) {
    case "mon":
      return `/cong-thuc/${the.slug ?? the.id}`;
    case "khoaHoc":
      return `/khoa-hoc/${the.slug ?? the.id}`;
    case "baiViet":
      return `/bai-viet/${the.slug ?? the.id}`;
    case "dauBep":
      return `/dau-bep/${the.id}`;
  }
}

function IconLoaiThe({ loai }: { loai: TheHienThi["loai"] }) {
  const cls = "h-8 w-8 text-primary";
  switch (loai) {
    case "mon":
      return <CookingPot className={cls} />;
    case "khoaHoc":
      return <GraduationCap className={cls} />;
    case "baiViet":
      return <Newspaper className={cls} />;
    case "dauBep":
      return <UserRound className={cls} />;
  }
}

function TheCokba({ the }: { the: TheHienThi }) {
  const hrefChinh = duongDanThe(the);
  return (
    <div
      data-testid="the-cokba"
      className="overflow-hidden rounded-2xl border bg-card shadow-xs"
    >
      {the.anh ? (
        <div className="relative h-32 w-full bg-muted">
          <Image
            src={the.anh}
            alt={the.tieuDe}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
          {typeof the.diemKhop === "number" && (
            <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow">
              Khớp {the.diemKhop}%
            </span>
          )}
        </div>
      ) : (
        <div className="flex h-16 w-full items-center justify-center gap-2 bg-primary/10">
          <IconLoaiThe loai={the.loai} />
          {typeof the.diemKhop === "number" && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              Khớp {the.diemKhop}%
            </span>
          )}
        </div>
      )}
      <div className="space-y-2 p-3">
        <p className="text-sm font-semibold leading-snug">{the.tieuDe}</p>
        {the.meta.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {the.meta.map((m, i) => (
              <span
                key={i}
                className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        )}
        {the.moTa && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {the.moTa}
          </p>
        )}
        {the.thieu && the.thieu.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Còn thiếu: <span className="font-medium text-foreground">{the.thieu.join(", ")}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {the.hanhDong.map((hd) => {
            if (hd === "nauMonNay") {
              return (
                <Link
                  key={hd}
                  href={`/nau/${the.slug ?? the.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <CookingPot className="h-3.5 w-3.5" /> Nấu món này
                </Link>
              );
            }
            const nhan =
              hd === "xem"
                ? "Xem công thức"
                : hd === "xemKhoa"
                  ? "Xem khóa học"
                  : hd === "docBai"
                    ? "Đọc bài"
                    : "Xem đầu bếp";
            const Icon =
              hd === "xem" ? BookOpen : hd === "xemKhoa" ? GraduationCap : hd === "docBai" ? Newspaper : UserRound;
            return (
              <Link
                key={hd}
                href={hrefChinh}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
              >
                <Icon className="h-3.5 w-3.5" /> {nhan}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel chính
// ---------------------------------------------------------------------------

export function PanelCokba({
  cheDo = "panel",
  nguoiDungId = null,
  onDong,
}: {
  cheDo?: "panel" | "trang";
  nguoiDungId?: string | null;
  onDong?: () => void;
}) {
  const [tinNhan, setTinNhan] = useState<TinNhan[]>([]);
  const [oNhap, setONhap] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [giaViChon, setGiaViChon] = useState<string[] | null>(null);
  const slotRef = useRef<SlotTriNho>(taoSlotTrong());
  const demRef = useRef(0);
  const cuoiRef = useRef<HTMLDivElement | null>(null);
  const cauHoiChoGiaViRef = useRef<string>("");
  const napTriNhoRef = useRef<Promise<void> | null>(null);

  const idMoi = () => ++demRef.current;

  // --- Khởi tạo trí nhớ: localStorage trước, server (nếu đăng nhập) là nguồn chính ---
  useEffect(() => {
    try {
      const tho = window.localStorage.getItem(KHOA_LOCAL);
      if (tho) {
        const slotLocal = { ...taoSlotTrong(), ...(JSON.parse(tho) as Partial<SlotTriNho>) };
        slotRef.current = slotLocal;
      }
    } catch {
      // localStorage không khả dụng -> dùng slot trống.
    }
    if (nguoiDungId) {
      napTriNhoRef.current = docTriNhoCokba()
        .then((slotServer) => {
          if (slotServer) {
            slotRef.current = slotServer;
            try {
              window.localStorage.setItem(KHOA_LOCAL, JSON.stringify(slotServer));
            } catch {
              // Bỏ qua lỗi ghi local.
            }
          }
        })
        .catch(() => undefined);
    }
    // Chỉ chạy một lần khi panel được dựng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Tự cuộn xuống cuối khi có tin mới ---
  useEffect(() => {
    cuoiRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [tinNhan, dangGui]);

  const luuSlot = (slotMoi: SlotTriNho) => {
    slotRef.current = slotMoi;
    try {
      window.localStorage.setItem(KHOA_LOCAL, JSON.stringify(slotMoi));
    } catch {
      // Bỏ qua lỗi ghi local.
    }
    if (nguoiDungId) void ghiTriNhoCokba(slotMoi).catch(() => undefined);
  };

  const guiLuat = async (vanBanHienThi: string, cauHoiGui: string) => {
    setTinNhan((ds) => [...ds, { id: idMoi(), vai: "nguoi", vanBan: vanBanHienThi }]);
    setDangGui(true);
    try {
      // Chờ nạp xong trí nhớ server (khi đã đăng nhập) rồi mới gửi kèm
      // slot mới nhất: trước đây lượt hỏi gửi ngay khi panel vừa mở có
      // thể mang slot trống (localStorage trống) và server action ghi đè
      // slot trống đó lên trí nhớ đã lưu, làm mất ngữ cảnh (phát hiện ở
      // kiểm chứng live đợt 5B).
      if (napTriNhoRef.current) await napTriNhoRef.current;
      const kq = await hoiCokba({ cauHoi: cauHoiGui, slot: slotRef.current });
      if (kq.ok) {
        luuSlot(kq.traLoi.slotDaCapNhat);
        if (kq.traLoi.canHoiGiaVi) {
          cauHoiChoGiaViRef.current = cauHoiGui;
          // Mặc định tích TẤT CẢ gia vị — người dùng bỏ tích món mình thiếu.
          setGiaViChon([...(kq.traLoi.danhSachGiaViDeHoi ?? [])]);
        }
        setTinNhan((ds) => [
          ...ds,
          { id: idMoi(), vai: "cokba", traLoi: kq.traLoi, cauHoiGoc: cauHoiGui },
        ]);
      } else {
        setTinNhan((ds) => [...ds, { id: idMoi(), vai: "cokba", vanBan: kq.loi }]);
      }
    } catch {
      setTinNhan((ds) => [...ds, { id: idMoi(), vai: "cokba", vanBan: t.loi_gui }]);
    } finally {
      setDangGui(false);
    }
  };

  const guiTuONhap = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cau = oNhap.trim();
    if (!cau || dangGui) return;
    setONhap("");
    void guiLuat(cau, cau);
  };

  const xacNhanGiaVi = () => {
    const slotMoi: SlotTriNho = {
      ...slotRef.current,
      giaViDaXacNhan: giaViChon ?? [],
    };
    luuSlot(slotMoi);
    setGiaViChon(null);
    // Gửi lại CÂU GỐC kèm slot đã có giaViDaXacNhan: bộ não bỏ qua bước
    // hỏi gia vị và chấm % khớp ngay (intent "có gì nấu nấy").
    void guiLuat(t.du_roi_goi_y, cauHoiChoGiaViRef.current);
  };

  const tinCuoiLaCokbaHoiGiaVi =
    tinNhan.length > 0 &&
    tinNhan[tinNhan.length - 1].vai === "cokba" &&
    !!tinNhan[tinNhan.length - 1].traLoi?.canHoiGiaVi &&
    slotRef.current.giaViDaXacNhan === null;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-card text-card-foreground",
        cheDo === "trang" && "rounded-3xl border shadow-sm"
      )}
    >
      {/* Đầu panel */}
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
          <ChefHat className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{t.tieu_de}</p>
          <p className="truncate text-xs opacity-90">{t.mo_ta_ngan}</p>
        </div>
        {onDong && (
          <button
            type="button"
            onClick={onDong}
            aria-label={t.dong}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-primary-foreground/15"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Thân trò chuyện */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-orange-50/60 p-4 dark:bg-muted/30">
        {tinNhan.length === 0 && (
          <div className="space-y-3">
            <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-background p-3 text-sm leading-relaxed shadow-xs">
              {t.loi_chao}
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> {t.cau_mau}
              </p>
              <div className="flex flex-wrap gap-2">
                {CAU_HOI_MAU.map((cau) => (
                  <button
                    key={cau}
                    type="button"
                    disabled={dangGui}
                    onClick={() => void guiLuat(cau, cau)}
                    className="rounded-full border bg-background px-3 py-1.5 text-left text-xs font-medium shadow-xs transition hover:bg-muted disabled:opacity-50"
                  >
                    {cau}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tinNhan.map((tn) => {
          if (tn.vai === "nguoi") {
            return (
              <div key={tn.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-xs">
                  {tn.vanBan}
                </div>
              </div>
            );
          }
          const tl = tn.traLoi;
          return (
            <div key={tn.id} className="flex justify-start">
              <div className="w-full max-w-[92%] space-y-2">
                {(tl ? tl.doanVan : tn.vanBan ? [tn.vanBan] : []).map((doan, i) => (
                  <div
                    key={i}
                    className="whitespace-pre-line rounded-2xl rounded-tl-md bg-background p-3 text-sm leading-relaxed shadow-xs"
                  >
                    {doan}
                  </div>
                ))}
                {tl && tl.the.length > 0 && (
                  <div className="space-y-2">
                    {tl.the.map((the) => (
                      <TheCokba key={`${the.loai}-${the.id}`} the={the} />
                    ))}
                  </div>
                )}
                {tl?.goiY && tl.goiY.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tl.goiY.map((gy) => (
                      <button
                        key={gy}
                        type="button"
                        disabled={dangGui}
                        onClick={() => void guiLuat(gy, gy)}
                        className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium shadow-xs transition hover:bg-muted disabled:opacity-50"
                      >
                        {gy}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Khối xác nhận gia vị — chỉ trên lượt hỏi gia vị gần nhất */}
        {tinCuoiLaCokbaHoiGiaVi && giaViChon !== null && (
          <div className="rounded-2xl border bg-background p-3 shadow-xs" data-testid="khoi-gia-vi">
            <p className="text-sm font-semibold">{t.hoi_gia_vi_tieu_de}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t.hoi_gia_vi_mo_ta}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {(tinNhan[tinNhan.length - 1].traLoi?.danhSachGiaViDeHoi ?? []).map((gv) => {
                const daChon = giaViChon.includes(gv);
                return (
                  <label
                    key={gv}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={daChon}
                      onChange={(e) =>
                        setGiaViChon((ds) =>
                          e.target.checked
                            ? [...(ds ?? []), gv]
                            : (ds ?? []).filter((x) => x !== gv)
                        )
                      }
                      className="h-4 w-4 shrink-0 accent-orange-600"
                    />
                    <span>{gv}</span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              disabled={dangGui}
              onClick={xacNhanGiaVi}
              className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {t.du_roi_goi_y}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {t.hoi_gia_vi_goi_y_phu}
            </p>
          </div>
        )}

        {dangGui && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-background px-3.5 py-2.5 text-sm text-muted-foreground shadow-xs">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.dang_nghi}
            </div>
          </div>
        )}
        <div ref={cuoiRef} />
      </div>

      {/* Ô nhập */}
      <form
        onSubmit={guiTuONhap}
        className="flex items-center gap-2 border-t bg-background p-3"
      >
        <input
          data-testid="o-nhap-cokba"
          value={oNhap}
          onChange={(e) => setONhap(e.target.value)}
          placeholder={t.nhap_cau_hoi}
          maxLength={500}
          className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          data-testid="nut-gui-cokba"
          disabled={dangGui || !oNhap.trim()}
          aria-label={t.gui}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}

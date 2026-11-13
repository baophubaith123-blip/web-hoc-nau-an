"use client";

// Buổi nấu rảnh tay (Đợt 4 — Cokba) gồm 3 màn:
//   A. Chuẩn bị: ảnh/meta món, nguyên liệu đã chia theo số người ăn
//      (chia-khau-phan.ts), 2 công tắc giọng nói / giữ màn hình sáng.
//   B. Từng bước: chữ to, ảnh bước, KHU ĐỒNG HỒ — mỗi mốc giờ mà
//      docThoiLuong() đọc được từ nội dung bước là một đồng hồ riêng.
//   C. Hoàn thành: tổng thời gian + lối tắt + gợi ý món cùng danh mục.
//
// Đồng hồ tính theo TIMESTAMP ĐÍCH (Date.now) nên chuyển tab quay lại
// vẫn đúng giờ. Trạng thái đồng hồ sống ở component buổi nấu, key theo
// (chỉ số bước, chỉ số mốc): chuyển bước KHÔNG giết đồng hồ đang chạy —
// đồng hồ của bước khác chạy xong vẫn phát chuông + hiện banner trong
// trang. Chuông "ting ting" tự sinh bằng Web Audio (không file ngoài),
// AudioContext chỉ khởi tạo sau tương tác người dùng.
//
// Dự án KHÔNG có bảng lịch sử/tiến độ nấu cho công thức (đã rà schema:
// tien_do_bai_hoc là của bài học khóa học, cong_thuc_da_luu là bookmark)
// nên khi hoàn thành buổi nấu CHỈ dọn slot trí nhớ (monDangNau /
// buocHienTai) — không tự chế bảng mới ở đợt này.

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  BookOpen,
  CheckCircle2,
  Clock,
  CookingPot,
  Home,
  Lightbulb,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { ghiTriNhoCokba } from "@/lib/actions/tro-ly";
import { chiaKhauPhan } from "@/lib/tro-ly/chia-khau-phan";
import { docThoiLuong } from "@/lib/tro-ly/doc-thoi-luong";
import {
  taoSlotTrong,
  type BuocNauMon,
  type NguyenLieuMon,
  type SlotTriNho,
} from "@/lib/tro-ly/kieu-du-lieu";
import { vi } from "@/lib/i18n/vi";
import { cn } from "@/lib/utils/cn";

const n = vi.nau_ranh_tay;
const KHOA_LOCAL = "cokba-tri-nho";

// ---------------------------------------------------------------------------
// Kiểu dữ liệu
// ---------------------------------------------------------------------------

export interface MonNau {
  id: string;
  slug: string;
  tieu_de: string;
  anh_dai_dien: string | null;
  khau_phan: number;
  thoi_gian_chuan_bi: number; // phút
  thoi_gian_nau: number; // phút
  do_kho: string;
  nguyen_lieu: NguyenLieuMon[];
  cac_buoc: BuocNauMon[];
}

export interface MonGoiY {
  slug: string;
  tieu_de: string;
  anh_dai_dien: string | null;
  thoi_gian_chuan_bi: number;
  thoi_gian_nau: number;
  do_kho: string;
}

type TrangThaiDongHo = "cho" | "dang_chay" | "tam_dung" | "xong";

interface DongHo {
  key: string;
  buocIdx: number;
  mocIdx: number;
  nhan: string;
  laKhoang: boolean;
  /** Thời lượng gốc của mốc giờ (giây) — Đặt lại quay về số này. */
  tongGoc: number;
  /** Tổng hiện tại (giây) — tăng khi bấm +1 phút. */
  tongGiay: number;
  trangThai: TrangThaiDongHo;
  /** Timestamp đích (ms) khi đang chạy; null khi chờ/tạm dừng/xong. */
  ketThucLuc: number | null;
  /** Giây còn lại tại thời điểm tạm dừng (hoặc tổng khi đang chờ). */
  conLaiTamDung: number;
}

// ---------------------------------------------------------------------------
// Hàm thuần / tiện ích ngoài component
// ---------------------------------------------------------------------------

function dinhDangDongHo(tongGiay: number): string {
  const s = Math.max(0, Math.floor(tongGiay));
  const gio = Math.floor(s / 3600);
  const phut = Math.floor((s % 3600) / 60);
  const giay = s % 60;
  const p2 = (x: number) => String(x).padStart(2, "0");
  return gio > 0 ? `${p2(gio)}:${p2(phut)}:${p2(giay)}` : `${p2(phut)}:${p2(giay)}`;
}

function giayConLai(dh: DongHo, bayGio: number): number {
  if (dh.trangThai === "dang_chay" && dh.ketThucLuc !== null) {
    return Math.max(0, Math.ceil((dh.ketThucLuc - bayGio) / 1000));
  }
  if (dh.trangThai === "xong") return 0;
  return dh.conLaiTamDung;
}

function nhanDoKho(doKho: string): string {
  return (vi.nhan.do_kho as Record<string, string>)[doKho] ?? doKho;
}

/** Đọc một câu bằng giọng nói (nếu trình duyệt hỗ trợ). Không bao giờ ném lỗi. */
function docVanBan(vanBan: string): void {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const loi = new SpeechSynthesisUtterance(vanBan);
    loi.lang = "vi-VN";
    window.speechSynthesis.speak(loi);
  } catch {
    // Thiết bị không đọc được -> bỏ qua lặng lẽ.
  }
}

function huyDoc(): void {
  try {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  } catch {
    // Bỏ qua.
  }
}

/** Khởi tạo / đánh thức AudioContext — phải gọi từ tương tác người dùng. */
function damBaoAudio(audioRef: React.RefObject<AudioContext | null>): void {
  try {
    if (!audioRef.current) {
      const Lop =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Lop) audioRef.current = new Lop();
    }
    if (audioRef.current && audioRef.current.state === "suspended") {
      void audioRef.current.resume();
    }
  } catch {
    // Không có Web Audio -> bỏ qua.
  }
}

/** Chuông "ting ting ting": 3 nhịp ting bằng oscillator, tông ấm rõ ràng. */
function phatChuong(audioRef: React.RefObject<AudioContext | null>): void {
  damBaoAudio(audioRef);
  const ctx = audioRef.current;
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + 0.03;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 1567.98; // nốt Sol cao — tiếng "ting" trong, rõ
      const batDau = t0 + i * 0.38;
      gain.gain.setValueAtTime(0.0001, batDau);
      gain.gain.exponentialRampToValueAtTime(0.45, batDau + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, batDau + 0.34);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(batDau);
      osc.stop(batDau + 0.38);
    }
  } catch {
    // Bỏ qua lỗi âm thanh.
  }
}

interface WakeLockSentinelToiThieu {
  release: () => Promise<void>;
}
type NavigatorCoWakeLock = Navigator & {
  wakeLock?: { request: (loai: "screen") => Promise<WakeLockSentinelToiThieu> };
};

// ---------------------------------------------------------------------------
// Công tắc tùy chọn (dùng ở cả màn chuẩn bị và màn bước)
// ---------------------------------------------------------------------------

function CongTac({
  bat,
  onDoi,
  tieuDe,
  moTa,
  icon,
  testId,
}: {
  bat: boolean;
  onDoi: (moi: boolean) => void;
  tieuDe: string;
  moTa: string;
  icon: React.ReactNode;
  testId: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug">{tieuDe}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{moTa}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={bat}
        aria-label={tieuDe}
        data-testid={testId}
        onClick={() => onDoi(!bat)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full transition-colors",
          bat ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all",
            bat ? "left-7" : "left-1"
          )}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thẻ đồng hồ của một mốc giờ trong bước
// ---------------------------------------------------------------------------

function TheDongHo({
  dh,
  bayGio,
  onBatDau,
  onTamDung,
  onCongPhut,
  onDatLai,
}: {
  dh: DongHo;
  bayGio: number;
  onBatDau: (key: string) => void;
  onTamDung: (key: string) => void;
  onCongPhut: (key: string) => void;
  onDatLai: (key: string) => void;
}) {
  const conLai = giayConLai(dh, bayGio);
  const nhanTrangThai =
    dh.trangThai === "dang_chay"
      ? n.dang_chay
      : dh.trangThai === "tam_dung"
        ? n.tam_dung
        : dh.trangThai === "xong"
          ? n.da_xong
          : n.san_sang;
  return (
    <div
      data-testid={`dong-ho-${dh.buocIdx}-${dh.mocIdx}`}
      className={cn(
        "rounded-2xl border-2 p-4 transition-colors",
        dh.trangThai === "cho" && "border-border bg-card",
        dh.trangThai === "dang_chay" &&
          "border-primary/50 bg-orange-50 dark:bg-orange-950/20",
        dh.trangThai === "tam_dung" &&
          "border-amber-400/70 bg-amber-50 dark:bg-amber-950/20",
        dh.trangThai === "xong" && "dong-ho-het-gio border-orange-600 bg-orange-100"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
          <Timer className="h-4.5 w-4.5 shrink-0 text-primary" />
          <span className="truncate">
            {dh.nhan}
            {dh.laKhoang ? ` · ${n.khoang}` : ""} · {n.tong}{" "}
            {dinhDangDongHo(dh.tongGiay)}
          </span>
        </p>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold",
            dh.trangThai === "dang_chay" &&
              "bg-primary text-primary-foreground",
            dh.trangThai === "tam_dung" &&
              "bg-amber-500 text-white",
            dh.trangThai === "xong" && "bg-orange-600 text-white",
            dh.trangThai === "cho" && "bg-muted text-muted-foreground"
          )}
        >
          {nhanTrangThai}
        </span>
      </div>

      <p
        data-testid="gia-tri-dong-ho"
        className="mt-2 text-center font-mono text-5xl font-bold tabular-nums tracking-tight"
      >
        {dinhDangDongHo(conLai)}
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {dh.trangThai === "cho" && (
          <button
            type="button"
            onClick={() => onBatDau(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Play className="h-4 w-4" /> {n.bat_dau}
          </button>
        )}
        {dh.trangThai === "dang_chay" && (
          <button
            type="button"
            onClick={() => onTamDung(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Pause className="h-4 w-4" /> {n.tam_dung}
          </button>
        )}
        {dh.trangThai === "tam_dung" && (
          <button
            type="button"
            onClick={() => onBatDau(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Play className="h-4 w-4" /> {n.tiep_tuc}
          </button>
        )}
        {dh.trangThai !== "xong" && dh.trangThai !== "cho" && (
          <button
            type="button"
            onClick={() => onCongPhut(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> {n.cong_1_phut}
          </button>
        )}
        {dh.trangThai === "cho" && (
          <button
            type="button"
            onClick={() => onCongPhut(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> {n.cong_1_phut}
          </button>
        )}
        {dh.trangThai !== "cho" && (
          <button
            type="button"
            onClick={() => onDatLai(dh.key)}
            className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" /> {n.dat_lai}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component buổi nấu
// ---------------------------------------------------------------------------

export function BuoiNau({
  mon,
  goiY,
  nguoiDungId = null,
}: {
  mon: MonNau;
  goiY: MonGoiY[];
  nguoiDungId?: string | null;
}) {
  const tongBuoc = mon.cac_buoc.length;
  const khauPhanGoc = mon.khau_phan > 0 ? mon.khau_phan : 1;

  const [giaiDoan, setGiaiDoan] = useState<"chuan-bi" | "dang-nau" | "hoan-thanh">(
    "chuan-bi"
  );
  const [soNguoi, setSoNguoi] = useState(khauPhanGoc);
  const [docGiongNoi, setDocGiongNoi] = useState(false);
  const [giuSang, setGiuSang] = useState(false);
  const [buocIdx, setBuocIdx] = useState(0);
  const [bayGio, setBayGio] = useState(() => Date.now());
  const [thongBaoHetGio, setThongBaoHetGio] = useState<{
    key: string;
    vanBan: string;
  } | null>(null);
  const [dongHo, setDongHo] = useState<Record<string, DongHo>>(() => {
    const banDau: Record<string, DongHo> = {};
    mon.cac_buoc.forEach((buoc, bi) => {
      docThoiLuong(buoc.noi_dung).forEach((moc, mi) => {
        const key = `${bi}-${mi}`;
        banDau[key] = {
          key,
          buocIdx: bi,
          mocIdx: mi,
          nhan: moc.nhan,
          laKhoang: moc.laKhoang,
          tongGoc: moc.giay,
          tongGiay: moc.giay,
          trangThai: "cho",
          ketThucLuc: null,
          conLaiTamDung: moc.giay,
        };
      });
    });
    return banDau;
  });

  const slotRef = useRef<SlotTriNho>(taoSlotTrong());
  const audioRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinelToiThieu | null>(null);
  const docGiongNoiRef = useRef(false);
  const daDocBuocRef = useRef(-1);
  const daBaoHetGioRef = useRef<Set<string>>(new Set());

  const nguyenLieuDaChia = useMemo(
    () => chiaKhauPhan(mon.nguyen_lieu, khauPhanGoc, soNguoi),
    [mon.nguyen_lieu, khauPhanGoc, soNguoi]
  );
  const mocCuaBuocNay = useMemo(
    () =>
      Object.values(dongHo)
        .filter((dh) => dh.buocIdx === buocIdx)
        .sort((a, b) => a.mocIdx - b.mocIdx),
    [dongHo, buocIdx]
  );
  const dongHoBuocKhac = useMemo(
    () =>
      Object.values(dongHo).filter(
        (dh) =>
          dh.buocIdx !== buocIdx &&
          (dh.trangThai === "dang_chay" || dh.trangThai === "tam_dung")
      ),
    [dongHo, buocIdx]
  );

  // --- Trí nhớ: nạp slot local lúc mở trang; số người ăn đã biết thì dùng luôn ---
  useEffect(() => {
    try {
      const tho = window.localStorage.getItem(KHOA_LOCAL);
      if (tho) {
        const slotLocal: SlotTriNho = {
          ...taoSlotTrong(),
          ...(JSON.parse(tho) as Partial<SlotTriNho>),
        };
        slotRef.current = slotLocal;
        const sn = slotLocal.soNguoiAn;
        if (typeof sn === "number" && Number.isFinite(sn) && sn >= 1 && sn <= 50) {
          setSoNguoi(Math.floor(sn));
        }
      }
    } catch {
      // localStorage không khả dụng -> dùng khẩu phần gốc.
    }
  }, []);

  const luuSlot = (slotMoi: SlotTriNho) => {
    slotRef.current = slotMoi;
    try {
      window.localStorage.setItem(KHOA_LOCAL, JSON.stringify(slotMoi));
    } catch {
      // Bỏ qua lỗi ghi local.
    }
    if (nguoiDungId) void ghiTriNhoCokba(slotMoi).catch(() => undefined);
  };

  // --- Nhịp tick 250ms: cập nhật giờ hiển thị + chuyển đồng hồ về "xong" ---
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setBayGio(now);
      setDongHo((prev) => {
        let coDoi = false;
        const next = { ...prev };
        for (const dh of Object.values(prev)) {
          if (
            dh.trangThai === "dang_chay" &&
            dh.ketThucLuc !== null &&
            dh.ketThucLuc <= now
          ) {
            next[dh.key] = {
              ...dh,
              trangThai: "xong",
              ketThucLuc: null,
              conLaiTamDung: 0,
            };
            coDoi = true;
          }
        }
        return coDoi ? next : prev;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  // --- Báo hết giờ: chuông + banner (+ đọc nếu bật giọng nói), kể cả khi
  //     người dùng đang ở bước khác với bước của đồng hồ ---
  useEffect(() => {
    docGiongNoiRef.current = docGiongNoi;
    for (const dh of Object.values(dongHo)) {
      if (dh.trangThai === "xong" && !daBaoHetGioRef.current.has(dh.key)) {
        daBaoHetGioRef.current.add(dh.key);
        phatChuong(audioRef);
        if (docGiongNoiRef.current) {
          docVanBan(`${n.da_het_gio}: ${dh.nhan}`);
        }
        setThongBaoHetGio({
          key: dh.key,
          vanBan: n.dong_ho_xong_o_buoc
            .replace("{nhan}", dh.nhan)
            .replace("{buoc}", String(dh.buocIdx + 1)),
        });
      }
      if (dh.trangThai !== "xong") daBaoHetGioRef.current.delete(dh.key);
    }
  }, [dongHo, docGiongNoi]);

  // Banner tự ẩn sau 12 giây.
  useEffect(() => {
    if (!thongBaoHetGio) return;
    const khoa = thongBaoHetGio.key;
    const id = window.setTimeout(() => {
      setThongBaoHetGio((cu) => (cu && cu.key === khoa ? null : cu));
    }, 12000);
    return () => window.clearTimeout(id);
  }, [thongBaoHetGio]);

  // --- Giọng nói: chuyển bước (khi đang nấu + công tắc bật) thì đọc bước ---
  useEffect(() => {
    if (giaiDoan !== "dang-nau" || !docGiongNoi) return;
    if (daDocBuocRef.current === buocIdx) return;
    daDocBuocRef.current = buocIdx;
    const buoc = mon.cac_buoc[buocIdx];
    if (buoc) docVanBan(`${n.buoc} ${buocIdx + 1}: ${buoc.noi_dung}`);
  }, [giaiDoan, buocIdx, docGiongNoi, mon.cac_buoc]);

  // Tắt công tắc giọng nói giữa chừng -> hủy câu đang đọc ngay.
  useEffect(() => {
    if (docGiongNoi) return;
    daDocBuocRef.current = -1;
    huyDoc();
  }, [docGiongNoi]);

  // Rời trang -> hủy giọng đọc đang dang dở.
  useEffect(() => {
    return () => huyDoc();
  }, []);

  // --- Wake Lock: xin khi công tắc bật, xin lại khi quay lại tab, nhả khi tắt ---
  useEffect(() => {
    if (!giuSang) return;
    let daHuy = false;
    const xin = async () => {
      try {
        const nav = navigator as NavigatorCoWakeLock;
        if (!nav.wakeLock) return;
        const sentinel = await nav.wakeLock.request("screen");
        if (daHuy) {
          await sentinel.release().catch(() => undefined);
          return;
        }
        wakeLockRef.current = sentinel;
      } catch {
        // Thiết bị/trình duyệt không hỗ trợ hoặc bị từ chối -> bỏ qua lặng lẽ.
      }
    };
    void xin();
    const onHienLai = () => {
      if (document.visibilityState === "visible") void xin();
    };
    document.addEventListener("visibilitychange", onHienLai);
    return () => {
      daHuy = true;
      document.removeEventListener("visibilitychange", onHienLai);
      const cu = wakeLockRef.current;
      wakeLockRef.current = null;
      if (cu) void cu.release().catch(() => undefined);
    };
  }, [giuSang]);

  // --- Điều khiển đồng hồ ---
  const batDauDongHo = (key: string) => {
    damBaoAudio(audioRef); // tương tác người dùng: mở khóa AudioContext
    setDongHo((prev) => {
      const dh = prev[key];
      if (!dh || dh.trangThai === "dang_chay" || dh.trangThai === "xong") return prev;
      const conLai =
        dh.trangThai === "tam_dung" ? dh.conLaiTamDung : dh.tongGiay;
      return {
        ...prev,
        [key]: {
          ...dh,
          trangThai: "dang_chay",
          ketThucLuc: Date.now() + conLai * 1000,
        },
      };
    });
  };

  const tamDungDongHo = (key: string) => {
    setDongHo((prev) => {
      const dh = prev[key];
      if (!dh || dh.trangThai !== "dang_chay" || dh.ketThucLuc === null) return prev;
      return {
        ...prev,
        [key]: {
          ...dh,
          trangThai: "tam_dung",
          ketThucLuc: null,
          conLaiTamDung: Math.max(
            0,
            Math.ceil((dh.ketThucLuc - Date.now()) / 1000)
          ),
        },
      };
    });
  };

  const congMotPhut = (key: string) => {
    setDongHo((prev) => {
      const dh = prev[key];
      if (!dh || dh.trangThai === "xong") return prev;
      const next: DongHo = { ...dh, tongGiay: dh.tongGiay + 60 };
      if (dh.trangThai === "dang_chay" && dh.ketThucLuc !== null) {
        next.ketThucLuc = dh.ketThucLuc + 60_000;
      } else {
        next.conLaiTamDung = dh.conLaiTamDung + 60;
      }
      return { ...prev, [key]: next };
    });
  };

  const datLaiDongHo = (key: string) => {
    setDongHo((prev) => {
      const dh = prev[key];
      if (!dh) return prev;
      return {
        ...prev,
        [key]: {
          ...dh,
          trangThai: "cho",
          ketThucLuc: null,
          tongGiay: dh.tongGoc,
          conLaiTamDung: dh.tongGoc,
        },
      };
    });
  };

  // --- Điều hướng buổi nấu ---
  const doiSoNguoi = (moi: number) => {
    const chuan = Math.min(50, Math.max(1, moi));
    setSoNguoi(chuan);
    luuSlot({ ...slotRef.current, soNguoiAn: chuan });
  };

  const batDauNau = () => {
    damBaoAudio(audioRef);
    setBuocIdx(0);
    setGiaiDoan("dang-nau");
    luuSlot({
      ...slotRef.current,
      monDangNau: mon.id,
      buocHienTai: 0,
      soNguoiAn: soNguoi,
    });
  };

  const sangBuoc = (idx: number) => {
    const chuan = Math.min(tongBuoc - 1, Math.max(0, idx));
    setBuocIdx(chuan);
    luuSlot({ ...slotRef.current, monDangNau: mon.id, buocHienTai: chuan });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hoanThanhNau = () => {
    huyDoc();
    // Không có bảng lịch sử nấu cho công thức trong dự án -> chỉ dọn slot.
    luuSlot({ ...slotRef.current, monDangNau: null, buocHienTai: null });
    setGiaiDoan("hoan-thanh");
    window.scrollTo({ top: 0 });
  };

  const buocHienTai = mon.cac_buoc[buocIdx];
  const tongPhut = mon.thoi_gian_chuan_bi + mon.thoi_gian_nau;
  const phanTramTienDo =
    tongBuoc > 0 ? Math.round(((buocIdx + 1) / tongBuoc) * 100) : 0;

  const khoiCongTac = (gon: boolean) => (
    <div className={cn("grid gap-3", !gon && "sm:grid-cols-2")}>
      <CongTac
        bat={docGiongNoi}
        onDoi={setDocGiongNoi}
        tieuDe={n.doc_buoc_bang_giong_noi}
        moTa={n.doc_buoc_mo_ta}
        icon={<Volume2 className="h-5 w-5" />}
        testId="cong-tac-doc-buoc"
      />
      <CongTac
        bat={giuSang}
        onDoi={setGiuSang}
        tieuDe={n.giu_man_hinh_sang}
        moTa={n.giu_man_hinh_mo_ta}
        icon={<Lightbulb className="h-5 w-5" />}
        testId="cong-tac-giu-sang"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Banner báo đồng hồ hết giờ — hiện dù đang ở bước nào */}
      {thongBaoHetGio && (
        <div
          data-testid="thong-bao-het-gio"
          role="alert"
          className="sticky top-3 z-30 flex items-center gap-3 rounded-2xl border-2 border-orange-600 bg-orange-100 px-4 py-3 shadow-lg dark:bg-orange-950"
        >
          <BellRing className="h-6 w-6 shrink-0 animate-bounce text-orange-700 dark:text-orange-300" />
          <p className="flex-1 text-sm font-semibold text-orange-900 dark:text-orange-100">
            {thongBaoHetGio.vanBan}
          </p>
          <button
            type="button"
            aria-label={n.dong}
            onClick={() => setThongBaoHetGio(null)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-orange-200 dark:hover:bg-orange-900"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* ============ MÀN A — CHUẨN BỊ ============ */}
      {giaiDoan === "chuan-bi" && (
        <section data-testid="man-chuan-bi" className="space-y-5">
          {mon.anh_dai_dien && (
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl bg-muted shadow-sm">
              <Image
                src={mon.anh_dai_dien}
                alt={mon.tieu_de}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CookingPot className="h-4 w-4" /> {n.che_do_nau}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {mon.tieu_de}
            </h1>
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                <Clock className="h-3.5 w-3.5" /> {n.chuan_bi}{" "}
                {mon.thoi_gian_chuan_bi} {n.phut} · {n.nau} {mon.thoi_gian_nau}{" "}
                {n.phut}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                <Users className="h-3.5 w-3.5" /> {n.cong_thuc_goc} {khauPhanGoc}{" "}
                {n.nguoi}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                {nhanDoKho(mon.do_kho)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                {tongBuoc} {n.buoc_thuong}
              </span>
            </div>
          </div>

          {/* Nguyên liệu đã chia theo số người */}
          <div className="space-y-4 rounded-3xl border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">
                {n.nguyen_lieu} · {soNguoi} {n.nguoi}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={n.giam_so_nguoi}
                  disabled={soNguoi <= 1}
                  onClick={() => doiSoNguoi(soNguoi - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span
                  data-testid="so-nguoi-hien-tai"
                  className="w-10 text-center text-2xl font-bold tabular-nums"
                >
                  {soNguoi}
                </span>
                <button
                  type="button"
                  aria-label={n.tang_so_nguoi}
                  disabled={soNguoi >= 50}
                  onClick={() => doiSoNguoi(soNguoi + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
            {nguyenLieuDaChia.length > 0 ? (
              <ul className="divide-y divide-border/60">
                {nguyenLieuDaChia.map((nl, i) => (
                  <li
                    key={i}
                    data-testid="dong-nguyen-lieu"
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="font-medium">{nl.ten}</span>
                    <span className="shrink-0 font-mono font-semibold">
                      {nl.hien_thi}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-3 text-sm text-muted-foreground">
                {n.chua_co_nguyen_lieu}
              </p>
            )}
          </div>

          {khoiCongTac(false)}

          {tongBuoc === 0 ? (
            <p className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">
              {n.chua_co_buoc}
            </p>
          ) : (
            <button
              type="button"
              data-testid="nut-bat-dau-nau"
              onClick={batDauNau}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-md transition hover:opacity-95 active:scale-[0.99]"
            >
              <Play className="h-6 w-6" /> {n.bat_dau_nau}
            </button>
          )}
        </section>
      )}

      {/* ============ MÀN B — TỪNG BƯỚC ============ */}
      {giaiDoan === "dang-nau" && buocHienTai && (
        <section data-testid="man-buoc" className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <h1
                data-testid="tieu-de-buoc"
                className="text-2xl font-extrabold tracking-tight md:text-3xl"
              >
                {n.buoc} {buocIdx + 1}/{tongBuoc}
              </h1>
              <p className="shrink-0 text-sm font-medium text-muted-foreground">
                {mon.tieu_de}
              </p>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={phanTramTienDo}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${phanTramTienDo}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border bg-card p-5 md:p-6">
            <p
              data-testid="noi-dung-buoc"
              className="whitespace-pre-line text-lg leading-relaxed md:text-xl md:leading-relaxed"
            >
              {buocHienTai.noi_dung}
            </p>
            {buocHienTai.anh && (
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={buocHienTai.anh}
                  alt={`${n.buoc} ${buocIdx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
          </div>

          {mocCuaBuocNay.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Timer className="h-5 w-5 text-primary" /> {n.hen_gio_cho_buoc_nay}
              </h2>
              <div className="grid gap-3">
                {mocCuaBuocNay.map((dh) => (
                  <TheDongHo
                    key={dh.key}
                    dh={dh}
                    bayGio={bayGio}
                    onBatDau={batDauDongHo}
                    onTamDung={tamDungDongHo}
                    onCongPhut={congMotPhut}
                    onDatLai={datLaiDongHo}
                  />
                ))}
              </div>
            </div>
          )}

          {dongHoBuocKhac.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed p-3 text-xs text-muted-foreground">
              <span className="font-semibold">{n.dong_ho_buoc_khac}</span>
              {dongHoBuocKhac.map((dh) => (
                <span
                  key={dh.key}
                  className="rounded-full bg-muted px-2.5 py-1 font-medium"
                >
                  {dh.nhan} · {n.buoc_thuong} {dh.buocIdx + 1} ·{" "}
                  {dinhDangDongHo(giayConLai(dh, bayGio))}
                  {dh.trangThai === "tam_dung" ? ` (${n.tam_dung})` : ""}
                </span>
              ))}
            </div>
          )}

          <div className="grid gap-3">{khoiCongTac(true)}</div>

          <div className="flex gap-3 pb-2">
            <button
              type="button"
              data-testid="nut-buoc-truoc"
              disabled={buocIdx === 0}
              onClick={() => sangBuoc(buocIdx - 1)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl border px-4 py-4 text-base font-semibold transition hover:bg-muted disabled:opacity-40"
            >
              <ArrowLeft className="h-5 w-5" /> {n.quay_lai}
            </button>
            {buocIdx < tongBuoc - 1 ? (
              <button
                type="button"
                data-testid="nut-buoc-tiep"
                onClick={() => sangBuoc(buocIdx + 1)}
                className="inline-flex flex-[2] items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow transition hover:opacity-95"
              >
                {n.xong_buoc_nay} <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                data-testid="nut-buoc-tiep"
                onClick={hoanThanhNau}
                className="inline-flex flex-[2] items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow transition hover:opacity-95"
              >
                {n.hoan_thanh} <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* ============ MÀN C — HOÀN THÀNH ============ */}
      {giaiDoan === "hoan-thanh" && (
        <section data-testid="man-hoan-thanh" className="space-y-6">
          <div className="space-y-3 rounded-3xl border bg-card px-5 py-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {n.hoan_thanh_mon.replace("{ten}", mon.tieu_de)}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {n.hoan_thanh_mo_ta
                .replace("{tong}", String(tongPhut))
                .replace("{chuan_bi}", String(mon.thoi_gian_chuan_bi))
                .replace("{nau}", String(mon.thoi_gian_nau))}
            </p>
            <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row sm:flex-wrap">
              <Link
                href={`/cong-thuc/${mon.slug}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <BookOpen className="h-4.5 w-4.5" /> {n.xem_lai_cong_thuc}
              </Link>
              <Link
                href="/tro-ly"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                <CookingPot className="h-4.5 w-4.5" /> {n.hoi_cokba_tiep}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border px-5 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                <Home className="h-4.5 w-4.5" /> {n.ve_trang_chu}
              </Link>
            </div>
          </div>

          {goiY.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">{n.goi_y_cung_danh_muc}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {goiY.map((g) => (
                  <div
                    key={g.slug}
                    data-testid="the-goi-y"
                    className="overflow-hidden rounded-2xl border bg-card shadow-xs"
                  >
                    {g.anh_dai_dien ? (
                      <div className="relative h-28 w-full bg-muted">
                        <Image
                          src={g.anh_dai_dien}
                          alt={g.tieu_de}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 240px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center bg-primary/10">
                        <CookingPot className="h-9 w-9 text-primary" />
                      </div>
                    )}
                    <div className="space-y-2 p-3">
                      <p className="text-sm font-semibold leading-snug">
                        {g.tieu_de}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {g.thoi_gian_chuan_bi + g.thoi_gian_nau} {n.phut} ·{" "}
                        {nhanDoKho(g.do_kho)}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <Link
                          href={`/nau/${g.slug}`}
                          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                        >
                          <CookingPot className="h-3.5 w-3.5" /> {n.nau_mon_nay}
                        </Link>
                        <Link
                          href={`/cong-thuc/${g.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
                        >
                          {n.xem_cong_thuc}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

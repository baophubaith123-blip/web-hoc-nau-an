// Bộ chạy ngân hàng câu hỏi Cokba trên DỮ LIỆU THẬT (Đợt 5A) — node-side,
// chạy bằng: npx playwright test -c playwright.node.config.ts
// Nạp DuLieuTroLy từ Supabase thật 1 lần (tests/du-lieu/nap-du-lieu-that.ts),
// chạy toàn bộ corpus (tests/du-lieu/corpus-cokba.ts) qua engine traLoi,
// đối chiếu kỳ vọng kiểm được bằng máy, rồi xuất:
//   - tóm tắt tỉ lệ theo từng nhóm ra console,
//   - file JSON chi tiết (đường dẫn lấy từ biến môi trường CORPUS_KET_QUA,
//     mặc định corpus-ket-qua.json ở thư mục gốc repo) để lưu theo vòng.
// Test này KHÔNG fail vì câu trả lời sai — tỉ lệ đạt là số liệu rèn luyện,
// được đọc từ JSON/console; test chỉ fail khi nạp dữ liệu hoặc chạy lỗi.

import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";

import { dungChiMuc } from "../src/lib/tro-ly/chi-muc";
import { taoSlotTrong, type CauTraLoi, type DuLieuTroLy, type SlotTriNho } from "../src/lib/tro-ly/kieu-du-lieu";
import { traLoi } from "../src/lib/tro-ly/tra-loi";
import { CORPUS, type KyVongCokba, type NhomCorpus } from "./du-lieu/corpus-cokba";
import { napDuLieuThat } from "./du-lieu/nap-du-lieu-that";

let duLieu: DuLieuTroLy;

test.beforeAll(async () => {
  duLieu = await napDuLieuThat();
});

test("nap du lieu that: dung so luong 4 mien", () => {
  const chiMuc = dungChiMuc(duLieu);
  // Đo trên DB live 2026-11-14: cong_thuc có 17 dòng nhưng 1 dòng đang
  // "cho_duyet" (Mì Ý sốt bò bằm) nên bộ lọc xuat_ban của tai-du-lieu.ts
  // cho 16; bai_viet 20 dòng gồm 4 bài TEST_ bị loại ở chỉ mục còn 16.
  console.log(
    `[corpus] du lieu that: congThuc=${duLieu.congThuc.length} khoaHoc=${duLieu.khoaHoc.length} ` +
      `baiViet=${duLieu.baiViet.length} (chi muc ${chiMuc.baiVietTheoId.size}) dauBep=${duLieu.dauBep.length}`
  );
  expect(duLieu.congThuc.length).toBe(16);
  expect(duLieu.khoaHoc.length).toBe(12);
  expect(duLieu.baiViet.length).toBe(20);
  expect(chiMuc.baiVietTheoId.size).toBe(16);
  expect(duLieu.dauBep.length).toBe(6);
});

function kiemKyVong(kyVong: KyVongCokba, kq: CauTraLoi): string[] {
  const loi: string[] = [];
  const van = kq.doanVan.join("\n");
  if (kyVong.loaiThe && !kq.the.some((t) => t.loai === kyVong.loaiThe)) {
    loi.push(`thieu the loai ${kyVong.loaiThe}`);
  }
  if (kyVong.chuaTieuDe && !kq.the.some((t) => t.tieuDe.includes(kyVong.chuaTieuDe!))) {
    loi.push(`khong co the chua "${kyVong.chuaTieuDe}"`);
  }
  if (kyVong.soTheToiThieu !== undefined && kq.the.length < kyVong.soTheToiThieu) {
    loi.push(`so the ${kq.the.length} < toi thieu ${kyVong.soTheToiThieu}`);
  }
  if (kyVong.soTheToiDa !== undefined && kq.the.length > kyVong.soTheToiDa) {
    loi.push(`so the ${kq.the.length} > toi da ${kyVong.soTheToiDa}`);
  }
  if (kyVong.coCo) {
    const coThucTe = {
      canHoiGiaVi: !!kq.canHoiGiaVi,
      choSoNguoiAn: !!kq.choSoNguoiAn,
      khongTraLoiDuoc: !!kq.khongTraLoiDuoc,
      ngoaiPhamVi: !!kq.ngoaiPhamVi,
    }[kyVong.coCo];
    if (!coThucTe) loi.push(`thieu co ${kyVong.coCo}`);
  }
  if (kyVong.chuaChuoi && !van.includes(kyVong.chuaChuoi)) {
    loi.push(`van khong chua "${kyVong.chuaChuoi}"`);
  }
  if (kyVong.khongChuaChuoi && van.includes(kyVong.khongChuaChuoi)) {
    loi.push(`van chua chuoi cam "${kyVong.khongChuaChuoi}"`);
  }
  return loi;
}

type PhanTang = "khong_nhan_dien_thuc_the" | "sai_y_dinh" | "thieu_du_lieu" | "sai_so_lieu" | "khac";

/** Phân tầng lý do fail TỰ ĐỘNG (suy từ cờ + nội dung trả lời, không phải kết luận thủ công). */
function phanTang(kyVong: KyVongCokba, kq: CauTraLoi): PhanTang {
  const van = kq.doanVan.join("\n");
  if (kq.ngoaiPhamVi) return "khong_nhan_dien_thuc_the";
  if (kyVong.chuaChuoi && /\d/.test(kyVong.chuaChuoi) && /\d/.test(van)) return "sai_so_lieu";
  if (kq.khongTraLoiDuoc) return "thieu_du_lieu";
  if (kyVong.coCo) return "sai_y_dinh";
  if (kyVong.chuaTieuDe || kyVong.loaiThe) return "sai_y_dinh";
  return "khac";
}

interface KetQuaLuot {
  nhom: NhomCorpus;
  muc: number;
  cauHoi: string;
  dat: boolean;
  loi: string[];
  phanTang?: PhanTang;
  yDinhThucTe?: string;
  theThucTe: string[];
  vanThucTe: string;
}

test("chay toan bo corpus tren du lieu that", () => {
  test.setTimeout(300_000);
  const ketQua: KetQuaLuot[] = [];

  CORPUS.forEach((muc, idx) => {
    let slot: SlotTriNho = taoSlotTrong();
    if (muc.slotBanDau?.giaViDaXacNhan !== undefined) slot.giaViDaXacNhan = muc.slotBanDau.giaViDaXacNhan;
    if (muc.slotBanDau?.soNguoiAn !== undefined) slot.soNguoiAn = muc.slotBanDau.soNguoiAn;
    const cacLuot = muc.luot ?? [{ cauHoi: muc.cauHoi!, kyVong: muc.kyVong! }];
    for (const luot of cacLuot) {
      const kq = traLoi(luot.cauHoi, duLieu, slot);
      slot = kq.slotDaCapNhat;
      const loi = kiemKyVong(luot.kyVong, kq);
      ketQua.push({
        nhom: muc.nhom,
        muc: idx,
        cauHoi: luot.cauHoi,
        dat: loi.length === 0,
        loi,
        phanTang: loi.length === 0 ? undefined : phanTang(luot.kyVong, kq),
        yDinhThucTe: kq.yDinh,
        theThucTe: kq.the.map((t) => `${t.loai}:${t.tieuDe}`),
        vanThucTe: kq.doanVan.join(" / ").slice(0, 220),
      });
    }
  });

  const nhomList: NhomCorpus[] = ["viet_tay", "dien_dat_lai", "khong_dau", "ghep_dieu_kien", "chuoi_tri_nho", "ngoai_pham_vi"];
  const theoNhom: Record<string, { tong: number; dat: number; tiLe: number }> = {};
  for (const nhom of nhomList) {
    const ds = ketQua.filter((k) => k.nhom === nhom);
    const dat = ds.filter((k) => k.dat).length;
    theoNhom[nhom] = { tong: ds.length, dat, tiLe: ds.length ? Math.round((dat / ds.length) * 1000) / 10 : 0 };
  }
  const tongDat = ketQua.filter((k) => k.dat).length;
  const tiLeTong = Math.round((tongDat / ketQua.length) * 1000) / 10;
  const nhomChuan = (["dien_dat_lai", "khong_dau", "ghep_dieu_kien", "chuoi_tri_nho"] as NhomCorpus[]).flatMap((n) =>
    ketQua.filter((k) => k.nhom === n)
  );
  const tiLeNhomChuan = Math.round((nhomChuan.filter((k) => k.dat).length / nhomChuan.length) * 1000) / 10;

  console.log(`[corpus] TONG: ${tongDat}/${ketQua.length} luot dat = ${tiLeTong}%`);
  for (const nhom of nhomList) {
    const t = theoNhom[nhom];
    console.log(`[corpus] ${nhom}: ${t.dat}/${t.tong} = ${t.tiLe}%`);
  }
  console.log(`[corpus] nhom chuan gop (dien_dat_lai+khong_dau+ghep+chuoi): ${tiLeNhomChuan}%`);
  for (const k of ketQua.filter((x) => !x.dat)) {
    console.log(`[corpus][FAIL][${k.nhom}][${k.phanTang}] ${k.cauHoi} -> yDinh=${k.yDinhThucTe} loi: ${k.loi.join("; ")}`);
  }

  const baoCao = {
    vong: process.env.CORPUS_VONG ?? "?",
    thoiGian: new Date().toISOString(),
    duLieu: {
      congThuc: duLieu.congThuc.length,
      khoaHoc: duLieu.khoaHoc.length,
      baiViet: duLieu.baiViet.length,
      dauBep: duLieu.dauBep.length,
    },
    tongMuc: CORPUS.length,
    tongLuot: ketQua.length,
    datLuot: tongDat,
    tiLeTong,
    theoNhom,
    tiLeNhomChuanGop: tiLeNhomChuan,
    chuanDat: theoNhom.viet_tay.tiLe === 100 && tiLeNhomChuan >= 95,
    thatBai: ketQua.filter((k) => !k.dat),
  };
  writeFileSync(process.env.CORPUS_KET_QUA ?? "corpus-ket-qua.json", JSON.stringify(baoCao, null, 1), "utf8");
  expect(ketQua.length).toBeGreaterThanOrEqual(150);
});

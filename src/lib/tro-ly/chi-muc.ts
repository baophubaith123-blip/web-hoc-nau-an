// Dựng chỉ mục tra cứu từ DuLieuTroLy (Đợt 2 — mục 3.1).
// Dữ liệu nhỏ (17 món · 12 khóa · 20 bài · 6 bếp) nên dựng mới mỗi lượt hỏi:
// thêm nội dung mới trên web là Cokba biết ngay, không cần huấn luyện lại.
//
// LƯU Ý dữ liệu: bài viết có tiêu đề bắt đầu bằng "TEST_" là dữ liệu test
// sót lại (đã ghi nhận ở Đợt 1, Bảo chưa cho dọn) -> LOẠI khỏi chỉ mục để
// Cokba không bao giờ giới thiệu bài test cho người dùng.

import { khoaChuanHoa, khoaNguyenLieu, khopKhoa } from "./chuan-hoa";
import type {
  BaiVietTroLy,
  CongThucTroLy,
  DauBepTroLy,
  DuLieuTroLy,
  KhoaHocTroLy,
} from "./kieu-du-lieu";

export interface MucThucThe {
  id: string;
  ten: string; // tên hiển thị gốc
  khoa: string; // khóa thường hóa để khớp
}

export interface ChiMucTroLy {
  monTheoId: Map<string, CongThucTroLy>;
  khoaHocTheoId: Map<string, KhoaHocTroLy>;
  baiVietTheoId: Map<string, BaiVietTroLy>;
  dauBepTheoId: Map<string, DauBepTroLy>;
  /** khóa nguyên liệu -> id các công thức có nguyên liệu đó. */
  monTheoNguyenLieu: Map<string, string[]>;
  /** Danh mục nguyên liệu distinct (đã qua bí danh/chuẩn hóa). */
  danhMucNguyenLieu: MucThucThe[];
  tenMon: MucThucThe[];
  tenKhoaHoc: MucThucThe[];
  tenDauBep: MucThucThe[];
  tenBaiViet: MucThucThe[];
  /** Tên danh mục món distinct (VD "Món chay") để lọc theo danh mục. */
  danhMucMon: MucThucThe[];
}

export function laBaiVietTest(bai: BaiVietTroLy): boolean {
  return bai.tieu_de.trim().toUpperCase().startsWith("TEST_");
}

export function dungChiMuc(duLieu: DuLieuTroLy): ChiMucTroLy {
  const monTheoId = new Map<string, CongThucTroLy>();
  const khoaHocTheoId = new Map<string, KhoaHocTroLy>();
  const baiVietTheoId = new Map<string, BaiVietTroLy>();
  const dauBepTheoId = new Map<string, DauBepTroLy>();
  const monTheoNguyenLieu = new Map<string, string[]>();
  const nguyenLieuDistinct = new Map<string, string>(); // khoa -> ten hien thi chuan
  const danhMucDistinct = new Map<string, string>();

  for (const mon of duLieu.congThuc) {
    monTheoId.set(mon.id, mon);
    const khoaDaDuyet = new Set<string>();
    for (const nl of mon.nguyen_lieu) {
      const khoa = khoaNguyenLieu(nl.ten);
      if (!nguyenLieuDistinct.has(khoa)) {
        // Tên hiển thị chuẩn của nguyên liệu = tên đã qua bí danh nếu có.
        nguyenLieuDistinct.set(khoa, nl.ten.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim());
      }
      if (khoaDaDuyet.has(khoa)) continue;
      khoaDaDuyet.add(khoa);
      const ds = monTheoNguyenLieu.get(khoa) ?? [];
      ds.push(mon.id);
      monTheoNguyenLieu.set(khoa, ds);
    }
    for (const tenDm of mon.danh_muc) {
      const khoa = khoaChuanHoa(tenDm);
      if (khoa && !danhMucDistinct.has(khoa)) danhMucDistinct.set(khoa, tenDm);
    }
  }
  for (const kh of duLieu.khoaHoc) khoaHocTheoId.set(kh.id, kh);
  for (const bv of duLieu.baiViet) {
    if (laBaiVietTest(bv)) continue; // loại bài test khỏi chỉ mục
    baiVietTheoId.set(bv.id, bv);
  }
  for (const db of duLieu.dauBep) dauBepTheoId.set(db.id, db);

  const sangMuc = (id: string, ten: string): MucThucThe => ({
    id,
    ten,
    khoa: khoaChuanHoa(ten),
  });

  return {
    monTheoId,
    khoaHocTheoId,
    baiVietTheoId,
    dauBepTheoId,
    monTheoNguyenLieu,
    danhMucNguyenLieu: [...nguyenLieuDistinct.entries()].map(([khoa, ten]) => ({
      id: khoa,
      ten,
      khoa,
    })),
    tenMon: duLieu.congThuc.map((m) => sangMuc(m.id, m.tieu_de)),
    tenKhoaHoc: duLieu.khoaHoc.map((k) => sangMuc(k.id, k.tieu_de)),
    tenDauBep: duLieu.dauBep.map((d) => sangMuc(d.id, d.ho_ten)),
    tenBaiViet: [...baiVietTheoId.values()].map((b) => sangMuc(b.id, b.tieu_de)),
    danhMucMon: [...danhMucDistinct.entries()].map(([khoa, ten]) => ({
      id: khoa,
      ten,
      khoa,
    })),
  };
}

/** Id các món có nguyên liệu khớp với khóa nguyên liệu cho trước. */
export function monCoNguyenLieu(chiMuc: ChiMucTroLy, khoaNguyenLieuCanTim: string): string[] {
  const ketQua = new Set<string>();
  for (const [khoa, ids] of chiMuc.monTheoNguyenLieu) {
    if (khopKhoa(khoa, khoaNguyenLieuCanTim)) {
      for (const id of ids) ketQua.add(id);
    }
  }
  return [...ketQua];
}

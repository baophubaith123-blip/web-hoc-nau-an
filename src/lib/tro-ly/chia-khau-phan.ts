// Chia khẩu phần: nhân số lượng nguyên liệu theo tỉ lệ
// soNguoiMuon / khauPhanGoc và làm tròn "kiểu bếp" (Đợt 2 — mục 3.3):
//   - g / ml            -> bội 5 (VD 499,5 g -> 500 g)
//   - quả/củ/trái/muỗng/hộp và các đơn vị còn lại -> bội 0,5
//   - con               -> làm tròn LÊN nguyên con (tối thiểu 1)
//   - kết quả < 0,25 (trừ đơn vị "con") -> ghi "một nhúm/ít" thay vì số lẻ.

import { khoaChuanHoa } from "./chuan-hoa";
import type { NguyenLieuMon } from "./kieu-du-lieu";

export interface NguyenLieuDaChia {
  ten: string;
  don_vi: string;
  so_luong_goc: number;
  /** null khi hiển thị bằng chữ ("một nhúm/ít"). */
  so_luong_moi: number | null;
  /** Chuỗi sẵn sàng để hiển thị, VD "500 g", "1,5 quả", "một nhúm/ít". */
  hien_thi: string;
}

function dinhDangSo(so: number): string {
  // Số nguyên -> không thập phân; lẻ -> phẩy thập phân kiểu Việt, tối đa 1 chữ số.
  if (Number.isInteger(so)) return String(so);
  return so.toFixed(1).replace(".", ",");
}

export function chiaMotNguyenLieu(
  nguyenLieu: NguyenLieuMon,
  tiLe: number
): NguyenLieuDaChia {
  const tho = nguyenLieu.so_luong * tiLe;
  const donViKhoa = khoaChuanHoa(nguyenLieu.don_vi);
  const coSo: NguyenLieuDaChia = {
    ten: nguyenLieu.ten,
    don_vi: nguyenLieu.don_vi,
    so_luong_goc: nguyenLieu.so_luong,
    so_luong_moi: null,
    hien_thi: "",
  };

  // Đơn vị "con": luôn nguyên con, làm tròn lên, tối thiểu 1.
  if (donViKhoa === "con") {
    const moi = Math.max(1, Math.ceil(tho));
    return { ...coSo, so_luong_moi: moi, hien_thi: `${moi} ${nguyenLieu.don_vi}` };
  }

  // Quá ít để đong -> diễn đạt bằng chữ.
  if (tho < 0.25) {
    return { ...coSo, so_luong_moi: null, hien_thi: "một nhúm/ít" };
  }

  let moi: number;
  if (donViKhoa === "g" || donViKhoa === "gram" || donViKhoa === "ml") {
    moi = Math.round(tho / 5) * 5;
    if (moi === 0) moi = 5; // đã qua mốc 0,25 mà làm tròn về 0 thì lấy mức tối thiểu 5
  } else {
    moi = Math.round(tho / 0.5) * 0.5;
    if (moi === 0) moi = 0.5;
  }
  return {
    ...coSo,
    so_luong_moi: moi,
    hien_thi: `${dinhDangSo(moi)} ${nguyenLieu.don_vi}`,
  };
}

/** Chia toàn bộ nguyên liệu của một món từ khauPhanGoc sang soNguoiMuon. */
export function chiaKhauPhan(
  nguyenLieu: NguyenLieuMon[],
  khauPhanGoc: number,
  soNguoiMuon: number
): NguyenLieuDaChia[] {
  const goc = khauPhanGoc > 0 ? khauPhanGoc : 1;
  const tiLe = soNguoiMuon / goc;
  return nguyenLieu.map((nl) => chiaMotNguyenLieu(nl, tiLe));
}

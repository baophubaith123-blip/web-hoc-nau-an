// Chấm khớp nguyên liệu cho intent "có gì nấu nấy" (Đợt 2 — mục 3.1).
//
// Nguyên tắc của Bảo: gia vị cơ bản KHÔNG được tự giả định là có sẵn.
// Hàm này tách nguyên liệu của công thức thành 2 nhóm:
//   - nguyên liệu CHÍNH (thịt, rau, trứng...),
//   - GIA VỊ CƠ BẢN theo danh sách GIA_VI_CO_BAN dưới đây.
// Người dùng xác nhận một lần trong phiên là nhà có những gia vị nào
// (slot.giaViDaXacNhan). % khớp tính trên TOÀN BỘ nguyên liệu của món:
// một nguyên liệu được tính là "có" khi người dùng kê nó trong danh sách
// đang có, hoặc nó là gia vị cơ bản đã được xác nhận có.
// Chưa xác nhận gia vị (null) -> kết quả gắn cờ canHoiGiaVi để UI hỏi trước.

import { khoaNguyenLieu, khoaChuanHoa, khopKhoa } from "./chuan-hoa";
import type { CongThucTroLy } from "./kieu-du-lieu";

/**
 * Danh sách gia vị cơ bản (~20 mục) — cũng là danh sách UI dùng để hỏi
 * "Nhà bạn có đầy đủ các gia vị này không?" ở intent "có gì nấu nấy".
 * Tên hiển thị khớp cách gọi trong dữ liệu công thức thật.
 */
export const GIA_VI_CO_BAN: string[] = [
  "Muối",
  "Đường",
  "Nước mắm",
  "Dầu ăn",
  "Tiêu",
  "Hành",
  "Tỏi",
  "Hành lá",
  "Hành tây",
  "Hành tím",
  "Gừng",
  "Ớt",
  "Nước tương",
  "Hạt nêm",
  "Bột ngọt",
  "Dầu hào",
  "Tương ớt",
  "Giấm",
  "Chanh",
  "Sả",
];

const KHOA_GIA_VI: string[] = GIA_VI_CO_BAN.map((g) => khoaChuanHoa(g));

/**
 * Một nguyên liệu có phải gia vị cơ bản không: khóa của nó bằng một mục
 * trong danh sách, hoặc bắt đầu bằng mục đó theo biên từ (VD "tieu xay",
 * "duong cat trang", "hanh tim bam" đều là gia vị).
 */
export function laGiaViCoBan(tenNguyenLieu: string): boolean {
  const khoa = khoaNguyenLieu(tenNguyenLieu);
  return KHOA_GIA_VI.some((gv) => khopKhoa(khoa, gv));
}

export interface KetQuaKhopMon {
  congThuc: CongThucTroLy;
  /** 0–100, làm tròn nguyên. */
  phanTramKhop: number;
  /** Tên hiển thị các nguyên liệu chính còn thiếu. */
  thieuChinh: string[];
  /** Tên hiển thị các gia vị cơ bản còn thiếu (hoặc chưa xác nhận). */
  thieuGiaVi: string[];
  /** Tên hiển thị các nguyên liệu đã có (khớp được). */
  daCo: string[];
  /** true khi phiên chưa xác nhận gia vị lần nào (giaViDaXacNhan === null). */
  canHoiGiaVi: boolean;
}

export interface DauVaoKhop {
  /** Nguyên liệu người dùng kê là đang có (tên hiển thị hoặc gõ tự do). */
  nguyenLieuNguoiDung: string[];
  /** null = chưa xác nhận; mảng (kể cả rỗng) = đã xác nhận. */
  giaViDaXacNhan: string[] | null;
}

function tapKhoa(danhSachTen: string[]): string[] {
  return danhSachTen.map((t) => khoaNguyenLieu(t));
}

function coTrongTap(khoa: string, tap: string[]): boolean {
  return tap.some((k) => khopKhoa(khoa, k));
}

/** Chấm khớp MỘT công thức với tủ bếp của người dùng. */
export function khopMotMon(congThuc: CongThucTroLy, dauVao: DauVaoKhop): KetQuaKhopMon {
  const tapNguoiDung = tapKhoa(dauVao.nguyenLieuNguoiDung);
  const chuaXacNhan = dauVao.giaViDaXacNhan === null;
  const tapGiaViXacNhan = chuaXacNhan ? [] : tapKhoa(dauVao.giaViDaXacNhan ?? []);

  const daCo: string[] = [];
  const thieuChinh: string[] = [];
  const thieuGiaVi: string[] = [];

  for (const nl of congThuc.nguyen_lieu) {
    const khoa = khoaNguyenLieu(nl.ten);
    const laGiaVi = laGiaViCoBan(nl.ten);
    const co =
      coTrongTap(khoa, tapNguoiDung) || (laGiaVi && coTrongTap(khoa, tapGiaViXacNhan));
    if (co) daCo.push(nl.ten);
    else if (laGiaVi) thieuGiaVi.push(nl.ten);
    else thieuChinh.push(nl.ten);
  }

  const tong = congThuc.nguyen_lieu.length;
  const phanTramKhop = tong === 0 ? 0 : Math.round((daCo.length / tong) * 100);

  return {
    congThuc,
    phanTramKhop,
    thieuChinh,
    thieuGiaVi,
    daCo,
    canHoiGiaVi: chuaXacNhan,
  };
}

/**
 * Chấm khớp toàn bộ danh sách công thức, xếp giảm dần theo % khớp;
 * hòa % thì món thiếu ít nguyên liệu chính hơn đứng trước.
 * Mặc định chỉ giữ món khớp ít nhất 1 nguyên liệu (phanTramKhop > 0).
 */
export function chamDiemTatCa(
  danhSachMon: CongThucTroLy[],
  dauVao: DauVaoKhop,
  tuyChon?: { chiMonCoKhop?: boolean }
): KetQuaKhopMon[] {
  const chiMonCoKhop = tuyChon?.chiMonCoKhop ?? true;
  return danhSachMon
    .map((ct) => khopMotMon(ct, dauVao))
    .filter((kq) => !chiMonCoKhop || kq.phanTramKhop > 0)
    .sort(
      (a, b) =>
        b.phanTramKhop - a.phanTramKhop ||
        a.thieuChinh.length - b.thieuChinh.length ||
        a.thieuGiaVi.length - b.thieuGiaVi.length
    );
}

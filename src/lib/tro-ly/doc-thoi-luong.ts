// Đọc mốc thời gian trong nội dung bước nấu (Đợt 2 — mục 3.4).
// cac_buoc của công thức KHÔNG có trường thời lượng riêng, nên chế độ nấu
// rảnh tay (Đợt 4) phải bóc mốc giờ từ câu chữ:
//   - mẫu số: (\d+)\s*(giờ|tiếng|phút|giây), kể cả gõ không dấu
//   - "nửa giờ" / "nửa tiếng" = 30 phút; "nửa phút" = 30 giây
//   - khoảng "10-15 phút" -> lấy số LỚN (an toàn cho món chín kỹ) + cờ khoảng
//   - nhãn = động từ nấu đứng gần mốc giờ nhất ở phía trước, không có -> "Hẹn giờ"
// Số dạng chữ ("mười phút") không hỗ trợ ở đợt đầu (kế hoạch đã chốt).

import { boDauTiengViet, chuanHoa } from "./chuan-hoa";

export interface MocThoiGian {
  /** Tổng số giây của mốc giờ. */
  giay: number;
  /** Nhãn hiển thị, VD "Hấp", "Ướp", "Ninh" — mặc định "Hẹn giờ". */
  nhan: string;
  /** true khi mốc giờ là một khoảng (VD "10-15 phút", lấy số lớn). */
  laKhoang: boolean;
  /** Đoạn văn bản gốc đã khớp (dạng thường hóa bỏ dấu), để debug/hiển thị. */
  vanBanGoc: string;
}

// Động từ nấu -> dạng hiển thị. Khóa tra cứu là dạng bỏ dấu.
const DONG_TU_NAU: Record<string, string> = {
  hap: "Hấp",
  uop: "Ướp",
  ninh: "Ninh",
  luoc: "Luộc",
  ham: "Hầm",
  chien: "Chiên",
  xao: "Xào",
  dun: "Đun",
  nau: "Nấu",
  kho: "Kho",
  rim: "Rim",
  ngam: "Ngâm",
  u: "Ủ",
  quay: "Quay",
  nuong: "Nướng",
  ran: "Rán",
  trang: "Tráng",
  phi: "Phi",
  xong: "Xông khói",
};

const DON_VI_GIAY: Record<string, number> = {
  gio: 3600,
  tieng: 3600,
  phut: 60,
  giay: 1,
};

function nhanDongTu(truocMoc: string): string {
  // Tìm động từ nấu xuất hiện MUỘN nhất trong đoạn ngay trước mốc giờ.
  const cacTu = truocMoc.split(" ").filter(Boolean);
  for (let i = cacTu.length - 1; i >= 0; i--) {
    const nhan = DONG_TU_NAU[cacTu[i]];
    if (nhan) return nhan;
  }
  return "Hẹn giờ";
}

export function docThoiLuong(noiDungBuoc: string): MocThoiGian[] {
  const banSao = boDauTiengViet(chuanHoa(noiDungBuoc));
  const ketQua: { moc: MocThoiGian; viTri: number }[] = [];
  const daDung: [number, number][] = []; // các khoảng ký tự đã khớp (tránh khớp trùng)

  const trungKhop = (batDau: number, ketThuc: number) =>
    daDung.some(([a, b]) => batDau < b && ketThuc > a);

  // 1) Khoảng "10-15 phút" — xử lý trước để không bị mẫu đơn nuốt mất.
  const mauKhoang = /(\d+(?:[.,]\d+)?)\s*[-–—~]\s*(\d+(?:[.,]\d+)?)\s*(gio|tieng|phut|giay)/g;
  let m: RegExpExecArray | null;
  while ((m = mauKhoang.exec(banSao)) !== null) {
    const lon = Math.max(parseFloat(m[1].replace(",", ".")), parseFloat(m[2].replace(",", ".")));
    ketQua.push({
      viTri: m.index,
      moc: {
        giay: Math.round(lon * DON_VI_GIAY[m[3]]),
        nhan: nhanDongTu(banSao.slice(Math.max(0, m.index - 40), m.index)),
        laKhoang: true,
        vanBanGoc: m[0],
      },
    });
    daDung.push([m.index, m.index + m[0].length]);
  }

  // 2) "nửa giờ / nửa tiếng / nửa phút"
  const mauNua = /nua\s+(gio|tieng|phut)/g;
  while ((m = mauNua.exec(banSao)) !== null) {
    if (trungKhop(m.index, m.index + m[0].length)) continue;
    const giay = m[1] === "phut" ? 30 : 30 * 60;
    ketQua.push({
      viTri: m.index,
      moc: {
        giay,
        nhan: nhanDongTu(banSao.slice(Math.max(0, m.index - 40), m.index)),
        laKhoang: false,
        vanBanGoc: m[0],
      },
    });
    daDung.push([m.index, m.index + m[0].length]);
  }

  // 3) Mốc đơn "15 phút", "1.5 giờ", "30 giây"
  const mauDon = /(\d+(?:[.,]\d+)?)\s*(gio|tieng|phut|giay)/g;
  while ((m = mauDon.exec(banSao)) !== null) {
    if (trungKhop(m.index, m.index + m[0].length)) continue;
    ketQua.push({
      viTri: m.index,
      moc: {
        giay: Math.round(parseFloat(m[1].replace(",", ".")) * DON_VI_GIAY[m[2]]),
        nhan: nhanDongTu(banSao.slice(Math.max(0, m.index - 40), m.index)),
        laKhoang: false,
        vanBanGoc: m[0],
      },
    });
    daDung.push([m.index, m.index + m[0].length]);
  }

  return ketQua.sort((a, b) => a.viTri - b.viTri).map((k) => k.moc);
}

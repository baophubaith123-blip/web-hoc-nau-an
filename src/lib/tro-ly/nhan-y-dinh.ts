// Nhận diện ý định + trích xuất thực thể/bộ lọc từ câu hỏi tự do (Đợt 2).
//
// Cách làm (mục 1.8 của kế hoạch — ghép ý tự do, không phải khớp câu mẫu):
// tách câu hỏi thành THỰC THỂ (nguyên liệu / món / khóa / đầu bếp / bài /
// con số người / con số phút) × BỘ LỌC (độ khó, thời gian tối đa, danh mục,
// miễn phí, cấp độ) × HÀNH ĐỘNG (từ khóa hành động trong câu). tra-loi.ts
// ghép các mảnh này lại thành 1 trong 12 intent. Mọi phép khớp đều chạy
// trên dạng thường hóa bỏ dấu nên gõ không dấu vẫn hiểu.

import { BI_DANH_NGUYEN_LIEU } from "./bi-danh-nguyen-lieu";
import { chuaCum, khoaCauHoi, khoaChuanHoa, tachTu } from "./chuan-hoa";
import type { ChiMucTroLy, MucThucThe } from "./chi-muc";
import type { CapDoKhoa, DoKhoMon, SlotTriNho } from "./kieu-du-lieu";

export interface ThucTheTimDuoc {
  /** Khóa thường hóa của nguyên liệu + tên hiển thị chuẩn. */
  nguyenLieu: { khoa: string; ten: string }[];
  monId?: string;
  khoaHocId?: string;
  dauBepId?: string;
  baiVietId?: string;
  /** Món được nhắc qua tham chiếu quay lui ("món đó") -> lấy từ slot. */
  monTuSlot: boolean;
  khoaTuSlot: boolean;
}

export interface BoLocTimDuoc {
  doKho?: DoKhoMon;
  thoiGianToiDa?: number; // phút (tổng chuẩn bị + nấu)
  danhMucMonKhoa?: string; // khóa của danh mục món khớp trong câu
  mienPhi?: boolean;
  capDo?: CapDoKhoa;
}

export interface PhanTichCauHoi {
  /** Câu hỏi dạng khóa thường hóa bỏ dấu. */
  khoa: string;
  thucThe: ThucTheTimDuoc;
  boLoc: BoLocTimDuoc;
  soNguoi?: number;
  /** Câu chỉ là một con số (người dùng đang trả lời câu hỏi chờ số người). */
  chiLaConSo: boolean;
  coTuCalo: boolean;
  hoiMonKhac: boolean;
  doiSoNguoi: boolean;
  laNguoiMoi: boolean;
}

function timTenChuaDu(danhSach: MucThucThe[], khoaCau: string): MucThucThe | undefined {
  let totNhat: MucThucThe | undefined;
  for (const muc of danhSach) {
    if (muc.khoa && chuaCum(khoaCau, muc.khoa)) {
      if (!totNhat || muc.khoa.length > totNhat.khoa.length) totNhat = muc;
    }
  }
  return totNhat;
}

/**
 * Khớp tên theo tỉ lệ từ trùng: dùng khi người dùng gõ thiếu/thừa vài từ
 * so với tiêu đề thật (VD "trung chien ca chua" cho "Trứng chiên cà chua").
 * Chỉ nhận khi trùng >= 2 từ và tỉ lệ >= nguong.
 */
function timTenTheoTuTrung(
  danhSach: MucThucThe[],
  khoaCau: string,
  nguong: number
): MucThucThe | undefined {
  const tuCau = new Set(tachTu(khoaCau));
  let totNhat: { muc: MucThucThe; diem: number; tiLe: number } | undefined;
  for (const muc of danhSach) {
    const tuTen = [...new Set(tachTu(muc.khoa))];
    if (tuTen.length === 0) continue;
    const trung = tuTen.filter((t) => tuCau.has(t)).length;
    const tiLe = trung / tuTen.length;
    if (trung >= 2 && tiLe >= nguong) {
      if (!totNhat || trung > totNhat.diem || (trung === totNhat.diem && tiLe > totNhat.tiLe)) {
        totNhat = { muc, diem: trung, tiLe };
      }
    }
  }
  return totNhat?.muc;
}

function timNguyenLieu(chiMuc: ChiMucTroLy, khoaCau: string): { khoa: string; ten: string }[] {
  const timDuoc = new Map<string, string>(); // khoa -> ten hien thi

  // 1) Khớp trực tiếp với danh mục nguyên liệu trong dữ liệu.
  for (const muc of chiMuc.danhMucNguyenLieu) {
    if (chuaCum(khoaCau, muc.khoa)) timDuoc.set(muc.khoa, muc.ten);
  }
  // 2) Khớp qua bảng bí danh: người dùng gõ biến thể ("hanh hoa") ->
  //    map sang tên chuẩn; chỉ nhận nếu tên chuẩn có trong dữ liệu.
  for (const [khoaBienThe, tenChuan] of Object.entries(BI_DANH_NGUYEN_LIEU)) {
    if (!chuaCum(khoaCau, khoaBienThe)) continue;
    const khoaChuan = khoaChuanHoa(tenChuan);
    const trongDuLieu = chiMuc.danhMucNguyenLieu.find(
      (m) => m.khoa === khoaChuan || m.khoa.startsWith(khoaChuan + " ") || khoaChuan.startsWith(m.khoa + " ")
    );
    if (trongDuLieu) timDuoc.set(trongDuLieu.khoa, trongDuLieu.ten);
  }
  // 3) Khớp tiền tố theo từ đơn: gõ "trứng" (1 từ) khớp "trung ga".
  //    Chỉ áp dụng cho từ >= 3 ký tự để tránh khớp nhầm từ ngắn ("ca"), và
  //    loại các từ MƠ HỒ khi bỏ dấu: "dau" có thể là đầu/dầu/đậu — gõ "đầu
  //    bếp" không được hiểu là nguyên liệu "dầu ăn".
  const TU_MO_HO = new Set(["dau"]);
  for (const tu of tachTu(khoaCau)) {
    if (tu.length < 3 || TU_MO_HO.has(tu) || timDuoc.has(tu)) continue;
    const ungVien = chiMuc.danhMucNguyenLieu
      .filter((m) => m.khoa === tu || m.khoa.startsWith(tu + " "))
      .sort((a, b) => a.khoa.length - b.khoa.length)[0];
    if (ungVien) timDuoc.set(ungVien.khoa, ungVien.ten);
  }

  // Loại kết quả bị kết quả dài hơn "nuốt" (VD vừa có "ca" vừa có "ca chua"
  // thì giữ "ca chua"), sắp xếp dài trước.
  const tatCa = [...timDuoc.entries()].map(([khoa, ten]) => ({ khoa, ten }));
  return tatCa
    .filter((m) => !tatCa.some((k) => k.khoa !== m.khoa && k.khoa.startsWith(m.khoa + " ")))
    .sort((a, b) => b.khoa.length - a.khoa.length);
}

export function phanTichCauHoi(
  cauHoi: string,
  chiMuc: ChiMucTroLy,
  slot: SlotTriNho
): PhanTichCauHoi {
  const khoa = khoaCauHoi(cauHoi);

  // ---- Con số ----
  let soNguoi: number | undefined;
  const mNguoi = khoa.match(/(\d+)\s*nguoi/);
  if (mNguoi) soNguoi = parseInt(mNguoi[1], 10);
  const chiLaConSo = /^\d+$/.test(khoa.trim());
  if (chiLaConSo && soNguoi === undefined) soNguoi = parseInt(khoa.trim(), 10);

  let thoiGianToiDa: number | undefined;
  const mPhut = khoa.match(/(\d+)\s*phut/);
  if (mPhut) thoiGianToiDa = parseInt(mPhut[1], 10);
  const mGio = khoa.match(/(\d+)\s*(gio|tieng)/);
  if (mGio && thoiGianToiDa === undefined) thoiGianToiDa = parseInt(mGio[1], 10) * 60;

  // ---- Thực thể ----
  const nguyenLieu = timNguyenLieu(chiMuc, khoa);

  const monChuaDu = timTenChuaDu(chiMuc.tenMon, khoa);
  const monTuTrung = monChuaDu ?? timTenTheoTuTrung(chiMuc.tenMon, khoa, 0.75);
  const thamChieuMon = chuaCum(khoa, "mon do") || chuaCum(khoa, "mon nay") || chuaCum(khoa, "no");
  const monId = monTuTrung?.id ?? (thamChieuMon && slot.monDangBan ? slot.monDangBan : undefined);

  const khoaChuaDu = timTenChuaDu(chiMuc.tenKhoaHoc, khoa);
  const khoaTuTrung = khoaChuaDu ?? timTenTheoTuTrung(chiMuc.tenKhoaHoc, khoa, 0.6);
  const thamChieuKhoa = chuaCum(khoa, "khoa do") || chuaCum(khoa, "khoa nay");
  const khoaHocId =
    khoaTuTrung?.id ?? (thamChieuKhoa && slot.khoaDangBan ? slot.khoaDangBan : undefined);

  let dauBep = timTenChuaDu(chiMuc.tenDauBep, khoa);
  if (!dauBep && (chuaCum(khoa, "dau bep") || chuaCum(khoa, "bep"))) {
    // Gọi theo tên riêng: "đầu bếp Hà" — lấy từ cuối của họ tên để đối chiếu.
    const tuCau = tachTu(khoa);
    const ungVien = chiMuc.tenDauBep.filter((d) => {
      const tuTen = tachTu(d.khoa);
      const tenRieng = tuTen[tuTen.length - 1];
      return tenRieng.length >= 2 && tuCau.includes(tenRieng);
    });
    if (ungVien.length === 1) dauBep = ungVien[0];
  }

  const baiViet = timTenChuaDu(chiMuc.tenBaiViet, khoa);

  // ---- Bộ lọc ----
  let doKho: DoKhoMon | undefined;
  if (chuaCum(khoa, "trung binh") || chuaCum(khoa, "vua vua")) doKho = "trung_binh";
  else if (chuaCum(khoa, "kho")) doKho = "kho";
  else if (chuaCum(khoa, "de") || chuaCum(khoa, "don gian")) doKho = "de";

  let danhMucMonKhoa: string | undefined;
  for (const dm of chiMuc.danhMucMon) {
    if (chuaCum(khoa, dm.khoa)) {
      danhMucMonKhoa = dm.khoa;
      break;
    }
    // Danh mục nhiều từ: khớp theo từ đặc trưng cuối (VD "mon chay" -> "chay").
    const tuDm = tachTu(dm.khoa);
    const tuDacTrung = tuDm[tuDm.length - 1];
    if (tuDacTrung && tuDacTrung.length >= 3 && chuaCum(khoa, tuDacTrung) && dm.khoa.includes(" ")) {
      danhMucMonKhoa = dm.khoa;
      break;
    }
  }

  const mienPhi = chuaCum(khoa, "mien phi") || undefined;
  let capDo: CapDoKhoa | undefined;
  if (chuaCum(khoa, "nang cao")) capDo = "nang_cao";
  else if (chuaCum(khoa, "trung cap")) capDo = "trung_cap";
  else if (chuaCum(khoa, "co ban")) capDo = "co_ban";

  return {
    khoa,
    thucThe: {
      nguyenLieu,
      monId,
      khoaHocId,
      dauBepId: dauBep?.id,
      baiVietId: baiViet?.id,
      monTuSlot: !monTuTrung && !!monId,
      khoaTuSlot: !khoaTuTrung && !!khoaHocId,
    },
    boLoc: { doKho, thoiGianToiDa, danhMucMonKhoa, mienPhi, capDo },
    soNguoi,
    chiLaConSo,
    coTuCalo: chuaCum(khoa, "calo") || chuaCum(khoa, "kcal"),
    hoiMonKhac:
      chuaCum(khoa, "con mon khac") ||
      chuaCum(khoa, "mon khac khong") ||
      chuaCum(khoa, "mon nao khac") ||
      chuaCum(khoa, "goi y khac"),
    doiSoNguoi: chuaCum(khoa, "doi sang") || chuaCum(khoa, "doi thanh"),
    laNguoiMoi:
      chuaCum(khoa, "nguoi moi") ||
      chuaCum(khoa, "moi vao bep") ||
      chuaCum(khoa, "moi bat dau") ||
      chuaCum(khoa, "moi hoc nau") ||
      chuaCum(khoa, "hoc gi dau tien") ||
      chuaCum(khoa, "khoa dau tien") ||
      chuaCum(khoa, "bat dau hoc nau"),
  };
}

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

function timTenChuaDu(
  danhSach: MucThucThe[],
  khoaCau: string,
  choPhepCumDau = true
): MucThucThe | undefined {
  let totNhat: MucThucThe | undefined;
  for (const muc of danhSach) {
    if (muc.khoa && chuaCum(khoaCau, muc.khoa)) {
      if (!totNhat || muc.khoa.length > totNhat.khoa.length) totNhat = muc;
    }
  }
  if (totNhat || !choPhepCumDau) return totNhat;
  // Cách gọi ngắn bằng 2 từ đầu của tên (vòng rèn luyện 1): người dùng hay
  // gọi "phở bò", "bánh xèo", "cá kho" thay cho tên đầy đủ "Phở bò Hà Nội",
  // "Bánh xèo miền Tây", "Cá kho tộ" — nhận khi cụm 2 từ đầu của tên xuất
  // hiện nguyên vẹn trong câu. KHÔNG áp cho khóa học: nhiều khóa bắt đầu
  // bằng "Món chay", "Ăn sáng", "Tráng miệng"... trùng đúng cụm danh mục
  // món, sẽ cướp intent của câu hỏi về món.
  for (const muc of danhSach) {
    const tuTen = tachTu(muc.khoa);
    if (tuTen.length < 3) continue;
    const cumDau = tuTen.slice(0, 2).join(" ");
    if (cumDau.length >= 5 && chuaCum(khoaCau, cumDau)) {
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
  // Các cụm NGUỒN đã khớp ở bước 1-2 (để bước 3 không tách lẻ từ trong đó:
  // "hoa" trong "hanh hoa" từng bị khớp thêm thành "Hoa hồi", "bap" trong
  // "dau bap" bị khớp thêm thành "Bắp Mỹ" — vòng rèn luyện 1).
  const nguonDaKhop: string[] = [];

  // 1) Khớp trực tiếp với danh mục nguyên liệu trong dữ liệu.
  //    Ngoại lệ: khóa trơn "nuoc" (từ nguyên liệu "Nước (làm caramel)")
  //    không phải nguyên liệu tra món được — nó khớp mọi câu có chữ
  //    "nước" (VD "tổng thống của nước Mỹ" — vòng rèn luyện 2). Các dạng
  //    đầy đủ như "nuoc loc", "nuoc mam" vẫn khớp bình thường.
  for (const muc of chiMuc.danhMucNguyenLieu) {
    if (muc.khoa === "nuoc") continue;
    if (chuaCum(khoaCau, muc.khoa)) {
      timDuoc.set(muc.khoa, muc.ten);
      nguonDaKhop.push(muc.khoa);
    }
  }
  // 2) Khớp qua bảng bí danh: người dùng gõ biến thể ("hanh hoa") ->
  //    map sang tên chuẩn; chỉ nhận nếu tên chuẩn có trong dữ liệu.
  for (const [khoaBienThe, tenChuan] of Object.entries(BI_DANH_NGUYEN_LIEU)) {
    if (!chuaCum(khoaCau, khoaBienThe)) continue;
    const khoaChuan = khoaChuanHoa(tenChuan);
    const trongDuLieu = chiMuc.danhMucNguyenLieu.find(
      (m) => m.khoa === khoaChuan || m.khoa.startsWith(khoaChuan + " ") || khoaChuan.startsWith(m.khoa + " ")
    );
    if (trongDuLieu) {
      timDuoc.set(trongDuLieu.khoa, trongDuLieu.ten);
      nguonDaKhop.push(khoaBienThe);
    }
  }
  // 3) Khớp tiền tố theo từ đơn: gõ "trứng" (1 từ) khớp "trung ga".
  //    Chỉ áp dụng cho từ >= 3 ký tự để tránh khớp nhầm từ ngắn ("ca"), và
  //    loại các từ MƠ HỒ khi bỏ dấu: "dau" có thể là đầu/dầu/đậu — gõ "đầu
  //    bếp" không được hiểu là nguyên liệu "dầu ăn". Bổ sung ở vòng rèn
  //    luyện 1 (đo trên dữ liệu thật): "gia" (giá tiền ~ giá đỗ), "hat"
  //    (hát ~ hạt), "nuoc" (nước Mỹ/nước ngoài ~ nước lọc), "nam" (Việt
  //    Nam ~ nấm), "giam" (giảm giá ~ giấm) — các từ này chỉ được khớp khi
  //    người dùng gõ đủ cụm nguyên liệu ở bước 1/2, không khớp theo 1 từ.
  const TU_MO_HO = new Set(["dau", "gia", "hat", "nuoc", "nam", "giam", "toi"]);
  for (const tu of tachTu(khoaCau)) {
    if (tu.length < 3 || TU_MO_HO.has(tu) || timDuoc.has(tu)) continue;
    // Từ nằm TRONG một cụm nguồn đã khớp (bước 1-2) thì không tách lẻ nữa.
    if (nguonDaKhop.some((cum) => (" " + cum + " ").includes(" " + tu + " "))) continue;
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

  // Cụm từ của BỘ LỌC không được lọt vào khâu khớp nguyên liệu/thực thể
  // (vòng rèn luyện 1): "trung bình" từng bị khớp thành nguyên liệu "trứng"
  // (từ "trung"), và nhãn "độ khó" từng làm câu "độ khó dễ" bị đọc thành
  // độ khó "kho". khoaSach = câu đã gỡ 2 cụm đó; khoaKhongDoKho = chỉ gỡ
  // nhãn "độ khó" (vẫn giữ "trung binh" để nhận diện độ khó).
  const khoaKhongDoKho = (" " + khoa + " ").replace(/ do kho /g, " ").trim().replace(/\s+/g, " ");
  const khoaSach = (" " + khoaKhongDoKho + " ")
    .replace(/ trung binh /g, " ")
    .replace(/ trung cap /g, " ")
    .trim()
    .replace(/\s+/g, " ");

  // ---- Thực thể ----
  const nguyenLieu = timNguyenLieu(chiMuc, khoaSach);

  const monChuaDu = timTenChuaDu(chiMuc.tenMon, khoa);
  const monTuTrung = monChuaDu ?? timTenTheoTuTrung(chiMuc.tenMon, khoa, 0.75);
  const thamChieuMon = chuaCum(khoa, "mon do") || chuaCum(khoa, "mon nay") || chuaCum(khoa, "no");
  const monId = monTuTrung?.id ?? (thamChieuMon && slot.monDangBan ? slot.monDangBan : undefined);

  const khoaChuaDu = timTenChuaDu(chiMuc.tenKhoaHoc, khoa, false);
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
  // Nhận diện trên khoaKhongDoKho để nhãn "độ khó" không tự khớp "kho".
  let doKho: DoKhoMon | undefined;
  if (chuaCum(khoaKhongDoKho, "trung binh") || chuaCum(khoaKhongDoKho, "vua vua")) doKho = "trung_binh";
  else if (chuaCum(khoaKhongDoKho, "kho")) doKho = "kho";
  else if (chuaCum(khoaKhongDoKho, "de") || chuaCum(khoaKhongDoKho, "don gian")) doKho = "de";

  let danhMucMonKhoa: string | undefined;
  for (const dm of chiMuc.danhMucMon) {
    if (chuaCum(khoa, dm.khoa)) {
      danhMucMonKhoa = dm.khoa;
      break;
    }
  }
  // Danh mục nhiều từ: khớp theo từ đặc trưng (cuối, hoặc đầu nếu đầu không
  // phải "mon") — VD "mon chay" -> "chay", "canh va sup" -> "canh". Chỉ áp
  // khi câu đang nói về MÓN (có từ "mon"): tránh "Viết..." ("viet" = Việt)
  // hay "...sang tiếng Anh" ("sang" của "Món ăn sáng") khớp nhầm danh mục
  // trong câu ngoài bếp (vòng rèn luyện 1).
  if (!danhMucMonKhoa && chuaCum(khoa, "mon")) {
    for (const dm of chiMuc.danhMucMon) {
      if (!dm.khoa.includes(" ")) continue;
      const tuDm = tachTu(dm.khoa);
      const tuCuoi = tuDm[tuDm.length - 1];
      const tuDau = tuDm[0] !== "mon" ? tuDm[0] : undefined;
      if (
        (tuCuoi && tuCuoi.length >= 3 && chuaCum(khoa, tuCuoi)) ||
        (tuDau && tuDau.length >= 3 && chuaCum(khoa, tuDau))
      ) {
        danhMucMonKhoa = dm.khoa;
        break;
      }
    }
  }

  const mienPhi =
    chuaCum(khoa, "mien phi") ||
    chuaCum(khoa, "khong ton tien") ||
    chuaCum(khoa, "khong mat tien") ||
    undefined;
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
    coTuCalo: chuaCum(khoa, "calo") || chuaCum(khoa, "kcal") || chuaCum(khoa, "nang luong"),
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
      chuaCum(khoa, "bat dau hoc nau") ||
      chuaCum(khoa, "bat dau tu dau") ||
      chuaCum(khoa, "chua biet bat dau") ||
      chuaCum(khoa, "khong biet bat dau") ||
      chuaCum(khoa, "moi tap nau") ||
      chuaCum(khoa, "tap nau an"),
  };
}

// Phân loại bước nấu thành "chuẩn bị" / "nấu chính" cho GIAI ĐOẠN CHUẨN BỊ
// của chế độ nấu rảnh tay (quyết định F.3.5 — đợt 2). Hàm THUẦN, không phụ
// thuộc UI: buoi-nau.tsx dùng để tách phần chuẩn bị trình bày trước, người
// dùng bấm "Chuẩn bị xong" mới vào các bước nấu chính.
//
// Nguyên tắc AN TOÀN (khớp yêu cầu đợt): bước nào không rõ ràng thì mặc
// định là NẤU CHÍNH — thà trình bày thừa ở luồng chính còn hơn giấu mất
// một bước nấu khỏi người dùng. Cụ thể:
//   1) TIÊU ĐỀ bước (phần trước dấu ":" đầu tiên, hoặc câu đầu tiên) mở đầu
//      bằng mẫu chuẩn bị ("Sơ chế…", "Chuẩn bị…", "Pha bột…", "Ướp…",
//      "Ngâm…") -> CHUẨN BỊ, kể cả khi thân bước có nhắc động tác nấu phụ
//      (VD bước "Chuẩn bị nguyên liệu" của Súp cua có luộc gà/xào cua —
//      đó vẫn là việc làm trước khi nấu nồi súp chính).
//   2) Ngược lại, thân bước chứa động từ NẤU CHÍNH mạnh (đun, nấu, xào,
//      chiên, hấp, nướng, kho, ninh, hầm, luộc, rán, quay, tráng, rim)
//      -> NẤU CHÍNH, dù có lẫn động tác chuẩn bị (VD "Xào thịt rồi ướp
//      thêm 10 phút" vẫn là bước nấu).
//   3) Không có động từ nấu chính mà có động từ CHUẨN BỊ (sơ chế, rửa,
//      cắt, thái, băm, gọt, ướp, ngâm, trộn bột, pha nước ướp/chấm, chuẩn
//      bị nguyên liệu, để ráo, thấm khô…) -> CHUẨN BỊ.
//   4) Còn lại -> NẤU CHÍNH (mặc định an toàn).
//
// Lớp buổi nấu (buoi-nau.tsx) chỉ lấy ĐOẠN CHUẨN BỊ LIỀN NHAU Ở ĐẦU công
// thức làm giai đoạn chuẩn bị: một bước chuẩn bị xuất hiện sau khi đã có
// bước nấu chính (VD "Chuẩn bị thịt tái" ở giữa công thức Phở) vẫn ở lại
// luồng nấu chính theo đúng thứ tự thời gian của món ăn.

import { boDauTiengViet, chuanHoa } from "./chuan-hoa";
import type { BuocNauMon } from "./kieu-du-lieu";

export type LoaiBuoc = "chuan_bi" | "nau_chinh";

/** Mẫu tiêu đề mở đầu = chuẩn bị (đã bỏ dấu, viết thường, không dấu cách cuối). */
const MAU_TIEU_DE_CHUAN_BI = [
  "so che",
  "chuan bi",
  "pha bot",
  "pha nuoc uop",
  "pha nuoc cham",
  "pha nuoc",
  "pha gia vi",
  "uop",
  "ngam",
  "rua",
  "cat",
  "thai",
  "bam",
  "got",
  "tron bot",
  "nhao bot",
  "lam sach",
];

/** Động từ nấu chính — từ đơn khớp theo BIÊN TỪ, cụm từ khớp theo chuỗi có biên. */
const DONG_TU_NAU_CHINH_TU_DON = [
  "dun",
  "nau",
  "xao",
  "chien",
  "hap",
  "nuong",
  "kho",
  "ninh",
  "ham",
  "luoc",
  "ran",
  "quay",
  "rim",
];
const DONG_TU_NAU_CHINH_CUM = ["trang banh", "phi thom", "thang caramel", "thang duong"];

/** Động từ/cụm chuẩn bị — chỉ dùng khi bước KHÔNG có động từ nấu chính. */
const DONG_TU_CHUAN_BI_TU_DON = ["uop", "ngam"];
const DONG_TU_CHUAN_BI_CUM = [
  "so che",
  "chuan bi nguyen lieu",
  "chuan bi",
  "rua sach",
  "rua",
  "cat",
  "thai",
  "bam",
  "got vo",
  "tron bot",
  "nhao bot",
  "pha bot",
  "pha nuoc uop",
  "pha nuoc cham",
  "de rao",
  "tham kho",
  "nhat sach",
  "bo chi den",
  "boc vo",
  "tach hat",
  "danh tan",
  "khuay tan",
  "hoa tan",
  "de bot nghi",
];

function chuaTuDon(khoaPad: string, tu: string): boolean {
  return khoaPad.includes(" " + tu + " ");
}
function chuaCumTu(khoaPad: string, cum: string): boolean {
  return khoaPad.includes(" " + cum + " ") || khoaPad.includes(" " + cum + ",");
}

/** Phân loại MỘT bước theo nội dung. Mặc định an toàn: "nau_chinh". */
export function phanLoaiBuoc(noiDung: string): LoaiBuoc {
  const sach = boDauTiengViet(chuanHoa(noiDung));
  const khoaPad = " " + sach + " ";

  // Tiêu đề = phần trước dấu ":" đầu tiên; không có ":" thì lấy câu đầu.
  const truocHaiCham = sach.split(":")[0];
  const tieuDe = (truocHaiCham.length <= 60 ? truocHaiCham : sach.split(".")[0]).trim();

  // Luật 1: tiêu đề chuẩn bị thắng.
  if (MAU_TIEU_DE_CHUAN_BI.some((m) => tieuDe === m || tieuDe.startsWith(m + " "))) {
    return "chuan_bi";
  }

  // Luật 2: có động từ nấu chính -> nấu chính.
  if (
    DONG_TU_NAU_CHINH_TU_DON.some((m) => chuaTuDon(khoaPad, m)) ||
    DONG_TU_NAU_CHINH_CUM.some((m) => chuaCumTu(khoaPad, m))
  ) {
    return "nau_chinh";
  }

  // Luật 3: chỉ có động từ chuẩn bị -> chuẩn bị.
  if (
    DONG_TU_CHUAN_BI_TU_DON.some((m) => chuaTuDon(khoaPad, m)) ||
    DONG_TU_CHUAN_BI_CUM.some((m) => chuaCumTu(khoaPad, m))
  ) {
    return "chuan_bi";
  }

  // Luật 4: mặc định an toàn.
  return "nau_chinh";
}

export interface TachBuocNau {
  /** Chỉ số (0-based, theo thứ tự gốc) của các bước chuẩn bị — đoạn liền nhau ở đầu. */
  chiSoChuanBi: number[];
  /** Chỉ số của các bước nấu chính theo thứ tự nấu thật. */
  chiSoNauChinh: number[];
  /** Loại của TỪNG bước theo phanLoaiBuoc (để debug/hiển thị nếu cần). */
  loaiTungBuoc: LoaiBuoc[];
}

/**
 * Tách bước cho buổi nấu: giai đoạn chuẩn bị = đoạn bước chuẩn bị LIỀN
 * NHAU ở đầu công thức. Nếu mọi bước đều là chuẩn bị (không còn bước nấu
 * nào) thì coi như không tách được — toàn bộ là nấu chính để không phá
 * luồng của món đơn giản/bất thường.
 */
export function tachBuocChuanBi(cacBuoc: BuocNauMon[]): TachBuocNau {
  const loaiTungBuoc = cacBuoc.map((b) => phanLoaiBuoc(b.noi_dung));
  let soDau = 0;
  while (soDau < loaiTungBuoc.length && loaiTungBuoc[soDau] === "chuan_bi") soDau++;
  if (soDau >= cacBuoc.length) soDau = 0; // không giấu toàn bộ món vào màn chuẩn bị
  const chiSoChuanBi = Array.from({ length: soDau }, (_, i) => i);
  const chiSoNauChinh = cacBuoc.map((_, i) => i).filter((i) => i >= soDau);
  return { chiSoChuanBi, chiSoNauChinh, loaiTungBuoc };
}

/** Ngưỡng "khoảng chờ dài" ở giai đoạn chuẩn bị: từ 10 phút trở lên. */
export const CHO_DAI_TOI_THIEU_GIAY = 600;

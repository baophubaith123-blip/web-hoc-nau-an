// Điều phối trả lời của Cokba (Đợt 2) — phủ 12 intent của kế hoạch mục 1:
//   1 mon_theo_nguyen_lieu   2 co_gi_nau_nay        3 nguyen_lieu_mon
//   4 cach_lam_mon           5 mon_theo_tieu_chi    6 lo_trinh_nguoi_moi
//   7 khoa_theo_nhu_cau      8 khoa_gom_gi          9 dau_bep_theo_chuyen_mon
//  10 ho_so_dau_bep         11 bai_theo_chu_de     12 calo_mon
// Cộng: ngữ cảnh quay lui ("món đó", "còn món khác không", "đổi sang N
// người"), dự phòng tìm kiếm toàn văn, và trả lời ngoài phạm vi đúng mực.
// Hàm THUẦN: dữ liệu truyền vào qua DuLieuTroLy, trạng thái qua SlotTriNho;
// kết quả luôn kèm slotDaCapNhat để UI lưu lại cho lượt sau.
// KHÔNG bịa: mọi tên/số trong câu trả lời đều lấy từ dữ liệu truyền vào.

import { dungChiMuc, monCoNguyenLieu, type ChiMucTroLy } from "./chi-muc";
import { chiaKhauPhan } from "./chia-khau-phan";
import { chuaCum, khoaChuanHoa, tachTu } from "./chuan-hoa";
import { GIA_VI_CO_BAN, chamDiemTatCa } from "./khop-nguyen-lieu";
import { phanTichCauHoi, type BoLocTimDuoc } from "./nhan-y-dinh";
import type {
  BaiVietTroLy,
  CauTraLoi,
  CongThucTroLy,
  DauBepTroLy,
  DuLieuTroLy,
  KhoaHocTroLy,
  SlotTriNho,
  TheHienThi,
} from "./kieu-du-lieu";

// ---------------------------------------------------------------------------
// Tiện ích trình bày
// ---------------------------------------------------------------------------

const NHAN_DO_KHO: Record<CongThucTroLy["do_kho"], string> = {
  de: "Dễ",
  trung_binh: "Trung bình",
  kho: "Khó",
};

const NHAN_CAP_DO: Record<KhoaHocTroLy["cap_do"], string> = {
  co_ban: "Cơ bản",
  trung_cap: "Trung cấp",
  nang_cao: "Nâng cao",
};

function tongPhut(mon: CongThucTroLy): number {
  return mon.thoi_gian_chuan_bi + mon.thoi_gian_nau;
}

function dinhDangGia(gia: number): string {
  return gia.toLocaleString("vi-VN") + "đ";
}

function giaCuaKhoa(kh: KhoaHocTroLy): string {
  return kh.mien_phi || kh.gia === 0 ? "Miễn phí" : dinhDangGia(kh.gia);
}

function theMon(mon: CongThucTroLy, them?: Partial<TheHienThi>): TheHienThi {
  return {
    loai: "mon",
    id: mon.id,
    tieuDe: mon.tieu_de,
    slug: mon.slug,
    anh: mon.anh_dai_dien,
    meta: [`${tongPhut(mon)} phút`, NHAN_DO_KHO[mon.do_kho], `cho ${mon.khau_phan} người`],
    moTa: mon.mo_ta,
    hanhDong: ["xem", "nauMonNay"],
    ...them,
  };
}

function theKhoaHoc(kh: KhoaHocTroLy, duLieu: DuLieuTroLy): TheHienThi {
  const bep = duLieu.dauBep.find((d) => d.id === kh.dau_bep_id);
  return {
    loai: "khoaHoc",
    id: kh.id,
    tieuDe: kh.tieu_de,
    slug: kh.slug,
    anh: kh.anh_dai_dien,
    meta: [
      NHAN_CAP_DO[kh.cap_do],
      giaCuaKhoa(kh),
      `${kh.bai_hoc.length || kh.so_bai_hoc} bài học`,
      ...(bep ? [`Đầu bếp ${bep.ho_ten}`] : []),
    ],
    moTa: kh.mo_ta,
    hanhDong: ["xemKhoa"],
  };
}

function theBaiViet(bv: BaiVietTroLy): TheHienThi {
  return {
    loai: "baiViet",
    id: bv.id,
    tieuDe: bv.tieu_de,
    slug: bv.slug,
    anh: bv.anh_dai_dien,
    meta: bv.danh_muc ? [bv.danh_muc] : [],
    moTa: bv.tom_tat ?? tomTatTuNoiDung(bv),
    hanhDong: ["docBai"],
  };
}

function theDauBep(db: DauBepTroLy, duLieu: DuLieuTroLy): TheHienThi {
  const soMon = duLieu.congThuc.filter((m) => m.tac_gia_id === db.id).length;
  const soKhoa = duLieu.khoaHoc.filter((k) => k.dau_bep_id === db.id).length;
  const soBai = duLieu.baiViet.filter((b) => b.tac_gia_id === db.id).length;
  return {
    loai: "dauBep",
    id: db.id,
    tieuDe: db.ho_ten,
    anh: db.avatar_url,
    meta: [`${soMon} công thức`, `${soKhoa} khóa học`, `${soBai} bài viết`],
    moTa: db.bio,
    hanhDong: ["xemDauBep"],
  };
}

function tomTatTuNoiDung(bv: BaiVietTroLy): string | null {
  if (!bv.noi_dung) return null;
  const sach = bv.noi_dung.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!sach) return null;
  return sach.length > 180 ? sach.slice(0, 180).trimEnd() + "…" : sach;
}

// ---------------------------------------------------------------------------
// Bộ lọc món theo tiêu chí (intent 5 + ghép tự do vào intent 1)
// ---------------------------------------------------------------------------

function apLocMon(mon: CongThucTroLy, boLoc: BoLocTimDuoc): boolean {
  if (boLoc.doKho && mon.do_kho !== boLoc.doKho) return false;
  if (boLoc.thoiGianToiDa !== undefined && tongPhut(mon) >= boLoc.thoiGianToiDa) return false;
  if (boLoc.danhMucMonKhoa) {
    const khoaDm = boLoc.danhMucMonKhoa;
    if (!mon.danh_muc.some((dm) => khoaChuanHoa(dm) === khoaDm)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Tìm kiếm toàn văn dự phòng (mục 1.8) — đếm số lần xuất hiện thuật ngữ
// trong tiêu đề (trọng số 3) + nội dung của cả 4 miền.
// ---------------------------------------------------------------------------

const TU_DUNG = new Set([
  "mon", "nao", "co", "khong", "cho", "toi", "minh", "thi", "duoc", "gi", "la", "va",
  "cua", "trong", "nay", "do", "cac", "nhung", "mot", "voi", "ve", "the", "lam",
  "bang", "hay", "biet", "tim", "xem", "hoc", "nau", "an", "khoa", "bai", "dau",
  "bep", "muon", "can", "muon", "ra", "sao", "ne", "nhe", "oi", "ah", "ma",
  // "gia" (giá/gia vị đều mơ hồ) và "bao" (bao nhiêu = từ hỏi) không mang
  // nghĩa nội dung khi đứng một mình (vòng rèn luyện 1).
  "gia", "bao",
]);

function timKiemToanVan(duLieu: DuLieuTroLy, chiMuc: ChiMucTroLy, khoaCau: string): TheHienThi[] {
  const thuatNgu = [...new Set(tachTu(khoaCau).filter((t) => t.length >= 3 && !TU_DUNG.has(t)))];
  if (thuatNgu.length === 0) return [];

  // Đếm theo BIÊN TỪ (vòng rèn luyện 1): trước đây đếm chuỗi con nên từ
  // ngắn khớp lọt vào giữa từ khác ("hom" trong "thom"...) khiến câu
  // ngoài phạm vi cũng "tìm thấy" kết quả. Nay chỉ tính khi thuật ngữ
  // đứng độc lập thành một từ, và một mục chỉ được coi là LIÊN QUAN khi:
  // có >= 2 thuật ngữ KHÁC NHAU cùng khớp, tổng điểm >= 6, và ít nhất
  // 1 thuật ngữ khớp ngay trong TIÊU ĐỀ của mục (trước đây chỉ cần 1 từ
  // phổ thông xuất hiện trong nội dung là đã trả thẻ — vòng 1 corpus:
  // 12/12 câu ngoài phạm vi bị trả sai sang mục liên quan).
  const demDiem = (tieuDe: string, noiDung: string): { diem: number; soThuatNguKhop: number; khopTieuDe: boolean } => {
    const td = " " + khoaChuanHoa(tieuDe) + " ";
    const nd = " " + khoaChuanHoa(noiDung) + " ";
    let diem = 0;
    let soThuatNguKhop = 0;
    let khopTieuDe = false;
    for (const tn of thuatNgu) {
      const trongTieuDe = td.includes(" " + tn + " ");
      const soLan = nd.split(" " + tn + " ").length - 1;
      if (trongTieuDe) {
        diem += 3;
        khopTieuDe = true;
      }
      diem += Math.min(soLan, 5);
      if (trongTieuDe || soLan > 0) soThuatNguKhop += 1;
    }
    return { diem, soThuatNguKhop, khopTieuDe };
  };
  const lienQuan = (tieuDe: string, noiDung: string): number => {
    const kq = demDiem(tieuDe, noiDung);
    return kq.soThuatNguKhop >= 2 && kq.khopTieuDe && kq.diem >= 6 ? kq.diem : 0;
  };

  const ungVien: { the: TheHienThi; diem: number }[] = [];
  for (const mon of duLieu.congThuc) {
    const diem = lienQuan(mon.tieu_de, (mon.mo_ta ?? "") + " " + mon.cac_buoc.map((b) => b.noi_dung).join(" "));
    if (diem > 0) ungVien.push({ the: theMon(mon), diem });
  }
  for (const kh of duLieu.khoaHoc) {
    const diem = lienQuan(kh.tieu_de, (kh.mo_ta ?? "") + " " + (kh.mo_ta_chi_tiet ?? ""));
    if (diem > 0) ungVien.push({ the: theKhoaHoc(kh, duLieu), diem });
  }
  for (const bv of duLieu.baiViet) {
    if (!chiMuc.baiVietTheoId.has(bv.id)) continue; // bỏ bài TEST_
    const diem = lienQuan(bv.tieu_de, (bv.tom_tat ?? "") + " " + (bv.noi_dung ?? ""));
    if (diem > 0) ungVien.push({ the: theBaiViet(bv), diem });
  }
  for (const db of duLieu.dauBep) {
    const diem = lienQuan(db.ho_ten, db.bio ?? "");
    if (diem > 0) ungVien.push({ the: theDauBep(db, duLieu), diem });
  }
  return ungVien
    .sort((a, b) => b.diem - a.diem)
    .slice(0, 5)
    .map((u) => u.the);
}

// ---------------------------------------------------------------------------
// Các intent cụ thể
// ---------------------------------------------------------------------------

function traLoiCalo(
  mon: CongThucTroLy,
  soNguoi: number | undefined,
  slotMoi: SlotTriNho
): CauTraLoi {
  slotMoi.monDangBan = mon.id;
  if (mon.calories === null || mon.calories === undefined) {
    return {
      doanVan: [
        `Món ${mon.tieu_de} hiện chưa có thông tin calo trong dữ liệu của Học Nấu Ăn nên Cokba không dám đoán số. Bạn có thể xem chi tiết nguyên liệu của món để ước lượng thêm nhé.`,
      ],
      the: [theMon(mon)],
      khongTraLoiDuoc: true,
      lyDoKhongTraLoi: `Món "${mon.tieu_de}" (id ${mon.id}) thiếu dữ liệu calories.`,
      yDinh: "calo_mon",
      slotDaCapNhat: slotMoi,
    };
  }
  if (soNguoi === undefined) {
    slotMoi.choSoNguoiAnChoMon = mon.id;
    return {
      doanVan: [`Để tính đúng calo món ${mon.tieu_de}, cho Cokba hỏi: Bạn nấu cho mấy người ăn?`],
      the: [theMon(mon)],
      choSoNguoiAn: true,
      monChoSoNguoiAn: mon.id,
      yDinh: "calo_mon",
      slotDaCapNhat: slotMoi,
    };
  }
  slotMoi.soNguoiAn = soNguoi;
  slotMoi.choSoNguoiAnChoMon = null;
  const moiNguoi = Math.round(mon.calories / mon.khau_phan);
  const tong = moiNguoi * soNguoi;
  return {
    doanVan: [
      `Món ${mon.tieu_de}: công thức gốc cho ${mon.khau_phan} người có tổng ${mon.calories.toLocaleString("vi-VN")} calo, tức khoảng ${moiNguoi.toLocaleString("vi-VN")} calo/người. Nấu cho ${soNguoi} người thì tổng khoảng ${tong.toLocaleString("vi-VN")} calo.`,
    ],
    the: [theMon(mon)],
    yDinh: "calo_mon",
    slotDaCapNhat: slotMoi,
  };
}

function traLoiNguyenLieuMon(
  mon: CongThucTroLy,
  soNguoiYeuCau: number | undefined,
  slotMoi: SlotTriNho
): CauTraLoi {
  slotMoi.monDangBan = mon.id;
  const soNguoi = soNguoiYeuCau ?? slotMoi.soNguoiAn ?? mon.khau_phan;
  slotMoi.soNguoiAn = soNguoi;
  slotMoi.choSoNguoiAnChoMon = null;
  const daChia = chiaKhauPhan(mon.nguyen_lieu, mon.khau_phan, soNguoi);
  const dong = daChia.map((nl) => `- ${nl.ten}: ${nl.hien_thi}`);
  const ghiChu =
    soNguoiYeuCau === undefined && slotMoi.soNguoiAn === mon.khau_phan
      ? `Đây là nguyên liệu của món ${mon.tieu_de} theo công thức gốc cho ${mon.khau_phan} người ăn:`
      : `Nguyên liệu món ${mon.tieu_de} cho ${soNguoi} người ăn (đã chia từ công thức gốc cho ${mon.khau_phan} người):`;
  return {
    doanVan: [ghiChu, ...dong],
    the: [theMon(mon)],
    goiY: ["Nấu món này", `Món ${mon.tieu_de} bao nhiêu calo?`, "Còn món khác không?"],
    yDinh: "nguyen_lieu_mon",
    slotDaCapNhat: slotMoi,
  };
}

function traLoiCachLam(mon: CongThucTroLy, slotMoi: SlotTriNho): CauTraLoi {
  slotMoi.monDangBan = mon.id;
  const soBuoc = mon.cac_buoc.length;
  return {
    doanVan: [
      `Món ${mon.tieu_de} gồm ${soBuoc} bước, chuẩn bị ${mon.thoi_gian_chuan_bi} phút và nấu ${mon.thoi_gian_nau} phút (tổng khoảng ${tongPhut(mon)} phút), độ khó: ${NHAN_DO_KHO[mon.do_kho]}. Bấm "Nấu món này" trên thẻ để Cokba dẫn bạn nấu từng bước, có hẹn giờ cho các bước cần chờ nhé.`,
    ],
    the: [theMon(mon)],
    goiY: [`Nguyên liệu món ${mon.tieu_de} cho ${mon.khau_phan} người`, "Còn món khác không?"],
    yDinh: "cach_lam_mon",
    slotDaCapNhat: slotMoi,
  };
}

// ---------------------------------------------------------------------------
// Hàm điều phối chính
// ---------------------------------------------------------------------------

export function traLoi(cauHoi: string, duLieu: DuLieuTroLy, slotIn: SlotTriNho): CauTraLoi {
  const chiMuc = dungChiMuc(duLieu);
  const slot: SlotTriNho = {
    ...slotIn,
    nguyenLieuDangCo: [...(slotIn.nguyenLieuDangCo ?? [])],
    danhSachVuaXem: [...(slotIn.danhSachVuaXem ?? [])],
    nguyenLieuTruyVanGanNhat: [...(slotIn.nguyenLieuTruyVanGanNhat ?? [])],
    giaViDaXacNhan: slotIn.giaViDaXacNhan ? [...slotIn.giaViDaXacNhan] : null,
  };
  const pt = phanTichCauHoi(cauHoi, chiMuc, slot);
  const khoa = pt.khoa;
  const monTuId = (id?: string) => (id ? chiMuc.monTheoId.get(id) : undefined);

  const goiYMacDinh = [
    "Món nào làm bằng cà chua?",
    "Mình có trứng, cà chua thì nấu được gì?",
    "Khóa đầu tiên cho người mới là gì?",
    "Có bài nào về chọn dao không?",
  ];

  // --- 0a) Đang chờ số người (luật calo) mà người dùng chỉ gõ một con số ---
  if (slot.choSoNguoiAnChoMon && pt.soNguoi !== undefined && (pt.chiLaConSo || chuaCum(khoa, "nguoi"))) {
    const mon = monTuId(slot.choSoNguoiAnChoMon);
    if (mon) return traLoiCalo(mon, pt.soNguoi, slot);
    slot.choSoNguoiAnChoMon = null;
  }

  // --- 0b) "Đổi sang N người" -> tính lại theo món đang bàn ---
  if (pt.doiSoNguoi && pt.soNguoi !== undefined && slot.monDangBan) {
    const mon = monTuId(slot.monDangBan);
    if (mon) return traLoiNguyenLieuMon(mon, pt.soNguoi, slot);
  }

  // --- 0c) "Còn món khác không" -> chạy lại truy vấn nguyên liệu gần nhất ---
  if (pt.hoiMonKhac && slot.nguyenLieuTruyVanGanNhat.length > 0) {
    const tapIds = new Set<string>();
    for (const khoaNl of slot.nguyenLieuTruyVanGanNhat) {
      for (const id of monCoNguyenLieu(chiMuc, khoaNl)) tapIds.add(id);
    }
    const chuaXem = [...tapIds]
      .map((id) => chiMuc.monTheoId.get(id)!)
      .filter((m) => !slot.danhSachVuaXem.includes(m.id));
    if (chuaXem.length === 0) {
      return {
        doanVan: [
          "Cokba đã liệt kê hết các món khớp với nguyên liệu đó rồi. Bạn thử thêm một nguyên liệu khác, hoặc hỏi Cokba theo tiêu chí khác nhé.",
        ],
        the: [],
        goiY: goiYMacDinh,
        yDinh: "con_mon_khac",
        slotDaCapNhat: slot,
      };
    }
    const tiep = chuaXem.slice(0, 3);
    slot.danhSachVuaXem = [...slot.danhSachVuaXem, ...tiep.map((m) => m.id)];
    if (tiep[0]) slot.monDangBan = tiep[0].id;
    return {
      doanVan: [`Còn ${chuaXem.length} món khác nữa, Cokba gợi ý tiếp đây:`],
      the: tiep.map((m) => theMon(m)),
      goiY: ["Còn món khác không?"],
      yDinh: "con_mon_khac",
      slotDaCapNhat: slot,
    };
  }

  // --- 12) Calo của một món ---
  if (pt.coTuCalo) {
    const mon = monTuId(pt.thucThe.monId) ?? monTuId(slot.monDangBan ?? undefined);
    if (!mon) {
      return {
        doanVan: ["Bạn muốn hỏi calo của món nào? Gõ tên món giúp Cokba nhé, VD: “Phở bò bao nhiêu calo?”"],
        the: [],
        khongTraLoiDuoc: true,
        lyDoKhongTraLoi: "Hỏi calo nhưng không nhận diện được món.",
        yDinh: "calo_mon",
        slotDaCapNhat: slot,
      };
    }
    const soNguoi = pt.soNguoi ?? slot.soNguoiAn ?? undefined;
    return traLoiCalo(mon, soNguoi, slot);
  }

  // Nguyên liệu + mẫu "có gì nấu nấy" tính trước: nếu câu vừa kê >= 2 nguyên
  // liệu vừa có mẫu này thì ưu tiên intent 2, tránh bị khớp tên món mơ hồ
  // (VD "có trứng gà, cà chua thì nấu được gì" trùng 3/4 từ của tên món).
  const nguyenLieuTimDuoc = pt.thucThe.nguyenLieu;
  const mauCoGiNauNay =
    chuaCum(khoa, "nau duoc gi") ||
    chuaCum(khoa, "lam duoc gi") ||
    chuaCum(khoa, "co the nau gi") ||
    chuaCum(khoa, "thi nau gi") ||
    chuaCum(khoa, "nau gi duoc") ||
    chuaCum(khoa, "minh co") ||
    chuaCum(khoa, "nha co") ||
    chuaCum(khoa, "tu lanh co");
  const uuTienCoGiNauNay = nguyenLieuTimDuoc.length >= 2 && mauCoGiNauNay;

  // --- Món cụ thể được nhắc rõ: intent 3 / 4 / tổng quan món ---
  const monThucThe = monTuId(pt.thucThe.monId);
  if (monThucThe && !pt.thucThe.monTuSlot && !uuTienCoGiNauNay) {
    if (
      chuaCum(khoa, "nguyen lieu") ||
      chuaCum(khoa, "can gi") ||
      chuaCum(khoa, "can nhung gi") ||
      chuaCum(khoa, "chuan bi gi") ||
      chuaCum(khoa, "can mua gi")
    ) {
      return traLoiNguyenLieuMon(monThucThe, pt.soNguoi, slot);
    }
    if (chuaCum(khoa, "cach lam") || chuaCum(khoa, "lam the nao") || chuaCum(khoa, "nau the nao") || chuaCum(khoa, "huong dan") || chuaCum(khoa, "nau sao") || chuaCum(khoa, "lam sao")) {
      return traLoiCachLam(monThucThe, slot);
    }
    // Nhắc tên món kèm số người -> hiểu là hỏi nguyên liệu theo số người đó.
    if (pt.soNguoi !== undefined) return traLoiNguyenLieuMon(monThucThe, pt.soNguoi, slot);
    slot.monDangBan = monThucThe.id;
    return {
      doanVan: [
        `${monThucThe.tieu_de}: ${monThucThe.mo_ta ?? "món này"} — tổng thời gian khoảng ${tongPhut(monThucThe)} phút, độ khó ${NHAN_DO_KHO[monThucThe.do_kho]}, công thức gốc cho ${monThucThe.khau_phan} người. Bạn muốn xem nguyên liệu hay để Cokba dẫn nấu luôn?`,
      ],
      the: [theMon(monThucThe)],
      goiY: [`Nguyên liệu món ${monThucThe.tieu_de}`, `Cách làm ${monThucThe.tieu_de}`],
      yDinh: "tong_quan_mon",
      slotDaCapNhat: slot,
    };
  }

  // --- "món đó" + số người (quay lui) -> nguyên liệu tính lại ---
  if (monThucThe && pt.thucThe.monTuSlot && pt.soNguoi !== undefined) {
    return traLoiNguyenLieuMon(monThucThe, pt.soNguoi, slot);
  }
  if (monThucThe && pt.thucThe.monTuSlot && (chuaCum(khoa, "nguyen lieu") || chuaCum(khoa, "can gi"))) {
    return traLoiNguyenLieuMon(monThucThe, pt.soNguoi, slot);
  }
  if (monThucThe && pt.thucThe.monTuSlot && (chuaCum(khoa, "cach lam") || chuaCum(khoa, "lam the nao"))) {
    return traLoiCachLam(monThucThe, slot);
  }

  // --- 6) Lộ trình người mới (trừ khi câu hỏi nhắc rõ một khóa cụ thể) ---
  if ((pt.laNguoiMoi || (chuaCum(khoa, "lo trinh") && chuaCum(khoa, "hoc"))) && !pt.thucThe.khoaHocId) {
    const coBan = duLieu.khoaHoc
      .filter((k) => k.cap_do === "co_ban")
      .sort((a, b) => {
        const diem = (kh: KhoaHocTroLy) =>
          (chuaCum(khoaChuanHoa(kh.tieu_de), "nguoi moi") || chuaCum(khoaChuanHoa(kh.tieu_de), "bat dau") ? 0 : 1) +
          (kh.mien_phi ? 0 : 0.5);
        return diem(a) - diem(b);
      });
    if (coBan.length === 0) {
      return {
        doanVan: ["Hiện chưa có khóa cấp cơ bản nào trong dữ liệu. Bạn xem tạm các khóa đang có nhé."],
        the: duLieu.khoaHoc.slice(0, 3).map((k) => theKhoaHoc(k, duLieu)),
        khongTraLoiDuoc: true,
        lyDoKhongTraLoi: "Không có khóa cap_do = co_ban cho lộ trình người mới.",
        yDinh: "lo_trinh_nguoi_moi",
        slotDaCapNhat: slot,
      };
    }
    slot.khoaDangBan = coBan[0].id;
    return {
      doanVan: [
        `Chào bạn mới vào bếp! Cokba gợi ý bắt đầu với các khóa cấp Cơ bản dưới đây — khóa đầu tiên là nền tảng nhất, học xong bạn cứ đi tiếp theo thứ tự Cokba xếp. Giá/miễn phí ghi rõ trên từng thẻ:`,
      ],
      the: coBan.slice(0, 3).map((k) => theKhoaHoc(k, duLieu)),
      goiY: ["Có khóa miễn phí không?", "Khóa đầu tiên gồm những bài gì?"],
      yDinh: "lo_trinh_nguoi_moi",
      slotDaCapNhat: slot,
    };
  }

  // --- Khóa cụ thể: 8) gồm những bài gì / "khóa đó của ai" / tổng quan ---
  const khoaThucThe = pt.thucThe.khoaHocId ? chiMuc.khoaHocTheoId.get(pt.thucThe.khoaHocId) : undefined;
  if (khoaThucThe) {
    if (chuaCum(khoa, "ai day") || chuaCum(khoa, "cua ai") || chuaCum(khoa, "dau bep nao")) {
      const bep = duLieu.dauBep.find((d) => d.id === khoaThucThe.dau_bep_id);
      slot.khoaDangBan = khoaThucThe.id;
      if (bep) slot.dauBepDangBan = bep.id;
      return {
        doanVan: [
          bep
            ? `Khóa "${khoaThucThe.tieu_de}" do đầu bếp ${bep.ho_ten} phụ trách.`
            : `Cokba chưa rõ đầu bếp phụ trách khóa "${khoaThucThe.tieu_de}".`,
        ],
        the: bep ? [theDauBep(bep, duLieu), theKhoaHoc(khoaThucThe, duLieu)] : [theKhoaHoc(khoaThucThe, duLieu)],
        yDinh: "ho_so_dau_bep",
        slotDaCapNhat: slot,
      };
    }
    if (
      chuaCum(khoa, "may bai") ||
      chuaCum(khoa, "gom") ||
      chuaCum(khoa, "hoc nhung gi") ||
      chuaCum(khoa, "bai hoc") ||
      chuaCum(khoa, "noi dung") ||
      chuaCum(khoa, "co bai gi")
    ) {
      slot.khoaDangBan = khoaThucThe.id;
      const bai = [...khoaThucThe.bai_hoc].sort((a, b) => a.thu_tu - b.thu_tu);
      const tongPhutKhoa = bai.reduce((s, b) => s + (b.thoi_gian_phut || 0), 0);
      const dong = bai.map((b, i) => `${i + 1}. ${b.tieu_de}${b.thoi_gian_phut ? ` (${b.thoi_gian_phut} phút)` : ""}`);
      return {
        doanVan: [
          `Khóa "${khoaThucThe.tieu_de}" gồm ${bai.length} bài học${tongPhutKhoa ? `, tổng khoảng ${tongPhutKhoa} phút` : ""}:`,
          ...dong,
        ],
        the: [theKhoaHoc(khoaThucThe, duLieu)],
        yDinh: "khoa_gom_gi",
        slotDaCapNhat: slot,
      };
    }
    slot.khoaDangBan = khoaThucThe.id;
    const bep = duLieu.dauBep.find((d) => d.id === khoaThucThe.dau_bep_id);
    return {
      doanVan: [
        `Khóa "${khoaThucThe.tieu_de}": cấp độ ${NHAN_CAP_DO[khoaThucThe.cap_do]}, ${giaCuaKhoa(khoaThucThe)}, gồm ${khoaThucThe.bai_hoc.length || khoaThucThe.so_bai_hoc} bài học${bep ? `, do đầu bếp ${bep.ho_ten} phụ trách` : ""}. ${khoaThucThe.mo_ta ?? ""}`,
      ],
      the: [theKhoaHoc(khoaThucThe, duLieu)],
      goiY: [`Khóa ${khoaThucThe.tieu_de} gồm những bài gì?`],
      yDinh: "khoa_theo_nhu_cau",
      slotDaCapNhat: slot,
    };
  }

  // --- 10) Hồ sơ đầu bếp cụ thể ---
  const bepThucThe = pt.thucThe.dauBepId ? chiMuc.dauBepTheoId.get(pt.thucThe.dauBepId) : undefined;
  if (bepThucThe && (chuaCum(khoa, "dau bep") || chuaCum(khoa, "bep") || chuaCum(khoa, "ai"))) {
    slot.dauBepDangBan = bepThucThe.id;
    const monCuaBep = duLieu.congThuc.filter((m) => m.tac_gia_id === bepThucThe.id);
    const khoaCuaBep = duLieu.khoaHoc.filter((k) => k.dau_bep_id === bepThucThe.id);
    const baiCuaBep = duLieu.baiViet.filter(
      (b) => b.tac_gia_id === bepThucThe.id && chiMuc.baiVietTheoId.has(b.id)
    );
    // Nếu câu hỏi nhắc rõ "khóa" -> ưu tiên trả khóa của bếp.
    if (chuaCum(khoa, "khoa") && !chuaCum(khoa, "mon")) {
      // Ghép tự do: câu có thêm cấp độ / miễn phí thì lọc khóa của bếp theo
      // đúng tiêu chí đó (vòng rèn luyện 1: "khóa nâng cao của bếp Tùng"
      // trước đây trả cả khóa trung cấp của bếp).
      let khoaLoc = khoaCuaBep;
      if (pt.boLoc.capDo) khoaLoc = khoaLoc.filter((k) => k.cap_do === pt.boLoc.capDo);
      if (pt.boLoc.mienPhi) khoaLoc = khoaLoc.filter((k) => k.mien_phi || k.gia === 0);
      const khoaTra = khoaLoc.length > 0 ? khoaLoc : khoaCuaBep;
      return {
        doanVan: [
          `Đầu bếp ${bepThucThe.ho_ten} đang phụ trách ${khoaTra.length} khóa học trên Học Nấu Ăn:`,
        ],
        the: [theDauBep(bepThucThe, duLieu), ...khoaTra.slice(0, 3).map((k) => theKhoaHoc(k, duLieu))],
        yDinh: "ho_so_dau_bep",
        slotDaCapNhat: slot,
      };
    }
    return {
      doanVan: [
        `Đầu bếp ${bepThucThe.ho_ten}${bepThucThe.bio ? ` — ${bepThucThe.bio}` : ""}. Trên Học Nấu Ăn, đầu bếp có ${monCuaBep.length} công thức, ${khoaCuaBep.length} khóa học và ${baiCuaBep.length} bài viết. Cokba để thẻ đầu bếp kèm các nội dung nổi bật ở dưới nhé:`,
      ],
      the: [
        theDauBep(bepThucThe, duLieu),
        ...monCuaBep.slice(0, 2).map((m) => theMon(m)),
        ...khoaCuaBep.slice(0, 2).map((k) => theKhoaHoc(k, duLieu)),
      ],
      yDinh: "ho_so_dau_bep",
      slotDaCapNhat: slot,
    };
  }

  // (Vòng rèn luyện 1: khối hỏi đầu bếp/khóa/bài theo nhu cầu được xét
  // TRƯỚC intent nguyên liệu — trước đây câu "đầu bếp nào dạy làm bánh?"
  // bị nguyên liệu "bánh tráng" khớp theo 1 từ cướp mất intent.)
  // --- 9) Đầu bếp theo chuyên môn / 7) khóa theo nhu cầu ---
  const hoiDauBep =
    chuaCum(khoa, "dau bep nao") || chuaCum(khoa, "ai day") || chuaCum(khoa, "ai la dau bep");
  const hoiKhoa = chuaCum(khoa, "khoa") || chuaCum(khoa, "lop hoc");
  if (hoiDauBep || (hoiKhoa && (pt.boLoc.mienPhi || pt.boLoc.capDo || pt.thucThe.dauBepId))) {
    if (hoiDauBep) {
      // Khớp chuyên môn: tìm từ khóa trong câu xuất hiện trong bio của bếp
      // hoặc trong tiêu đề nội dung của bếp.
      const tuCau = tachTu(khoa).filter((t) => t.length >= 3 && !TU_DUNG.has(t));
      const chamBep = (db: DauBepTroLy): number => {
        const vanBan = khoaChuanHoa(
          (db.bio ?? "") +
            " " +
            duLieu.congThuc.filter((m) => m.tac_gia_id === db.id).map((m) => m.tieu_de).join(" ") +
            " " +
            duLieu.khoaHoc.filter((k) => k.dau_bep_id === db.id).map((k) => k.tieu_de).join(" ")
        );
        return tuCau.reduce((d, t) => d + (vanBan.includes(t) ? 1 : 0), 0);
      };
      const xep = duLieu.dauBep
        .map((db) => ({ db, diem: chamBep(db) }))
        .filter((x) => x.diem > 0)
        .sort((a, b) => b.diem - a.diem);
      if (xep.length > 0) {
        slot.dauBepDangBan = xep[0].db.id;
        return {
          doanVan: [`Theo chuyên môn bạn hỏi, Cokba gợi ý các đầu bếp sau:`],
          the: xep.slice(0, 3).map((x) => theDauBep(x.db, duLieu)),
          yDinh: "dau_bep_theo_chuyen_mon",
          slotDaCapNhat: slot,
        };
      }
    }
    if (hoiKhoa) {
      let ds = duLieu.khoaHoc;
      if (pt.boLoc.mienPhi) ds = ds.filter((k) => k.mien_phi || k.gia === 0);
      if (pt.boLoc.capDo) ds = ds.filter((k) => k.cap_do === pt.boLoc.capDo);
      if (pt.thucThe.dauBepId) ds = ds.filter((k) => k.dau_bep_id === pt.thucThe.dauBepId);
      if (ds.length > 0) {
        slot.khoaDangBan = ds[0].id;
        return {
          doanVan: [`Cokba tìm thấy ${ds.length} khóa học khớp với nhu cầu của bạn:`],
          the: ds.slice(0, 4).map((k) => theKhoaHoc(k, duLieu)),
          yDinh: "khoa_theo_nhu_cau",
          slotDaCapNhat: slot,
        };
      }
    }
  }

  // --- 7b) Khóa theo chủ đề (từ khóa khớp tiêu đề/mô tả khóa) ---
  if (hoiKhoa) {
    const tuCau = tachTu(khoa).filter((t) => t.length >= 3 && !TU_DUNG.has(t));
    const chamKhoa = (kh: KhoaHocTroLy): number => {
      const td = khoaChuanHoa(kh.tieu_de);
      const nd = khoaChuanHoa((kh.mo_ta ?? "") + " " + (kh.mo_ta_chi_tiet ?? ""));
      return tuCau.reduce((d, t) => d + (td.includes(t) ? 3 : 0) + (nd.includes(t) ? 1 : 0), 0);
    };
    const xep = duLieu.khoaHoc
      .map((kh) => ({ kh, diem: chamKhoa(kh) }))
      .filter((x) => x.diem > 0)
      .sort((a, b) => b.diem - a.diem);
    if (xep.length > 0) {
      slot.khoaDangBan = xep[0].kh.id;
      return {
        doanVan: [`Các khóa học liên quan đến nhu cầu của bạn:`],
        the: xep.slice(0, 4).map((x) => theKhoaHoc(x.kh, duLieu)),
        yDinh: "khoa_theo_nhu_cau",
        slotDaCapNhat: slot,
      };
    }
  }

  // --- 11) Bài viết theo chủ đề ---
  if (chuaCum(khoa, "bai viet") || chuaCum(khoa, "bai nao") || chuaCum(khoa, "co bai") || pt.thucThe.baiVietId) {
    const baiThucThe = pt.thucThe.baiVietId ? chiMuc.baiVietTheoId.get(pt.thucThe.baiVietId) : undefined;
    if (baiThucThe) {
      slot.baiVietDangBan = baiThucThe.id;
      return {
        doanVan: [`Đây là bài viết bạn hỏi: "${baiThucThe.tieu_de}". ${baiThucThe.tom_tat ?? tomTatTuNoiDung(baiThucThe) ?? ""}`],
        the: [theBaiViet(baiThucThe)],
        yDinh: "bai_theo_chu_de",
        slotDaCapNhat: slot,
      };
    }
    const tuCau = tachTu(khoa).filter((t) => t.length >= 3 && !TU_DUNG.has(t));
    const chamBai = (bv: BaiVietTroLy): number => {
      const td = khoaChuanHoa(bv.tieu_de);
      const nd = khoaChuanHoa((bv.tom_tat ?? "") + " " + (bv.noi_dung ?? ""));
      return tuCau.reduce((d, t) => d + (td.includes(t) ? 3 : 0) + (nd.includes(t) ? 1 : 0), 0);
    };
    const xep = duLieu.baiViet
      .filter((b) => chiMuc.baiVietTheoId.has(b.id))
      .map((bv) => ({ bv, diem: chamBai(bv) }))
      .filter((x) => x.diem > 0)
      .sort((a, b) => b.diem - a.diem);
    if (xep.length > 0) {
      slot.baiVietDangBan = xep[0].bv.id;
      return {
        doanVan: [`Cokba tìm thấy ${xep.length} bài viết liên quan:`],
        the: xep.slice(0, 3).map((x) => theBaiViet(x.bv)),
        yDinh: "bai_theo_chu_de",
        slotDaCapNhat: slot,
      };
    }
    return {
      doanVan: [
        "Cokba chưa tìm thấy bài viết nào khớp chủ đề bạn hỏi trong kho bài hiện có. Bạn thử diễn đạt ngắn hơn, VD chỉ gõ chủ đề chính nhé.",
      ],
      the: [],
      khongTraLoiDuoc: true,
      lyDoKhongTraLoi: `Không có bài viết khớp chủ đề của câu: "${cauHoi}".`,
      goiY: goiYMacDinh,
      yDinh: "bai_theo_chu_de",
      slotDaCapNhat: slot,
    };
  }

  // --- 2) Có gì nấu nấy (đa nguyên liệu) ---
  if (nguyenLieuTimDuoc.length >= 2 || (nguyenLieuTimDuoc.length >= 1 && mauCoGiNauNay)) {
    slot.nguyenLieuDangCo = nguyenLieuTimDuoc.map((n) => n.ten);
    slot.nguyenLieuTruyVanGanNhat = nguyenLieuTimDuoc.map((n) => n.khoa);
    if (slot.giaViDaXacNhan === null) {
      return {
        doanVan: [
          `Bạn đang có: ${slot.nguyenLieuDangCo.join(", ")}. Trước khi gợi ý món, cho Cokba hỏi để tính đúng phần trăm khớp: Nhà bạn có đầy đủ các gia vị cơ bản này không? (chọn những gia vị nhà đang CÓ, rồi bấm xác nhận giúp Cokba nhé)`,
        ],
        the: [],
        canHoiGiaVi: true,
        danhSachGiaViDeHoi: [...GIA_VI_CO_BAN],
        yDinh: "co_gi_nau_nay",
        slotDaCapNhat: slot,
      };
    }
    const ketQua = chamDiemTatCa(duLieu.congThuc, {
      nguyenLieuNguoiDung: slot.nguyenLieuDangCo,
      giaViDaXacNhan: slot.giaViDaXacNhan,
    }).slice(0, 5);
    if (ketQua.length === 0) {
      return {
        doanVan: [
          `Với ${slot.nguyenLieuDangCo.join(", ")}, Cokba chưa tìm thấy món nào khớp trong dữ liệu hiện có. Bạn thử thêm nguyên liệu khác xem sao nhé.`,
        ],
        the: [],
        khongTraLoiDuoc: true,
        lyDoKhongTraLoi: `Không món nào khớp với nguyên liệu: ${slot.nguyenLieuDangCo.join(", ")}.`,
        yDinh: "co_gi_nau_nay",
        slotDaCapNhat: slot,
      };
    }
    slot.danhSachVuaXem = ketQua.map((k) => k.congThuc.id);
    slot.monDangBan = ketQua[0].congThuc.id;
    return {
      doanVan: [
        `Với tủ bếp hiện tại, Cokba chấm điểm khớp cho từng món như sau (món khớp nhất xếp trước, còn thiếu gì Cokba ghi ngay trên thẻ):`,
      ],
      the: ketQua.map((k) =>
        theMon(k.congThuc, {
          diemKhop: k.phanTramKhop,
          thieu: [...k.thieuChinh, ...k.thieuGiaVi],
          meta: [
            `Khớp ${k.phanTramKhop}%`,
            ...(k.thieuChinh.length ? [`Thiếu chính: ${k.thieuChinh.join(", ")}`] : []),
            ...(k.thieuGiaVi.length ? [`Thiếu gia vị: ${k.thieuGiaVi.join(", ")}`] : []),
          ],
        })
      ),
      goiY: ["Còn món khác không?"],
      yDinh: "co_gi_nau_nay",
      slotDaCapNhat: slot,
    };
  }

  // --- 1) Món theo MỘT nguyên liệu (+ bộ lọc ghép tự do nếu có) ---
  if (nguyenLieuTimDuoc.length === 1) {
    const nl = nguyenLieuTimDuoc[0];
    const ids = monCoNguyenLieu(chiMuc, nl.khoa);
    const danhSach = ids
      .map((id) => chiMuc.monTheoId.get(id)!)
      .filter((m) => apLocMon(m, pt.boLoc));
    const coBoLoc = pt.boLoc.doKho || pt.boLoc.thoiGianToiDa || pt.boLoc.danhMucMonKhoa;
    slot.nguyenLieuDangCo = [nl.ten];
    slot.nguyenLieuTruyVanGanNhat = [nl.khoa];
    if (danhSach.length === 0) {
      return {
        doanVan: [
          coBoLoc
            ? `Có món làm bằng ${nl.ten}, nhưng không món nào thỏa thêm điều kiện bạn nêu. Cokba liệt kê tất cả món có ${nl.ten} để bạn xem nhé:`
            : `Cokba chưa tìm thấy món nào làm bằng ${nl.ten} trong dữ liệu hiện có.`,
        ],
        the: coBoLoc ? ids.slice(0, 5).map((id) => theMon(chiMuc.monTheoId.get(id)!)) : [],
        khongTraLoiDuoc: !coBoLoc,
        lyDoKhongTraLoi: coBoLoc ? undefined : `Không có món nào dùng nguyên liệu "${nl.ten}".`,
        yDinh: "mon_theo_nguyen_lieu",
        slotDaCapNhat: slot,
      };
    }
    const hienThi = danhSach.slice(0, 3);
    slot.danhSachVuaXem = hienThi.map((m) => m.id);
    slot.monDangBan = hienThi[0].id;
    return {
      doanVan: [
        `Cokba tìm thấy ${danhSach.length} món làm bằng ${nl.ten}${coBoLoc ? " thỏa điều kiện bạn nêu" : ""}:`,
      ],
      the: hienThi.map((m) => theMon(m)),
      goiY: danhSach.length > 3 ? ["Còn món khác không?"] : undefined,
      yDinh: "mon_theo_nguyen_lieu",
      slotDaCapNhat: slot,
    };
  }

  // --- 5) Món theo tiêu chí (không có nguyên liệu/món cụ thể) ---
  if (pt.boLoc.doKho || pt.boLoc.thoiGianToiDa || pt.boLoc.danhMucMonKhoa) {
    const ds = duLieu.congThuc.filter((m) => apLocMon(m, pt.boLoc));
    if (ds.length > 0) {
      slot.danhSachVuaXem = ds.slice(0, 3).map((m) => m.id);
      slot.monDangBan = ds[0].id;
      return {
        doanVan: [`Cokba lọc được ${ds.length} món thỏa tiêu chí của bạn:`],
        the: ds.slice(0, 3).map((m) => theMon(m)),
        yDinh: "mon_theo_tieu_chi",
        slotDaCapNhat: slot,
      };
    }
    return {
      doanVan: ["Không món nào thỏa đúng tất cả tiêu chí bạn nêu. Bạn nới bớt một điều kiện (VD tăng thời gian) rồi hỏi lại Cokba nhé."],
      the: [],
      khongTraLoiDuoc: true,
      lyDoKhongTraLoi: `Lọc món theo tiêu chí rỗng cho câu: "${cauHoi}".`,
      goiY: goiYMacDinh,
      yDinh: "mon_theo_tieu_chi",
      slotDaCapNhat: slot,
    };
  }

  // --- Dự phòng: tìm kiếm toàn văn 4 miền ---
  const lienQuan = timKiemToanVan(duLieu, chiMuc, khoa);
  if (lienQuan.length > 0) {
    const theDau = lienQuan[0];
    if (theDau.loai === "mon") slot.monDangBan = theDau.id;
    if (theDau.loai === "khoaHoc") slot.khoaDangBan = theDau.id;
    if (theDau.loai === "dauBep") slot.dauBepDangBan = theDau.id;
    if (theDau.loai === "baiViet") slot.baiVietDangBan = theDau.id;
    return {
      doanVan: ["Cokba tìm thấy các mục liên quan này trong Học Nấu Ăn, bạn xem có đúng ý mình không nhé:"],
      the: lienQuan,
      goiY: goiYMacDinh,
      yDinh: "tim_kiem_toan_van",
      slotDaCapNhat: slot,
    };
  }

  // --- Ngoài phạm vi / không ghép được ý ---
  return {
    doanVan: [
      "Câu này Cokba chưa trả lời được — Cokba chỉ rành chuyện trong bếp của Học Nấu Ăn thôi: công thức, khóa học, đầu bếp và bài viết ẩm thực. Bạn thử hỏi Cokba theo một trong các mẫu dưới đây nhé.",
    ],
    the: [],
    goiY: goiYMacDinh,
    ngoaiPhamVi: true,
    khongTraLoiDuoc: true,
    lyDoKhongTraLoi: `Không ghép được ý / ngoài phạm vi cho câu: "${cauHoi}".`,
    yDinh: "ngoai_pham_vi",
    slotDaCapNhat: slot,
  };
}

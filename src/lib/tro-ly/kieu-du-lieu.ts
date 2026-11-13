// Kiểu dữ liệu dùng chung cho bộ não trợ lý bếp "Cokba" (Đợt 2).
// Các kiểu này khớp schema DB thật của dự án (bảng cong_thuc, khoa_hoc,
// bai_hoc, bai_viet, profiles) nhưng đã được rút gọn thành dạng "phẳng",
// sẵn sàng cho các hàm thuần xử lý: nguyen_lieu/cac_buoc đã parse từ JSON,
// khóa học đã kèm danh sách bài học, công thức đã kèm tên danh mục.

/** Một nguyên liệu trong công thức — khớp zod nguyenLieuSchema của dự án. */
export interface NguyenLieuMon {
  ten: string;
  so_luong: number;
  don_vi: string;
}

/** Một bước nấu trong công thức — khớp zod buocNauSchema của dự án. */
export interface BuocNauMon {
  thu_tu: number;
  noi_dung: string;
  anh?: string | null;
}

export type DoKhoMon = "de" | "trung_binh" | "kho";
export type CapDoKhoa = "co_ban" | "trung_cap" | "nang_cao";

export interface CongThucTroLy {
  id: string;
  tieu_de: string;
  slug: string;
  mo_ta: string | null;
  nguyen_lieu: NguyenLieuMon[];
  cac_buoc: BuocNauMon[];
  thoi_gian_chuan_bi: number; // phút
  thoi_gian_nau: number; // phút
  khau_phan: number; // số người ăn của công thức gốc
  do_kho: DoKhoMon;
  anh_dai_dien: string | null;
  calories: number | null; // calo cho TOÀN BỘ công thức gốc (khau_phan người)
  tac_gia_id: string;
  danh_muc: string[]; // tên danh mục hiển thị, VD ["Món chính", "Món chay"]
  danh_muc_slug: string[];
}

export interface BaiHocTroLy {
  id: string;
  tieu_de: string;
  mo_ta: string | null;
  thoi_gian_phut: number;
  thu_tu: number;
  xem_truoc: boolean;
}

export interface KhoaHocTroLy {
  id: string;
  tieu_de: string;
  slug: string;
  mo_ta: string | null;
  mo_ta_chi_tiet: string | null;
  anh_dai_dien: string | null;
  cap_do: CapDoKhoa;
  gia: number;
  mien_phi: boolean;
  dau_bep_id: string;
  tong_thoi_gian: number; // phút (trường sẵn có của bảng khoa_hoc)
  so_bai_hoc: number;
  bai_hoc: BaiHocTroLy[]; // đã sắp theo thu_tu tăng dần
}

export interface BaiVietTroLy {
  id: string;
  tieu_de: string;
  slug: string;
  tom_tat: string | null;
  noi_dung: string | null;
  anh_dai_dien: string | null;
  tac_gia_id: string;
  danh_muc: string | null;
}

export interface DauBepTroLy {
  id: string; // = profiles.id của người dùng vai trò chef
  ho_ten: string;
  avatar_url: string | null;
  bio: string | null;
}

/** Toàn bộ dữ liệu Cokba được phép tra cứu — chỉ 4 miền của web. */
export interface DuLieuTroLy {
  congThuc: CongThucTroLy[];
  khoaHoc: KhoaHocTroLy[];
  baiViet: BaiVietTroLy[];
  dauBep: DauBepTroLy[];
}

// ---------------------------------------------------------------------------
// Trí nhớ phiên (slot) — mục 1.7 của kế hoạch. UI lưu slot này (localStorage
// cho khách, bảng tro_ly_tri_nho cho tài khoản ở Đợt 3) và truyền lại vào
// mỗi lượt hỏi; tra-loi.ts trả về slot MỚI trong CauTraLoi.slotDaCapNhat.
// ---------------------------------------------------------------------------

export interface SlotTriNho {
  /** id công thức đang bàn gần nhất ("món đó" trỏ về đây). */
  monDangBan?: string | null;
  /** Số người ăn đã biết trong phiên — biết rồi thì KHÔNG hỏi lại. */
  soNguoiAn?: number | null;
  /** Tên nguyên liệu (dạng hiển thị) người dùng nói là đang có. */
  nguyenLieuDangCo: string[];
  /**
   * Gia vị cơ bản người dùng đã xác nhận là CÓ ở nhà.
   * null = CHƯA hỏi/xác nhận lần nào trong phiên -> intent "có gì nấu nấy"
   * phải trả cờ canHoiGiaVi thay vì tự giả định. [] = đã hỏi, nhà không có
   * gia vị nào trong danh sách.
   */
  giaViDaXacNhan: string[] | null;
  khoaDangBan?: string | null;
  dauBepDangBan?: string | null;
  baiVietDangBan?: string | null;
  /** Món đang nấu ở chế độ nấu rảnh tay (Đợt 4 dùng). */
  monDangNau?: string | null;
  buocHienTai?: number | null;

  // --- Slot phụ cho ngữ cảnh quay lui (thiết kế thêm ở Đợt 2) ---
  /** id các món vừa được trả trong truy vấn nguyên liệu gần nhất. */
  danhSachVuaXem: string[];
  /** Khóa đã thường hóa của các nguyên liệu trong truy vấn gần nhất —
   *  để "còn món khác không" chạy lại đúng truy vấn đó, trừ món đã xem. */
  nguyenLieuTruyVanGanNhat: string[];
  /** Đang chờ người dùng trả lời số người ăn cho món này (luật calo /
   *  nguyên liệu): lượt sau nếu chỉ gõ một con số thì hiểu là số người. */
  choSoNguoiAnChoMon?: string | null;
}

export function taoSlotTrong(): SlotTriNho {
  return {
    monDangBan: null,
    soNguoiAn: null,
    nguyenLieuDangCo: [],
    giaViDaXacNhan: null,
    khoaDangBan: null,
    dauBepDangBan: null,
    baiVietDangBan: null,
    monDangNau: null,
    buocHienTai: null,
    danhSachVuaXem: [],
    nguyenLieuTruyVanGanNhat: [],
    choSoNguoiAnChoMon: null,
  };
}

// ---------------------------------------------------------------------------
// Câu trả lời có cấu trúc — Đợt 3 (UI) render đúng kiểu này.
// ---------------------------------------------------------------------------

export type LoaiThe = "mon" | "khoaHoc" | "baiViet" | "dauBep";

/** Hành động UI gắn lên thẻ: xem chi tiết / bắt đầu nấu / đọc bài... */
export type HanhDongThe =
  | "xem" // mở trang chi tiết của thẻ
  | "nauMonNay" // vào chế độ nấu rảnh tay (chỉ thẻ món)
  | "docBai" // mở bài viết (chỉ thẻ bài)
  | "xemKhoa" // mở khóa học (chỉ thẻ khóa)
  | "xemDauBep"; // mở hồ sơ đầu bếp (chỉ thẻ đầu bếp)

export interface TheHienThi {
  loai: LoaiThe;
  id: string;
  tieuDe: string;
  slug?: string;
  anh?: string | null;
  /** Các dòng meta ngắn hiển thị dưới tiêu đề, VD ["25 phút", "Dễ", "4 người"]. */
  meta: string[];
  moTa?: string | null;
  hanhDong: HanhDongThe[];
  /** Chỉ thẻ món từ intent khớp nguyên liệu: % khớp 0–100. */
  diemKhop?: number;
  /** Chỉ thẻ món từ intent khớp nguyên liệu: nguyên liệu còn thiếu. */
  thieu?: string[];
}

export interface CauTraLoi {
  /** Các đoạn văn bản trả lời (mỗi phần tử = 1 đoạn/bong bóng). */
  doanVan: string[];
  the: TheHienThi[];
  /** Câu hỏi gợi ý bấm nhanh cho lượt tiếp theo. */
  goiY?: string[];
  /**
   * true khi intent "có gì nấu nấy" chưa chạy được vì chưa xác nhận gia vị:
   * UI phải hiện checklist gia vị (danhSachGiaViDeHoi) cho người dùng tích.
   */
  canHoiGiaVi?: boolean;
  danhSachGiaViDeHoi?: string[];
  /** true khi câu hỏi nằm ngoài 4 miền nội dung của web. */
  ngoaiPhamVi?: boolean;
  /**
   * true khi Cokba không trả lời được (không ghép được ý / thiếu dữ liệu) —
   * Đợt 3 ghi các câu này vào nhật ký cau_hoi_chua_tra_loi kèm lyDo.
   */
  khongTraLoiDuoc?: boolean;
  lyDoKhongTraLoi?: string;
  /**
   * Luật calo/nguyên liệu: chưa biết số người ăn -> choSoNguoiAn = true và
   * monChoSoNguoiAn = id món đang chờ; UI/slot giữ trạng thái này, lượt sau
   * người dùng gõ số người thì tra-loi tự tính tiếp cho đúng món đó.
   */
  choSoNguoiAn?: boolean;
  monChoSoNguoiAn?: string;
  /** Tên ý định đã nhận diện (để ghi log/debug), VD "calo", "co_gi_nau_nay". */
  yDinh?: string;
  /** Slot MỚI sau lượt hỏi này — UI bắt buộc lưu đè bằng slot này. */
  slotDaCapNhat: SlotTriNho;
}

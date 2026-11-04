// Tiện ích quản lý gói Premium (Pro Tháng & Pro Năm)

export type MaGoi = "pro_thang" | "pro_nam";

export type ThongTinGoi = {
  ma_goi: MaGoi;
  ten: string;
  mo_ta: string;
  thoi_han_ngay: number;
  gia: number;
  gia_goc?: number;
  tiet_kiem?: string;
  badge?: string;
  noi_bat?: boolean;
};

export const DANH_SACH_GOI: ThongTinGoi[] = [
  {
    ma_goi: "pro_thang",
    ten: "Pro Tháng",
    mo_ta: "Trải nghiệm trọn vẹn toàn bộ tính năng cao cấp trong 30 ngày.",
    thoi_han_ngay: 30,
    gia: 99000,
    badge: "Dùng thử linh hoạt",
    noi_bat: false,
  },
  {
    ma_goi: "pro_nam",
    ten: "Pro Năm",
    mo_ta: "Gói tiết kiệm 33% chi phí, thỏa sức nấu nướng và nhận chứng chỉ trọn năm.",
    thoi_han_ngay: 365,
    gia: 799000,
    gia_goc: 1188000,
    tiet_kiem: "Tiết kiệm 33%",
    badge: "Phổ biến nhất",
    noi_bat: true,
  },
];

export const QUYEN_LOI_PRO = [
  {
    id: "xem_video_hd",
    ten: "Xem video HD 1080p sắc nét",
    mo_ta: "Thưởng thức từng khung hình góc quay chi tiết từng kỹ thuật dùng dao, nêm nếm.",
    icon: "Video",
  },
  {
    id: "tai_tai_lieu",
    ten: "Tải tài liệu công thức độc quyền (PDF)",
    mo_ta: "Lưu trữ cẩm nang dinh dưỡng, bảng định lượng gia vị về máy để tra cứu offline.",
    icon: "FileDown",
  },
  {
    id: "lam_bai_tap",
    ten: "Làm bài tập trắc nghiệm có chấm điểm",
    mo_ta: "Kiểm tra kiến thức sau mỗi bài học để củng cố kỹ năng làm bếp vững chắc.",
    icon: "HelpCircle",
  },
  {
    id: "nhan_chung_chi",
    ten: "Nhận chứng chỉ tốt nghiệp (PDF + mã QR)",
    mo_ta: "Chứng nhận hoàn thành khóa học từ bếp trưởng có thể xác thực trực tuyến.",
    icon: "Award",
  },
  {
    id: "tao_cong_thuc",
    ten: "Quyền đăng tải công thức chia sẻ cộng đồng",
    mo_ta: "Trở thành người sáng tạo nội dung ẩm thực, chia sẻ bí quyết gia đình cho mọi người.",
    icon: "PlusCircle",
  },
  {
    id: "profile_nang_cap",
    ten: "Huy hiệu Pro vương miện vàng",
    mo_ta: "Hồ sơ cá nhân chuyên nghiệp, nổi bật trên bình luận và bảng xếp hạng cộng đồng.",
    icon: "Crown",
  },
  {
    id: "ho_tro_1_1",
    ten: "Hỗ trợ 1-1 chuyên sâu cùng đầu bếp",
    mo_ta: "Giải đáp thắc mắc về kỹ thuật làm bánh, cân bằng hương vị trực tiếp với bếp trưởng.",
    icon: "Headphones",
  },
  {
    id: "khong_quang_cao",
    ten: "Trải nghiệm học tập không quảng cáo",
    mo_ta: "Giao diện tinh gọn, tập trung 100% vào việc rèn luyện tay nghề làm bếp.",
    icon: "Sparkles",
  },
];

// So sánh chi tiết quyền lợi Free vs Pro
export const SO_SANH_QUYEN_LOI = [
  { tieu_de: "Xem công thức & nguyên liệu cơ bản", free: true, pro: true },
  { tieu_de: "Lưu công thức & bộ sưu tập", free: true, pro: true },
  { tieu_de: "Bình luận & đánh giá sao", free: true, pro: true },
  { tieu_de: "Xem video bài học xem thử (Preview)", free: true, pro: true },
  { tieu_de: "Xem trọn bộ video bài học chất lượng cao 1080p", free: false, pro: true },
  { tieu_de: "Tải cẩm nang & công thức chuẩn PDF", free: false, pro: true },
  { tieu_de: "Làm bài tập & kiểm tra tay nghề có chấm điểm", free: false, pro: true },
  { tieu_de: "Nhận chứng chỉ tốt nghiệp khóa học (kèm mã QR)", free: false, pro: true },
  { tieu_de: "Đăng tải công thức nấu ăn cá nhân", free: false, pro: true },
  { tieu_de: "Huy hiệu Pro vương miện vàng trên hồ sơ", free: false, pro: true },
  { tieu_de: "Hỗ trợ kỹ thuật 1-1 với bếp trưởng", free: false, pro: true },
  { tieu_de: "Trải nghiệm hoàn toàn không quảng cáo", free: false, pro: true },
];

/**
 * Kiểm tra xem người dùng có quyền Pro còn hiệu lực hay không
 */
export function laProHopLe(profile?: { la_pro?: boolean | null; goi_het_han?: string | null } | null): boolean {
  if (!profile || !profile.la_pro) return false;
  if (!profile.goi_het_han) return false; // Luôn bắt buộc có ngày hết hạn
  return new Date(profile.goi_het_han) > new Date();
}

/**
 * Tính ngày hết hạn dựa theo số ngày thời hạn và mốc bắt đầu
 */
export function tinhNgayHetHan(thoiHanNgay: number, ngayBatDau?: Date | string | null): Date {
  const base = ngayBatDau ? new Date(ngayBatDau) : new Date();
  const start = base > new Date() ? base : new Date();
  const res = new Date(start);
  res.setDate(res.getDate() + thoiHanNgay);
  return res;
}

/**
 * Định dạng tiền tệ VND
 */
export function formatGiaVND(gia: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(gia);
}

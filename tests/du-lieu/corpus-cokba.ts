// Ngân hàng câu hỏi rèn luyện Cokba (Đợt 5A) — 151 mục / 168 lượt hỏi,
// viết trên THỰC THỂ THẬT của DB live (16 công thức xuất bản, 12 khóa,
// 16 bài viết thật, 6 đầu bếp — số liệu đo ngày 2026-11-14).
// Mọi số trong chuaChuoi đều được tính tay từ dữ liệu thật (phép tính ghi
// ở ghiChu): calo/người = làm tròn(calories / khau_phan), tổng = calo/người
// × số người (đúng công thức engine tra-loi.ts dùng); nguyên liệu chia theo
// chia-khau-phan.ts (g/ml bội 5, đơn vị đếm bội 0,5, "con" tròn lên).

import type { SlotTriNho } from "../../src/lib/tro-ly/kieu-du-lieu";

export type NhomCorpus =
  | "viet_tay"
  | "dien_dat_lai"
  | "khong_dau"
  | "ghep_dieu_kien"
  | "chuoi_tri_nho"
  | "ngoai_pham_vi";

export interface KyVongCokba {
  loaiThe?: "mon" | "khoaHoc" | "baiViet" | "dauBep";
  chuaTieuDe?: string;
  soTheToiThieu?: number;
  soTheToiDa?: number;
  coCo?: "canHoiGiaVi" | "choSoNguoiAn" | "khongTraLoiDuoc" | "ngoaiPhamVi";
  chuaChuoi?: string;
  khongChuaChuoi?: string;
}

export interface LuotCorpus {
  cauHoi: string;
  kyVong: KyVongCokba;
}

export interface MucCorpus {
  nhom: NhomCorpus;
  cauHoi?: string;
  luot?: LuotCorpus[];
  kyVong?: KyVongCokba;
  ghiChu?: string;
  slotBanDau?: Pick<SlotTriNho, "giaViDaXacNhan" | "soNguoiAn">;
}

const GIA_VI_DU: string[] = [
  "Muối", "Đường", "Nước mắm", "Dầu ăn", "Tiêu", "Hành lá",
  "Hành tây", "Hành tím", "Tỏi", "Ớt", "Nước tương", "Hạt nêm",
];

export const CORPUS: MucCorpus[] = [
  // ================= viet_tay (55) — phủ 12 intent =================
  // intent 1: món theo nguyên liệu
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng cà chua?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc", soTheToiThieu: 2 } },
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng trứng gà?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh flan caramel" } },
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng tôm sú?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gỏi cuốn tôm thịt" } },
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng cá lóc?", kyVong: { loaiThe: "mon", chuaTieuDe: "Cá kho tộ" } },
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng thịt ba chỉ?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bún chả Hà Nội" } },
  { nhom: "viet_tay", cauHoi: "Món nào làm bằng khoai tây?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bò lúc lắc" } },
  // intent 2: có gì nấu nấy
  { nhom: "viet_tay", cauHoi: "Mình có trứng gà, cà chua thì nấu được gì?", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "viet_tay", cauHoi: "Nhà mình có thịt ba chỉ và tôm sú, nấu được món gì?", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "viet_tay", cauHoi: "Tủ lạnh còn ức gà với nấm rơm thì nấu được gì?", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "viet_tay", cauHoi: "Mình có trứng gà, cà chua thì nấu được gì?", kyVong: { loaiThe: "mon", soTheToiThieu: 3 }, slotBanDau: { giaViDaXacNhan: GIA_VI_DU }, ghiChu: "Đã xác nhận gia vị từ trước -> chấm % khớp và trả thẻ món ngay." },
  { nhom: "viet_tay", cauHoi: "Mình có cá lóc, cà chua thì nấu được món gì?", kyVong: { loaiThe: "mon", soTheToiThieu: 3 }, slotBanDau: { giaViDaXacNhan: GIA_VI_DU }, ghiChu: "Đã xác nhận gia vị từ trước." },
  // intent 3: nguyên liệu của món theo số người
  { nhom: "viet_tay", cauHoi: "Nguyên liệu món Phở bò Hà Nội cho 4 người gồm những gì?", kyVong: { loaiThe: "mon", chuaChuoi: "1 kg" }, ghiChu: "Công thức gốc 4 người: Xương ống bò 1 kg giữ nguyên." },
  { nhom: "viet_tay", cauHoi: "Đậu hũ sốt cà chua cần nguyên liệu gì cho 6 người?", kyVong: { loaiThe: "mon", chuaChuoi: "8 bìa" }, ghiChu: "Gốc 3 người: đậu hũ 4 bìa x 6/3 = 8 bìa; cà chua 4 quả -> 8 quả." },
  { nhom: "viet_tay", cauHoi: "Cơm chiên dương châu cần gì cho 4 người ăn?", kyVong: { loaiThe: "mon", chuaChuoi: "6 quả" }, ghiChu: "Gốc 2 người: trứng 3 quả x 4/2 = 6 quả." },
  { nhom: "viet_tay", cauHoi: "Nguyên liệu canh chua cá lóc cho 2 người", kyVong: { loaiThe: "mon", chuaChuoi: "300 g" }, ghiChu: "Gốc 4 người: cá lóc 600 g x 2/4 = 300 g." },
  { nhom: "viet_tay", cauHoi: "Bánh flan caramel cần nguyên liệu gì cho 12 người?", kyVong: { loaiThe: "mon", chuaChuoi: "1000 ml" }, ghiChu: "Gốc 6 người: sữa tươi 500 ml x 12/6 = 1000 ml." },
  { nhom: "viet_tay", cauHoi: "Nguyên liệu bánh xèo miền Tây cho 8 người gồm gì?", kyVong: { loaiThe: "mon", chuaChuoi: "600 g" }, ghiChu: "Gốc 4 người: bột gạo 300 g x 8/4 = 600 g." },
  // intent 4: cách làm
  { nhom: "viet_tay", cauHoi: "Cách làm bánh xèo miền Tây thế nào?", kyVong: { loaiThe: "mon", chuaChuoi: "7 bước" }, ghiChu: "Bánh xèo có 7 bước trong DB." },
  { nhom: "viet_tay", cauHoi: "Cách làm cá kho tộ", kyVong: { loaiThe: "mon", chuaChuoi: "7 bước" }, ghiChu: "Cá kho tộ có 7 bước." },
  { nhom: "viet_tay", cauHoi: "Cách làm phở bò Hà Nội thế nào?", kyVong: { loaiThe: "mon", chuaChuoi: "9 bước" }, ghiChu: "Phở bò có 9 bước." },
  { nhom: "viet_tay", cauHoi: "Cách làm gỏi cuốn tôm thịt", kyVong: { loaiThe: "mon", chuaChuoi: "7 bước" }, ghiChu: "Gỏi cuốn có 7 bước." },
  // intent 5: món theo tiêu chí
  { nhom: "viet_tay", cauHoi: "Món nào dễ làm, dưới 30 phút?", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "viet_tay", cauHoi: "Có món chay nào ngon không?", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "viet_tay", cauHoi: "Món nào khó nhất?", kyVong: { loaiThe: "mon", chuaTieuDe: "Phở bò Hà Nội" }, ghiChu: "Phở bò là món duy nhất độ khó kho." },
  { nhom: "viet_tay", cauHoi: "Món nào dưới 30 phút?", kyVong: { loaiThe: "mon", chuaTieuDe: "Cơm chiên dương châu" } },
  { nhom: "viet_tay", cauHoi: "Cho mình vài món nướng", kyVong: { loaiThe: "mon", chuaTieuDe: "Gà nướng mật ong" } },
  // intent 6: lộ trình người mới
  { nhom: "viet_tay", cauHoi: "Tôi mới vào bếp, nên học khóa gì đầu tiên?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "viet_tay", cauHoi: "Khóa đầu tiên cho người mới là gì?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "viet_tay", cauHoi: "Người mới học nấu ăn nên bắt đầu từ khóa nào?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  // intent 7: khóa theo nhu cầu
  { nhom: "viet_tay", cauHoi: "Có khóa học miễn phí không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món chay thanh đạm" } },
  { nhom: "viet_tay", cauHoi: "Có khóa học cơ bản nào không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Ăn sáng kiểu Việt" } },
  { nhom: "viet_tay", cauHoi: "Có khóa học nâng cao nào không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Kỹ thuật bếp chuyên nghiệp" } },
  { nhom: "viet_tay", cauHoi: "Có khóa học trung cấp nào không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Làm bánh Âu căn bản" } },
  { nhom: "viet_tay", cauHoi: "Có khóa học trung cấp nào dạy món Hàn không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món Hàn tại nhà" } },
  // intent 8: khóa gồm gì
  { nhom: "viet_tay", cauHoi: "Khóa Nấu ăn cho người mới bắt đầu gồm mấy bài?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "3 bài" }, ghiChu: "Mỗi khóa trong DB đều có 3 bài học thật." },
  { nhom: "viet_tay", cauHoi: "Khóa Làm bánh Âu căn bản gồm những bài gì?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "Nhập môn làm bánh" } },
  { nhom: "viet_tay", cauHoi: "Khóa Món Hàn tại nhà gồm những bài gì?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "Muối kim chi" } },
  { nhom: "viet_tay", cauHoi: "Khóa Eat-clean nhẹ nhàng có mấy bài học?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "3 bài" } },
  // intent 9: đầu bếp theo chuyên môn
  { nhom: "viet_tay", cauHoi: "Đầu bếp nào dạy làm bánh?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Phạm Thu Hà" } },
  { nhom: "viet_tay", cauHoi: "Đầu bếp nào chuyên món chay?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Huỳnh Mỹ Linh" } },
  { nhom: "viet_tay", cauHoi: "Đầu bếp nào chuyên món Âu?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Lê Thanh Tùng" } },
  // intent 10: hồ sơ đầu bếp
  { nhom: "viet_tay", cauHoi: "Đầu bếp Trần Văn Minh có món nào?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Trần Văn Minh", chuaChuoi: "6 công thức" }, ghiChu: "Minh có 6 công thức xuất bản: Canh chua, Gà nướng, Bún chả, Phở, Cá kho, Súp cua." },
  { nhom: "viet_tay", cauHoi: "Đầu bếp Phạm Thu Hà là ai?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Phạm Thu Hà" } },
  { nhom: "viet_tay", cauHoi: "Đầu bếp Huỳnh Mỹ Linh có khóa nào?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Món chay thanh đạm" } },
  { nhom: "viet_tay", cauHoi: "Cho mình xem hồ sơ đầu bếp Vũ Ngọc Anh", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Vũ Ngọc Anh" } },
  // intent 11: bài viết theo chủ đề
  { nhom: "viet_tay", cauHoi: "Có bài nào về chọn dao không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Chọn dao cho căn bếp gia đình" } },
  { nhom: "viet_tay", cauHoi: "Có bài viết nào về nấu nước dùng không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Bí quyết nấu nước dùng" } },
  { nhom: "viet_tay", cauHoi: "Có bài nào về eat-clean không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Bắt đầu eat-clean" } },
  { nhom: "viet_tay", cauHoi: "Có bài nào về bảo quản rau củ không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Bảo quản rau củ" } },
  { nhom: "viet_tay", cauHoi: "Có bài nào về gia vị không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Tủ gia vị Việt" } },
  // intent 12: calo
  { nhom: "viet_tay", cauHoi: "Phở bò Hà Nội bao nhiêu calo?", kyVong: { coCo: "choSoNguoiAn" }, ghiChu: "Chưa biết số người -> phải hỏi lại (luật calo)." },
  { nhom: "viet_tay", cauHoi: "Đậu hũ sốt cà chua bao nhiêu calo cho 6 người?", kyVong: { loaiThe: "mon", chuaChuoi: "480" }, ghiChu: "240 calo / 3 người = 80/người; 80 x 6 = 480." },
  { nhom: "viet_tay", cauHoi: "Cơm chiên dương châu bao nhiêu calo cho 4 người?", kyVong: { loaiThe: "mon", chuaChuoi: "1.120" }, ghiChu: "560 / 2 = 280/người; 280 x 4 = 1120 (định dạng vi-VN: 1.120)." },
  { nhom: "viet_tay", cauHoi: "Bò lúc lắc bao nhiêu calo cho 2 người?", kyVong: { loaiThe: "mon", chuaChuoi: "320" }, ghiChu: "480 / 3 = 160/người; 160 x 2 = 320." },
  { nhom: "viet_tay", cauHoi: "Canh chua cá lóc bao nhiêu calo cho 2 người?", kyVong: { loaiThe: "mon", chuaChuoi: "106" }, ghiChu: "210 / 4 = 52,5 -> làm tròn 53/người; 53 x 2 = 106." },

  // ================= dien_dat_lai (40) =================
  { nhom: "dien_dat_lai", cauHoi: "Cokba ơi, món gì nấu với cà chua được nhỉ?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc" } },
  { nhom: "dien_dat_lai", cauHoi: "Cho tớ xin mấy món có trứng gà đi", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh flan caramel" } },
  { nhom: "dien_dat_lai", cauHoi: "Tôm sú chế biến được món gì vậy?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gỏi cuốn tôm thịt" } },
  { nhom: "dien_dat_lai", cauHoi: "Ở nhà còn cá lóc, làm món gì ngon?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc" } },
  { nhom: "dien_dat_lai", cauHoi: "Thịt ba rọi nấu được món gì?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gỏi cuốn tôm thịt" }, ghiChu: "Ba rọi = ba chỉ (bí danh vùng miền có sẵn)." },
  { nhom: "dien_dat_lai", cauHoi: "Hành hoa nấu được món gì?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh xèo miền Tây" }, ghiChu: "Hành hoa = hành lá (bí danh); món đầu tiên có hành lá theo thứ tự DB là Bánh xèo." },
  { nhom: "dien_dat_lai", cauHoi: "Xin công thức làm phở bò Hà Nội", kyVong: { loaiThe: "mon", chuaTieuDe: "Phở bò Hà Nội" } },
  { nhom: "dien_dat_lai", cauHoi: "Phở bò nấu sao vậy bạn?", kyVong: { loaiThe: "mon", chuaTieuDe: "Phở bò Hà Nội" } },
  { nhom: "dien_dat_lai", cauHoi: "Chỉ mình cách nấu cá kho tộ với", kyVong: { loaiThe: "mon", chuaTieuDe: "Cá kho tộ" } },
  { nhom: "dien_dat_lai", cauHoi: "Bánh xèo miền Tây làm thế nào?", kyVong: { loaiThe: "mon", chuaChuoi: "7 bước" } },
  { nhom: "dien_dat_lai", cauHoi: "Tớ mới tập nấu, nên học gì trước?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "dien_dat_lai", cauHoi: "Có lớp nào miễn phí cho người mới không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "dien_dat_lai", cauHoi: "Khóa nào không tốn tiền?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" }, ghiChu: "'Không tốn tiền' = miễn phí, diễn đạt đồng nghĩa." },
  { nhom: "dien_dat_lai", cauHoi: "Học phí khóa Làm bánh Âu căn bản bao nhiêu tiền?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "699.000" }, ghiChu: "Giá khóa trong DB: 699000đ." },
  { nhom: "dien_dat_lai", cauHoi: "Khóa Món Hàn tại nhà dạy những gì?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món Hàn tại nhà" } },
  { nhom: "dien_dat_lai", cauHoi: "Ai là người dạy khóa Kỹ thuật bếp chuyên nghiệp?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "Trần Văn Minh" } },
  { nhom: "dien_dat_lai", cauHoi: "Bếp Hà có những khóa gì?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Làm bánh Âu căn bản" }, ghiChu: "Gọi đầu bếp theo tên riêng 'Hà' -> Phạm Thu Hà." },
  { nhom: "dien_dat_lai", cauHoi: "Đầu bếp Linh có khóa món chay nào?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món chay thanh đạm" } },
  { nhom: "dien_dat_lai", cauHoi: "Có bài viết gì về dao kéo không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Chọn dao cho căn bếp gia đình" } },
  { nhom: "dien_dat_lai", cauHoi: "Bài nào hướng dẫn chọn cá tươi?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Cách chọn cá tươi" } },
  { nhom: "dien_dat_lai", cauHoi: "Viết về nước dùng thì có bài gì?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Bí quyết nấu nước dùng" } },
  { nhom: "dien_dat_lai", cauHoi: "Mẹo bảo quản rau củ có bài nào không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Bảo quản rau củ" } },
  { nhom: "dien_dat_lai", cauHoi: "Súp cua chứa bao nhiêu năng lượng?", kyVong: { coCo: "choSoNguoiAn" }, ghiChu: "'Năng lượng' = calo, diễn đạt đồng nghĩa; chưa biết số người nên phải hỏi lại." },
  { nhom: "dien_dat_lai", cauHoi: "Cho 3 người thì phở bò tổng cộng mấy calo?", kyVong: { loaiThe: "mon", chuaChuoi: "339" }, ghiChu: "450 / 4 = 112,5 -> 113/người; 113 x 3 = 339. Gọi tắt 'phở bò' thay cho tên đầy đủ." },
  { nhom: "dien_dat_lai", cauHoi: "Đổi khẩu phần đậu hũ sốt cà chua sang 6 người giúp mình", kyVong: { loaiThe: "mon", chuaChuoi: "8 bìa" }, ghiChu: "Đậu hũ 4 bìa (gốc 3 người) x 6/3 = 8 bìa." },
  { nhom: "dien_dat_lai", cauHoi: "Nguyên liệu làm gỏi cuốn cho 4 người gồm gì?", kyVong: { loaiThe: "mon", chuaChuoi: "300 g" }, ghiChu: "Gọi tắt 'gỏi cuốn'; gốc 4 người: bún tươi 300 g giữ nguyên." },
  { nhom: "dien_dat_lai", cauHoi: "Nhà có sẵn đậu hũ với cà chua, gợi ý món đi Cokba", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "dien_dat_lai", cauHoi: "Tớ có tôm với thịt ba chỉ nè, nấu gì giờ?", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "dien_dat_lai", cauHoi: "Món gì vừa dễ vừa nhanh dưới 30 phút hả Cokba?", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "dien_dat_lai", cauHoi: "Có món chay nào dễ làm không?", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "dien_dat_lai", cauHoi: "Tìm món làm từ nấm rơm", kyVong: { loaiThe: "mon", chuaTieuDe: "Lẩu Thái chua cay" } },
  { nhom: "dien_dat_lai", cauHoi: "Món nào có đậu bắp?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc" } },
  { nhom: "dien_dat_lai", cauHoi: "Khóa học nấu phở ở đâu?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Bí quyết nấu phở và bún" } },
  { nhom: "dien_dat_lai", cauHoi: "Cho mình lộ trình học nấu từ con số 0", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "dien_dat_lai", cauHoi: "Người mới nên học khóa nào trước tiên?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
  { nhom: "dien_dat_lai", cauHoi: "Bánh flan cần những gì cho 6 người?", kyVong: { loaiThe: "mon", chuaChuoi: "500 ml" }, ghiChu: "Gọi tắt 'bánh flan'; gốc 6 người: sữa tươi 500 ml giữ nguyên." },
  { nhom: "dien_dat_lai", cauHoi: "Cá kho tộ nấu trong bao lâu?", kyVong: { loaiThe: "mon", chuaChuoi: "80 phút" }, ghiChu: "Cá kho tộ: chuẩn bị 35 + nấu 45 = 80 phút." },
  { nhom: "dien_dat_lai", cauHoi: "Món gì làm bằng bột gạo?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh xèo miền Tây" } },
  { nhom: "dien_dat_lai", cauHoi: "Đầu bếp nào phụ trách khóa Món Âu cho bữa tối?", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "Lê Thanh Tùng" } },
  { nhom: "dien_dat_lai", cauHoi: "Có bài nào nói về an toàn thực phẩm không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "An toàn vệ sinh thực phẩm" } },

  // ================= khong_dau (20) =================
  { nhom: "khong_dau", cauHoi: "mon nao lam bang ca chua", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc" } },
  { nhom: "khong_dau", cauHoi: "trung ga nau duoc mon gi", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh flan caramel" } },
  { nhom: "khong_dau", cauHoi: "pho bo bao nhieu calo", kyVong: { coCo: "choSoNguoiAn" } },
  { nhom: "khong_dau", cauHoi: "khoa hoc mien phi co khong", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món chay thanh đạm" } },
  { nhom: "khong_dau", cauHoi: "dau bep nao day lam banh", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Phạm Thu Hà" } },
  { nhom: "khong_dau", cauHoi: "cach lam banh xeo mien tay", kyVong: { loaiThe: "mon", chuaChuoi: "7 bước" } },
  { nhom: "khong_dau", cauHoi: "nguyen lieu mon dau hu sot ca chua cho 6 nguoi", kyVong: { loaiThe: "mon", chuaChuoi: "8 bìa" } },
  { nhom: "khong_dau", cauHoi: "mon nao de duoi 30 phut", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "khong_dau", cauHoi: "co bai nao ve chon dao khong", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Chọn dao cho căn bếp gia đình" } },
  { nhom: "khong_dau", cauHoi: "nha minh co trung ga ca chua thi nau duoc gi", kyVong: { coCo: "canHoiGiaVi" } },
  { nhom: "khong_dau", cauHoi: "mon chay nao de lam bang ca chua duoi 30 phut", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua" } },
  { nhom: "khong_dau", cauHoi: "canh chua ca loc can nguyen lieu gi cho 2 nguoi", kyVong: { loaiThe: "mon", chuaChuoi: "300 g" } },
  { nhom: "khong_dau", cauHoi: "khoa nau an cho nguoi moi bat dau gom may bai", kyVong: { loaiThe: "khoaHoc", chuaChuoi: "3 bài" } },
  { nhom: "khong_dau", cauHoi: "com chien duong chau bao nhieu calo cho 4 nguoi", kyVong: { loaiThe: "mon", chuaChuoi: "1.120" }, ghiChu: "560 / 2 = 280/người; 280 x 4 = 1120." },
  { nhom: "khong_dau", cauHoi: "mon nao lam bang ca loc", kyVong: { loaiThe: "mon", chuaTieuDe: "Cá kho tộ" } },
  { nhom: "khong_dau", cauHoi: "dau bep tran van minh co mon nao", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Trần Văn Minh" } },
  { nhom: "khong_dau", cauHoi: "khoa hoc nang cao co nhung khoa nao", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Kỹ thuật bếp chuyên nghiệp" } },
  { nhom: "khong_dau", cauHoi: "mon nao kho nhat", kyVong: { loaiThe: "mon", chuaTieuDe: "Phở bò Hà Nội" } },
  { nhom: "khong_dau", cauHoi: "co khoa hoc co ban nao mien phi khong", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Eat-clean nhẹ nhàng" } },
  { nhom: "khong_dau", cauHoi: "thoi tiet hom nay the nao", kyVong: { coCo: "ngoaiPhamVi" }, ghiChu: "Câu ngoài phạm vi viết không dấu vẫn phải bị từ chối đúng mực." },

  // ================= ghep_dieu_kien (16) =================
  { nhom: "ghep_dieu_kien", cauHoi: "Món chay nào dễ, làm bằng cà chua, dưới 30 phút?", kyVong: { loaiThe: "mon", chuaTieuDe: "Đậu hũ sốt cà chua", soTheToiDa: 1 }, ghiChu: "Ghép: danh mục chay + dễ + cà chua + <30 phút -> chỉ Đậu hũ sốt cà chua." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món làm bằng cá lóc, độ khó dễ", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc", soTheToiDa: 1 }, ghiChu: "Cá lóc có 2 món: Canh chua (dễ) và Cá kho tộ (trung bình) -> chỉ Canh chua." },
  { nhom: "ghep_dieu_kien", cauHoi: "Có món nào làm bằng tôm, dưới 50 phút không?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gỏi cuốn tôm thịt" }, ghiChu: "Tôm + <50 phút: Gỏi cuốn (40) và Cơm chiên (25, tôm bóc vỏ qua bí danh)." },
  { nhom: "ghep_dieu_kien", cauHoi: "Khóa học miễn phí cấp cơ bản có những khóa nào?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Ăn sáng kiểu Việt", soTheToiThieu: 3 }, ghiChu: "Miễn phí + cơ bản = 4 khóa: Nấu ăn người mới, Món chay, Ăn sáng, Eat-clean." },
  { nhom: "ghep_dieu_kien", cauHoi: "Khóa nâng cao của đầu bếp Lê Thanh Tùng là khóa nào?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Kỹ thuật chiên xào châu Á", soTheToiDa: 2 }, ghiChu: "Bếp Tùng có 2 khóa; chỉ Kỹ thuật chiên xào châu Á là nâng cao (+ thẻ đầu bếp = tối đa 2 thẻ)." },
  { nhom: "ghep_dieu_kien", cauHoi: "Khóa học của đầu bếp Trần Văn Minh", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Bí quyết nấu phở và bún" } },
  { nhom: "ghep_dieu_kien", cauHoi: "Món nướng nào có độ khó trung bình?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gà nướng mật ong" }, ghiChu: "Danh mục Món nướng + trung bình: Gà nướng mật ong và Bún chả Hà Nội." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món Á nào dễ, dưới 30 phút?", kyVong: { loaiThe: "mon", chuaTieuDe: "Cơm chiên dương châu" } },
  { nhom: "ghep_dieu_kien", cauHoi: "Khóa miễn phí của đầu bếp Huỳnh Mỹ Linh", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Món chay thanh đạm" }, ghiChu: "Cả 2 khóa của bếp Linh đều miễn phí." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món làm bằng khoai tây, độ khó trung bình", kyVong: { loaiThe: "mon", chuaTieuDe: "Bò lúc lắc" }, ghiChu: "Khoai tây có ở Bò lúc lắc và Cà ri gà, cả hai đều trung bình." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món canh nào dưới 45 phút?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc", soTheToiDa: 1 }, ghiChu: "Danh mục Canh và súp + <45 phút: chỉ Canh chua cá lóc (40 phút)." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món tráng miệng nào làm bằng sữa tươi?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh flan caramel", soTheToiDa: 1 }, ghiChu: "Sữa tươi + danh mục Bánh và tráng miệng: chỉ Bánh flan (Gà rán cũng có sữa tươi nhưng thuộc Ăn vặt)." },
  { nhom: "ghep_dieu_kien", cauHoi: "Món ăn sáng nào khó?", kyVong: { loaiThe: "mon", chuaTieuDe: "Phở bò Hà Nội" }, ghiChu: "Danh mục Món ăn sáng + khó: chỉ Phở bò." },
  { nhom: "ghep_dieu_kien", cauHoi: "Có khóa học nào về làm bánh không?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Làm bánh Âu căn bản" } },
  { nhom: "ghep_dieu_kien", cauHoi: "Có bài nào về dinh dưỡng không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Cách đọc nhãn dinh dưỡng" } },
  { nhom: "ghep_dieu_kien", cauHoi: "Món làm bằng trứng gà, độ khó dễ, dưới 30 phút", kyVong: { loaiThe: "mon", chuaTieuDe: "Cơm chiên dương châu", soTheToiDa: 1 }, ghiChu: "Trứng gà có ở 5 món; chỉ Cơm chiên vừa dễ vừa <30 phút." },

  // ================= chuoi_tri_nho (8 chuỗi, 25 lượt) =================
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Hỏi calo -> trả lời số người -> hỏi nguyên liệu 'món đó'.",
    luot: [
      { cauHoi: "Phở bò Hà Nội bao nhiêu calo?", kyVong: { coCo: "choSoNguoiAn" } },
      { cauHoi: "4 người", kyVong: { chuaChuoi: "452" } },
      { cauHoi: "Món đó cần nguyên liệu gì?", kyVong: { loaiThe: "mon", chuaChuoi: "1 kg" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Gợi ý theo nguyên liệu -> 'còn món khác không' (đã hết) -> calo món trong danh sách -> trả lời số người.",
    luot: [
      { cauHoi: "Món nào làm bằng cà chua?", kyVong: { loaiThe: "mon", chuaTieuDe: "Canh chua cá lóc" } },
      { cauHoi: "Còn món khác không?", kyVong: { chuaChuoi: "liệt kê hết" } },
      { cauHoi: "Đậu hũ sốt cà chua bao nhiêu calo?", kyVong: { coCo: "choSoNguoiAn" } },
      { cauHoi: "6", kyVong: { chuaChuoi: "480" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Có gì nấu nấy (hỏi gia vị) -> hỏi 1 nguyên liệu -> 'còn món khác không' phải ra món chưa xem.",
    luot: [
      { cauHoi: "Mình có trứng gà, cà chua thì nấu được gì?", kyVong: { coCo: "canHoiGiaVi" } },
      { cauHoi: "Món nào làm bằng trứng gà?", kyVong: { loaiThe: "mon", chuaTieuDe: "Bánh flan caramel" } },
      { cauHoi: "Còn món khác không?", kyVong: { loaiThe: "mon", chuaTieuDe: "Gà rán vỏ giòn" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Lộ trình người mới -> 'khóa đó gồm gì' -> 'khóa đó của ai' (nhớ slot khóa).",
    luot: [
      { cauHoi: "Khóa đầu tiên cho người mới là gì?", kyVong: { loaiThe: "khoaHoc", chuaTieuDe: "Nấu ăn cho người mới bắt đầu" } },
      { cauHoi: "Khóa đó gồm những bài gì?", kyVong: { chuaChuoi: "Làm quen căn bếp" } },
      { cauHoi: "Khóa đó của ai?", kyVong: { chuaChuoi: "Vũ Ngọc Anh" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Nguyên liệu 2 người -> 'đổi sang 4 người' -> calo 'món đó' phải dùng luôn số người đã biết (280 x 4 = 1120).",
    luot: [
      { cauHoi: "Nguyên liệu món Cơm chiên dương châu cho 2 người", kyVong: { chuaChuoi: "3 quả" } },
      { cauHoi: "Đổi sang 4 người", kyVong: { chuaChuoi: "6 quả" } },
      { cauHoi: "Món đó bao nhiêu calo?", kyVong: { chuaChuoi: "1.120" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Cách làm -> nguyên liệu 'món đó' cho 8 người (bột gạo 300 g x 2 = 600 g) -> calo 'món đó' (95/người x 8 = 760).",
    luot: [
      { cauHoi: "Cách làm bánh xèo miền Tây thế nào?", kyVong: { chuaChuoi: "7 bước" } },
      { cauHoi: "Món đó cần nguyên liệu gì cho 8 người?", kyVong: { chuaChuoi: "600 g" } },
      { cauHoi: "Món đó bao nhiêu calo?", kyVong: { chuaChuoi: "760" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Hồ sơ đầu bếp -> hỏi bài của 1 khóa -> 'khóa đó của ai' phải quay về đúng đầu bếp.",
    luot: [
      { cauHoi: "Đầu bếp Trần Văn Minh là ai?", kyVong: { loaiThe: "dauBep", chuaTieuDe: "Trần Văn Minh" } },
      { cauHoi: "Khóa Bí quyết nấu phở và bún gồm mấy bài?", kyVong: { chuaChuoi: "3 bài" } },
      { cauHoi: "Khóa đó của ai?", kyVong: { chuaChuoi: "Trần Văn Minh" } },
    ],
  },
  {
    nhom: "chuoi_tri_nho",
    ghiChu: "Bài viết -> chuyển sang món theo nguyên liệu -> 'còn món khác không' khi đã liệt kê hết 2 món cá lóc.",
    luot: [
      { cauHoi: "Có bài nào về chọn dao không?", kyVong: { loaiThe: "baiViet", chuaTieuDe: "Chọn dao cho căn bếp gia đình" } },
      { cauHoi: "Món nào làm bằng cá lóc?", kyVong: { loaiThe: "mon", chuaTieuDe: "Cá kho tộ" } },
      { cauHoi: "Còn món khác không?", kyVong: { chuaChuoi: "liệt kê hết" } },
    ],
  },

  // ================= ngoai_pham_vi (12) =================
  { nhom: "ngoai_pham_vi", cauHoi: "Thời tiết hôm nay thế nào?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "2 cộng 3 nhân 4 bằng bao nhiêu?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Đội tuyển Việt Nam đá bóng tối nay với ai?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Thủ đô của Nhật Bản là thành phố nào?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Dịch câu này sang tiếng Anh giúp mình", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Viết cho mình một bài thơ về mùa thu", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Tử vi cung Sư Tử tuần này thế nào?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Chứng khoán hôm nay tăng hay giảm?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Mở bài hát mới nhất của Sơn Tùng", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Đặt vé máy bay đi Đà Nẵng cuối tuần", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Ai đang là tổng thống của nước Mỹ?", kyVong: { coCo: "ngoaiPhamVi" } },
  { nhom: "ngoai_pham_vi", cauHoi: "Bây giờ là mấy giờ?", kyVong: { coCo: "ngoaiPhamVi" } },
];

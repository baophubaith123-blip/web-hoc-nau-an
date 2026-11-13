// Ca kiểm tra node-side cho bộ não Cokba (Đợt 2) — KHÔNG mở trình duyệt,
// chạy bằng: npx playwright test -c playwright.node.config.ts
// Phủ: chuẩn hóa + bí danh, khớp nguyên liệu, chia khẩu phần, đọc thời
// lượng, và tra-loi với dữ liệu mồi nhỏ cho đủ 12 intent + ngữ cảnh.

import { expect, test } from "@playwright/test";

import { dungChiMuc } from "../src/lib/tro-ly/chi-muc";
import { chiaKhauPhan } from "../src/lib/tro-ly/chia-khau-phan";
import {
  khoaChuanHoa,
  khoaNguyenLieu,
  tenChuanNguyenLieu,
} from "../src/lib/tro-ly/chuan-hoa";
import { docThoiLuong } from "../src/lib/tro-ly/doc-thoi-luong";
import { khopMotMon } from "../src/lib/tro-ly/khop-nguyen-lieu";
import { taoSlotTrong, type DuLieuTroLy } from "../src/lib/tro-ly/kieu-du-lieu";
import { traLoi } from "../src/lib/tro-ly/tra-loi";

// ---------------------------------------------------------------------------
// Dữ liệu mồi nhỏ, tự dựng — số liệu được tính tay để đối chiếu.
// ---------------------------------------------------------------------------

const DU_LIEU_MOI: DuLieuTroLy = {
  dauBep: [
    {
      id: "db1",
      ho_ten: "Trần Văn Minh",
      avatar_url: null,
      bio: "Chuyên món Việt truyền thống, nhiều năm kinh nghiệm bếp Việt.",
    },
    {
      id: "db2",
      ho_ten: "Phạm Thu Hà",
      avatar_url: null,
      bio: "Chuyên làm bánh và món Âu, giảng dạy các khóa bánh cơ bản.",
    },
  ],
  congThuc: [
    {
      id: "m1",
      tieu_de: "Trứng chiên cà chua",
      slug: "trung-chien-ca-chua",
      mo_ta: "Món trứng chiên cà chua đơn giản cho bữa cơm gia đình.",
      nguyen_lieu: [
        { ten: "Trứng gà", so_luong: 4, don_vi: "quả" },
        { ten: "Cà chua", so_luong: 2, don_vi: "quả" },
        { ten: "Hành lá", so_luong: 2, don_vi: "cây" },
        { ten: "Muối", so_luong: 1, don_vi: "muỗng" },
        { ten: "Dầu ăn", so_luong: 2, don_vi: "muỗng" },
      ],
      cac_buoc: [
        { thu_tu: 1, noi_dung: "Rửa sạch cà chua, cắt múi cau. Đập trứng ra tô, đánh tan với muối." },
        { thu_tu: 2, noi_dung: "Đun nóng dầu ăn, cho trứng vào chiên 3 phút rồi gạt ra đĩa." },
        { thu_tu: 3, noi_dung: "Xào cà chua 5 phút cho mềm, cho trứng vào đảo đều, rắc hành lá." },
      ],
      thoi_gian_chuan_bi: 5,
      thoi_gian_nau: 10,
      khau_phan: 2,
      do_kho: "de",
      anh_dai_dien: null,
      calories: 320,
      tac_gia_id: "db1",
      danh_muc: ["Món chính"],
      danh_muc_slug: ["mon-chinh"],
    },
    {
      id: "m2",
      tieu_de: "Canh cà chua cá",
      slug: "canh-ca-chua-ca",
      mo_ta: "Canh cá nấu cà chua chua ngọt.",
      nguyen_lieu: [
        { ten: "Cà chua", so_luong: 3, don_vi: "quả" },
        { ten: "Cá lóc", so_luong: 1, don_vi: "con" },
        { ten: "Nước mắm", so_luong: 2, don_vi: "muỗng" },
        { ten: "Đường", so_luong: 1, don_vi: "muỗng" },
      ],
      cac_buoc: [
        { thu_tu: 1, noi_dung: "Sơ chế cá, rửa sạch, để ráo." },
        { thu_tu: 2, noi_dung: "Ninh cá 10-15 phút cho ngọt nước, cho cà chua vào nấu chín." },
      ],
      thoi_gian_chuan_bi: 10,
      thoi_gian_nau: 20,
      khau_phan: 4,
      do_kho: "trung_binh",
      anh_dai_dien: null,
      calories: null,
      tac_gia_id: "db1",
      danh_muc: ["Món chính"],
      danh_muc_slug: ["mon-chinh"],
    },
    {
      id: "m3",
      tieu_de: "Salad cà chua",
      slug: "salad-ca-chua",
      mo_ta: "Salad cà chua tươi mát.",
      nguyen_lieu: [
        { ten: "Cà chua", so_luong: 2, don_vi: "quả" },
        { ten: "Dưa leo", so_luong: 1, don_vi: "quả" },
        { ten: "Dầu ăn", so_luong: 1, don_vi: "muỗng" },
        { ten: "Muối", so_luong: 0.5, don_vi: "muỗng" },
      ],
      cac_buoc: [{ thu_tu: 1, noi_dung: "Trộn đều tất cả, để ngấm 10 phút rồi dùng." }],
      thoi_gian_chuan_bi: 5,
      thoi_gian_nau: 5,
      khau_phan: 2,
      do_kho: "de",
      anh_dai_dien: null,
      calories: 150,
      tac_gia_id: "db2",
      danh_muc: ["Món chay"],
      danh_muc_slug: ["mon-chay"],
    },
    {
      id: "m4",
      tieu_de: "Sốt cà chua mì Ý",
      slug: "sot-ca-chua-mi-y",
      mo_ta: "Mì Ý sốt cà chua kiểu Âu.",
      nguyen_lieu: [
        { ten: "Cà chua", so_luong: 4, don_vi: "quả" },
        { ten: "Mì Ý", so_luong: 200, don_vi: "g" },
        { ten: "Tỏi", so_luong: 2, don_vi: "tép" },
        { ten: "Dầu ăn", so_luong: 2, don_vi: "muỗng" },
      ],
      cac_buoc: [{ thu_tu: 1, noi_dung: "Luộc mì 10 phút, xào sốt cà chua rồi trộn đều." }],
      thoi_gian_chuan_bi: 10,
      thoi_gian_nau: 15,
      khau_phan: 2,
      do_kho: "trung_binh",
      anh_dai_dien: null,
      calories: 450,
      tac_gia_id: "db2",
      danh_muc: ["Món Âu"],
      danh_muc_slug: ["mon-au"],
    },
  ],
  khoaHoc: [
    {
      id: "k1",
      tieu_de: "Nấu ăn cho người mới bắt đầu",
      slug: "nau-an-cho-nguoi-moi-bat-dau",
      mo_ta: "Khóa nền tảng cho người mới vào bếp.",
      mo_ta_chi_tiet: null,
      anh_dai_dien: null,
      cap_do: "co_ban",
      gia: 0,
      mien_phi: true,
      dau_bep_id: "db1",
      tong_thoi_gian: 25,
      so_bai_hoc: 2,
      bai_hoc: [
        { id: "bh1", tieu_de: "Làm quen dao thớt", mo_ta: null, thoi_gian_phut: 10, thu_tu: 1, xem_truoc: true },
        { id: "bh2", tieu_de: "Luộc trứng và rau cơ bản", mo_ta: null, thoi_gian_phut: 15, thu_tu: 2, xem_truoc: false },
      ],
    },
    {
      id: "k2",
      tieu_de: "Làm bánh Âu cơ bản",
      slug: "lam-banh-au-co-ban",
      mo_ta: "Khóa làm bánh Âu cho người đã biết nấu cơ bản.",
      mo_ta_chi_tiet: null,
      anh_dai_dien: null,
      cap_do: "trung_cap",
      gia: 499000,
      mien_phi: false,
      dau_bep_id: "db2",
      tong_thoi_gian: 20,
      so_bai_hoc: 1,
      bai_hoc: [
        { id: "bh3", tieu_de: "Bánh mì sandwich", mo_ta: null, thoi_gian_phut: 20, thu_tu: 1, xem_truoc: false },
      ],
    },
  ],
  baiViet: [
    {
      id: "b1",
      tieu_de: "Cách chọn dao nhà bếp",
      slug: "cach-chon-dao-nha-bep",
      tom_tat: "Bài viết hướng dẫn chọn dao phù hợp cho gian bếp gia đình.",
      noi_dung:
        "Dao là dụng cụ quan trọng trong bếp. Khi chọn dao cần xem chất thép, cán dao và độ nặng vừa tay. Một con dao tốt giúp sơ chế nhanh và an toàn.",
      anh_dai_dien: null,
      tac_gia_id: "db1",
      danh_muc: "Cẩm nang",
    },
    {
      id: "btest",
      tieu_de: "TEST_bài thử nghiệm nội bộ",
      slug: "test-bai-thu-nghiem",
      tom_tat: "Nội dung thử nghiệm.",
      noi_dung: "Đây là dữ liệu thử nghiệm, không được hiển thị cho người dùng.",
      anh_dai_dien: null,
      tac_gia_id: "db1",
      danh_muc: "Test",
    },
  ],
};

const idCacThe = (kq: { the: { id: string }[] }) => kq.the.map((t) => t.id);
const vanBan = (kq: { doanVan: string[] }) => kq.doanVan.join("\n");

// ---------------------------------------------------------------------------
// 1) Chuẩn hóa + bí danh
// ---------------------------------------------------------------------------

test("chuan-hoa: bỏ dấu, bí danh hành hoa -> Hành lá, bỏ ghi chú ngoặc", () => {
  expect(khoaChuanHoa("Cà Chua")).toBe("ca chua");
  expect(khoaNguyenLieu("ca chua")).toBe(khoaNguyenLieu("Cà chua"));
  expect(tenChuanNguyenLieu("hành hoa")).toBe("Hành lá");
  expect(tenChuanNguyenLieu("Hành lá thái nhỏ")).toBe("Hành lá");
  expect(tenChuanNguyenLieu("Nước mắm (pha nước chấm)")).toBe("Nước mắm");
});

// ---------------------------------------------------------------------------
// 2) Khớp nguyên liệu — % tính tay: m1 có 5 nguyên liệu
//    (2 chính: Trứng gà, Cà chua; 3 gia vị: Hành lá, Muối, Dầu ăn)
// ---------------------------------------------------------------------------

test("khop-nguyen-lieu: chưa xác nhận gia vị -> 40% + cờ hỏi gia vị", () => {
  const mon = DU_LIEU_MOI.congThuc[0];
  const kq = khopMotMon(mon, { nguyenLieuNguoiDung: ["Trứng gà", "Cà chua"], giaViDaXacNhan: null });
  expect(kq.phanTramKhop).toBe(40); // 2/5
  expect(kq.canHoiGiaVi).toBe(true);
  expect(kq.thieuChinh).toEqual([]);
  expect(kq.thieuGiaVi).toEqual(["Hành lá", "Muối", "Dầu ăn"]);
});

test("khop-nguyen-lieu: xác nhận đủ gia vị -> 100%; thiếu 2 gia vị -> 60%", () => {
  const mon = DU_LIEU_MOI.congThuc[0];
  const du = khopMotMon(mon, {
    nguyenLieuNguoiDung: ["Trứng gà", "Cà chua"],
    giaViDaXacNhan: ["Hành lá", "Muối", "Dầu ăn"],
  });
  expect(du.phanTramKhop).toBe(100);
  expect(du.canHoiGiaVi).toBe(false);

  const thieu = khopMotMon(mon, {
    nguyenLieuNguoiDung: ["trứng", "cà chua"],
    giaViDaXacNhan: ["Muối"],
  });
  expect(thieu.phanTramKhop).toBe(60); // 3/5
  expect(thieu.thieuGiaVi).toEqual(["Hành lá", "Dầu ăn"]);
});

// ---------------------------------------------------------------------------
// 3) Chia khẩu phần
// ---------------------------------------------------------------------------

test("chia-khau-phan: g -> bội 5, quả -> bội 0,5, con -> tròn lên, nhỏ -> nhúm", () => {
  const botMi = chiaKhauPhan([{ ten: "Bột mì đa dụng", so_luong: 333, don_vi: "g" }], 2, 3);
  expect(botMi[0].hien_thi).toBe("500 g"); // 333 * 1,5 = 499,5 -> 500

  const trung = chiaKhauPhan([{ ten: "Trứng gà", so_luong: 3, don_vi: "quả" }], 2, 3);
  expect(trung[0].hien_thi).toBe("4,5 quả"); // 3 * 1,5 = 4,5

  const caIt = chiaKhauPhan([{ ten: "Cá lóc", so_luong: 1, don_vi: "con" }], 4, 3);
  expect(caIt[0].hien_thi).toBe("1 con"); // 0,75 -> làm tròn lên 1
  const caNhieu = chiaKhauPhan([{ ten: "Cá lóc", so_luong: 1, don_vi: "con" }], 4, 6);
  expect(caNhieu[0].hien_thi).toBe("2 con"); // 1,5 -> 2

  const muoi = chiaKhauPhan([{ ten: "Muối", so_luong: 0.1, don_vi: "muỗng" }], 2, 2);
  expect(muoi[0].so_luong_moi).toBeNull();
  expect(muoi[0].hien_thi).toBe("một nhúm/ít");
});

// ---------------------------------------------------------------------------
// 4) Đọc thời lượng trong bước
// ---------------------------------------------------------------------------

test("doc-thoi-luong: mốc đơn, nửa giờ, khoảng, không có giờ", () => {
  const hap = docThoiLuong("Đậy nắp hấp 15 phút cho chín.");
  expect(hap).toHaveLength(1);
  expect(hap[0].giay).toBe(900);
  expect(hap[0].nhan).toBe("Hấp");

  const uop = docThoiLuong("Ướp thịt nửa giờ rồi đem nướng.");
  expect(uop).toHaveLength(1);
  expect(uop[0].giay).toBe(1800);

  const ninh = docThoiLuong("Ninh xương 10-15 phút cho ngọt nước.");
  expect(ninh).toHaveLength(1);
  expect(ninh[0].giay).toBe(900); // lấy số lớn của khoảng
  expect(ninh[0].laKhoang).toBe(true);
  expect(ninh[0].nhan).toBe("Ninh");

  expect(docThoiLuong("Trộn đều rồi bày ra đĩa.")).toEqual([]);

  const haiMoc = docThoiLuong("Luộc trứng 8 phút, vớt ra ngâm nước lạnh 2 phút.");
  expect(haiMoc.map((m) => m.giay)).toEqual([480, 120]);
  expect(haiMoc.map((m) => m.nhan)).toEqual(["Luộc", "Ngâm"]);
});

// ---------------------------------------------------------------------------
// 5) tra-loi — 12 intent với dữ liệu mồi
// ---------------------------------------------------------------------------

test("intent 1: món theo một nguyên liệu (có dấu + không dấu)", () => {
  const coDau = traLoi("món nào làm bằng cà chua?", DU_LIEU_MOI, taoSlotTrong());
  expect(coDau.yDinh).toBe("mon_theo_nguyen_lieu");
  expect(idCacThe(coDau)).toContain("m1");
  expect(idCacThe(coDau)).toContain("m2");

  const khongDau = traLoi("mon nao lam bang ca chua", DU_LIEU_MOI, taoSlotTrong());
  expect(khongDau.yDinh).toBe("mon_theo_nguyen_lieu");
  expect(idCacThe(khongDau)).toContain("m1");
});

test("intent 2: chưa xác nhận gia vị -> cờ canHoiGiaVi + danh sách gia vị", () => {
  const kq = traLoi("mình có trứng gà, cà chua thì nấu được gì?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("co_gi_nau_nay");
  expect(kq.canHoiGiaVi).toBe(true);
  expect(kq.danhSachGiaViDeHoi?.length).toBeGreaterThanOrEqual(10);
  expect(kq.slotDaCapNhat.nguyenLieuDangCo).toEqual(["Trứng gà", "Cà chua"]);
});

test("intent 2: đã xác nhận gia vị -> chấm % khớp, món khớp nhất đứng đầu", () => {
  const slot = taoSlotTrong();
  slot.giaViDaXacNhan = ["Hành lá", "Muối", "Dầu ăn", "Nước mắm", "Đường"];
  const kq = traLoi("mình có trứng gà, cà chua thì nấu được gì?", DU_LIEU_MOI, slot);
  expect(kq.yDinh).toBe("co_gi_nau_nay");
  expect(kq.canHoiGiaVi).toBeFalsy();
  expect(kq.the[0].id).toBe("m1");
  expect(kq.the[0].diemKhop).toBe(100);
});

test("intent 3: nguyên liệu của một món cho 3 người (có dấu + không dấu)", () => {
  const kq = traLoi(
    "món trứng chiên cà chua cần nguyên liệu gì cho 3 người?",
    DU_LIEU_MOI,
    taoSlotTrong()
  );
  expect(kq.yDinh).toBe("nguyen_lieu_mon");
  expect(vanBan(kq)).toContain("6 quả"); // trứng 4 * 3/2
  expect(vanBan(kq)).toContain("3 quả"); // cà chua 2 * 3/2
  expect(kq.slotDaCapNhat.soNguoiAn).toBe(3);
  expect(kq.slotDaCapNhat.monDangBan).toBe("m1");

  const khongDau = traLoi("trung chien ca chua can gi cho 3 nguoi", DU_LIEU_MOI, taoSlotTrong());
  expect(khongDau.yDinh).toBe("nguyen_lieu_mon");
  expect(vanBan(khongDau)).toContain("6 quả");
});

test("intent 4: cách làm một món -> tóm tắt số bước + thẻ có nút nấu", () => {
  const kq = traLoi("cách làm trứng chiên cà chua thế nào?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("cach_lam_mon");
  expect(vanBan(kq)).toContain("3 bước");
  expect(kq.the[0].hanhDong).toContain("nauMonNay");
});

test("intent 5: món theo tiêu chí — dễ + dưới 30 phút; câu ghép chay", () => {
  const kq = traLoi("món nào dễ, dưới 30 phút?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("mon_theo_tieu_chi");
  expect(idCacThe(kq)).toContain("m1");
  expect(idCacThe(kq)).not.toContain("m2"); // m2 tổng 30 phút, không "dưới 30"

  const ghep = traLoi(
    "có món chay nào dễ, làm bằng cà chua, dưới 30 phút không?",
    DU_LIEU_MOI,
    taoSlotTrong()
  );
  expect(idCacThe(ghep)).toEqual(["m3"]);
});

test("intent 6: lộ trình người mới -> khóa cơ bản nền tảng đứng đầu", () => {
  const kq = traLoi("mới vào bếp thì học khóa gì đầu tiên?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("lo_trinh_nguoi_moi");
  expect(kq.the[0].id).toBe("k1");
});

test("intent 7: khóa theo nhu cầu — miễn phí (có dấu + không dấu)", () => {
  const kq = traLoi("có khóa miễn phí không?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("khoa_theo_nhu_cau");
  expect(idCacThe(kq)).toEqual(["k1"]);

  const khongDau = traLoi("khoa hoc nao mien phi", DU_LIEU_MOI, taoSlotTrong());
  expect(idCacThe(khongDau)).toEqual(["k1"]);
});

test("intent 8: khóa gồm những bài gì -> đếm + liệt kê bài học", () => {
  const kq = traLoi(
    "khóa nấu ăn cho người mới bắt đầu có mấy bài?",
    DU_LIEU_MOI,
    taoSlotTrong()
  );
  expect(kq.yDinh).toBe("khoa_gom_gi");
  expect(vanBan(kq)).toContain("2 bài");
  expect(vanBan(kq)).toContain("Làm quen dao thớt");
  expect(vanBan(kq)).toContain("Luộc trứng và rau cơ bản");
});

test("intent 9: đầu bếp theo chuyên môn làm bánh", () => {
  const kq = traLoi("đầu bếp nào dạy làm bánh?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("dau_bep_theo_chuyen_mon");
  expect(idCacThe(kq)).toEqual(["db2"]);
});

test("intent 9b: đầu bếp dạy món Âu — từ ngắn 'Âu' vẫn khớp được (hồi quy live 5B)", () => {
  const kq = traLoi("đầu bếp nào dạy món Âu?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("dau_bep_theo_chuyen_mon");
  expect(kq.khongTraLoiDuoc).not.toBe(true);
  expect(idCacThe(kq)[0]).toBe("db2");
});

test("intent 10: hồ sơ đầu bếp + khóa của đầu bếp gọi theo tên riêng", () => {
  const kq = traLoi("đầu bếp Trần Văn Minh có món nào?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("ho_so_dau_bep");
  expect(idCacThe(kq)).toContain("db1");
  expect(vanBan(kq)).toContain("2 công thức");

  const khoaCuaHa = traLoi("khóa của đầu bếp Hà có gì?", DU_LIEU_MOI, taoSlotTrong());
  expect(khoaCuaHa.yDinh).toBe("ho_so_dau_bep");
  expect(idCacThe(khoaCuaHa)).toContain("k2");
});

test("intent 11: bài viết theo chủ đề chọn dao", () => {
  const kq = traLoi("có bài nào về chọn dao không?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.yDinh).toBe("bai_theo_chu_de");
  expect(idCacThe(kq)).toEqual(["b1"]);
});

test("intent 12: calo — chưa biết số người thì hỏi lại đúng 1 ý, trả lời số thì tính tiếp", () => {
  const hoi = traLoi("món trứng chiên cà chua bao nhiêu calo?", DU_LIEU_MOI, taoSlotTrong());
  expect(hoi.yDinh).toBe("calo_mon");
  expect(hoi.choSoNguoiAn).toBe(true);
  expect(hoi.monChoSoNguoiAn).toBe("m1");
  expect(vanBan(hoi)).toContain("mấy người");

  // Lượt sau: người dùng chỉ trả lời con số -> tính cho món đang chờ.
  const tinh = traLoi("3 người", DU_LIEU_MOI, hoi.slotDaCapNhat);
  expect(tinh.choSoNguoiAn).toBeFalsy();
  expect(vanBan(tinh)).toContain("480"); // 320/2 * 3
  expect(vanBan(tinh)).toContain("160"); // calo/người
  expect(tinh.slotDaCapNhat.soNguoiAn).toBe(3);
});

test("intent 12: đã biết số người trong phiên + 'món đó' -> tính thẳng, không hỏi lại", () => {
  const slot = taoSlotTrong();
  slot.monDangBan = "m1";
  slot.soNguoiAn = 3;
  const kq = traLoi("món đó bao nhiêu calo?", DU_LIEU_MOI, slot);
  expect(kq.choSoNguoiAn).toBeFalsy();
  expect(vanBan(kq)).toContain("480");
});

test("intent 12: món chưa có dữ liệu calo -> nói thật, không bịa", () => {
  const slot = taoSlotTrong();
  slot.soNguoiAn = 2;
  const kq = traLoi("canh cà chua cá bao nhiêu calo?", DU_LIEU_MOI, slot);
  expect(vanBan(kq)).toContain("chưa có thông tin calo");
  expect(kq.khongTraLoiDuoc).toBe(true);
});

test("ngữ cảnh: 'món đó cho 5 người' và 'đổi sang 5 người' tính lại theo món đang bàn", () => {
  const dau = traLoi(
    "món trứng chiên cà chua cần nguyên liệu gì cho 3 người?",
    DU_LIEU_MOI,
    taoSlotTrong()
  );
  const quayLui = traLoi("món đó cho 5 người thì sao?", DU_LIEU_MOI, dau.slotDaCapNhat);
  expect(vanBan(quayLui)).toContain("5 quả"); // cà chua 2 * 5/2
  expect(quayLui.slotDaCapNhat.soNguoiAn).toBe(5);

  const doiSo = traLoi("đổi sang 5 người", DU_LIEU_MOI, dau.slotDaCapNhat);
  expect(vanBan(doiSo)).toContain("5 quả");
  expect(doiSo.slotDaCapNhat.soNguoiAn).toBe(5);
});

test("ngữ cảnh: 'còn món khác không' gợi ý tiếp món chưa xem", () => {
  const dau = traLoi("món nào làm bằng cà chua?", DU_LIEU_MOI, taoSlotTrong());
  expect(idCacThe(dau)).toHaveLength(3);
  const tiep = traLoi("còn món khác không?", DU_LIEU_MOI, dau.slotDaCapNhat);
  expect(idCacThe(tiep)).toEqual(["m4"]);
});

test("ngoài phạm vi: câu không thuộc 4 miền -> ngoaiPhamVi + gợi ý + đánh dấu chưa trả lời được", () => {
  const kq = traLoi("thời tiết hôm nay thế nào?", DU_LIEU_MOI, taoSlotTrong());
  expect(kq.ngoaiPhamVi).toBe(true);
  expect(kq.khongTraLoiDuoc).toBe(true);
  expect(kq.goiY?.length).toBeGreaterThan(0);
});

test("bài viết TEST_ bị loại khỏi chỉ mục và không bao giờ được gợi ý", () => {
  const chiMuc = dungChiMuc(DU_LIEU_MOI);
  expect(chiMuc.baiVietTheoId.has("btest")).toBe(false);
  const kq = traLoi("có bài nào về thử nghiệm không?", DU_LIEU_MOI, taoSlotTrong());
  expect(idCacThe(kq)).not.toContain("btest");
});

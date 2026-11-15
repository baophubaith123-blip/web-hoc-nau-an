import { test, expect, type Page } from "@playwright/test";

// ĐỢT 3 (15/11/2026) — THÙNG RÁC (hoàn tác xóa) cho công thức / khóa học / bài viết.
//
// Trạng thái khi viết spec: migration 009 CHƯA được dán vào Supabase
// (DB chưa có khoa_hoc.deleted_at, bai_viet.deleted_at,
// *.trang_thai_truoc_xoa — đã kiểm chứng bằng truy vấn thật, lỗi 42703).
// - cong_thuc: deleted_at đã có từ migration 001 và action đợt 3 GIỮ
//   NGUYÊN trang_thai khi xóa mềm → luồng thùng rác của công thức chạy
//   THẬT ngay cả trước migration (xóa → ẩn công khai → vào thùng rác →
//   khôi phục về ĐÚNG trạng thái trước xóa → xóa vĩnh viễn).
// - khoa_hoc / bai_viet và ca "khôi phục về đúng xuất bản nhờ cột
//   trang_thai_truoc_xoa": để test.fixme kèm ghi chú "bật sau migration
//   009" — TUYỆT ĐỐI không để spec fail đỏ trong suite khi chưa dán 009.
// Mọi dữ liệu tạo ra có tiền tố TEST_DOT3_ và tự dọn bằng xóa vĩnh viễn
// ngay trong test (DB trở về baseline sau suite).
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";
const DAU = Date.now();

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

// Tạo công thức bằng form dùng chung (nguyên liệu/bước đã có sẵn mẫu) rồi
// "Gửi duyệt" — chef/admin: xuất bản luôn; user Pro: chờ duyệt.
async function taoCongThucGui(page: Page, duongDanForm: string, tieuDe: string) {
  await page.goto(duongDanForm);
  await page.locator("#tieu_de").fill(tieuDe);
  await page.getByRole("button", { name: "Gửi duyệt công thức" }).click();
  await expect(page).toHaveURL(/\/cong-thuc-da-gui/);
  await expect(page.getByText(tieuDe).first()).toBeVisible();
}

function theCongThucDaGui(page: Page, tieuDe: string) {
  return page.locator("div.shadow-xs").filter({ hasText: tieuDe }).first();
}
function theCongThucBep(page: Page, tieuDe: string) {
  return page.locator("div.border.rounded-2xl").filter({ hasText: tieuDe }).first();
}
function dongThungRac(page: Page, tieuDe: string) {
  return page.locator("div.divide-y > div").filter({ hasText: tieuDe }).first();
}

// Bấm Xóa trên thẻ/dòng hiện tại -> xác nhận "Chuyển vào thùng rác" trong hộp thoại
async function xoaVaoThungRac(page: Page, vung: ReturnType<Page["locator"]>) {
  await vung.getByRole("button", { name: "Xóa", exact: true }).click();
  const hopThoai = page.getByRole("dialog");
  await expect(hopThoai.getByText(/Thùng rác/)).toBeVisible();
  await hopThoai.getByRole("button", { name: "Chuyển vào thùng rác" }).click();
}

// Xóa vĩnh viễn 1 dòng trong thùng rác (hộp xác nhận 2 lớp)
async function xoaVinhVienDongRac(page: Page, tieuDe: string) {
  const dong = dongThungRac(page, tieuDe);
  await expect(dong).toBeVisible();
  await dong.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
  const hopThoai = page.getByRole("dialog");
  await expect(hopThoai.getByText(/không khôi phục được/)).toBeVisible();
  await hopThoai.getByRole("button", { name: "Tôi hiểu, tiếp tục" }).click();
  await hopThoai.getByRole("button", { name: "Xóa vĩnh viễn" }).click();
  await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
}

test.describe("Đợt 3 — Thùng rác công thức (chạy thật trước migration 009)", () => {
  test("Đầu bếp: xóa công thức xuất bản -> ẩn công khai -> thùng rác -> khôi phục về đúng xuất bản -> xóa vĩnh viễn", async ({ page }) => {
    const tieuDe = `TEST_DOT3_ Món thùng rác của bếp ${DAU}`;
    await dangNhap(page, "chef@naungon.vn");
    await taoCongThucGui(page, "/bep/cong-thuc/moi", tieuDe);
    await expect(theCongThucDaGui(page, tieuDe).getByText("Đã xuất bản")).toBeVisible();

    // Đang hiện công khai
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe).first()).toBeVisible();

    // Xóa từ khu bếp -> vào thùng rác
    await page.goto("/bep/cong-thuc");
    await expect(theCongThucBep(page, tieuDe)).toBeVisible();
    await xoaVaoThungRac(page, theCongThucBep(page, tieuDe));
    await expect(page.getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });

    // Biến mất khỏi trang công khai (Cokba cũng lọc deleted_at như trang này)
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe)).toHaveCount(0);

    // Thùng rác khu bếp: thấy dòng, còn ngày giữ, nhớ trạng thái trước xóa
    await page.goto("/bep/thung-rac");
    const dong = dongThungRac(page, tieuDe);
    await expect(dong).toBeVisible();
    await expect(dong.getByText(/Còn \d+ ngày/)).toBeVisible();
    await expect(dong.getByText(/Đã xuất bản/)).toBeVisible();

    // Khôi phục -> rời thùng rác, trở lại ĐÚNG trạng thái xuất bản + công khai
    await dong.getByRole("button", { name: "Khôi phục" }).click();
    await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
    await page.goto("/bep/cong-thuc");
    await expect(theCongThucBep(page, tieuDe).getByText("Đã xuất bản")).toBeVisible();
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe).first()).toBeVisible();

    // Dọn dữ liệu test: xóa lại rồi xóa vĩnh viễn trong thùng rác
    await page.goto("/bep/cong-thuc");
    await xoaVaoThungRac(page, theCongThucBep(page, tieuDe));
    await page.goto("/bep/thung-rac");
    await xoaVinhVienDongRac(page, tieuDe);
  });

  test("Học viên Pro: xóa công thức chờ duyệt -> thùng rác của tôi -> khôi phục về đúng chờ duyệt -> xóa vĩnh viễn", async ({ page }) => {
    const tieuDe = `TEST_DOT3_ Món thùng rác của Pro ${DAU}`;
    await dangNhap(page, "user1@naungon.vn");
    await taoCongThucGui(page, "/tao-cong-thuc", tieuDe);
    await expect(theCongThucDaGui(page, tieuDe).getByText("Chờ phê duyệt")).toBeVisible();

    // Xóa ngay tại "Công thức của tôi"
    await xoaVaoThungRac(page, theCongThucDaGui(page, tieuDe));
    await expect(page.getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });

    // Thùng rác của người dùng: thấy dòng của mình
    await page.goto("/thung-rac");
    const dong = dongThungRac(page, tieuDe);
    await expect(dong).toBeVisible();
    await expect(dong.getByText(/Còn \d+ ngày/)).toBeVisible();
    await expect(dong.getByText(/Chờ phê duyệt/)).toBeVisible();

    // Khôi phục -> trở lại danh sách với ĐÚNG trạng thái chờ duyệt
    await dong.getByRole("button", { name: "Khôi phục" }).click();
    await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
    await page.goto("/cong-thuc-da-gui");
    await expect(theCongThucDaGui(page, tieuDe).getByText("Chờ phê duyệt")).toBeVisible();

    // Dọn dữ liệu test
    await xoaVaoThungRac(page, theCongThucDaGui(page, tieuDe));
    await page.goto("/thung-rac");
    await xoaVinhVienDongRac(page, tieuDe);
  });

  test("Thùng rác theo chủ sở hữu: công thức đã xóa của đầu bếp KHÔNG xuất hiện trong thùng rác của học viên Pro", async ({ page, browser }) => {
    const tieuDe = `TEST_DOT3_ Món riêng của bếp ${DAU}`;
    await dangNhap(page, "chef@naungon.vn");
    await taoCongThucGui(page, "/bep/cong-thuc/moi", tieuDe);
    await page.goto("/bep/cong-thuc");
    await xoaVaoThungRac(page, theCongThucBep(page, tieuDe));
    await page.goto("/bep/thung-rac");
    await expect(dongThungRac(page, tieuDe)).toBeVisible();

    // Học viên Pro mở thùng rác của mình: không thấy món của đầu bếp
    const ctxPro = await browser.newContext();
    const pro = await ctxPro.newPage();
    await dangNhap(pro, "user1@naungon.vn");
    await pro.goto("/thung-rac");
    await expect(pro.getByRole("heading", { name: "Thùng rác" })).toBeVisible();
    await expect(pro.getByText(tieuDe)).toHaveCount(0);
    await ctxPro.close();

    // Dọn dữ liệu test
    await page.goto("/bep/thung-rac");
    await xoaVinhVienDongRac(page, tieuDe);
  });
});

test.describe("Đợt 3 — Bề mặt thùng rác quản trị + phân quyền khu vực", () => {
  test("Admin: trang thùng rác mở được, đủ 3 mục Công thức/Khóa học/Bài viết và nút Dọn thùng rác", async ({ page }) => {
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/thung-rac");
    await expect(page.getByRole("heading", { name: "Thùng rác" })).toBeVisible();
    await expect(page.getByText("Công thức đã xóa")).toBeVisible();
    await expect(page.getByText("Khóa học đã xóa")).toBeVisible();
    await expect(page.getByText("Bài viết đã xóa")).toBeVisible();
    await expect(page.getByRole("button", { name: "Dọn thùng rác" }).first()).toBeVisible();
    // Chưa dán migration 009: mục khóa học/bài viết hiện thông báo kích hoạt sau, trang không sập.
    // (Sau khi dán 009: bỏ dòng kiểm thông báo này và bật các test.fixme ở dưới.)
    await expect(page.getByText(/migration 009/).first()).toBeVisible();
  });

  test("Phân quyền: Pro vào thùng rác khu bếp/quản trị bị đưa về bảng điều khiển; đầu bếp vào thùng rác quản trị bị đưa về khu bếp", async ({ page, browser }) => {
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/bep/thung-rac");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);
    await page.goto("/quan-tri/thung-rac");
    await expect(page).toHaveURL(/\/bang-dieu-khien/);

    const ctxBep = await browser.newContext();
    const bep = await ctxBep.newPage();
    await dangNhap(bep, "chef@naungon.vn");
    await bep.goto("/quan-tri/thung-rac");
    await expect(bep).toHaveURL(/\/bep/);
    await ctxBep.close();
  });
});

test.describe("Đợt 3 — Ca chờ migration 009 (bật sau khi Bảo dán 009)", () => {
  // Cần cột khoa_hoc.deleted_at + trang_thai_truoc_xoa của migration 009.
  // Sau khi dán 009: bỏ .fixme và chạy thật theo kịch bản trong thân test.
  test.fixme("Khóa học: đầu bếp xóa -> học viên không học được -> thùng rác bếp (không có nút xóa vĩnh viễn) -> khôi phục -> học lại được", async () => {
    // Kịch bản dự kiến:
    // 1) chef tạo khóa TEST_DOT3_ (miễn phí) + 1 bài học, gửi duyệt; admin duyệt -> xuất bản.
    // 2) user1 mở /hoc-bai/<khoaHocId> học được bài đầu tiên.
    // 3) chef vào /bep/khoa-hoc bấm Xóa -> hộp xác nhận nêu rõ vào Thùng rác, khôi phục được 30 ngày.
    // 4) user1 vào lại /hoc-bai/<khoaHocId> -> 404; trang /khoa-hoc không còn khóa.
    // 5) chef mở /bep/thung-rac: thấy khóa, có nút Khôi phục, KHÔNG có nút Xóa vĩnh viễn
    //    (kèm ghi chú "Xóa vĩnh viễn khóa học do Admin thực hiện").
    // 6) Khôi phục -> user1 học lại được, tiến độ cũ còn nguyên.
    // 7) Dọn: chef xóa lại -> admin xóa vĩnh viễn trong /quan-tri/thung-rac (xác nhận 2 lớp,
    //    nêu rõ mất bài học/ghi danh/tiến độ/chứng chỉ).
  });

  // Cần migration 009 như trên. Action xoaVinhVienKhoaHoc đã từ chối tường
  // minh mọi vai khác admin — ca này kiểm ở tầng giao diện + hành vi sau 009.
  test.fixme("Phân quyền xóa vĩnh viễn khóa học: chỉ Admin (đầu bếp không có nút, gọi thẳng bị từ chối); đầu bếp A không thấy mục của đầu bếp B", async () => {
    // Kịch bản dự kiến:
    // 1) chef A (chef@naungon.vn) xóa 1 khóa của mình -> vào /bep/thung-rac của A thấy dòng.
    // 2) chef B đăng nhập /bep/thung-rac: không thấy khóa của A.
    // 3) Admin mở /quan-tri/thung-rac: thấy khóa, có nút Xóa vĩnh viễn cho khóa học.
  });

  // Ca chuẩn của kế hoạch B.3 cho người dùng thường: công thức ĐANG XUẤT BẢN
  // của Pro (đã được admin duyệt) bị xóa rồi khôi phục phải về đúng
  // 'xuat_ban' — bảo đảm bởi cột trang_thai_truoc_xoa của migration 009.
  test.fixme("Công thức xuất bản của Pro: xóa -> khôi phục về đúng trạng thái xuất bản nhờ trang_thai_truoc_xoa", async () => {
    // Kịch bản dự kiến:
    // 1) user1 tạo công thức TEST_DOT3_ gửi duyệt; admin duyệt -> xuất bản, hiện công khai.
    // 2) user1 xóa tại /cong-thuc-da-gui -> biến mất công khai, vào /thung-rac.
    // 3) Khôi phục tại /thung-rac -> hiện công khai lại ngay với trạng thái Đã xuất bản.
    // 4) Dọn: xóa lại + xóa vĩnh viễn trong /thung-rac.
  });

  // Cần bai_viet.deleted_at của migration 009 (trước 009 xóa bài là xóa cứng).
  test.fixme("Bài viết: người dùng xóa bài nháp -> vào thùng rác -> khôi phục về đúng trạng thái nháp; admin thấy trong thùng rác quản trị", async () => {
    // Kịch bản dự kiến:
    // 1) user1 viết bài TEST_DOT3_ lưu nháp tại /bai-viet-cua-toi.
    // 2) Bấm Xóa -> hộp thoại nêu rõ vào Thùng rác, khôi phục được 30 ngày.
    // 3) /thung-rac (người dùng) thấy bài; admin /quan-tri/thung-rac cũng thấy ở mục Bài viết.
    // 4) Khôi phục -> bài trở lại /bai-viet-cua-toi với trạng thái Bản nháp.
    // 5) Dọn: xóa lại + xóa vĩnh viễn trong thùng rác.
  });
});

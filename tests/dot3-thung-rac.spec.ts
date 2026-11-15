import { test, expect, type Page, type Browser } from "@playwright/test";

// ĐỢT 3 (15/11/2026) — THÙNG RÁC (hoàn tác xóa) cho công thức / khóa học / bài viết.
//
// Cập nhật 16/11/2026 (việc 0 — kiểm chứng bù): migration 009 ĐÃ được dán
// vào Supabase (kiểm chứng bằng admin client: cong_thuc / khoa_hoc /
// bai_viet đều đã có deleted_at + trang_thai_truoc_xoa). Toàn bộ ca
// trong file này nay chạy THẬT — gồm cả 4 ca khóa học / bài viết / khôi
// phục đúng trạng thái xuất bản từng để test.fixme chờ 009.
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

// Bấm Xóa trên thẻ/dòng hiện tại -> xác nhận "Chuyển vào thùng rác" trong hộp thoại.
// QUAN TRỌNG: phải chờ hộp thoại ĐÓNG (chỉ đóng khi server action thành
// công) trước khi điều hướng đi nơi khác — điều hướng ngay sẽ hủy request
// đang bay và thao tác xóa không kịp ghi (race đã gặp ở lượt chạy đầu).
async function xoaVaoThungRac(page: Page, vung: ReturnType<Page["locator"]>) {
  await vung.getByRole("button", { name: "Xóa", exact: true }).click();
  const hopThoai = page.getByRole("dialog");
  await expect(hopThoai.getByText(/Thùng rác/)).toBeVisible();
  await hopThoai.getByRole("button", { name: "Chuyển vào thùng rác" }).click();
  await expect(hopThoai).toBeHidden({ timeout: 45_000 });
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
  await expect(hopThoai).toBeHidden({ timeout: 45_000 });
  await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
}

// --- Khóa học: helper dùng chung với spec đợt 1 ---
function theKhoaHoc(page: Page, tieuDe: string) {
  return page.locator("div.border.rounded-2xl").filter({ hasText: tieuDe }).first();
}

// Đầu bếp tạo khóa MIỄN PHÍ + 1 bài học -> gửi duyệt -> admin duyệt ->
// xuất bản. Trả về id khóa học (lấy từ URL trang bài học).
async function taoKhoaHocXuatBan(
  page: Page,
  browser: Browser,
  tieuDeKhoa: string,
  tieuDeBai: string
): Promise<string> {
  await page.goto("/bep/khoa-hoc/moi");
  await page.locator("#tieu_de").fill(tieuDeKhoa);
  await page.locator("#mo_ta").fill("Khóa học kiểm thử thùng rác đợt 3 — sẽ được dọn sau khi kiểm tra.");
  await page.getByRole("button", { name: "Lưu nháp" }).click();
  await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);

  // Thêm 1 bài học, đồng thời lấy id khóa từ URL
  await theKhoaHoc(page, tieuDeKhoa).getByRole("link", { name: /Bài học/ }).click();
  await expect(page).toHaveURL(/\/bep\/khoa-hoc\/[0-9a-f-]{36}\/bai-hoc/);
  const khoaHocId = page.url().match(/khoa-hoc\/([0-9a-f-]{36})\/bai-hoc/)![1];
  await page.getByRole("button", { name: "Thêm bài học mới" }).click();
  await page.locator("#tieu_de_bh").fill(tieuDeBai);
  await page.locator("#mo_ta_bh").fill("Bài học kiểm thử thùng rác đợt 3.");
  await page.getByRole("button", { name: "Thêm bài học", exact: true }).click();
  await expect(page.getByText(tieuDeBai).first()).toBeVisible();

  // Gửi phê duyệt
  await page.goto("/bep/khoa-hoc");
  await theKhoaHoc(page, tieuDeKhoa).getByRole("link", { name: "Sửa" }).click();
  await page.getByRole("button", { name: "Gửi phê duyệt" }).click();
  await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);
  await expect(theKhoaHoc(page, tieuDeKhoa).getByText("Chờ phê duyệt")).toBeVisible();

  // Admin duyệt -> xuất bản
  const ctxAdmin = await browser.newContext();
  const admin = await ctxAdmin.newPage();
  await dangNhap(admin, "admin@naungon.vn");
  await admin.goto("/quan-tri/khoa-hoc");
  const theAdmin = theKhoaHoc(admin, tieuDeKhoa);
  await expect(theAdmin.getByText("Chờ phê duyệt")).toBeVisible();
  await theAdmin.getByRole("button", { name: "Duyệt", exact: true }).click();
  await expect(theAdmin.getByText("Đã xuất bản")).toBeVisible({ timeout: 20_000 });
  await ctxAdmin.close();

  return khoaHocId;
}

// --- Bài viết: form dùng chung với spec đợt 1 ---
async function dienFormBaiViet(page: Page, tieuDe: string) {
  await page.getByLabel(/Tiêu đề bài viết/).fill(tieuDe);
  await page.getByLabel(/Tóm tắt ngắn/).fill("Bài viết kiểm thử thùng rác đợt 3 — sẽ được dọn sau khi kiểm tra.");
  await page.getByLabel(/Chuyên mục/).fill("Mẹo vặt");
  await page.getByLabel(/Ảnh bìa/).fill("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800");
  await page
    .getByLabel(/Nội dung bài viết/)
    .fill("Nội dung kiểm thử thùng rác đợt 3: lưu nháp, xóa vào thùng rác, khôi phục về đúng bản nháp rồi xóa vĩnh viễn.");
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
  test("Admin: trang thùng rác mở được, đủ 3 mục Công thức/Khóa học/Bài viết và nút Dọn thùng rác (đã kích hoạt sau 009)", async ({ page }) => {
    await dangNhap(page, "admin@naungon.vn");
    await page.goto("/quan-tri/thung-rac");
    await expect(page.getByRole("heading", { name: "Thùng rác" })).toBeVisible();
    await expect(page.getByText("Công thức đã xóa")).toBeVisible();
    await expect(page.getByText("Khóa học đã xóa")).toBeVisible();
    await expect(page.getByText("Bài viết đã xóa")).toBeVisible();
    await expect(page.getByRole("button", { name: "Dọn thùng rác" }).first()).toBeVisible();
    // Sau migration 009: không còn thông báo "kích hoạt sau" — 3 mục đã chạy thật.
    await expect(page.getByText(/migration 009/)).toHaveCount(0);
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

test.describe("Đợt 3 — Khóa học / bài viết / khôi phục đúng trạng thái (chạy thật sau migration 009)", () => {
  test("Khóa học: đầu bếp xóa -> học viên không học được -> thùng rác bếp (không có nút xóa vĩnh viễn) -> khôi phục -> học lại được", async ({ page, browser }) => {
    // Ca dài nhất suite (tạo khóa + duyệt + ghi danh + 2 vòng xóa/khôi
    // phục, 3 ngữ cảnh trình duyệt) — nới trần thời gian cho máy dev
    // chậm/biên dịch nguội; các assert chức năng giữ nguyên độ chặt.
    test.setTimeout(300_000);
    const tieuDeKhoa = `TEST_DOT3_ Khóa thùng rác ${DAU}`;
    const tieuDeBai = `TEST_DOT3_ Bài học thùng rác ${DAU}`;

    await dangNhap(page, "chef@naungon.vn");
    const khoaHocId = await taoKhoaHocXuatBan(page, browser, tieuDeKhoa, tieuDeBai);

    // Học viên ghi danh theo luồng THẬT: mở chi tiết khóa từ danh sách
    // công khai -> "Đăng ký học miễn phí" -> "Vào học ngay" -> vào được
    // bài học đầu tiên. (RLS bài học yêu cầu có bản ghi đăng ký: đi thẳng
    // /hoc-bai khi chưa ghi danh sẽ bị đưa về /khoa-hoc-cua-toi.)
    const ctxHv = await browser.newContext();
    const hv = await ctxHv.newPage();
    await dangNhap(hv, "user1@naungon.vn");
    await hv.goto("/khoa-hoc");
    await hv.locator("a").filter({ hasText: tieuDeKhoa }).first().click();
    await expect(hv).toHaveURL(/\/khoa-hoc\/[a-z0-9-]+$/);
    await hv.getByRole("button", { name: "Đăng ký học miễn phí" }).click();
    await expect(hv.getByRole("button", { name: "Vào học ngay" })).toBeVisible({ timeout: 20_000 });
    await hv.getByRole("button", { name: "Vào học ngay" }).click();
    await expect(hv).toHaveURL(new RegExp(`/hoc-bai/${khoaHocId}/[0-9a-f-]{36}`));
    await expect(hv.getByText(tieuDeBai).first()).toBeVisible();

    // Đầu bếp xóa khóa -> vào thùng rác
    await page.goto("/bep/khoa-hoc");
    await xoaVaoThungRac(page, theKhoaHoc(page, tieuDeKhoa));
    await expect(page.getByText(tieuDeKhoa)).toHaveCount(0, { timeout: 20_000 });

    // Học viên không học được nữa: trang vào học hiện trang 404 thân
    // thiện của app và KHÔNG vào được bài học. (Không assert HTTP status:
    // layout khu người dùng phát streaming phần khung trước khi trang
    // con gọi notFound() nên status là 200 — đã kiểm chứng thủ công:
    // nội dung hiện đúng "404 Không tìm thấy trang", không lộ bài học.)
    await hv.goto(`/hoc-bai/${khoaHocId}`);
    await expect(hv.getByText("Không tìm thấy trang")).toBeVisible({ timeout: 20_000 });
    await expect(hv).not.toHaveURL(new RegExp(`/hoc-bai/${khoaHocId}/[0-9a-f-]{36}`));
    await expect(hv.getByText(tieuDeBai)).toHaveCount(0);
    await hv.goto("/khoa-hoc");
    await expect(hv.getByText(tieuDeKhoa)).toHaveCount(0);
    await ctxHv.close();

    // Thùng rác khu bếp: có Khôi phục, KHÔNG có Xóa vĩnh viễn cho khóa học + có ghi chú Admin
    await page.goto("/bep/thung-rac");
    const dong = dongThungRac(page, tieuDeKhoa);
    await expect(dong).toBeVisible();
    await expect(dong.getByRole("button", { name: "Khôi phục" })).toBeVisible();
    await expect(dong.getByRole("button", { name: "Xóa vĩnh viễn" })).toHaveCount(0);
    await expect(page.getByText(/Xóa vĩnh viễn khóa học do Admin thực hiện/)).toBeVisible();

    // Khôi phục -> học viên học lại được
    await dong.getByRole("button", { name: "Khôi phục" }).click();
    await expect(page.locator("div.divide-y").getByText(tieuDeKhoa)).toHaveCount(0, { timeout: 20_000 });
    const ctxHv2 = await browser.newContext();
    const hv2 = await ctxHv2.newPage();
    await dangNhap(hv2, "user1@naungon.vn");
    await hv2.goto(`/hoc-bai/${khoaHocId}`);
    await expect(hv2).toHaveURL(new RegExp(`/hoc-bai/${khoaHocId}/[0-9a-f-]{36}`));
    await expect(hv2.getByText(tieuDeBai).first()).toBeVisible();
    await ctxHv2.close();

    // Dọn: đầu bếp xóa lại -> Admin xóa vĩnh viễn trong thùng rác quản trị
    await page.goto("/bep/khoa-hoc");
    await xoaVaoThungRac(page, theKhoaHoc(page, tieuDeKhoa));
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/thung-rac");
    await xoaVinhVienDongRac(admin, tieuDeKhoa);
    await ctxAdmin.close();
  });

  test("Phân quyền xóa vĩnh viễn khóa học: thùng rác của Pro không thấy khóa của bếp; Admin thấy và xóa vĩnh viễn được", async ({ page, browser }) => {
    // Ghi chú phạm vi: hệ thống demo chỉ có 1 tài khoản đầu bếp đăng nhập
    // được (chef@naungon.vn) nên ca "đầu bếp A vs đầu bếp B" được kiểm
    // bằng cùng cơ chế lọc chủ sở hữu đã có ca riêng cho công thức ở
    // trên; riêng việc "chỉ Admin xóa vĩnh viễn khóa học" được bảo đảm
    // TƯỜNG MINH trong action xoaVinhVienKhoaHoc (mọi vai khác admin bị
    // từ chối ngay trong server action — đã đọc trực tiếp code) và kiểm
    // ở đây qua giao diện: khu bếp không có nút, khu quản trị có nút.
    const tieuDeKhoa = `TEST_DOT3_ Khóa phân quyền rác ${DAU}`;
    await dangNhap(page, "chef@naungon.vn");
    await page.goto("/bep/khoa-hoc/moi");
    await page.locator("#tieu_de").fill(tieuDeKhoa);
    await page.locator("#mo_ta").fill("Khóa nháp kiểm thử phân quyền thùng rác đợt 3.");
    await page.getByRole("button", { name: "Lưu nháp" }).click();
    await expect(page).toHaveURL(/\/bep\/khoa-hoc$/);

    // Đầu bếp xóa khóa nháp của mình
    await xoaVaoThungRac(page, theKhoaHoc(page, tieuDeKhoa));
    await page.goto("/bep/thung-rac");
    const dongBep = dongThungRac(page, tieuDeKhoa);
    await expect(dongBep).toBeVisible();
    await expect(dongBep.getByRole("button", { name: "Xóa vĩnh viễn" })).toHaveCount(0);

    // Học viên Pro không thấy khóa của đầu bếp trong thùng rác của mình
    const ctxPro = await browser.newContext();
    const pro = await ctxPro.newPage();
    await dangNhap(pro, "user1@naungon.vn");
    await pro.goto("/thung-rac");
    await expect(pro.getByText(tieuDeKhoa)).toHaveCount(0);
    await ctxPro.close();

    // Admin thấy khóa trong thùng rác quản trị và xóa vĩnh viễn được (dọn)
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/thung-rac");
    await xoaVinhVienDongRac(admin, tieuDeKhoa);
    await ctxAdmin.close();
  });

  test("Công thức xuất bản của Pro: xóa -> khôi phục về đúng trạng thái xuất bản nhờ trang_thai_truoc_xoa", async ({ page, browser }) => {
    const tieuDe = `TEST_DOT3_ Món Pro xuất bản ${DAU}`;
    await dangNhap(page, "user1@naungon.vn");
    await taoCongThucGui(page, "/tao-cong-thuc", tieuDe);
    await expect(theCongThucDaGui(page, tieuDe).getByText("Chờ phê duyệt")).toBeVisible();

    // Admin duyệt -> xuất bản
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/cong-thuc");
    const theAdmin = admin.locator("div.border.rounded-2xl").filter({ hasText: tieuDe }).first();
    await expect(theAdmin).toBeVisible();
    await theAdmin.getByRole("button", { name: "Duyệt", exact: true }).click();
    await expect(theAdmin.getByText("Đã xuất bản")).toBeVisible({ timeout: 20_000 });
    await ctxAdmin.close();

    // Hiện công khai + phía Pro hiện Đã xuất bản
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe).first()).toBeVisible();
    await page.goto("/cong-thuc-da-gui");
    await expect(theCongThucDaGui(page, tieuDe).getByText("Đã xuất bản")).toBeVisible();

    // Pro xóa -> mất công khai, vào thùng rác với trạng thái nhớ = Đã xuất bản
    await xoaVaoThungRac(page, theCongThucDaGui(page, tieuDe));
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe)).toHaveCount(0);
    await page.goto("/thung-rac");
    const dong = dongThungRac(page, tieuDe);
    await expect(dong).toBeVisible();
    await expect(dong.getByText(/Đã xuất bản/)).toBeVisible();

    // Khôi phục -> về ĐÚNG xuất bản, hiện công khai lại ngay
    await dong.getByRole("button", { name: "Khôi phục" }).click();
    await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
    await page.goto("/cong-thuc-da-gui");
    await expect(theCongThucDaGui(page, tieuDe).getByText("Đã xuất bản")).toBeVisible();
    await page.goto("/cong-thuc");
    await expect(page.getByText(tieuDe).first()).toBeVisible();

    // Dọn dữ liệu test
    await page.goto("/cong-thuc-da-gui");
    await xoaVaoThungRac(page, theCongThucDaGui(page, tieuDe));
    await page.goto("/thung-rac");
    await xoaVinhVienDongRac(page, tieuDe);
  });

  test("Bài viết: người dùng xóa bài nháp -> vào thùng rác -> khôi phục về đúng trạng thái nháp; admin thấy trong thùng rác quản trị", async ({ page, browser }) => {
    const tieuDe = `TEST_DOT3_ Bài nháp thùng rác ${DAU}`;
    await dangNhap(page, "user1@naungon.vn");
    await page.goto("/tao-bai-viet");
    await dienFormBaiViet(page, tieuDe);
    await page.getByRole("button", { name: "Lưu bản nháp" }).click();
    await expect(page).toHaveURL(/\/bai-viet-cua-toi/);
    await expect(page.getByText(tieuDe)).toBeVisible();

    // Xóa bài nháp -> vào thùng rác (hộp thoại của NutXoaVaoThungRac)
    const vungBai = page.locator("div.overflow-hidden.shadow-xs").filter({ hasText: tieuDe }).first();
    await xoaVaoThungRac(page, vungBai);
    await expect(page.getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });

    // Thùng rác người dùng thấy bài; thùng rác quản trị cũng thấy
    await page.goto("/thung-rac");
    const dong = dongThungRac(page, tieuDe);
    await expect(dong).toBeVisible();
    await expect(dong.getByText(/Bản nháp/)).toBeVisible();
    const ctxAdmin = await browser.newContext();
    const admin = await ctxAdmin.newPage();
    await dangNhap(admin, "admin@naungon.vn");
    await admin.goto("/quan-tri/thung-rac");
    await expect(dongThungRac(admin, tieuDe)).toBeVisible();
    await ctxAdmin.close();

    // Khôi phục -> bài trở lại danh sách của tôi với trạng thái Bản nháp
    await dong.getByRole("button", { name: "Khôi phục" }).click();
    await expect(page.locator("div.divide-y").getByText(tieuDe)).toHaveCount(0, { timeout: 20_000 });
    await page.goto("/bai-viet-cua-toi");
    await expect(page.getByText(tieuDe)).toBeVisible();
    await expect(page.getByText("Bản nháp").first()).toBeVisible();

    // Dọn dữ liệu test
    const vungBai2 = page.locator("div.overflow-hidden.shadow-xs").filter({ hasText: tieuDe }).first();
    await xoaVaoThungRac(page, vungBai2);
    await page.goto("/thung-rac");
    await xoaVinhVienDongRac(page, tieuDe);
  });
});

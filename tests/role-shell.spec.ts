import { test, expect, type Page } from "@playwright/test";

// Kiểm thử tách khung giao diện 3 khu vực vai trò: trong khu vực Admin/Đầu bếp/Hỗ trợ
// TUYỆT ĐỐI không còn header trang công khai (logo về trang chủ + menu Công thức/
// Khóa học/Bảng giá...), và khi staff lạc sang khu vực thành viên/trang công khai
// thì luôn có lối quay về khu vực làm việc của mình.
const MAT_KHAU = process.env.TEST_PASSWORD ?? "Matkhau@123";

async function dangNhap(page: Page, email: string) {
  await page.goto("/dang-nhap");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(MAT_KHAU);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/dang-nhap"), { timeout: 30_000 });
}

const CAC_VAI_TRO = [
  { ten: "Admin", email: "admin@naungon.vn", nha: "/quan-tri", nhanVe: "Về trang quản trị", nhanMenu: "Trang quản trị", huyHieu: "Quản trị viên", tieuDeKhu: "Quản trị hệ thống", mauKhu: "admin" },
  { ten: "Đầu bếp", email: "chef@naungon.vn", nha: "/bep", nhanVe: "Về trang đầu bếp", nhanMenu: "Trang đầu bếp", huyHieu: "Đầu bếp", tieuDeKhu: "Bảng điều khiển đầu bếp", mauKhu: "chef" },
  { ten: "Hỗ trợ", email: "support@naungon.vn", nha: "/nhan-vien", nhanVe: "Về trang hỗ trợ", nhanMenu: "Trang hỗ trợ", huyHieu: "Hỗ trợ", tieuDeKhu: "Hỗ trợ", mauKhu: "support" },
];

// Liên kết thuộc giao diện người dùng/học viên — không được xuất hiện trong
// sidebar và menu di động của 3 khu vực staff.
const LIEN_KET_NGUOI_DUNG = ["/cong-thuc", "/khoa-hoc", "/bang-gia", "/bai-viet", "/bang-dieu-khien", "/goi-cua-toi"];

for (const vt of CAC_VAI_TRO) {
  test(`Khung riêng ${vt.ten}: không còn header công khai, lạc ra ngoài quay về được`, async ({ page }) => {
    await dangNhap(page, vt.email);
    await page.goto(vt.nha);
    const header = page.locator("header");
    // Không có logo trỏ về trang chủ và không có menu trang công khai trong khu vực
    await expect(header.locator("a[href='/']")).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Bảng giá Pro" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Giới thiệu" })).toHaveCount(0);
    await expect(header.getByRole("link", { name: "Liên hệ" })).toHaveCount(0);
    // Topbar riêng hiện huy hiệu vai trò
    await expect(header.getByText(vt.huyHieu).first()).toBeVisible();
    // Nhận diện khu vực: tiêu đề khu + chip màu nhấn riêng theo vai trò
    await expect(header.getByText(vt.tieuDeKhu).first()).toBeVisible();
    await expect(header.locator(`[data-mau-khu='${vt.mauKhu}']`)).toHaveCount(1);

    // Sidebar desktop chỉ chứa chức năng của vai trò, không trộn liên kết học viên
    const aside = page.locator("aside");
    for (const href of LIEN_KET_NGUOI_DUNG) {
      await expect(aside.locator(`a[href='${href}']`)).toHaveCount(0);
    }

    // Lạc sang trang Hồ sơ (khu vực thành viên): sidebar có mục quay về ở đầu menu
    await page.goto("/ho-so");
    await page.getByRole("link", { name: vt.nhanVe }).click();
    await expect(page).toHaveURL(new RegExp(vt.nha.replace(/\//g, "\\/") + "$"));

    // Lạc ra trang chủ công khai: menu avatar có mục quay về ghi đúng tên khu vực
    await page.goto("/");
    await page.locator("header button:has([data-slot='avatar'])").first().click();
    const mucVe = page.getByRole("menuitem", { name: vt.nhanMenu });
    await expect(mucVe).toBeVisible();
    await mucVe.click();
    await expect(page).toHaveURL(new RegExp(vt.nha.replace(/\//g, "\\/") + "$"));
  });
}

test("Khung riêng Admin trên mobile: menu trượt chỉ có chức năng quản trị", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await dangNhap(page, "admin@naungon.vn");
  await page.goto("/quan-tri");
  const header = page.locator("header");
  await expect(header.locator("a[href='/']")).toHaveCount(0);
  // Mở menu di động của khu vực
  await header.getByRole("button", { name: /mở menu|mo menu/i }).first().click();
  const hopMenu = page.locator("[data-slot='sheet-content']");
  await expect(hopMenu.getByRole("link", { name: "Duyệt nâng cấp Pro" })).toBeVisible();
  for (const href of LIEN_KET_NGUOI_DUNG) {
    await expect(hopMenu.locator(`a[href='${href}']`)).toHaveCount(0);
  }
});

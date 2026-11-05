import { test, expect } from "@playwright/test";

test("Tìm kiếm công thức: gõ tiếng Việt liền mạch qua nhịp tải lại, không mất chữ, lọc đúng", async ({ page }) => {
  await page.goto("/cong-thuc");
  // Chờ trang hydrate xong mới gõ (gõ vào trang chưa hydrate sẽ không kích hoạt tìm kiếm)
  try { await page.waitForLoadState("networkidle", { timeout: 15_000 }); } catch { /* quá thời gian chờ vẫn tiếp tục */ }
  const o = page.getByPlaceholder("Tìm tên món, nguyên liệu...");
  await o.click();
  // Gõ "bánh", chờ nhịp debounce kích hoạt lần tải lại kết quả đầu tiên, rồi gõ tiếp " xèo"
  // ngay trong lúc kết quả đang tải — đúng khoảnh khắc bản cũ ghi đè mất chữ/mất dấu.
  await o.pressSequentially("bánh", { delay: 80 });
  await page.waitForTimeout(1200);
  await o.pressSequentially(" xèo", { delay: 60 });
  // Cốt lõi hồi quy: ô nhập giữ nguyên vẹn cả cụm từ và vẫn còn focus để gõ tiếp
  await expect(o).toHaveValue("bánh xèo");
  await expect(o).toBeFocused();
  // URL cuối cùng mang đủ từ khóa và danh sách lọc đúng món (máy chủ local phản hồi chậm
  // khi nhiều trang được tải cùng lúc nên chờ tối đa 60 giây)
  await expect(page).toHaveURL(/tu_khoa=b%C3%A1nh(\+|%20)x%C3%A8o/, { timeout: 60_000 });
  await expect(page.locator("main a[href='/cong-thuc/banh-xeo-mien-tay']")).toBeVisible();
});

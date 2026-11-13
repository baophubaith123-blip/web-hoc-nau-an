import { defineConfig } from "@playwright/test";

// Cấu hình riêng cho các ca kiểm tra node-side của bộ não Cokba
// (tests/tro-ly.spec.ts): không mở trình duyệt, không dựng web server,
// chỉ chạy các hàm thuần trong src/lib/tro-ly/ để kiểm tra nhanh.
// Chạy: npx playwright test -c playwright.node.config.ts
export default defineConfig({
  testDir: "./tests",
  testMatch: ["tro-ly.spec.ts", "tro-ly-corpus.spec.ts"],
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
});

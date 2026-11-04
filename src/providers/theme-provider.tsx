"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

// Toaster đổi màu theo chế độ sáng/tối
function ToasterTheoGiaoDien() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
    />
  );
}

// Lưu lựa chọn sáng/tối vào localStorage (khóa "theme"), mặc định theo hệ thống
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
      <ToasterTheoGiaoDien />
    </NextThemesProvider>
  );
}
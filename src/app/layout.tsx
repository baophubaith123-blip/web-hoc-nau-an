import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Geist } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { QueryProvider } from "@/providers/query-provider";
import { vi } from "@/lib/i18n/vi";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${vi.chung.ten_site} - ${vi.chung.slogan}`, template: `%s | ${vi.chung.ten_site}` },
  description: "Công thức và khóa học nấu ăn từ các đầu bếp hàng đầu.",
  openGraph: { locale: "vi_VN", type: "website", siteName: vi.chung.ten_site, images: ["/og-image.jpg"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${font.variable} font-sans`}>
        <ThemeProvider>
          <I18nProvider>
            <QueryProvider>{children}</QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
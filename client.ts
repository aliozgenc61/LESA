import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LESA | AI Business Operating System",
  description: "CEM Su Sayaçları için ihale, üretim, finans, garanti ve servis yönetim platformu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

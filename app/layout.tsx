import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phạm Kim Bảo Trân | Portfolio",
  description: "Content Creator portfolio — Phạm Kim Bảo Trân",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={jakarta.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

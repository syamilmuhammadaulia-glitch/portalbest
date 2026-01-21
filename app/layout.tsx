import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Ganti ke Inter agar kompatibel dengan v14
import "./globals.css";

// Konfigurasi font Inter sebagai pengganti Geist
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BEST OSIS SMPIP Baitul Maal",
  description: "Website Resmi BEST OSIS SMPIP Baitul Maal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {/* PENTING: children harus ada di sini agar isi page.tsx muncul */}
        {children}
      </body>
    </html>
  );
}

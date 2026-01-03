"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Menu, X } from "lucide-react";

// Tambahkan Interface Props agar Navbar bisa menerima fungsi pembuka portal
interface NavbarProps {
  onEnterPortal?: () => void;
}

export default function Navbar({ onEnterPortal }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    e.preventDefault();

    if (id === "beranda") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO - Sudah menggunakan /logo.png sesuai folder public kamu */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="font-black text-slate-900 tracking-tighter text-xl uppercase">
            BEST
          </span>
        </Link>

        {/* MENU NAVIGASI DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {[
            "Beranda",
            "Tentang",
            "Statistik",
            "Berita",
            "Event",
            "Struktur",
            "FAQ",
            "Aspirasi",
          ].map((item) =>
            item === "Aspirasi" ? (
              <Link
                key={item}
                href="/aspirasi"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest cursor-pointer"
              >
                {item}
              </Link>
            ) : (
              <motion.a
                key={item}
                href={`/#${item.toLowerCase()}`}
                whileHover={{ y: -2 }}
                onClick={(e) => scrollToSection(e, item.toLowerCase())}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest cursor-pointer"
              >
                {item}
              </motion.a>
            )
          )}

          {/* DROPDOWN PENDAFTARAN */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest outline-none">
              Pendaftaran{" "}
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-0 w-48 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden py-2 z-50"
                >
                  <Link
                    href="/pendaftaran"
                    className="block px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase"
                  >
                    Info Pendaftaran
                  </Link>
                  <Link
                    href="/pengumuman"
                    className="block px-4 py-3 text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase"
                  >
                    Hasil Pengumuman
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PERBAIKAN: Menggunakan onClick bukannya Link href="/portal" */}
          <motion.button
            onClick={() => {
              if (onEnterPortal) {
                onEnterPortal();
              } else {
                window.location.href = "/portal";
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-blue-200"
          >
            Masuk Portal <ArrowRight size={14} />
          </motion.button>
        </div>

        {/* TOMBOL MENU MOBILE */}
        <div className="md:hidden text-slate-600">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* DRAWER MENU MOBILE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 p-6 space-y-5 overflow-hidden"
          >
            {["Beranda", "Tentang", "Berita", "Event", "Struktur", "FAQ"].map(
              (item) => (
                <a
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  onClick={(e) => {
                    scrollToSection(e, item.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-sm font-black text-slate-600 uppercase tracking-widest"
                >
                  {item}
                </a>
              )
            )}
            <Link
              href="/aspirasi"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-black text-blue-600 uppercase tracking-widest"
            >
              Aspirasi Siswa
            </Link>

            {/* Tombol Portal di Mobile */}
            <button
              onClick={() => (window.location.href = "/portal")}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm uppercase"
            >
              Masuk Portal
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <Link
                href="/pendaftaran"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-500 uppercase"
              >
                Info Pendaftaran
              </Link>
              <Link
                href="/pengumuman"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-500 uppercase"
              >
                Cek Hasil Pengumuman
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

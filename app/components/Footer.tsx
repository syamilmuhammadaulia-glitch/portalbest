"use client";
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Jarak mt-60 memastikan footer tidak menabrak elemen di atasnya saat scroll */}
      <footer className="bg-slate-50 text-center mt-60 relative">
        {/* Garis pemisah tipis yang full lebar layar */}
        <div className="w-full border-t border-slate-200"></div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            {/* 1. BRANDING & LOGO */}
            <div className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Logo Footer"
                className="w-10 h-10 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="text-left border-l border-slate-200 pl-3">
                <span className="font-black text-[10px] tracking-tighter text-slate-500 leading-tight uppercase block">
                  BEST SMP ISLAM PLUS
                </span>
                <span className="font-black text-[10px] tracking-tighter text-slate-500 leading-tight uppercase block">
                  BAITUL MAAL
                </span>
              </div>
            </div>

            {/* 2. INFO & CREDITS (PUSAT PERHATIAN) */}
            <div className="flex flex-col items-center gap-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  &copy; 2026 BEST Digital Management
                </p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest italic opacity-80">
                  Dikelola oleh Departemen BPH, IPTEK, dan Humas
                </p>
              </div>

              {/* Kredit Developer dengan Link Aktif */}
              <div className="pt-2">
                <p className="text-[8px] text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                  Designed & Developed by{" "}
                  <motion.a
                    whileHover={{ color: "#3b82f6" }}
                    href="https://instagram.com/syamiiiiiiiiiil" // Masukkan username IG kamu di sini
                    target="_blank"
                    className="font-bold text-slate-400 underline decoration-slate-200 underline-offset-4 hover:decoration-blue-400 transition-all cursor-pointer"
                  >
                    Syamil Muhammad Aulia
                  </motion.a>
                </p>
              </div>
            </div>

            {/* 3. SOCIAL MEDIA LINKS */}
            <div className="flex items-center gap-6">
              <motion.a
                whileHover={{ y: -2, color: "#db2777" }}
                href="https://instagram.com/bestsmpipbm_"
                target="_blank"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-pink-600 transition-all flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                Instagram
              </motion.a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON (WHATSAPP) */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="https://wa.me/628123456789"
        target="_blank"
        className="fixed bottom-10 right-6 md:bottom-24 md:right-10 bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-200/50 z-50 flex items-center gap-2 border border-white/20 backdrop-blur-sm"
      >
        <MessageCircle
          size={20}
          fill="currentColor"
          className="text-emerald-100"
        />
        <span className="font-black text-[10px] uppercase tracking-[0.2em] hidden md:block">
          Bantuan
        </span>
      </motion.a>
    </>
  );
}

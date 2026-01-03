"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  GraduationCap,
  MessageCircle,
  Lightbulb,
  Info,
  Bell,
  ShieldCheck,
} from "lucide-react";

export default function AspirasiPage() {
  // GANTI LINK DI BAWAH INI DENGAN LINK GOOGLE FORM KAMU
  const GOOGLE_FORM_URL = "https://forms.google.com";
  const aspirasiOptions = [
    {
      title: "Aspirasi Siswa Siswi",
      desc: "Wadah suara bagi seluruh siswa SMPIP Baitul Maal.",
      icon: <Users className="text-blue-600" size={28} />,
      link: GOOGLE_FORM_URL,
    },
    {
      title: "Aspirasi Khusus Guru",
      desc: "Masukan dan saran dari Bapak/Ibu Guru untuk OSIS.",
      icon: <GraduationCap className="text-emerald-600" size={28} />,
      link: GOOGLE_FORM_URL,
    },
    {
      title: "Kritik/Saran Untuk OSIS",
      desc: "Evaluasi kinerja pengurus BEST OSIS agar lebih baik.",
      icon: <MessageCircle className="text-red-500" size={28} />,
      link: GOOGLE_FORM_URL,
    },
    {
      title: "Masukan Ide Kegiatan",
      desc: "Punya ide acara seru? Sampaikan idemu di sini!",
      icon: <Lightbulb className="text-yellow-500" size={28} />,
      link: GOOGLE_FORM_URL,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <main className="max-w-4xl mx-auto px-6">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 bg-white shadow-xl rounded-[2rem] mb-6 text-blue-600"
          >
            <MessageSquare size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase mb-4 tracking-tight">
            Kotak Suara
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Pilih kategori di bawah untuk menyampaikan aspirasimu.
          </p>
        </header>

        {/* SECTION: PEMBERITAHUAN PENTING */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-200 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="bg-white/20 p-4 rounded-2xl">
            <Bell size={32} className="animate-bounce" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black uppercase tracking-widest text-sm mb-1">
              Pemberitahuan Penting
            </h4>
            <p className="text-blue-100 text-xs font-medium leading-relaxed">
              Kotak aspirasi periode semester genap telah dibuka. Semua masukan
              akan dibahas dalam rapat koordinasi BEST OSIS setiap akhir bulan.
            </p>
          </div>
        </motion.div>

        {/* GRID TOMBOL UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {aspirasiOptions.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start group transition-all"
            >
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-slate-100 shadow-inner group-hover:shadow-none transition-all">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                {item.desc}
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Buka Google Form <ArrowLeft className="rotate-180" size={14} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* SECTION: INFO TAMBAHAN & PRIVASI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h5 className="font-black text-xs uppercase mb-2">
                Privasi Terjamin
              </h5>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                Data yang masuk melalui Google Form dienkripsi dan hanya dapat
                diakses oleh pimpinan BPH OSIS tanpa disebarluaskan.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="text-emerald-600 bg-emerald-50 p-3 rounded-xl">
              <Info size={24} />
            </div>
            <div>
              <h5 className="font-black text-xs uppercase mb-2">
                Alur Tindak Lanjut
              </h5>
              <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                Aspirasi yang valid akan disampaikan kepada pihak sekolah atau
                dibahas dalam program kerja BEST berikutnya.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

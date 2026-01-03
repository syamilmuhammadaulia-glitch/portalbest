"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  ExternalLink,
  Lock,
  ChevronDown,
} from "lucide-react";

export default function InfoPendaftaran() {
  const linkPendaftaran =
    "https://docs.google.com/forms/d/e/1FAIpQLSdwCmavhaGAUy01X9ZPqHcVxoQtYobliZ6fS51uZEXCExmSxg/viewform?usp=dialog";

  const targetDate = new Date("2026-08-24T08:00:00");
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      if (now >= targetDate) {
        setIsOpened(true);
      }
    };

    checkDate();
    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto py-12 px-6">
        {/* HEADER */}
        <div className="mb-10 text-center md:text-left">
          <span
            className={`font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full ${
              isOpened
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            Status: {isOpened ? "Pendaftaran Dibuka" : "Segera Hadir"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 mb-4 uppercase italic leading-tight tracking-tighter">
            DAFTAR UNTUK{" "}
            <span className="text-blue-600">MENJADI PENGURUS BEST</span>
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Persiapkan dirimu untuk menjadi bagian dari pengurus BEST SMPIP
            Baitul Maal periode 2026/2027. Jadilah pemimpin yang inovatif dan
            berakhlak mulia.
          </p>
        </div>

        <div className="space-y-8">
          {/* KARTU SYARAT */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="flex items-center gap-3 text-lg font-black text-slate-800 mb-6 uppercase tracking-wider">
              <FileText className="text-blue-600" /> Syarat & Ketentuan
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 font-medium">
              {[
                "Siswa/i aktif SMPIP Baitul Maal (Kelas 7 & 8)",
                "Memiliki komitmen dan tanggung jawab tinggi",
                "Mendapat izin dari orang tua",
                "Siap mengikuti seluruh rangkaian seleksi",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <CheckCircle
                    size={18}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AREA TOMBOL */}
          {!isOpened ? (
            <div className="bg-slate-200 p-8 rounded-[2rem] text-center border-2 border-dashed border-slate-300">
              <Lock size={40} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">
                Pendaftaran akan otomatis terbuka pada:
              </p>
              <p className="text-slate-800 font-black text-xl mt-2">
                24 Agustus 2026
              </p>
            </div>
          ) : (
            <a
              href={linkPendaftaran}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-1 w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              <div className="flex items-center gap-3 text-lg">
                Isi Formulir Online <ExternalLink size={20} />
              </div>
              <span className="text-[9px] opacity-80 font-bold">
                Klik untuk membuka Google Form
              </span>
            </a>
          )}

          {/* FAQ SECTION */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-center mb-10 uppercase italic">
              Tanya <span className="text-blue-600">Jawab</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Siapa yang boleh daftar?",
                  a: "Siswa aktif kelas 7 dan 8 SMPIP Baitul Maal.",
                },
                {
                  q: "Bagaimana jika lupa ID pendaftaran?",
                  a: "Hubungi admin melalui tombol bantuan yang ada di halaman depan saja.",
                },
                {
                  q: "Apa saja tesnya?",
                  a: "Tes tertulis online dan wawancara tatap muka.",
                },
                {
                  q: "Apakah siswa kelas 9 boleh mendaftar?",
                  a: "Pendaftaran dibuka untuk siswa kelas 7 dan 8. Kelas 9 disarankan fokus pada persiapan ujian kelulusan.",
                },
                {
                  q: "Apa saja syarat utama untuk menjadi pengurus?",
                  a: "Memiliki niat yang kuat, disiplin, mampu membagi waktu antara belajar dan organisasi.",
                },
                {
                  q: "Departemen apa saja yang terdapat di BEST OSIS?",
                  a: "BPH, Humas, Agama, IPTEK, Sabda (Seni Pendidikan Budaya), Lingkup (Lingkungan Hidup), Disorkes (Disiplin Olahraga dan kesehatan).",
                },
                {
                  q: "Apa itu Departemen BPH?",
                  a: "BPH (Badan Pengurus Harian) adalah inti organisasi yang terdiri dari Presiden, Wakil, Sekretaris, dan Bendahara. Tugasnya memimpin, mengoordinasi, dan mengawasi seluruh jalannya organisasi.",
                },
                {
                  q: "Apa tugas Departemen Humas?",
                  a: "Humas (Hubungan Masyarakat) bertugas sebagai jembatan komunikasi antara pengurus OSIS dengan siswa, guru, dan pihak luar.",
                },
                {
                  q: "Apa fungsi Departemen Agama?",
                  a: "Departemen Agama berfokus pada pembinaan mental dan spiritual siswa, termasuk mengatur jadwal ibadah dan kegiatan hari besar keagamaan.",
                },
                {
                  q: "Apa peran Departemen IPTEK?",
                  a: "IPTEK (Ilmu Pengetahuan dan Teknologi) bertanggung jawab atas pengembangan wawasan akademik dan teknologi digital sekolah.",
                },
                {
                  q: "Apa itu Departemen SABDA?",
                  a: "SABDA (Seni Pendidikan Budaya) adalah wadah kreativitas siswa di bidang seni dan budaya sekolah.",
                },
                {
                  q: "Apa tanggung jawab Departemen Lingkup?",
                  a: "Departemen Lingkup (Lingkungan Hidup) bertanggung jawab menjaga kebersihan dan kelestarian lingkungan sekolah.",
                },
                {
                  q: "Apa tugas Departemen Disorkes?",
                  a: "Disorkes (Disiplin, Olahraga, dan Kesehatan) bertugas memantau ketertiban siswa dan mengatur kegiatan olahraga.",
                },
              ].map((faq, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-slate-50 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <summary className="font-black text-[11px] uppercase tracking-wider list-none flex justify-between items-center outline-none">
                    {faq.q}
                    <ChevronDown
                      size={14}
                      className="group-open:rotate-180 transition-transform"
                    />
                  </summary>
                  <p className="mt-3 text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    {faq.a}
                  </p>
                </motion.details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

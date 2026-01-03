"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Target,
  Award,
  Bell,
  Calendar,
  Star,
  Info,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

interface LandingProps {
  onEnterPortal: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function LandingPage({ onEnterPortal }: LandingProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    // Jika id adalah beranda, naik ke paling atas
    if (id === "beranda" || id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id.toLowerCase());
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div id="home" className="min-h-screen bg-white text-slate-900">
        {/* --- 2. HERO SECTION --- */}
        <section id="beranda" className="pt-32 pb-20">
          <header className="py-20 px-6 text-center bg-white relative overflow-hidden">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8 relative"
            >
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10"
              />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-7xl font-black mb-6 leading-tight text-slate-900 tracking-tight"
            >
              BEST <br />{" "}
              <span className="text-blue-600 uppercase text-3xl md:text-5xl block mt-2">
                SMPIP BAITUL MAAL
              </span>
            </motion.h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10 text-justify px-4">
              Organisai Siswa Intra Sekolah (OSIS) adalah wadah resmi untuk
              menyalurkan ide, minat, dan aspirasi siswa. Melalui OSIS, kamu
              belajar kepemimpinan, kerja sama, dan tanggung jawab secara
              langsung.
            </p>
          </header>
        </section>
        {/* 3. TENTANG SECTION (Reveal on Scroll) */}
        <motion.section
          id="tentang"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="py-20 px-6 max-w-5xl mx-auto scroll-mt-24"
        >
          <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Info /> TENTANG BEST OSIS
              </h2>
              <p className="text-blue-50 leading-relaxed text-lg text-justify">
                Badan Eksekutif Siswa Terpadu (BEST) OSIS adalah tim pengurus
                siswa yang merencanakan, melaksanakan, dan mengawasi program
                kerja siswa agar berjalan tertib dan sejalan dengan tujuan
                sekolah.
              </p>
            </div>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="absolute -right-10 -bottom-10 opacity-10 transition-transform"
            >
              <Users size={300} />
            </motion.div>
          </div>
        </motion.section>
        {/* 4. VISI & MISI */}
        <section className="py-10 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[2rem] border-2 border-blue-100 shadow-sm"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase">Visi</h3>
            <p className="text-slate-600 font-medium">
              Mewujudkan OSIS yang berlandaskan budi pekerti luhur serta menjadi
              teladan bagi seluruh siswa/i melalui kegiatan kreatif &
              bermanfaat.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[2rem] border-2 border-emerald-100 shadow-sm"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Award size={28} />
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase">Misi</h3>
            <ul className="text-slate-600 space-y-3 font-medium">
              {[
                "Membangun budaya akhlak mulia.",
                "Menjadi contoh disiplin & etika.",
                "Ruang komunikasi aktif.",
                "Wadah kreatif ide positif.",
                "Partisipasi aktif masyarakat.",
              ].map((misi, i) => (
                <li key={i} className="flex gap-2">
                  <span>{i + 1}.</span> {misi}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
        {/* 5. STATISTIK */}
        <section
          id="statistik"
          className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-6 text-center"
          >
            <h2 className="text-3xl font-black mb-12 uppercase tracking-wide">
              BEST dalam Angka
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: "7", t: "Seksi Departemen" },
                { n: "34", t: "Pengurus OSIS BEST" },
                { n: "15+", t: "Program Kerja" },
                { n: "250+", t: "Siswa Terlibat" },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <p className="text-5xl font-black mb-2">{stat.n}</p>
                  <p className="text-blue-100 font-bold text-sm uppercase">
                    {stat.t}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        {/* 6. BERITA & PROKER */}
        <section
          id="berita"
          className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 scroll-mt-24"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Bell className="text-blue-600" /> BERITA TERBARU
            </h3>

            <div className="space-y-4">
              {" "}
              {/* Pembungkus agar ada jarak antar berita */}
              {/* Berita 1: Pendaftaran */}
              <Link href="/pendaftaran" className="block group">
                <div className="bg-white p-5 rounded-2xl shadow-sm border group-hover:border-blue-500 group-hover:shadow-lg transition-all">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    PENGUMUMAN
                  </span>
                  <h4 className="font-bold mt-2 group-hover:text-blue-600">
                    Open Recruitment BEST Baru Telah Dibuka!
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Klik di sini untuk melihat syarat dan cara pendaftaran
                    online.
                  </p>
                </div>
              </Link>
              {/* Berita 2: Aspirasi (TAMBAHAN BARU) */}
              <Link href="/aspirasi" className="block group">
                <div className="bg-white p-5 rounded-2xl shadow-sm border group-hover:border-emerald-500 group-hover:shadow-lg transition-all">
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                    ASPIRASI
                  </span>
                  <h4 className="font-bold mt-2 group-hover:text-emerald-600">
                    Sampaikan Aspirasimu Lewat Kotak Suara Online!
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Punya ide kegiatan atau saran untuk sekolah? Kirim langsung
                    di sini.
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Star className="text-yellow-500" /> PROKER UNGGULAN
            </h3>
            <div className="p-5 bg-white rounded-2xl border-l-8 border-yellow-500 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-black text-slate-800 uppercase">
                BM CUP 2026
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Turnamen akbar olahraga dan seni antar sekolah se-Tangerang
                Selatan.
              </p>
            </div>
          </motion.div>
        </section>
        {/* 8. EVENT MENDATANG */}
        <section id="event" className="py-20 bg-white px-6 scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 uppercase">
              <Calendar className="text-emerald-600" /> Event Mendatang
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  date: "Februari 2026",
                  title: "LDKS Kepemimpinan",
                  desc: "Pelatihan dasar untuk mengasah jiwa kepemimpinan pengurus baru.",
                },
                {
                  date: "Maret 2026",
                  title: "Gema Ramadhan",
                  desc: "Serangkaian lomba religi dan kegiatan berbagi di bulan suci.",
                },
              ].map((ev, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                >
                  <span className="text-xs font-bold text-emerald-600 uppercase">
                    {ev.date}
                  </span>
                  <h4 className="font-black mt-2 uppercase">{ev.title}</h4>
                  <p className="text-sm text-slate-500 mt-2">{ev.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* 9. STRUKTUR ORGANISASI */}
        <section
          id="struktur"
          className="py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
                Struktur Organisasi
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            {/* PRESIDEN */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center relative mb-12"
            >
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl w-64 z-10 text-center hover:rotate-1 transition-transform">
                <p className="text-[10px] uppercase font-bold opacity-80 mb-1">
                  Presiden BEST OSIS
                </p>
                <h3 className="font-bold text-xl leading-tight">
                  Asykar Munadhil Syabib Irnowo
                </h3>
              </div>
              <div className="absolute top-full left-1/2 w-0.5 h-12 bg-slate-200 -translate-x-1/2"></div>
            </motion.div>

            {/* BPH UTAMA */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-20 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 -translate-y-1/2"></div>
              {[
                { title: "Wakil Presiden", name: "Ikhsan Ramadhan Kusnadi" },
                { title: "Sekretaris", name: "Hafidzah Bequina Aghniya A." },
                { title: "Bendahara", name: "Lulu Fatin Nabila" },
              ].map((bph, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white border-2 border-blue-500 p-5 rounded-xl shadow-md w-56 z-10 text-center"
                >
                  <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">
                    {bph.title}
                  </p>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {bph.name}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* DEPARTEMEN LIST (MENGGUNAKAN MAP DATA KAMU) */}
            <div className="space-y-16">
              {[
                {
                  namaDept: "Humas",
                  anggota: [
                    {
                      nama: "Kayla Azka Shazia Wibowo",
                      kelas: "8B2",
                      jab: "Mentri",
                    },
                    {
                      nama: "Athaya Zahratus Silmi",
                      kelas: "8B1",
                      jab: "Wakil Mentri",
                    },
                    {
                      nama: "Kayyasa Syalabiyyah P.",
                      kelas: "8B1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Alleira Aydina Nadifa S.",
                      kelas: "7B2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Tsabita Nur Azizah",
                      kelas: "7B2",
                      jab: "Anggota",
                    },
                  ],
                },
                {
                  namaDept: "Disorkes",
                  anggota: [
                    { nama: "Kirania Maiza", kelas: "8B1", jab: "Mentri" },
                    {
                      nama: "Muhammad Razka Thariq A.",
                      kelas: "8A1",
                      jab: "Wakil Mentri",
                    },
                    {
                      nama: "Shakila Hana Azzahra",
                      kelas: "8B2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Almira Qanita Farzani W.",
                      kelas: "8B2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Dimarsyah Daanish Hafiz",
                      kelas: "7A1",
                      jab: "Anggota",
                    },
                  ],
                },
                {
                  namaDept: "SABDA",
                  anggota: [
                    {
                      nama: "Muhammad Ichigo Ararie P.",
                      kelas: "8A2",
                      jab: "Mentri",
                    },
                    { nama: "Alya Ulfa", kelas: "8B2", jab: "Wakil Mentri" },
                    {
                      nama: "Sahla Abira Syufie",
                      kelas: "8B1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Aruni Khaira Sabila",
                      kelas: "8B1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Dastian Al Qassimy",
                      kelas: "7A2",
                      jab: "Anggota",
                    },
                  ],
                },
                {
                  namaDept: "Agama",
                  anggota: [
                    {
                      nama: "Muhammad Roffiq Musaffa",
                      kelas: "8A1",
                      jab: "Mentri",
                    },
                    {
                      nama: "Mazaya Nairuwa A.",
                      kelas: "8B2",
                      jab: "Wakil Mentri",
                    },
                    {
                      nama: "Hafy Aydin Ramaputra",
                      kelas: "7A1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Arkaan Raffaizaz A.",
                      kelas: "7A2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Arfa Syazia Bisyri",
                      kelas: "8B1",
                      jab: "Anggota",
                    },
                  ],
                },
                {
                  namaDept: "Lingkup",
                  anggota: [
                    {
                      nama: "Muhammad Zuhair Asyraf",
                      kelas: "8A2",
                      jab: "Mentri",
                    },
                    {
                      nama: "Atiqah Fauziyah Rahma",
                      kelas: "8B1",
                      jab: "Wakil Mentri",
                    },
                    {
                      nama: "Arvina Andya Putri",
                      kelas: "8B1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Annisa Mutmainah Arifin",
                      kelas: "7B2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Ibamez Arsyad Zamzami",
                      kelas: "7A1",
                      jab: "Anggota",
                    },
                  ],
                },
                {
                  namaDept: "IPTEK",
                  anggota: [
                    {
                      nama: "Almarzuq Ramadhan Q.",
                      kelas: "8A1",
                      jab: "Mentri",
                    },
                    {
                      nama: "Fairuz Azzahra M",
                      kelas: "8B1",
                      jab: "Wakil Mentri",
                    },
                    {
                      nama: "Devdan Abyaz Rasyad",
                      kelas: "7A1",
                      jab: "Anggota",
                    },
                    {
                      nama: "Intan Fitri Mahrizal",
                      kelas: "8B2",
                      jab: "Anggota",
                    },
                    {
                      nama: "Safira Azkadina A.",
                      kelas: "7B2",
                      jab: "Anggota",
                    },
                  ],
                },
              ].map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-center mb-8">
                    <div className="h-[1px] bg-slate-200 flex-grow"></div>
                    <h4 className="px-6 font-black text-blue-600 uppercase text-xs tracking-[0.3em]">
                      DEPARTEMEN {dept.namaDept}
                    </h4>
                    <div className="h-[1px] bg-slate-200 flex-grow"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {dept.anggota.map((person, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-xl border text-center flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md ${
                          person.jab.includes("Mentri")
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-slate-100"
                        }`}
                      >
                        <div>
                          <p className="text-[9px] font-black text-blue-500 uppercase mb-1 italic">
                            {person.jab}
                          </p>
                          <p className="text-[11px] font-bold text-slate-800 leading-tight mb-2">
                            {person.nama}
                          </p>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 bg-slate-100 w-fit mx-auto px-2 py-0.5 rounded uppercase">
                          {person.kelas}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* 9.5 FAQ */}
        <section id="faq" className="py-20 bg-white px-6 border-t">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-center mb-10 uppercase italic">
              Tanya <span className="text-blue-600">Jawab</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Apa itu OSIS BEST?",
                  a: "BEST (Badan Eksekutif Siswa Terpadu) adalah organisasi siswa resmi di SMP Islam Plus Baitul Maal yang menjadi wadah aspirasi, pengembangan kepemimpinan, dan penyelenggara kegiatan kesiswaan.",
                },
                {
                  q: "Siapa saja yang boleh mendaftar menjadi pengurus?",
                  a: "Seluruh siswa kelas 7 dan 8 yang memiliki semangat belajar, integritas tinggi, dan ingin berkontribusi bagi kemajuan sekolah.",
                },
                {
                  q: "Bagaimana alur pendaftaran anggota baru?",
                  a: "Alur pendaftaran meliputi pengisian formulir online melalui portal ini, seleksi berkas, tes tertulis (pengetahuan umum & keorganisasian), serta tes wawancara.",
                },
                {
                  q: "Apa saja keuntungan bergabung di OSIS?",
                  a: "Kamu akan belajar public speaking, manajemen waktu, cara mengelola event besar, hingga memperluas jaringan pertemanan dan melatih jiwa kepemimpinan.",
                },
                {
                  q: "Apakah menjadi pengurus OSIS akan mengganggu waktu belajar?",
                  a: "Tidak, OSIS justru melatih disiplin waktu. Kegiatan OSIS sudah dijadwalkan agar tidak berbenturan dengan jam akademik utama sekolah.",
                },
                {
                  q: "Bagaimana cara menyampaikan aspirasi atau ide kegiatan?",
                  a: "Kamu bisa langsung menuju menu 'Aspirasi' di website ini atau menghubungi perwakilan kelas yang bertugas di Departemen Humas.",
                },
                {
                  q: "Di mana saya bisa melihat pengumuman hasil seleksi?",
                  a: "Hasil seleksi akan diumumkan secara resmi melalui menu 'Pendaftaran > Hasil Pengumuman' di website ini dan juga melalui akun Instagram resmi @bestsmpipbm_.",
                },
              ].map((faq, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-slate-50 rounded-2xl p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <summary className="font-black text-[11px] uppercase tracking-wider list-none flex justify-between items-center outline-none">
                    {faq.q}{" "}
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
          </div>
        </section>
      </div>
    </motion.div>
  );
}

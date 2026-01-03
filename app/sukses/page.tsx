"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Copy,
  ArrowRight,
  Home,
  AlertTriangle,
  MessageSquare, // Menggunakan icon Lucide lebih aman untuk build
} from "lucide-react";

export default function SuksesPage() {
  const [pendaftaranID, setPendaftaranID] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cek localStorage agar ID tidak berubah saat refresh
    const savedID = localStorage.getItem("last_registration_id");

    if (savedID) {
      setPendaftaranID(savedID);
    } else {
      const now = new Date();
      const tgl = now.getDate().toString().padStart(2, "0");
      const jam = now.getHours().toString().padStart(2, "0");
      const mnt = now.getMinutes().toString().padStart(2, "0");
      const dtk = now.getSeconds().toString().padStart(2, "0");
      const newID = `BEST-${tgl}${jam}${mnt}${dtk}`;

      setPendaftaranID(newID);
      localStorage.setItem("last_registration_id", newID);
    }
  }, []);

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(pendaftaranID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mencegah error hydration pada Next.js
  if (!isMounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 italic font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100 relative overflow-hidden">
        {/* Dekorasi Aksen */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          PENDAFTARAN <br />
          <span className="text-blue-600 text-2xl">BERHASIL!</span>
        </h1>

        <p className="text-slate-500 text-xs mt-4 mb-8 font-bold uppercase tracking-widest leading-relaxed">
          Data kamu telah masuk sistem. <br /> Simpan ID di bawah ini baik-baik.
        </p>

        {/* BOX ID PENDAFTARAN */}
        <div className="bg-blue-600 p-8 rounded-[2rem] mb-6 shadow-xl shadow-blue-200 relative transition-transform hover:scale-[1.02]">
          <p className="text-[10px] font-black text-blue-200 uppercase mb-2 tracking-[0.2em]">
            ID Registrasi Resmi
          </p>
          <p className="text-4xl font-black text-white tracking-tighter">
            {pendaftaranID}
          </p>
        </div>

        {/* TOMBOL SALIN */}
        <button
          onClick={copyToClipboard}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest mb-4 transition-all flex items-center justify-center gap-2 ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {copied ? (
            "Tersalin!"
          ) : (
            <>
              <Copy size={16} /> Salin ID Pendaftaran
            </>
          )}
        </button>

        {/* SEKSI WAJIB LAPOR */}
        <div className="mb-8 p-1 bg-rose-50 rounded-[2.5rem] border-2 border-rose-100 shadow-inner">
          <div className="p-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest mb-4 animate-pulse">
              <AlertTriangle size={10} /> Langkah Wajib
            </div>

            <p className="text-[11px] text-rose-600 font-black uppercase mb-4 leading-tight">
              Pendaftaran belum dianggap sah sebelum <br /> kamu lapor ke
              WhatsApp Panitia!
            </p>

            <a
              href={`https://wa.me/628123456789?text=Halo%20Panitia%20BEST%20OSIS%20saya%20(isi%20nama%20lengkap)%20sudah%20berhasil%20mendaftar%20menjadi%20pengurus%20BEST%20OSIS%20dengan%20ID%20*${pendaftaranID}*%20mohon%20verifikasi%20data%20saya`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <MessageSquare size={18} /> Kirim ID ke Panitia (WA)
            </a>
          </div>
        </div>
        {/* PERINGATAN */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 text-left mb-8">
          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
          <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
            ID ini wajib digunakan saat pengecekan hasil seleksi. Jangan sampai
            hilang atau lupa!
          </p>
        </div>

        {/* NAVIGASI */}
        <div className="flex flex-col gap-4">
          <Link
            href="/pengumuman"
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all"
          >
            Cek Halaman Pengumuman <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all"
          >
            <Home size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

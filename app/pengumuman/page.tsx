"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ClipboardList,
  Lock,
  Clock,
} from "lucide-react";
import Link from "next/link";

// 1. Taruh Data Lulus di luar fungsi (sudah benar)
const DATA_LULUS = [
  {
    id: "BEST-01201530",
    nama: "ASYKAR MUNADHIL",
    kelas: "8A1",
    status: "LULUS",
  },
  { id: "BEST-00000000", nama: "SITI FATIMAH", kelas: "7B2", status: "LULUS" },
  {
    id: "BEST-12345678",
    nama: "IKSAN RAMADHAN",
    kelas: "8A2",
    status: "TIDAK LULUS",
  },
];

export default function PengumumanPage() {
  // 2. Semua State harus di DALAM fungsi ini
  const [isMounted, setIsMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [formData, setFormData] = useState({ id: "", nama: "", kelas: "" });
  const [hasil, setHasil] = useState<any>(null);
  const [sudahCek, setSudahCek] = useState(false);

  const targetDate = new Date("2026-09-30T00:00:00");

  useEffect(() => {
    setIsMounted(true);
    const checkDate = () => {
      const now = new Date();
      if (now >= targetDate) {
        setIsOpened(true);
      }
    };
    checkDate();
    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCek = (e: React.FormEvent) => {
    e.preventDefault();
    const ditemukan = DATA_LULUS.find(
      (item) =>
        item.id.toLowerCase() === formData.id.toLowerCase().trim() &&
        item.nama.toLowerCase() === formData.nama.toLowerCase().trim() &&
        item.kelas.toLowerCase() === formData.kelas.toLowerCase().trim()
    );
    setHasil(ditemukan);
    setSudahCek(true);
  };

  // 3. Pengaman Hydration
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 italic">
      <div className="max-w-md mx-auto pt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-8 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </Link>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
          {/* LOGIKA TAMPILAN: Jika belum dibuka, tampilkan gembok. Jika sudah, tampilkan form */}
          {!isOpened ? (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock size={40} />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none mb-4">
                Pengumuman <br />
                <span className="text-blue-600">Belum Tersedia</span>
              </h1>
              <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl inline-block w-full text-center">
                <Clock size={20} className="mx-auto mb-2 text-slate-400" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  Hasil seleksi akan dibuka pada:
                </p>
                <p className="text-lg font-black text-slate-800 uppercase">
                  30 September 2026
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2">
                  Cek Hasil <br />
                  <span className="text-blue-600">Seleksi</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Masukkan data sesuai bukti pendaftaran kamu
                </p>
              </div>

              <form onSubmit={handleCek} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
                    ID Pendaftaran
                  </label>
                  <input
                    type="text"
                    placeholder="CONTOH: BEST-12345"
                    required
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm focus:outline-none focus:border-blue-600 transition-all uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="NAMA SESUAI FORM..."
                    required
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm focus:outline-none focus:border-blue-600 transition-all uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
                    Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="CONTOH: 7A1 / 8B2"
                    required
                    value={formData.kelas}
                    onChange={(e) =>
                      setFormData({ ...formData, kelas: e.target.value })
                    }
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-sm focus:outline-none focus:border-blue-600 transition-all uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-3 mt-4"
                >
                  <Search size={16} /> Lihat Hasil Seleksi
                </button>
              </form>

              {sudahCek && (
                <div className="mt-10 animate-in fade-in zoom-in duration-300">
                  {hasil ? (
                    <div
                      className={`p-6 rounded-[2rem] text-center border-2 ${
                        hasil.status === "LULUS"
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-rose-50 border-rose-100"
                      }`}
                    >
                      {hasil.status === "LULUS" ? (
                        <>
                          <CheckCircle2
                            size={48}
                            className="text-emerald-500 mx-auto mb-4"
                          />
                          <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">
                            Selamat! Kamu Lulus
                          </p>
                          <h2 className="text-xl font-black text-slate-800 uppercase">
                            {hasil.nama}
                          </h2>
                          <div className="mt-4 py-2 px-4 bg-emerald-100 rounded-full inline-block text-[10px] font-black text-emerald-700 uppercase">
                            ID: {hasil.id} • KELAS {hasil.kelas}
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle
                            size={48}
                            className="text-rose-500 mx-auto mb-4"
                          />
                          <p className="text-[10px] font-black text-rose-600 uppercase mb-1">
                            Mohon Maaf
                          </p>
                          <h2 className="text-xl font-black text-slate-800 uppercase">
                            {hasil.nama}
                          </h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-4">
                            Tetap semangat!
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[2rem] text-center">
                      <ClipboardList
                        size={40}
                        className="text-amber-500 mx-auto mb-4"
                      />
                      <p className="text-[10px] font-black text-amber-600 uppercase">
                        Data Tidak Cocok
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center mt-12 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          BEST DIGITAL MANAGEMENT SYSTEM
        </p>
      </div>
    </div>
  );
}

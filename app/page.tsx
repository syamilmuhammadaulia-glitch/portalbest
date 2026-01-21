"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Calendar,
  ShieldAlert,
  LogOut,
  TrendingUp,
  FileText,
  Menu,
  Trash2,
  Plus,
  Download,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  X,
  Home as HomeIcon,
  ClipboardList,
} from "lucide-react";
import * as XLSX from "xlsx";

// --- KONFIGURASI SUPABASE ---
const supabaseUrl = "https://fxwkpcqiwefvuoiohwor.supabase.co";
const supabaseAnonKey = "sb_publishable_btGuXiRdoUVQDigPqIEZNA_ZSNt2iI2";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- INTERFACES ---
interface AppUser {
  id?: any;
  nama: string;
  kelas: string;
  jabatan: string;
  poin: number;
  role: "USER" | "SUPER_ADMIN";
  password?: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  notulensi: string;
}

interface Attendance {
  id: number;
  meeting_id: number;
  nama_pengurus: string;
  keterangan: string;
  jam_absen: string;
  tanggal_absen: string;
  created_at: string;
  jabatan_display?: string;
}

interface Proker {
  id: number;
  nama_proker: string;
  divisi: string;
  status: string;
  penanggung_jawab: string;
}

export default function PortalPage() {
  // --- STATES ---
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [view, setView] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [prokers, setProkers] = useState<Proker[]>([]);

  // --- HELPER ---
  const showToast = (
    msg: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FETCH DATA ---
  const fetchCloudData = async () => {
    try {
      const { data: userData } = await supabase
        .from("pengurus")
        .select("*")
        .order("no", { ascending: true });
      if (userData) setUsers(userData);

      const { data: meetData } = await supabase
        .from("meetings")
        .select("*")
        .order("id", { ascending: false });
      if (meetData) setMeetings(meetData);

      const { data: prokerData } = await supabase
        .from("proker")
        .select("*")
        .order("created_at", { ascending: false });
      if (prokerData) setProkers(prokerData);

      const { data: attendData } = await supabase
        .from("absensi")
        .select("*")
        .order("id", { ascending: false });

      if (attendData && userData) {
        setAttendance(
          attendData.map((a: any) => ({
            ...a,
            jabatan_display:
              userData.find((u: any) => u.nama === a.nama_pengurus)?.jabatan ||
              "Pengurus",
          })),
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem("best_osis_session");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    fetchCloudData();
    const interval = setInterval(fetchCloudData, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleAbsen = async (meetingId: number) => {
    if (!currentUser) return;
    const sudahAbsen = attendance.some(
      (a) => a.meeting_id === meetingId && a.nama_pengurus === currentUser.nama,
    );
    if (sudahAbsen) return showToast("Kamu sudah absen!", "info");

    const now = new Date();
    const { error } = await supabase.from("absensi").insert([
      {
        meeting_id: meetingId,
        nama_pengurus: currentUser.nama,
        jam_absen: now.toLocaleTimeString("id-ID"),
        tanggal_absen: now.toLocaleDateString("en-CA"),
        keterangan: "Hadir",
      },
    ]);

    if (!error) {
      showToast("Absen Berhasil!");
      fetchCloudData();
    }
  };

  const handleAddMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("meetings").insert([
      {
        title: fd.get("title"),
        date: fd.get("date"),
        time: fd.get("time"),
        notulensi: "Belum ada notulensi",
      },
    ]);
    if (!error) {
      showToast("Rapat Ditambah!");
      e.currentTarget.reset();
      fetchCloudData();
    }
  };

  const handleAddProker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("proker").insert([
      {
        nama_proker: fd.get("nama_proker"),
        divisi: fd.get("divisi"),
        status: "Terencana",
        penanggung_jawab: currentUser?.nama,
      },
    ]);
    if (!error) {
      showToast("Proker Ditambah!");
      e.currentTarget.reset();
      fetchCloudData();
    }
  };

  const updateProkerStatus = async (id: number, nextStatus: string) => {
    const { error } = await supabase
      .from("proker")
      .update({ status: nextStatus })
      .eq("id", id);

    if (!error) {
      showToast(`Status diperbarui ke ${nextStatus}`);
      fetchCloudData();
    } else {
      showToast("Gagal memperbarui status", "error");
    }
  };

  const handleAddPoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("userName") as string;
    const pts = parseInt(fd.get("point") as string);

    const targetUser = users.find((u) => u.nama === name);
    if (!targetUser) return;

    const newPoin = (targetUser.poin || 0) + pts;

    const { error } = await supabase
      .from("pengurus")
      .update({ poin: newPoin })
      .eq("nama", name);

    if (!error) {
      showToast("Poin Terupdate!");
      e.currentTarget.reset();
      fetchCloudData();
    } else {
      showToast("Gagal update ke database", "error");
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#0f172a]" />;
  if (!currentUser) return <LoginPage users={users} onLogin={setCurrentUser} />;

  const isAdmin =
    currentUser.role === "SUPER_ADMIN" || currentUser.nama === "Admin OSIS";

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* NOTIFIKASI */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] px-6 py-4 bg-white border-l-4 border-blue-600 shadow-2xl rounded-2xl transition-all animate-bounce">
          <p className="font-black text-sm">{notification.msg}</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen
            ? "w-72 translate-x-0"
            : "w-24 -translate-x-full md:translate-x-0"
        } bg-[#0f172a] text-white p-6 transition-all fixed md:sticky top-0 h-screen z-50 shadow-2xl flex flex-col`}
      >
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
          <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              className="w-full h-full object-contain"
              alt="Logo"
            />
          </div>
          {isSidebarOpen && (
            <h1 className="font-black text-blue-400 uppercase tracking-tighter whitespace-nowrap">
              BEST OSIS
            </h1>
          )}
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem
            active={view === "dashboard"}
            icon={<TrendingUp size={22} />}
            label="Beranda"
            isOpen={isSidebarOpen}
            onClick={() => {
              setView("dashboard");
              setSidebarOpen(false);
            }}
          />
          <NavItem
            active={view === "proker"}
            icon={<Briefcase size={22} />}
            label="Proker"
            isOpen={isSidebarOpen}
            onClick={() => {
              setView("proker");
              setSidebarOpen(false);
            }}
          />
          <NavItem
            active={view === "jadwal"}
            icon={<Calendar size={22} />}
            label="Rapat"
            isOpen={isSidebarOpen}
            onClick={() => {
              setView("jadwal");
              setSidebarOpen(false);
            }}
          />
          {isAdmin && (
            <NavItem
              active={view === "laporan"}
              icon={<ClipboardList size={22} />}
              label="Laporan"
              isOpen={isSidebarOpen}
              onClick={() => {
                setView("laporan");
                setSidebarOpen(false);
              }}
              color="text-emerald-400"
            />
          )}
          {isAdmin && (
            <NavItem
              active={view === "admin"}
              icon={<ShieldAlert size={22} />}
              label="Admin"
              isOpen={isSidebarOpen}
              onClick={() => {
                setView("admin");
                setSidebarOpen(false);
              }}
              color="text-yellow-400"
            />
          )}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("best_osis_session");
            setCurrentUser(null);
          }}
          className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 font-bold w-full mt-auto"
        >
          <LogOut size={22} /> {isSidebarOpen && "Logout"}
        </button>
      </aside>

      {/* OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-3 bg-white rounded-xl border md:hidden shadow-sm"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {view}
            </h2>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">
              Login Sebagai
            </p>
            <p className="font-bold text-blue-600">{currentUser.nama}</p>
          </div>
        </header>

        {/* VIEW: DASHBOARD */}
        {view === "dashboard" && (
          <div className="space-y-6">
            <input
              placeholder="Cari pengurus..."
              className="w-full p-4 rounded-2xl border font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users
                .filter((u) =>
                  u.nama.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((u, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between mb-4">
                      <UserIcon className="text-blue-600" />
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Poin
                        </p>
                        <p className="text-2xl font-black text-red-500">
                          {u.poin || 0}
                        </p>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 uppercase leading-tight">
                      {u.nama}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      {u.jabatan} - {u.kelas}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW: PROKER */}
        {view === "proker" && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <h4 className="font-black mb-6 text-blue-600 uppercase flex items-center gap-2">
                <Plus size={20} /> Tambah Proker
              </h4>
              <form
                onSubmit={handleAddProker}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  name="nama_proker"
                  placeholder="Nama Proker"
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none"
                  required
                />
                <select
                  name="divisi"
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none"
                >
                  <option value="BPH">BPH</option>
                  <option value="Humas">Humas</option>
                  <option value="Agama">Agama</option>
                  <option value="IPTEK">IPTEK</option>
                </select>
                <button className="bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-colors">
                  SIMPAN
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prokers.map((p) => {
                const getStatusStyles = (status: string) => {
                  switch (status) {
                    case "Selesai":
                      return "bg-emerald-50 border-l-emerald-500 text-emerald-700";
                    case "Berjalan":
                      return "bg-blue-50 border-l-blue-500 text-blue-700";
                    default:
                      return "bg-white border-l-slate-300 text-slate-700";
                  }
                };
                return (
                  <div
                    key={p.id}
                    className={`p-6 rounded-[2rem] border shadow-sm border-l-8 transition-all ${getStatusStyles(p.status)}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black bg-white/50 px-2 py-1 rounded uppercase">
                        {p.divisi}
                      </span>
                      <span className="text-[10px] font-black px-2 py-1 rounded uppercase bg-white shadow-sm">
                        {p.status}
                      </span>
                    </div>
                    <h5 className="font-black uppercase mb-4 text-slate-800">
                      {p.nama_proker}
                    </h5>
                    <p className="text-[10px] font-bold text-slate-400 mb-4 italic">
                      PJ: {p.penanggung_jawab}
                    </p>
                    {isAdmin && (
                      <select
                        value={p.status}
                        onChange={(e) =>
                          updateProkerStatus(p.id, e.target.value)
                        }
                        className="w-full py-2 px-3 bg-slate-900 text-white text-[10px] font-black rounded-xl outline-none cursor-pointer"
                      >
                        <option value="Terencana">Ubah ke: TERENCANA</option>
                        <option value="Berjalan">Ubah ke: BERJALAN</option>
                        <option value="Selesai">Ubah ke: SELESAI</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: LAPORAN */}
        {view === "laporan" && isAdmin && (
          <div className="space-y-10">
            <div>
              <h3 className="font-black text-xl uppercase mb-6 flex items-center gap-2">
                <ClipboardList className="text-blue-600" /> Rekap Notulensi &
                Kehadiran
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-6 rounded-[2rem] border shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                            {m.date}
                          </span>
                          <h4 className="font-black text-slate-800 uppercase">
                            {m.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold mb-3 italic">
                          Notulensi: <span>{m.notulensi}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {attendance
                            .filter((a) => a.meeting_id === m.id)
                            .map((person, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-bold bg-slate-50 border px-2 py-1 rounded-lg text-slate-600"
                              >
                                {person.nama_pengurus} (✓)
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-xl uppercase">
                  Semua Log Absensi
                </h3>
                <button
                  onClick={() => {
                    const reportData = attendance.map((a) => {
                      const m = meetings.find(
                        (meet) => meet.id === a.meeting_id,
                      );
                      return {
                        Tanggal: a.tanggal_absen,
                        Rapat: m?.title || "N/A",
                        Nama: a.nama_pengurus,
                        Jam_Masuk: a.jam_absen,
                        Status: a.keterangan,
                        Notulensi: m?.notulensi || "-",
                      };
                    });
                    const ws = XLSX.utils.json_to_sheet(reportData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
                    XLSX.writeFile(wb, "Laporan_Absensi_OSIS.xlsx");
                  }}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2"
                >
                  <Download size={18} /> EXCEL
                </button>
              </div>
              <div className="bg-white rounded-3xl border shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                        Rapat
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                        Pengurus
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                        Jam
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-slate-400">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 font-black text-xs uppercase">
                          {meetings.find((m) => m.id === a.meeting_id)?.title ||
                            "Rapat"}
                        </td>
                        <td className="p-4 font-black text-xs text-blue-600 uppercase">
                          {a.nama_pengurus}
                        </td>
                        <td className="p-4 font-bold text-xs text-slate-500">
                          {a.jam_absen}
                        </td>
                        <td className="p-4 font-bold text-xs text-slate-500">
                          {a.tanggal_absen}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ADMIN */}
        {view === "admin" && isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <h4 className="font-black mb-6 text-blue-600 uppercase flex items-center gap-2">
                <Plus size={20} /> Buat Rapat
              </h4>
              <form onSubmit={handleAddMeeting} className="space-y-4">
                <input
                  name="title"
                  placeholder="Judul Rapat"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border"
                  required
                />
                <input
                  name="date"
                  type="date"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border"
                  required
                />
                <input
                  name="time"
                  type="time"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border"
                  required
                />
                <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black">
                  PUBLIKASIKAN
                </button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
              <h4 className="font-black mb-6 text-red-600 uppercase flex items-center gap-2">
                <AlertCircle size={20} /> Update Poin
              </h4>
              <form onSubmit={handleAddPoint} className="space-y-4">
                <select
                  name="userName"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border"
                >
                  {users.map((u, i) => (
                    <option key={i} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
                </select>
                <input
                  name="point"
                  type="number"
                  placeholder="Jumlah Poin"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border"
                  required
                />
                <button className="w-full bg-red-600 text-white p-4 rounded-2xl font-black">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: JADWAL */}
        {view === "jadwal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="bg-slate-900 p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-600 p-3 rounded-2xl">
                      <Calendar size={24} />
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                      {m.date}
                    </span>
                  </div>
                  <h4 className="font-black text-lg uppercase leading-tight">
                    {m.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    Pukul: {m.time} WIB
                  </p>
                </div>
                <div className="p-6 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1">
                    <FileText size={12} /> Notulensi Rapat
                  </p>
                  <div className="text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl line-clamp-3 mb-4 italic">
                    {m.notulensi || "Belum ada catatan rapat."}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600">
                    <CheckCircle2 size={14} />{" "}
                    {attendance.filter((a) => a.meeting_id === m.id).length}{" "}
                    Pengurus Hadir
                  </div>
                </div>
                <div className="p-6 pt-0 space-y-2">
                  {!isAdmin ? (
                    <button
                      onClick={() => handleAbsen(m.id)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all text-xs"
                    >
                      ABSEN SEKARANG
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const data = attendance.filter(
                            (a) => a.meeting_id === m.id,
                          );
                          const ws = XLSX.utils.json_to_sheet(data);
                          const wb = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(wb, ws, "Absensi");
                          XLSX.writeFile(wb, `Absensi_${m.title}.xlsx`);
                        }}
                        className="py-3 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] border border-emerald-100"
                      >
                        <Download size={14} /> EXCEL
                      </button>
                      <button
                        onClick={() => {
                          const catatan = prompt(
                            "Masukkan Notulensi Rapat:",
                            m.notulensi,
                          );
                          if (catatan) {
                            supabase
                              .from("meetings")
                              .update({ notulensi: catatan })
                              .eq("id", m.id)
                              .then(() => fetchCloudData());
                          }
                        }}
                        className="py-3 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center gap-2 font-black text-[10px]"
                      >
                        <FileText size={14} /> EDIT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---
function NavItem({ icon, label, active, onClick, color, isOpen }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : color || "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {isOpen && <span className="text-sm font-black uppercase">{label}</span>}
    </button>
  );
}

function LoginPage({ onLogin, users }: any) {
  const [uVal, setUVal] = useState("");
  const [pVal, setPVal] = useState("");
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
      (u: any) =>
        u.nama.toLowerCase() === uVal.trim().toLowerCase() &&
        String(u.password) === pVal.trim(),
    );
    if (found || (uVal === "admin" && pVal === "osis2025")) {
      const user = found || {
        nama: "Admin OSIS",
        role: "SUPER_ADMIN",
        jabatan: "Admin",
        kelas: "System",
        poin: 0,
      };
      localStorage.setItem("best_osis_session", JSON.stringify(user));
      onLogin(user);
    } else {
      alert("Login Gagal! Cek Nama & Password.");
    }
  };
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logo.png"
            className="w-20 h-20 object-contain mb-4"
            alt="Logo"
          />
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            PORTAL BEST OSIS
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Nama Lengkap"
            className="w-full p-5 rounded-2xl bg-slate-50 font-bold outline-none border focus:ring-2 ring-blue-500"
            onChange={(e) => setUVal(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-5 rounded-2xl bg-slate-50 font-bold outline-none border focus:ring-2 ring-blue-500"
            onChange={(e) => setPVal(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">
            MASUK SISTEM
          </button>
        </form>
      </div>
    </div>
  );
}

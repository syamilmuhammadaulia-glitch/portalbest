"use client";
import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import * as XLSX from "xlsx";

// --- IMPORT LANDING PAGE ---
import LandingPage from "@/app/components/LandingPage";

// --- KONFIGURASI SUPABASE ---
const supabaseUrl = "https://fxwkpcqiwefvuoiohwor.supabase.co";
const supabaseAnonKey = "sb_publishable_btGuXiRdoUVQDigPqIEZNA_ZSNt2iI2";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- INTERFACES ---
interface AppUser {
  id: any;
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
  meetingId: number;
  userName: string;
  time: string;
  jabatan: string;
}

interface Proker {
  id: number;
  nama_proker: string;
  divisi: string;
  status: string;
  penanggung_jawab: string;
}

export default function PortalPage() {
  // --- STATE NAVIGASI HALAMAN ---
  const [isPortalOpen, setIsPortalOpen] = useState(true);

  // --- STATE DATA ASLI KAMU ---
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

  const showToast = (
    msg: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- 1. SINKRONISASI DATA ---
  const fetchCloudData = async () => {
    try {
      const { data: meetData } = await supabase
        .from("meetings")
        .select("*")
        .order("id", { ascending: false });
      if (meetData) setMeetings(meetData);

      const { data: userData } = await supabase
        .from("pengurus")
        .select("*")
        .order("no", { ascending: true });
      const currentUsersList: AppUser[] = userData || [];
      if (userData) setUsers(currentUsersList);

      const { data: prokerData } = await supabase
        .from("proker")
        .select("*")
        .order("created_at", { ascending: false });
      if (prokerData) setProkers(prokerData);

      const { data: attendData } = await supabase.from("absensi").select("*");
      if (attendData) {
        const formattedAttend: Attendance[] = attendData.map((a) => ({
          id: a.id,
          meetingId: a.meeting_id || 0,
          userName: a.nama_pengurus,
          time: a.jam_absen,
          jabatan:
            currentUsersList.find((u) => u.nama === a.nama_pengurus)?.jabatan ||
            "Pengurus",
        }));
        setAttendance(formattedAttend);
      }
    } catch (err) {
      console.error("System error:", err);
    }
  };

  useEffect(() => {
    fetchCloudData();
    const interval = setInterval(fetchCloudData, 5000);
    if (window.innerWidth > 768) setSidebarOpen(true);
    return () => clearInterval(interval);
  }, []);

  // --- 2. FUNGSI-FUNGSI ASLI KAMU ---
  const handleAbsen = async (meetingId: number) => {
    if (!currentUser) return;
    if (currentUser.role === "SUPER_ADMIN")
      return showToast("Admin tidak perlu absen!", "error");

    const sudahAbsen = attendance.find(
      (a) => a.meetingId === meetingId && a.userName === currentUser.nama
    );
    if (sudahAbsen) return showToast("Anda sudah absen!", "info");

    const waktuSekarang = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const { error } = await supabase.from("absensi").insert([
      {
        meeting_id: meetingId,
        nama_pengurus: currentUser.nama,
        jam_absen: waktuSekarang,
        keterangan: "Hadir",
      },
    ]);

    if (error) showToast("Gagal absen: " + error.message, "error");
    else {
      showToast("Absen Berhasil!");
      fetchCloudData();
    }
  };

  const deleteAbsenPerPerson = async (absenId: number) => {
    if (!confirm("Hapus data absen ini?")) return;
    const { error } = await supabase.from("absensi").delete().eq("id", absenId);
    if (error) showToast("Gagal hapus data", "error");
    else {
      showToast("Data absen dihapus", "info");
      fetchCloudData();
    }
  };

  const handleAddProker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return showToast("Gagal: Sesi tidak ditemukan", "error");

    const formData = new FormData(e.currentTarget);
    const pjName =
      currentUser.role === "SUPER_ADMIN"
        ? users[0]?.nama || "Admin"
        : currentUser.nama;

    const { error } = await supabase.from("proker").insert([
      {
        nama_proker: formData.get("nama_proker") as string,
        divisi: formData.get("divisi") as string,
        status: "Terencana",
        penanggung_jawab: pjName,
      },
    ]);

    if (error) showToast("Gagal simpan proker: " + error.message, "error");
    else {
      showToast("Proker berhasil ditambahkan!");
      (e.target as HTMLFormElement).reset();
      fetchCloudData();
    }
  };

  const handleAddPoint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const targetName = formData.get("userName") as string;
    const pointVal = parseInt(formData.get("point") as string);
    const targetUser = users.find((u) => u.nama === targetName);

    if (!targetUser) return;
    const { error } = await supabase
      .from("pengurus")
      .update({ poin: (targetUser.poin || 0) + pointVal })
      .eq("nama", targetName);

    if (error) showToast("Gagal update poin", "error");
    else {
      showToast(`Poin ${targetName} diperbarui!`);
      fetchCloudData();
      (e.target as HTMLFormElement).reset();
    }
  };

  const resetAllPoints = async () => {
    if (!confirm("Yakin ingin mereset semua poin ke 0?")) return;
    const { error } = await supabase
      .from("pengurus")
      .update({ poin: 0 })
      .neq("no", -1);
    if (error) showToast("Gagal reset", "error");
    else {
      showToast("Semua poin di-reset!", "info");
      fetchCloudData();
    }
  };

  const handleAddMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("meetings").insert([
      {
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        notulensi: "",
      },
    ]);
    if (error) showToast("Gagal membuat jadwal", "error");
    else {
      showToast("Jadwal Dipublikasikan!");
      (e.target as HTMLFormElement).reset();
      fetchCloudData();
    }
  };

  const deleteMeeting = async (id: number) => {
    if (!confirm("Hapus jadwal ini?")) return;
    const { error } = await supabase.from("meetings").delete().eq("id", id);
    if (error) showToast("Gagal hapus", "error");
    else {
      showToast("Jadwal dihapus", "info");
      fetchCloudData();
    }
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleNotulensiChange = (id: number, text: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notulensi: text } : m))
    );
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await supabase.from("meetings").update({ notulensi: text }).eq("id", id);
      showToast("Notulensi tersimpan");
    }, 2000);
  };

  // --- LOGIKA TAMPILAN (CONDITIONAL RENDERING) ---

  // 1. Tampilkan Landing Page jika portal belum dibuka

  // 2. Tampilkan Login Page jika sudah masuk portal tapi belum login
  if (!currentUser) {
    return;
  }

  // 3. Tampilkan Dashboard jika sudah login
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          isSidebarOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full md:translate-x-0 md:w-24"
        } bg-[#0f172a] text-white p-6 transition-all duration-300 flex flex-col z-[50] fixed md:sticky top-0 h-screen shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="min-w-[45px] h-[45px] bg-white rounded-xl p-1 flex items-center justify-center">
              <img
                src="/logo.png"
                className="w-full h-full object-contain"
                alt="Logo"
              />
            </div>
            {isSidebarOpen && (
              <h1 className="font-black text-lg tracking-tighter text-blue-400 uppercase">
                Best Osis
              </h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <NavItem
            active={view === "dashboard"}
            icon={<TrendingUp size={22} />}
            label="Beranda"
            isOpen={isSidebarOpen}
            onClick={() => setView("dashboard")}
          />
          <NavItem
            active={view === "proker"}
            icon={<Briefcase size={22} />}
            label="Program Kerja"
            isOpen={isSidebarOpen}
            onClick={() => setView("proker")}
          />
          <NavItem
            active={view === "jadwal"}
            icon={<Calendar size={22} />}
            label="Jadwal Rapat"
            isOpen={isSidebarOpen}
            onClick={() => setView("jadwal")}
          />
          <NavItem
            active={view === "laporan"}
            icon={<FileText size={22} />}
            label="Laporan Rapat"
            isOpen={isSidebarOpen}
            onClick={() => setView("laporan")}
          />
          {currentUser.role === "SUPER_ADMIN" && (
            <NavItem
              active={view === "admin"}
              icon={<ShieldAlert size={22} />}
              label="Admin Panel"
              isOpen={isSidebarOpen}
              onClick={() => setView("admin")}
              color="text-yellow-400"
            />
          )}
        </nav>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <button
            onClick={() => setCurrentUser(null)}
            className="flex items-center gap-4 p-4 w-full text-slate-400 hover:text-red-400 font-bold transition-all rounded-2xl hover:bg-white/5"
          >
            <LogOut size={22} /> {isSidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-screen relative w-full">
        {notification && (
          <div className="fixed top-6 right-6 z-[100] px-6 py-4 bg-white border-l-4 border-blue-600 shadow-2xl rounded-2xl animate-bounce">
            <p className="font-black text-sm">{notification.msg}</p>
          </div>
        )}

        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {view.toUpperCase()}
          </h2>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-3 bg-white rounded-xl shadow-sm border hover:bg-slate-50 transition-all"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* --- VIEW: DASHBOARD --- */}
        {view === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u.nama}
                className="bg-white p-6 rounded-3xl border shadow-sm group hover:border-blue-500 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <UserIcon size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Poin
                    </p>
                    <p className="text-2xl font-black text-red-500">
                      {u.poin || 0}
                    </p>
                  </div>
                </div>
                <h4 className="font-black text-slate-800 text-lg uppercase leading-tight">
                  {u.nama}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                    {u.kelas}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {u.jabatan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW: PROKER --- */}
        {view === "proker" && (
          <div className="space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
              <h4 className="font-black mb-6 flex items-center gap-2 tracking-tight text-blue-600">
                <Plus size={20} /> TAMBAH PROKER DIVISI
              </h4>
              <form
                onSubmit={handleAddProker}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  name="nama_proker"
                  placeholder="Nama Program Kerja"
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500"
                  required
                />
                <select
                  name="divisi"
                  className="p-4 bg-slate-50 rounded-2xl font-bold outline-none"
                >
                  <option value="BPH">BPH</option>
                  <option value="Dept. Humas">Departemen Humas</option>
                  <option value="Dept. Agama">Departemen Agama</option>
                  <option value="Dept. IPTEK">Departemen IPTEK</option>
                  <option value="Dept. SABDA">Departemen SABDA</option>
                  <option value="Dept. Lingkup">Departemen Lingkup</option>
                  <option value="Dept. Disorkes">Departemen Disorkes</option>
                </select>
                <button className="bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-blue-700">
                  SIMPAN PROKER
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prokers.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-6 rounded-[2rem] border shadow-sm border-l-8 border-l-blue-500"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                      {p.divisi}
                    </span>
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase flex items-center gap-1">
                      <CheckCircle2 size={10} /> {p.status}
                    </span>
                  </div>
                  <h5 className="font-black text-slate-800 uppercase mb-4 leading-snug">
                    {p.nama_proker}
                  </h5>
                  <p className="text-[10px] font-bold text-slate-400 border-t pt-4 uppercase">
                    PJ: {p.penanggung_jawab}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: JADWAL --- */}
        {view === "jadwal" && (
          <div className="max-w-3xl space-y-4">
            {meetings.map((m) => {
              const sudah = attendance.some(
                (a) => a.meetingId === m.id && a.userName === currentUser?.nama
              );
              return (
                <div
                  key={m.id}
                  className="bg-white p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                >
                  <div>
                    <h4 className="text-lg font-black uppercase text-slate-800">
                      {m.title}
                    </h4>
                    <p className="text-sm font-bold text-slate-500">
                      {m.date} • {m.time} WIB
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {currentUser?.role === "SUPER_ADMIN" && (
                      <button
                        onClick={() => deleteMeeting(m.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    <button
                      disabled={sudah || currentUser?.role === "SUPER_ADMIN"}
                      onClick={() => handleAbsen(m.id)}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-xl font-black ${
                        sudah
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {sudah
                        ? "HADIR"
                        : currentUser?.role === "SUPER_ADMIN"
                        ? "ADMIN"
                        : "ABSEN"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- VIEW: LAPORAN --- */}
        {view === "laporan" && (
          <div className="space-y-6">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-[2rem] border overflow-hidden shadow-sm"
              >
                <div className="p-6 bg-slate-50 border-b flex flex-wrap justify-between items-center gap-4">
                  <h3 className="font-black uppercase">{m.title}</h3>
                  <button
                    onClick={() => {
                      const data = attendance
                        .filter((a) => a.meetingId === m.id)
                        .map((a) => ({
                          Nama: a.userName,
                          Jabatan: a.jabatan,
                          Jam: a.time,
                        }));
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "Absen");
                      XLSX.writeFile(wb, `Laporan_${m.title}.xlsx`);
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700"
                  >
                    <Download size={16} /> EXCEL
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">
                      Daftar Hadir
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {attendance
                        .filter((a) => a.meetingId === m.id)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs font-bold border"
                          >
                            <span>{a.userName}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-blue-500">{a.time}</span>
                              {currentUser?.role === "SUPER_ADMIN" && (
                                <button
                                  onClick={() => deleteAbsenPerPerson(a.id)}
                                  className="text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">
                      Notulensi Rapat
                    </p>
                    <textarea
                      readOnly={currentUser?.role !== "SUPER_ADMIN"}
                      defaultValue={m.notulensi}
                      onChange={(e) =>
                        handleNotulensiChange(m.id, e.target.value)
                      }
                      className="w-full h-44 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 ring-blue-500 font-medium"
                      placeholder="Hasil rapat..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- VIEW: ADMIN --- */}
        {view === "admin" && (
          <div className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black flex items-center gap-2">
                    <AlertCircle className="text-red-500" /> PELANGGARAN POIN
                  </h4>
                  <button
                    onClick={resetAllPoints}
                    className="text-[10px] bg-slate-100 px-3 py-1 rounded-lg font-black hover:bg-red-50 hover:text-red-500"
                  >
                    RESET
                  </button>
                </div>
                <form onSubmit={handleAddPoint} className="space-y-4">
                  <select
                    name="userName"
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-red-500"
                  >
                    {users.map((u) => (
                      <option key={u.nama} value={u.nama}>
                        {u.nama} ({u.kelas})
                      </option>
                    ))}
                  </select>
                  <input
                    name="point"
                    type="number"
                    placeholder="Jumlah Poin"
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-red-500"
                    required
                  />
                  <button className="w-full bg-red-500 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-red-600">
                    TAMBAHKAN POIN
                  </button>
                </form>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm">
                <h4 className="font-black mb-6 flex items-center gap-2 text-blue-600">
                  <Calendar size={20} /> BUAT JADWAL
                </h4>
                <form onSubmit={handleAddMeeting} className="space-y-4">
                  <input
                    name="title"
                    placeholder="Agenda Rapat"
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="date"
                      type="date"
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"
                      required
                    />
                    <input
                      name="time"
                      type="time"
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"
                      required
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg hover:bg-blue-700">
                    BUAT JADWAL RAPAT
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-KOMPONEN ---

function NavItem({ icon, label, active, onClick, color, isOpen }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : color || "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span>{icon}</span>
      {isOpen && (
        <span className="text-sm font-black tracking-tight">{label}</span>
      )}
    </button>
  );
}

function LoginPage({ onLogin, users }: any) {
  const [uVal, setUVal] = useState("");
  const [pVal, setPVal] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const inputUser = uVal as string;
    const inputPass = pVal as string;

    const isAdmin1 = inputUser === "admin.utama" && inputPass === "osis2025";
    const isAdmin2 = inputUser === "luthfi" && inputPass === "pembina2025";

    if (isAdmin1 || isAdmin2) {
      onLogin({
        nama: isAdmin1 ? "Admin Utama" : "Admin Kedua",
        role: "SUPER_ADMIN",
        jabatan: "Server Master",
        poin: 0,
        kelas: "System",
      });
    } else {
      const user = users.find(
        (u: any) => u.nama === inputUser && u.password === inputPass
      );
      if (user) {
        onLogin({ ...user, role: "USER" });
      } else {
        alert("Nama atau Password salah!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl border-t-8 border-blue-600">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-slate-50 p-2 rounded-2xl mb-4 border">
            <img
              src="/logo.png"
              className="w-full h-full object-contain"
              alt="Logo"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
            PORTAL BEST OSIS
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            placeholder="Nama Lengkap"
            className="w-full p-5 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 ring-blue-500"
            onChange={(e) => setUVal(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-5 rounded-2xl bg-slate-50 outline-none font-bold focus:ring-2 ring-blue-500"
            onChange={(e) => setPVal(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
            MASUK
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  FolderKanban, CalendarDays, Mail, Users, Activity, 
  Zap, ArrowRight, TrendingUp, CheckCircle, XCircle, Clock, Save,
  ExternalLink, User, CheckCircle2, MoreVertical
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { projects: 0, pendingAppointments: 0, unreadMessages: 0, customers: 0 },
    recentProjects: [],
    pendingAppointments: []
  });
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  const { currentTheme } = useTheme(); 

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard-stats", { cache: "no-store" });
      if (res.ok) {
        const result = await res.json();
        setData({
          stats: result.stats || result, 
          recentProjects: result.recentProjects || [],
          pendingAppointments: result.pendingAppointments || []
        });
      }
    } catch (error) {
      console.error("Dashboard verileri alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectProgress = async (id, newProgress) => {
    setActionLoading(`proj-${id}`);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });
      if (res.ok) {
        setData(prev => ({
          ...prev,
          recentProjects: prev.recentProjects.map(p => p.id === id ? { ...p, progress: newProgress } : p)
        }));
        if (newProgress === 100) {
           setTimeout(() => fetchDashboardData(), 1000); // 100 olunca listeden düşmesi için yenile
        }
      }
    } catch (error) {
      console.error("Proje güncellenemedi", error);
    } finally {
      setActionLoading(null);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    setActionLoading(`appt-${id}`);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Randevu güncellenemedi", error);
    } finally {
      setActionLoading(null);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => {
    const colorClasses = {
      blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800/50",
      yellow: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50",
      red: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/50",
      green: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/50",
    };
    const bgHover = {
      blue: "group-hover:bg-blue-600 dark:group-hover:bg-blue-500",
      yellow: "group-hover:bg-amber-600 dark:group-hover:bg-amber-500",
      red: "group-hover:bg-rose-600 dark:group-hover:bg-rose-500",
      green: "group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500",
    };

    return (
      <Link href={link} className="block group h-full">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg h-full flex flex-col backdrop-blur-sm">
          <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 dark:opacity-20 ${bgHover[color]} transition-colors duration-500 blur-2xl pointer-events-none`}></div>
          <div className="flex justify-between items-start mb-6">
            <div className="relative z-10 pr-2">
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 min-h-[40px] transition-colors">{title}</p>
              <h3 className="text-5xl font-black text-slate-900 dark:text-slate-200 tracking-tighter transition-colors">
                {loading ? <span className="animate-pulse text-slate-300 dark:text-slate-600">...</span> : value}
              </h3>
            </div>
            <div className={`p-4 rounded-2xl ${colorClasses[color]} transition-colors duration-300 relative z-10 shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>
          <div className={`mt-auto inline-flex items-center text-sm font-bold ${colorClasses[color].split(' ')[0]} dark:${colorClasses[color].split(' ')[1]} opacity-80 group-hover:opacity-100 transition-opacity`}>
            {linkText} <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="font-sans transition-colors duration-300 pb-10">
      
      {/* ÜST BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20 ${currentTheme.text}`}>
              <Activity className="w-7 h-7" />
            </div>
            Sistem Özeti
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors">Enerji Yönetim Merkezi kontrol paneline hoş geldiniz.</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm flex items-center gap-3 transition-colors backdrop-blur-sm">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sistem Aktif & Çevrimiçi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Aktif Projeler" value={data.stats.projects} icon={FolderKanban} color="blue" link="/admin/projeler" linkText="Projeleri Yönet" />
        <StatCard title="Yeni Randevular" value={data.stats.pendingAppointments} icon={CalendarDays} color="yellow" link="/admin/randevular" linkText="Talepleri İncele" />
        <StatCard title="Yeni Mesajlar" value={data.stats.unreadMessages} icon={Mail} color="red" link="/admin/mesajlar" linkText="Gelen Kutusuna Git" />
        <StatCard title="Müşteriler" value={data.stats.customers} icon={Users} color="green" link="/admin/musteriler" linkText="Müşterileri Yönet" />
      </div>

      {/* DETAYLI HIZLI YÖNETİM MODÜLLERİ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        
        {/* AKTİF PROJELER KARTI - GELİŞMİŞ TASARIM */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderKanban className={`w-6 h-6 ${currentTheme.text}`} /> Aktif Projeler
            </h2>
            <Link href="/admin/projeler" className={`text-sm font-bold ${currentTheme.text} bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`}>
              Tümünü Gör
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {data.recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 dark:text-slate-500">
                <FolderKanban className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Henüz aktif proje bulunmuyor.</p>
              </div>
            ) : (
              data.recentProjects.slice(0, 4).map((project) => (
                <div key={project.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        {project.title}
                        <Link href={`/admin/projeler`} className="text-slate-400 hover:text-blue-500 transition-colors" title="Projeyi Düzenle">
                           <ExternalLink className="w-4 h-4" />
                        </Link>
                      </h4>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                         <User className="w-3.5 h-3.5"/> {project.customerName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="font-black text-2xl text-blue-600 dark:text-blue-400 leading-none">%{project.progress}</span>
                       <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">İlerleme</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <input 
                      type="range" 
                      min="0" max="100" step="5"
                      value={project.progress}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setData(prev => ({
                          ...prev,
                          recentProjects: prev.recentProjects.map(p => p.id === project.id ? { ...p, progress: val } : p)
                        }));
                      }}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-600 accent-current ${currentTheme.text}`}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => updateProjectProgress(project.id, project.progress)}
                        disabled={actionLoading === `proj-${project.id}`}
                        className={`p-2.5 rounded-lg text-white ${currentTheme.bg} ${currentTheme.hoverBg} transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center`}
                        title="İlerlemeyi Kaydet"
                      >
                        {actionLoading === `proj-${project.id}` ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => updateProjectProgress(project.id, 100)}
                        disabled={actionLoading === `proj-${project.id}`}
                        className="p-2.5 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
                        title="Projeyi Tamamla (%100)"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BEKLEYEN RANDEVULAR KARTI - GELİŞMİŞ TASARIM */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 backdrop-blur-sm transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-amber-500" /> Bekleyen Randevular
            </h2>
            <Link href="/admin/randevular" className="text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {data.pendingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 dark:text-slate-500">
                <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Onay bekleyen yeni talep yok.</p>
              </div>
            ) : (
              data.pendingAppointments.slice(0, 4).map((appt) => (
                <div key={appt.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1.5 line-clamp-1">{appt.subject}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <User className="w-3.5 h-3.5" /> {appt.customerName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" /> 
                        {new Date(appt.date).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'APPROVED')}
                      disabled={actionLoading === `appt-${appt.id}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white text-xs font-bold rounded-xl transition-all border border-emerald-100 hover:border-emerald-500 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Onayla
                    </button>
                    <button 
                      onClick={() => updateAppointmentStatus(appt.id, 'REJECTED')}
                      disabled={actionLoading === `appt-${appt.id}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold rounded-xl transition-all border border-rose-100 hover:border-rose-500 shadow-sm disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> İptal
                    </button>
                    <Link 
                      href="/admin/randevular" 
                      className="hidden sm:flex items-center justify-center p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      title="Detayları Gör"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ALT HERO BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 shadow-2xl transition-all duration-300 border border-slate-800">
        <div className={`absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-1000 ${currentTheme.bg.replace('bg-', 'bg-')}`}></div>
        <div className={`absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
        
        <div className="relative z-10 p-10 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-slate-200">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-black tracking-widest uppercase mb-6 ${currentTheme.text} transition-colors`}>
              <Zap className="w-4 h-4" /> Sözen Enerji CRM
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-white dark:text-slate-100">
              Enerjimiz <span className={`${currentTheme.text} transition-colors`}>Panel</span>
            </h2>
            <p className="text-slate-300 dark:text-slate-400 text-lg leading-relaxed mb-10 font-medium max-w-xl">
              Bu panel üzerinden şirketinizin tüm operasyonlarını tek bir noktadan yönetebilirsiniz. Müşteri projelerinin ilerlemesini güncelleyin ve randevu taleplerini hızlıca onaylayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/admin/projeler" className={`group ${currentTheme.bg} ${currentTheme.hoverBg} text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2`}>
                Hızlı Proje Ekle
              </Link>
              <Link href="/" target="_blank" className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                Siteyi Görüntüle <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex shrink-0 w-80 h-80 relative">
            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-white/5 to-white/10 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl">
              <TrendingUp className={`w-32 h-32 ${currentTheme.text} drop-shadow-2xl transition-colors`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
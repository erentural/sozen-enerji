"use client";

import { useState, useEffect } from "react";
import { FolderKanban, CalendarDays, Mail, Users, Activity, Zap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, pendingAppointments: 0, unreadMessages: 0, customers: 0 });
  const [loading, setLoading] = useState(true);
  const { currentTheme } = useTheme(); 

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats", { cache: "no-store" });
        if (res.ok) setStats(await res.json());
      } catch (error) {
        console.error("İstatistikler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 min-h-[40px] transition-colors">
                {title}
              </p>
              {/* text-white yerine text-slate-200 kullanıldı */}
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
    <div className="font-sans transition-colors duration-300">
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
        <StatCard title="Aktif Projeler" value={stats.projects} icon={FolderKanban} color="blue" link="/admin/projeler" linkText="Projeleri Yönet" />
        <StatCard title="Yeni Randevular" value={stats.pendingAppointments} icon={CalendarDays} color="yellow" link="/admin/randevular" linkText="Talepleri İncele" />
        <StatCard title="Yeni Mesajlar" value={stats.unreadMessages} icon={Mail} color="red" link="/admin/mesajlar" linkText="Gelen Kutusuna Git" />
        <StatCard title="Müşteriler" value={stats.customers} icon={Users} color="green" link="/admin/musteriler" linkText="Müşterileri Yönet" />
      </div>

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
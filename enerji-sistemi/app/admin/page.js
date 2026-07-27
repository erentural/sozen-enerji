"use client";

import { useState, useEffect } from "react";
import { FolderKanban, CalendarDays, Mail, Users, Activity, Zap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Veritabanından gerçek istatistikleri çek
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("İstatistikler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

 // Premium İstatistik Kartı Bileşeni
  const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => {
    const colorClasses = {
      blue: "text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300",
      yellow: "text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300",
      red: "text-rose-600 bg-rose-50 border-rose-100 hover:border-rose-300",
      green: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300",
    };
    const bgHover = {
      blue: "group-hover:bg-blue-600",
      yellow: "group-hover:bg-amber-600",
      red: "group-hover:bg-rose-600",
      green: "group-hover:bg-emerald-600",
    };

    return (
      <Link href={link} className="block group h-full">
        {/* YENİ: h-full, flex ve flex-col eklenerek kutu yüksekliği eşitlendi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] h-full flex flex-col">
          
          <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-5 ${bgHover[color]} transition-colors duration-500 blur-2xl pointer-events-none`}></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="relative z-10 pr-2">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                {loading ? <span className="animate-pulse text-slate-300">...</span> : value}
              </h3>
            </div>
            {/* YENİ: shrink-0 eklenerek yazının ikonu sıkıştırması engellendi */}
            <div className={`p-4 rounded-2xl ${colorClasses[color]} transition-colors duration-300 relative z-10 shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>
          
          {/* YENİ: mt-auto (margin-top: auto) eklenerek alt link her zaman kutunun en dibine itildi */}
          <div className={`mt-auto inline-flex items-center text-sm font-bold ${colorClasses[color].split(' ')[0]} opacity-80 group-hover:opacity-100 transition-opacity`}>
            {linkText} <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans selection:bg-[#02529C] selection:text-white">
      
      {/* Üst Karşılama Alanı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#02529C] rounded-2xl">
              <Activity className="w-7 h-7" />
            </div>
            Sistem Özeti
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Enerji Yönetim Merkezi kontrol paneline hoş geldiniz.</p>
        </div>
        
        {/* Canlı Ping Animasyonlu Durum Bildirgesi */}
        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-bold text-slate-700">Sistem Aktif & Çevrimiçi</span>
        </div>
      </div>

      {/* İstatistik Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Aktif Projeler" 
          value={stats.projects} 
          icon={FolderKanban} 
          color="blue" 
          link="/admin/projeler"
          linkText="Projeleri Yönet"
        />
        <StatCard 
          title="Yeni Randevular" 
          value={stats.pendingAppointments} 
          icon={CalendarDays} 
          color="yellow" 
          link="/admin/randevular"
          linkText="Talepleri İncele"
        />
        <StatCard 
          title="Yeni Mesajlar" 
          value={stats.unreadMessages} 
          icon={Mail} 
          color="red" 
          link="/admin/mesajlar"
          linkText="Gelen Kutusuna Git"
        />
        <StatCard 
          title="Müşteriler" 
          value={stats.customers} 
          icon={Users} 
          color="green" 
          link="/admin/musteriler"
          linkText="Müşterileri Yönet"
        />
      </div>

      {/* Premium Hoş Geldin / Kısayol Banner'ı */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-[#02529C] to-slate-900 shadow-2xl shadow-blue-900/20">
        
        {/* Dekoratif Gradient Katmanları */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 p-10 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-widest uppercase mb-6">
              <Zap className="w-4 h-4 text-amber-400" /> Sözen Enerji CRM
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Enerjimiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Panel</span>
            </h2>
            
            <p className="text-blue-100/90 text-lg leading-relaxed mb-10 font-medium max-w-xl">
              Bu panel üzerinden şirketinizin tüm operasyonlarını tek bir noktadan yönetebilirsiniz. Müşteri projelerinin ilerlemesini güncelleyin ve randevu taleplerini hızlıca onaylayın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/admin/projeler" className="group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 px-8 py-4 rounded-xl font-black transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2">
                Hızlı Proje Ekle
              </Link>
              <Link href="/" target="_blank" className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                Siteyi Görüntüle <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Sağ Taraftaki Şık İkonografi */}
          <div className="hidden lg:flex shrink-0 w-80 h-80 relative">
            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-white/5 to-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
              <TrendingUp className="w-32 h-32 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
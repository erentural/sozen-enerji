"use client";

import { useState, useEffect } from "react";
import { FolderKanban, CalendarDays, Mail, Users, Activity, Zap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  // Veritabanından gerçek istatistikleri çek
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats");
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

  // İstatistik Kartı Bileşeni
  const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 bg-${color}-500`}></div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold text-gray-500 mb-1">{title}</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight">
            {loading ? "..." : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <Link href={link} className={`inline-flex items-center text-sm font-bold text-${color}-600 hover:text-${color}-800 transition-colors`}>
        {linkText} <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      
      {/* Üst Karşılama Alanı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            <Activity className="w-8 h-8 text-[#02529C]" /> 
            Sistem Özeti
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Enerji Yönetim Merkezi kontrol paneline hoş geldiniz.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-gray-700">Sistem Aktif & Çevrimiçi</span>
        </div>
      </div>

      {/* İstatistik Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Aktif Projeler" 
          value={stats.projects} 
          icon={FolderKanban} 
          color="blue" 
          link="/admin/projeler"
          linkText="Projeleri Yönet"
        />
        <StatCard 
          title="Bekleyen Randevular" 
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

      {/* Büyük Bilgi / Hoş Geldin Kartı */}
      <div className="bg-[#02529C] rounded-2xl overflow-hidden relative shadow-lg">
        {/* Dekoratif Arka Plan Çizgileri */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white rotate-12" />
        </div>
        
        <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-4 flex items-center gap-3">
              Enerjimiz <span className="text-[#FFC107]">Panel</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-6 font-medium">
              Bu panel üzerinden şirketinizin tüm operasyonlarını tek bir noktadan yönetebilirsiniz. Yeni gelen randevu taleplerini onaylayabilir, müşteri projelerinin ilerlemesini güncelleyebilir ve web sitesindeki ürün kataloğunuzu anında değiştirebilirsiniz.
            </p>
            <div className="flex gap-4">
              <Link href="/admin/projeler" className="bg-[#FFC107] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-sm">
                Hızlı Proje Ekle
              </Link>
              <Link href="/" className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors flex items-center gap-2">
                Siteyi Görüntüle <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Grafik İllüstrasyonu */}
          <div className="hidden lg:flex shrink-0 w-64 h-64 bg-white/5 border border-white/10 rounded-full items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-32 h-32 text-[#FFC107]" />
          </div>
        </div>
      </div>

    </div>
  );
}
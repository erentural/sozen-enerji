"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Search, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 

  // --- TEMA AYARLARI STATE'LERİ ---
  const [isCompact, setIsCompact] = useState(false);
  const [accent, setAccent] = useState("blue");

  // Dinamik Vurgu Renkleri
  const themeColors = {
    blue: { text: "text-[#02529C]", bg: "bg-[#02529C]", activeBtn: "bg-[#02529C] text-white" },
    amber: { text: "text-amber-500", bg: "bg-amber-500", activeBtn: "bg-amber-500 text-white" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-600", activeBtn: "bg-emerald-600 text-white" }
  };
  const currentTheme = themeColors[accent] || themeColors.blue;

  useEffect(() => {
    fetchAppointments();

    // Sayfa yüklendiğinde LocalStorage'dan temanın okunması
    const savedTheme = localStorage.getItem("sozen_admin_theme");
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setIsCompact(parsed.compactMode || false);
        setAccent(parsed.accent || "blue");
      } catch (e) {
        console.error("Tema okunamadı", e);
      }
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Randevular çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className={`bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı</span>;
      case "REJECTED":
        return <span className={`bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
      case "COMPLETED":
        return <span className={`bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı</span>;
      default:
        return <span className={`bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><Clock className="w-3.5 h-3.5" /> Onay Bekliyor</span>;
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Randevular yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300 dark:bg-slate-900 min-h-screen">
      
      {/* Sayfa Başlığı (Dinamik Renkli ve Karanlık Mod Uyumlu) */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
          <CalendarDays className={`w-8 h-8 ${currentTheme.text}`} /> Randevu Talepleri
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Müşterilerden gelen görüşme ve keşif taleplerini buradan yönetin.</p>
      </div>

      {/* Arama ve Filtreleme Araç Çubuğu */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        
        {/* Arama Çubuğu */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Konu veya müşteri adı ile ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-300 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-white text-sm font-medium transition-colors"
          />
        </div>

        {/* Durum Filtreleme Sekmeleri */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { key: "ALL", label: "Tümü" },
            { key: "PENDING", label: "Bekleyenler" },
            { key: "APPROVED", label: "Onaylananlar" },
            { key: "REJECTED", label: "İptal Edilenler" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                statusFilter === tab.key 
                  ? currentTheme.activeBtn // Seçili ise temanın vurgu rengini alır
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Randevu Listesi */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-bold text-base">Aradığınız kriterlere uygun randevu talebi bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((app) => (
            <div 
              key={app.id} 
              // DİKKAT: KOMPAKT MOD KONTROLÜ BURADA! Açıksa (p-3 gap-2), Kapalıysa (p-6 gap-4) kullanır.
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center group ${
                isCompact ? "p-3 md:p-4 gap-2" : "p-5 md:p-6 gap-4"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className={`font-black text-slate-900 dark:text-white transition-colors ${
                    isCompact ? "text-base" : "text-lg"
                  }`}>
                    {app.subject}
                  </h3>
                </div>
                
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition-colors">
                  <span className="text-slate-400 dark:text-slate-500">Müşteri:</span> {app.customer?.name || "Bilinmiyor"}
                </p>

                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 pt-1 transition-colors">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(app.date).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </div>

              <div className={`flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-slate-100 dark:border-slate-700 ${
                isCompact ? "pt-2 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0" : "pt-3 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0"
              }`}>
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
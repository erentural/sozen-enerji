"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Search, CheckCircle2, XCircle, Clock, AlertCircle, Trash2, Check } from "lucide-react";
import { useTheme } from "../ThemeContext"; 

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); 

  const { currentTheme, themeForm } = useTheme();
  const isCompact = themeForm?.compactMode || false;

  useEffect(() => {
    fetchAppointments();
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

  // DURUM GÜNCELLEME FONKSİYONU (Onayla, İptal Et, Tamamla)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        alert("Durum güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  // SİLME FONKSİYONU
  const handleDelete = async (id) => {
    if (!window.confirm("Bu randevu talebini tamamen silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAppointments(appointments.filter(app => app.id !== id));
      }
    } catch (error) {
      console.error("Silme hatası:", error);
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
        return <span className={`bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı</span>;
      case "REJECTED":
        return <span className={`bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
      case "COMPLETED":
        return <span className={`bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı</span>;
      default:
        return <span className={`bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors`}><Clock className="w-3.5 h-3.5" /> Onay Bekliyor</span>;
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Randevular yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
          <CalendarDays className={`w-8 h-8 ${currentTheme.text}`} /> Randevu Talepleri
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Müşterilerden gelen görüşme ve keşif taleplerini buradan yönetin.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Konu veya müşteri adı ile ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-1 ${currentTheme.focus} bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors`}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {/* YENİ EKLENEN: COMPLETED (Tamamlananlar) Filtresi */}
          {[
            { key: "ALL", label: "Tümü" },
            { key: "PENDING", label: "Bekleyenler" },
            { key: "APPROVED", label: "Onaylananlar" },
            { key: "COMPLETED", label: "Tamamlananlar" },
            { key: "REJECTED", label: "İptal Edilenler" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                statusFilter === tab.key 
                  ? `${currentTheme.bg} text-white` 
                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-700/80 shadow-sm transition-colors">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-bold text-base">Aradığınız kriterlere uygun randevu talebi bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((app) => (
            <div 
              key={app.id} 
              className={`bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center group ${
                isCompact ? "p-3 md:p-4 gap-2" : "p-5 md:p-6 gap-4"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className={`font-black text-slate-900 dark:text-slate-200 transition-colors ${
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

              <div className={`flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-4 w-full md:w-auto border-slate-100 dark:border-slate-700/80 ${
                isCompact ? "pt-2 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0" : "pt-3 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0"
              }`}>
                
                {/* Durum Rozeti */}
                {getStatusBadge(app.status)}

                {/* AKSİYON BUTONLARI */}
                <div className="flex items-center gap-2">
                  
                  {/* Bekleyen Randevu İçin Aksiyonlar */}
                  {app.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(app.id, "APPROVED")} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors text-xs font-bold border border-emerald-100 dark:border-emerald-800/50"
                        title="Randevuyu Onayla"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Onayla
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app.id, "REJECTED")} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors text-xs font-bold border border-rose-100 dark:border-rose-800/50"
                        title="Randevuyu İptal Et"
                      >
                        <XCircle className="w-4 h-4" /> Reddet
                      </button>
                    </>
                  )}

                  {/* Onaylanmış Randevu İçin Aksiyonlar */}
                  {app.status === "APPROVED" && (
                    <button 
                      onClick={() => handleStatusChange(app.id, "COMPLETED")} 
                      className={`flex items-center gap-1.5 px-3 py-1.5 ${currentTheme.bg} text-white hover:opacity-90 rounded-lg transition-colors text-xs font-bold shadow-sm`}
                      title="Randevuyu Tamamlandı Olarak İşaretle"
                    >
                      <Check className="w-4 h-4" /> Tamamla
                    </button>
                  )}

                  {/* Her Durumda Çıkan Sil Butonu */}
                  <button 
                    onClick={() => handleDelete(app.id)} 
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors ml-1"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
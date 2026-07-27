"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Search, CheckCircle2, XCircle, Clock, AlertCircle, Filter } from "lucide-react";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED, COMPLETED

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // Not: Projendeki randevu API endpoint yoluna göre burayı güncelleyebilirsin (örn: /api/admin/appointments)
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

  // Durum değişteme fonksiyonu (Eğer panelinde onaylama/reddetme butonları varsa aktif kalır)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Durum güncellenemedi", error);
    }
  };

  // Arama ve Filtreleme Mantığı
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
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı</span>;
      case "REJECTED":
        return <span className="bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> İptal Edildi</span>;
      case "COMPLETED":
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı</span>;
      default:
        return <span className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Onay Bekliyor</span>;
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium">Randevular yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans selection:bg-[#02529C] selection:text-white">
      
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <CalendarDays className="w-8 h-8 text-[#02529C]" /> Randevu Talepleri
        </h1>
        <p className="text-slate-500 text-sm mt-1">Müşterilerden gelen görüşme ve keşif taleplerini buradan yönetin.</p>
      </div>

      {/* Arama ve Filtreleme Araç Çubuğu */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Arama Çubuğu */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Konu veya müşteri adı ile ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-slate-50/50 text-slate-700 text-sm font-medium transition-colors"
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.key 
                  ? "bg-[#02529C] text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Randevu Listesi */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold text-base">Aradığınız kriterlere uygun randevu talebi bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div 
              key={app.id} 
              className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-blue-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#02529C] transition-colors">
                    {app.subject}
                  </h3>
                </div>
                
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">Müşteri:</span> {app.customer?.name || "Bilinmiyor"}
                </p>

                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(app.date).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
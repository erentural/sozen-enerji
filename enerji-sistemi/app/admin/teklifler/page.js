"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2, XCircle, Mail, Phone, ChevronRight } from "lucide-react";

export default function LeadsPage() {
  // Tasarımı anında görebilmen için geçici örnek talepler
  const [leads, setLeads] = useState([
    { id: 1, name: "Mehmet Demir", phone: "0555 123 4567", service: "Çatı GES Kurulumu", status: "YENI", date: "2 saat önce" },
    { id: 2, name: "ABC Tekstil Fabrikası", phone: "0850 987 6543", service: "Endüstriyel Pano", status: "GORUSULDU", date: "Dün" },
    { id: 3, name: "Ayşe Yılmaz", phone: "0532 111 2233", service: "Konut Elektrik", status: "KAPANDI", date: "3 gün önce" },
  ]);

  const getStatusStyle = (status) => {
    switch(status) {
      case "YENI": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "GORUSULDU": return "bg-blue-100 text-[#02529C] border-blue-200";
      case "KAPANDI": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "YENI": return <Clock className="w-4 h-4 mr-1.5" />;
      case "GORUSULDU": return <ChevronRight className="w-4 h-4 mr-1.5" />;
      case "KAPANDI": return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#FFC107]" /> Teklif Talepleri
          </h1>
          <p className="text-gray-500 text-sm mt-1">Web sitesinden gelen keşif ve fiyat taleplerini yönetin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#FFC107] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
            
            {/* Sol: İletişim Bilgileri */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(lead.status)}`}>
                  {getStatusIcon(lead.status)}
                  {lead.status === "YENI" ? "Yeni Talep" : lead.status === "GORUSULDU" ? "Dönüş Yapıldı" : "Satışa Döndü"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {lead.phone}</span>
                <span className="flex items-center gap-1.5"><FolderKanban className="w-4 h-4 text-gray-400" /> {lead.service}</span>
              </div>
            </div>

            {/* Sağ: Aksiyonlar ve Tarih */}
            <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
              <div className="text-sm font-semibold text-gray-400 text-right hidden md:block">
                {lead.date}
              </div>
              <button className="w-full sm:w-auto bg-gray-50 hover:bg-[#02529C] text-[#02529C] hover:text-white border border-gray-200 px-5 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                Detayları Gör <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
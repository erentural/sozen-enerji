"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2, Phone, ChevronRight, FolderKanban, Trash2, Search } from "lucide-react";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Örnek talepler (Veritabanı bağlantısı yapılana kadar güvenli liste)
  const [leads, setLeads] = useState([
    { id: 1, name: "Mehmet Demir", phone: "0555 123 4567", service: "Çatı GES Kurulumu", status: "YENI", date: "2 saat önce" },
    { id: 2, name: "ABC Tekstil Fabrikası", phone: "0850 987 6543", service: "Endüstriyel Pano", status: "GORUSULDU", date: "Dün" },
    { id: 3, name: "Ayşe Yılmaz", phone: "0532 111 2233", service: "Konut Elektrik", status: "KAPANDI", date: "3 gün önce" },
  ]);

  const handleDelete = (id) => {
    if (!window.confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case "YENI": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "GORUSULDU": return "bg-blue-100 text-[#02529C] border-blue-200";
      case "KAPANDI": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#FFC107]" /> Teklif Talepleri
          </h1>
          <p className="text-gray-500 text-sm mt-1">Web sitesinden gelen keşif ve fiyat taleplerini yönetin.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Arama Alanı */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim veya hizmet ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
            />
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <p className="text-gray-500 text-sm py-12 text-center">Görüntülenecek talep bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                    <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(lead.status)}`}>
                      {lead.status === "YENI" ? <Clock className="w-3.5 h-3.5 mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {lead.status === "YENI" ? "Yeni Talep" : lead.status === "GORUSULDU" ? "Dönüş Yapıldı" : "Tamamlandı"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {lead.phone}</span>
                    <span className="flex items-center gap-1.5"><FolderKanban className="w-4 h-4 text-gray-400" /> {lead.service}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 hidden md:block">{lead.date}</span>
                  <button 
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Talebi Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
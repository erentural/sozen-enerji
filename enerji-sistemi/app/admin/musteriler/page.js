"use client";

import { useState } from "react";
import { Users, Search, Plus, Mail, FolderKanban, MoreVertical } from "lucide-react";

export default function CustomersPage() {
  // Tasarımı anında görebilmen için geçici örnek veriler ekledim
  const [customers, setCustomers] = useState([
    { id: 1, name: "Ali Bülent", email: "ali@ornek.com", projects: 2, date: "2026-07-15" },
    { id: 2, name: "Eren Tural", email: "eren@ornek.com", projects: 5, date: "2026-06-20" },
    { id: 3, name: "Sözen İnşaat A.Ş.", email: "info@sozeninsaat.com", projects: 1, date: "2026-07-20" },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#02529C]" /> Müşteri Yönetimi (CRM)
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı tüm müşterileriniz ve proje sayıları.</p>
        </div>
        
        <button className="bg-[#02529C] hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> Yeni Müşteri Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Arama Çubuğu */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Müşteri adı veya e-posta ara..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white"
            />
          </div>
        </div>

        {/* Müşteri Tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Müşteri / Firma Adı</th>
                <th className="p-4">E-Posta Adresi</th>
                <th className="p-4 text-center">Aktif Proje</th>
                <th className="p-4">Kayıt Tarihi</th>
                <th className="p-4 text-right pr-6">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 pl-6 font-bold text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {c.email}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center bg-blue-100 text-[#02529C] font-bold px-3 py-1 rounded-full text-xs">
                      {c.projects} Proje
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{c.date}</td>
                  <td className="p-4 text-right pr-6">
                    <button className="text-gray-400 hover:text-[#02529C] p-2 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
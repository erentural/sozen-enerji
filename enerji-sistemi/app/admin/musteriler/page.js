"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Trash2, X, Calendar } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal (Yeni Müşteri Ekle Penceresi) State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Müşteriler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni Müşteri Kaydetme Formu Gönderimi
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Müşteri başarıyla eklendi!");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", password: "" });
        fetchCustomers();
      } else {
        alert(data.error || "Müşteri eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("İşlem başarısız", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Müşteri Silme
  const handleDelete = async (id) => {
    if (!window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert("Müşteri silinemedi.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // Arama Filtresi
  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500 font-medium">Müşteriler yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#02529C]" /> Müşteri Yönetimi (CRM)
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı tüm müşterileriniz ve proje sayıları.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#02529C] hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
            />
          </div>
        </div>

        {/* Müşteri Tablosu */}
        {filteredCustomers.length === 0 ? (
          <p className="text-gray-500 text-sm py-12 text-center">Kayıtlı müşteri bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Müşteri Adı</th>
                  <th className="p-4">E-Posta Adresi</th>
                  <th className="p-4 text-center">Aktif Proje</th>
                  <th className="p-4">Kayıt Tarihi</th>
                  <th className="p-4 text-right pr-6">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-gray-900">{c.name || "İsimsiz"}</td>
                    <td className="p-4 text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> {c.email}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-[#02529C] font-bold px-3 py-1 rounded-full text-xs">
                        {c.projects?.length || 0} Proje
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 flex items-center gap-1.5 pt-5">
                      <Calendar className="w-4 h-4 text-gray-400" /> {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition-colors hover:bg-red-50"
                        title="Müşteriyi Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Yeni Müşteri Ekle Modal Penceresi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Müşteri Ekle</h2>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Müşteri Adı / Soyadı</label>
                <input 
                  type="text" 
                  required
                  placeholder="Örn: Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta Adresi</label>
                <input 
                  type="email" 
                  required
                  placeholder="ahmet@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giriş Şifresi (Opsiyonel)</label>
                <input 
                  type="password" 
                  placeholder="Boş bırakılırsa 'musteri123' atanır"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#02529C] hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-70 shadow-sm"
                >
                  {isSubmitting ? "Kaydediliyor..." : "Müşteriyi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
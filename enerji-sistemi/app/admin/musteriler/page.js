"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Trash2, X, Calendar, AlertTriangle, AlertCircle, ShieldAlert, Phone } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // YENİ: countryCode state'e eklendi ve varsayılan +90 atandı
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", countryCode: "+90", password: "", role: "USER" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // API'ye gönderilecek veriyi hazırlıyoruz (Ülke kodu ve numarayı birleştirerek)
    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode} ${formData.phone}`,
      password: formData.password,
      role: formData.role
    };

    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData), // Düzenlenmiş veriyi gönderiyoruz
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        // Formu tamamen sıfırla
        setFormData({ name: "", email: "", phone: "", countryCode: "+90", password: "", role: "USER" });
        fetchCustomers();
      } else {
        setErrorMessage(data.error || "Kayıt sırasında bir hata oluştu.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("İşlem başarısız", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/customers/${customerToDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
        setDeleteModalOpen(false);
        setCustomerToDelete(null);
      } else {
        setDeleteModalOpen(false);
        setErrorMessage(data.error || "Kullanıcı silinemedi.");
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      setDeleteModalOpen(false);
      setErrorMessage("Sistemsel bir bağlantı hatası oluştu.");
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  if (loading) return <div className="p-8 text-gray-500 font-medium">Kullanıcılar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#02529C]" /> Müşteri & Kullanıcı Yönetimi
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı müşterilerinizi ve yöneticileri buradan yönetin.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#02529C] hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Yeni Ekle
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya telefon ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <p className="text-gray-500 text-sm py-12 text-center">Kayıtlı kullanıcı bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Ad Soyad</th>
                  <th className="p-4">İletişim Bilgileri</th>
                  <th className="p-4 text-center">Durum / Proje</th>
                  <th className="p-4">Kayıt Tarihi</th>
                  <th className="p-4 text-right pr-6">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-gray-900 flex items-center gap-2">
                      {c.name || "İsimsiz"}
                      {c.role === "ADMIN" && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> YÖNETİCİ
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {c.email}</span>
                        <span className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-3.5 h-3.5 text-gray-400" /> {c.phone || "Belirtilmemiş"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center font-bold px-3 py-1 rounded-full text-xs ${c.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-blue-100 text-[#02529C]'}`}>
                        {c.role === "ADMIN" ? "Yetkili Personel" : `${c.projects?.length || 0} Proje`}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5 pt-1"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(c.createdAt).toLocaleDateString("tr-TR")}</div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => initiateDelete(c)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition-colors hover:bg-red-50"
                        title="Sil"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Yeni Kullanıcı Ekle</h2>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hesap Türü (Yetki)</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "USER"})}
                    className={`flex-1 py-2 text-sm font-bold border rounded-lg transition-colors ${formData.role === "USER" ? "bg-[#02529C] text-white border-[#02529C]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                  >
                    Müşteri
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: "ADMIN"})}
                    className={`flex-1 py-2 text-sm font-bold border rounded-lg transition-colors ${formData.role === "ADMIN" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                  >
                    Sistem Yöneticisi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad *</label>
                <input 
                  type="text" required placeholder="Örn: Ahmet Yılmaz" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>
              
              {/* YENİ: Ülke Kodlu ve Sınırlamalı Telefon Girişi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon Numaranız *</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-sm font-medium shadow-sm"
                  >
                    <option value="+90">+90</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+49">+49</option>
                  </select>
                  <input 
                    type="tel" 
                    required
                    maxLength="10"
                    placeholder="555 123 4567"
                    value={formData.phone}
                    onChange={(e) => {
                      // Sadece rakam girişine izin ver
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      if (onlyNums.length <= 10) setFormData({ ...formData, phone: onlyNums });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] text-sm shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-Posta Adresi *</label>
                <input 
                  type="email" required placeholder="ahmet@email.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giriş Şifresi (Opsiyonel)</label>
                <input 
                  type="password" placeholder="Boş bırakılırsa 'musteri123' atanır" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C]"
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-70 shadow-sm ${formData.role === 'ADMIN' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#02529C] hover:bg-blue-800'}`}>
                  {isSubmitting ? "Kaydediliyor..." : "Kullanıcıyı Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kullanıcıyı Sil</h3>
            <p className="text-sm text-gray-500 mb-6">
              <strong className="text-gray-800">{customerToDelete?.name}</strong> isimli kullanıcıyı silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors"
              >
                İptal Et
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {errorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border-t-4 border-red-500 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">İşlem Durduruldu</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100">
              {errorMessage}
            </p>
            <button 
              onClick={() => setErrorModalOpen(false)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Trash2, X, Calendar, AlertTriangle, AlertCircle, ShieldAlert, Phone, UserPlus, ShieldPlus } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("USER"); // "USER" veya "ADMIN"
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", countryCode: "+90", password: "", role: "USER" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Silme Onayı ve Hata Modalı State'leri
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

  // Yeni Modal Açma Fonksiyonu
  const openModal = (type) => {
    setModalType(type);
    setFormData({ name: "", email: "", phone: "", countryCode: "+90", password: "", role: type });
    setIsModalOpen(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#02529C]" /> Müşteri & Personel Yönetimi
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı müşterilerinizi ve yöneticileri buradan yönetin.</p>
        </div>
        
        {/* YENİ: İKİ AYRI İŞLEM BUTONU */}
        <div className="flex gap-3">
          <button 
            onClick={() => openModal("ADMIN")}
            className="bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-500 hover:text-amber-600 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <ShieldPlus className="w-5 h-5" /> Yönetici Ekle
          </button>
          
          <button 
            onClick={() => openModal("USER")}
            className="bg-[#02529C] hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus className="w-5 h-5" /> Yeni Müşteri Ekle
          </button>
        </div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
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

      {/* YENİ: DİNAMİK EKLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${modalType === 'ADMIN' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-[#02529C]'}`}>
                {modalType === 'ADMIN' ? <ShieldPlus className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {modalType === 'ADMIN' ? 'Yeni Yönetici Ekle' : 'Yeni Müşteri Ekle'}
                </h2>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  {modalType === 'ADMIN' ? 'Sisteme tam yetkili bir personel tanımlayın.' : 'Sisteme yeni bir müşteri profili oluşturun.'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {modalType === 'ADMIN' ? 'Personel Adı Soyadı *' : 'Müşteri Adı Soyadı *'}
                </label>
                <input 
                  type="text" required placeholder="Örn: Ahmet Yılmaz" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none transition-colors ${modalType === 'ADMIN' ? 'focus:border-amber-500' : 'focus:border-[#02529C]'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Telefon Numarası *</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className={`px-3 py-3 border border-gray-200 rounded-xl focus:outline-none text-sm font-bold bg-gray-50 transition-colors ${modalType === 'ADMIN' ? 'focus:border-amber-500' : 'focus:border-[#02529C]'}`}
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
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      if (onlyNums.length <= 10) setFormData({ ...formData, phone: onlyNums });
                    }}
                    className={`flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-sm transition-colors ${modalType === 'ADMIN' ? 'focus:border-amber-500' : 'focus:border-[#02529C]'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">E-Posta Adresi *</label>
                <input 
                  type="email" required placeholder="ornek@email.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none transition-colors ${modalType === 'ADMIN' ? 'focus:border-amber-500' : 'focus:border-[#02529C]'}`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Giriş Şifresi</label>
                <input 
                  type="password" 
                  placeholder={modalType === 'ADMIN' ? "Boş bırakılırsa 'admin123' atanır" : "Boş bırakılırsa 'musteri123' atanır"} 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none transition-colors ${modalType === 'ADMIN' ? 'focus:border-amber-500' : 'focus:border-[#02529C]'}`}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full text-white font-black py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 ${modalType === 'ADMIN' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#02529C] hover:bg-blue-800'}`}
                >
                  {isSubmitting 
                    ? "Kaydediliyor..." 
                    : modalType === 'ADMIN' ? "Yöneticiyi Yetkilendir" : "Müşteriyi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
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
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                İptal Et
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {errorModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-t-4 border-red-500 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">İşlem Durduruldu</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100">
              {errorMessage}
            </p>
            <button 
              onClick={() => setErrorModalOpen(false)}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
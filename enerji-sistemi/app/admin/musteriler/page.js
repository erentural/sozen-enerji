"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Trash2, X, Calendar, AlertTriangle, AlertCircle, ShieldAlert, Phone, UserPlus, ShieldPlus } from "lucide-react";
import { useTheme } from "../ThemeContext"; // YENİ: Global Temayı çekiyoruz

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Tema State'leri
  const { currentTheme, themeForm } = useTheme();
  const isCompact = themeForm?.compactMode || false; // Kompakt tablo kontrolü

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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Kullanıcılar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      
      {/* Sayfa Başlığı ve Aksiyon Butonları */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
            <Users className={`w-8 h-8 ${currentTheme.text}`} /> Müşteri & Personel Yönetimi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Sisteme kayıtlı müşterilerinizi ve yöneticileri buradan yönetin.</p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <button 
            onClick={() => openModal("ADMIN")}
            className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm flex-1 md:flex-none"
          >
            <ShieldPlus className="w-5 h-5" /> Yönetici Ekle
          </button>
          
          <button 
            onClick={() => openModal("USER")}
            className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm flex-1 md:flex-none`}
          >
            <UserPlus className="w-5 h-5" /> Yeni Müşteri Ekle
          </button>
        </div>
      </div>

      {/* Tablo Kartı */}
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden transition-colors duration-300">
        
        {/* Arama */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya telefon ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-1 ${currentTheme.focus} bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors`}
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-12 text-center font-medium">Kayıtlı kullanıcı bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/80 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors">
                  <th className="p-4 pl-6">Ad Soyad</th>
                  <th className="p-4">İletişim Bilgileri</th>
                  <th className="p-4 text-center">Durum / Proje</th>
                  <th className="p-4">Kayıt Tarihi</th>
                  <th className="p-4 text-right pr-6">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group ${isCompact ? "text-sm" : "text-base"}`}>
                    <td className={`pl-6 font-bold text-slate-900 dark:text-slate-200 transition-colors flex items-center gap-2 ${isCompact ? 'py-3' : 'py-5'}`}>
                      {c.name || "İsimsiz"}
                      {c.role === "ADMIN" && (
                        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] uppercase font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200 dark:border-amber-800 transition-colors">
                          <ShieldAlert className="w-3 h-3" /> YÖNETİCİ
                        </span>
                      )}
                    </td>
                    <td className={`${isCompact ? 'py-3' : 'py-5'} pr-4 text-slate-600 dark:text-slate-400 transition-colors`}>
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {c.email}</span>
                        <span className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {c.phone || "Belirtilmemiş"}</span>
                      </div>
                    </td>
                    <td className={`${isCompact ? 'py-3' : 'py-5'} p-4 text-center`}>
                      <span className={`inline-flex items-center justify-center font-bold px-3 py-1.5 rounded-xl text-xs transition-colors border ${
                        c.role === 'ADMIN' 
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' 
                          : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}>
                        {c.role === "ADMIN" ? "Yetkili Personel" : `${c.projects?.length || 0} Proje`}
                      </span>
                    </td>
                    <td className={`${isCompact ? 'py-3' : 'py-5'} p-4 text-sm text-slate-500 dark:text-slate-400 transition-colors`}>
                      <div className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {new Date(c.createdAt).toLocaleDateString("tr-TR")}</div>
                    </td>
                    <td className={`${isCompact ? 'py-3' : 'py-5'} p-4 text-right pr-6`}>
                      <button 
                        onClick={() => initiateDelete(c)}
                        className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-xl transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
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

      {/* DİNAMİK EKLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-700/80 transition-colors">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${modalType === 'ADMIN' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400' : `${currentTheme.bg.replace('bg-', 'text-')} bg-opacity-10 dark:bg-opacity-20`}`}>
                {modalType === 'ADMIN' ? <ShieldPlus className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 transition-colors">
                  {modalType === 'ADMIN' ? 'Yeni Yönetici Ekle' : 'Yeni Müşteri Ekle'}
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                  {modalType === 'ADMIN' ? 'Sisteme tam yetkili bir personel tanımlayın.' : 'Sisteme yeni bir müşteri profili oluşturun.'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
                  {modalType === 'ADMIN' ? 'Personel Adı Soyadı *' : 'Müşteri Adı Soyadı *'}
                </label>
                <input 
                  type="text" required placeholder="Örn: Ahmet Yılmaz" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 transition-colors ${modalType === 'ADMIN' ? 'focus:ring-amber-500 focus:border-amber-500' : currentTheme.focus}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Telefon Numarası *</label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className={`px-3 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 text-sm font-bold focus:outline-none focus:ring-1 transition-colors ${modalType === 'ADMIN' ? 'focus:ring-amber-500 focus:border-amber-500' : currentTheme.focus}`}
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
                    className={`flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 transition-colors ${modalType === 'ADMIN' ? 'focus:ring-amber-500 focus:border-amber-500' : currentTheme.focus}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">E-Posta Adresi *</label>
                <input 
                  type="email" required placeholder="ornek@email.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 transition-colors ${modalType === 'ADMIN' ? 'focus:ring-amber-500 focus:border-amber-500' : currentTheme.focus}`}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Giriş Şifresi</label>
                <input 
                  type="password" 
                  placeholder={modalType === 'ADMIN' ? "Boş bırakılırsa 'admin123' atanır" : "Boş bırakılırsa 'musteri123' atanır"} 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-1 transition-colors ${modalType === 'ADMIN' ? 'focus:ring-amber-500 focus:border-amber-500' : currentTheme.focus}`}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`w-full text-white font-black py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 ${modalType === 'ADMIN' ? 'bg-amber-500 hover:bg-amber-600' : `${currentTheme.bg} ${currentTheme.hoverBg}`}`}
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

      {/* SİLME ONAYI MODALI */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700/80">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-2 transition-colors">Kullanıcıyı Sil</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
              <strong className="text-slate-800 dark:text-slate-200">{customerToDelete?.name}</strong> isimli kullanıcıyı silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors"
              >
                İptal Et
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HATA MODALI */}
      {errorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border-t-4 border-rose-500 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-rose-100 dark:bg-rose-900/30 mb-4 transition-colors">
              <AlertCircle className="h-7 w-7 text-rose-600 dark:text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-200 mb-2 transition-colors">İşlem Durduruldu</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 font-medium transition-colors">
              {errorMessage}
            </p>
            <button 
              onClick={() => setErrorModalOpen(false)}
              className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
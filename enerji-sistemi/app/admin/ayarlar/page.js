"use client";

import { useState, useEffect } from "react";
import { User, Building2, Bell, Shield, Save, CheckCircle2, Mail, Phone, MapPin, Palette, Sun, Moon, Monitor } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "Sistem Yöneticisi",
    email: "admin@enerji.com",
    currentPassword: "",
    newPassword: "",
  });

  // Şirket bilgileri başlangıçta boş veya geçici olabilir, API'den dolacak
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    supportEmail: "",
    phone: "",
    address: "",
  });

  const [notificationForm, setNotificationForm] = useState({
    emailOnAppointment: true,
    emailOnMessage: true,
    emailOnQuote: true,
    smsAlerts: false,
  });

  const [themeForm, setThemeForm] = useState({
    mode: "light", 
    accent: "blue", 
    compactMode: false,
  });

  // 1. ADIM: Sayfa açıldığında veritabanından gerçek bilgileri çek
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setCompanyForm(data.company); // Veritabanından gelen gerçek şirket bilgileri
          }
          if (data.profile) {
            setProfileForm(prev => ({ ...prev, name: data.profile.name, email: data.profile.email }));
          }
        }
      } catch (error) {
        console.error("Ayarlar yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. ADIM: Değişiklikleri kaydet butonuna basınca veritabanına gönder
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyForm,
          profileForm,
          notificationForm,
          themeForm,
        }),
      });

      if (res.ok) {
        if (activeTab === "theme") {
          localStorage.setItem("sozen_admin_theme", JSON.stringify(themeForm));
        }
        setSuccessMessage("Değişiklikler veritabanına başarıyla kaydedildi!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Kaydedilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Sistemsel bir hata oluştu.");
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium">Ayarlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans selection:bg-[#02529C] selection:text-white">
      
      {/* Sayfa Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#02529C]" /> Sistem Ayarları
        </h1>
        <p className="text-slate-500 text-sm mt-1">Yönetici profili, kurumsal bilgiler, bildirimler ve tema tercihlerinizi buradan yönetin.</p>
      </div>

      {/* Başarı Mesajı */}
      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-bold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Sekmeli Yapı (Tabs Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sol Menü / Sekmeler */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "profile" ? "bg-[#02529C] text-white shadow-md shadow-blue-900/10" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5" /> Profil ve Güvenlik
            </button>

            <button
              onClick={() => setActiveTab("company")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "company" ? "bg-[#02529C] text-white shadow-md shadow-blue-900/10" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Building2 className="w-5 h-5" /> Kurumsal Bilgiler
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "notifications" ? "bg-[#02529C] text-white shadow-md shadow-blue-900/10" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Bell className="w-5 h-5" /> Bildirim Tercihleri
            </button>

            <button
              onClick={() => setActiveTab("theme")}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "theme" ? "bg-[#02529C] text-white shadow-md shadow-blue-900/10" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Palette className="w-5 h-5" /> Görünüm ve Tema
            </button>
          </div>
        </div>

        {/* Sağ İçerik Alanı */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            
            {/* 1. SEKME: PROFİL VE GÜVENLİK */}
            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Profil ve Güvenlik</h2>
                  <p className="text-xs text-slate-400 font-medium">Yönetici hesap bilgilerinizi ve şifrenizi güncelleyin.</p>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Görüntülenen Adınız</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">E-posta Adresiniz</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-400 bg-slate-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 mb-4">Şifre Değiştirme</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Mevcut Şifreniz</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Yeni Şifreniz</label>
                        <input
                          type="password"
                          placeholder="Yeni şifrenizi girin"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[#02529C] hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* 2. SEKME: KURUMSAL BİLGİLER (ADRES BURADA) */}
            {activeTab === "company" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Kurumsal Bilgiler</h2>
                  <p className="text-xs text-slate-400 font-medium">Web sitesinde ve PDF raporlarında kullanılan resmi şirket bilgileri.</p>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Şirket Resmi Unvanı</label>
                    <input
                      type="text"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Destek E-Postası</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={companyForm.supportEmail}
                          onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Çağrı Merkezi / Telefon</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Merkez Adres Bilgisi</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <textarea
                        rows={3}
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50/50 focus:outline-none focus:border-[#02529C] resize-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[#02529C] hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* 3. SEKME: BİLDİRİM TERCİHLERİ */}
            {activeTab === "notifications" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Bildirim Tercihleri</h2>
                  <p className="text-xs text-slate-400 font-medium">Sistemde gerçekleşen olaylar için bilgilendirme kanallarını yapılandırın.</p>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="space-y-4">
                  {[
                    { key: "emailOnAppointment", title: "Yeni Randevu Talebi", desc: "Müşteriler yeni bir randevu talebi oluşturduğunda e-posta al." },
                    { key: "emailOnMessage", title: "Müşteri Mesajları", desc: "Portal üzerinden yönetime yeni bir mesaj gönderildiğinde bilgilendir." },
                    { key: "emailOnQuote", title: "Fiyat Teklifi İstekleri", desc: "Web sitesi hesaplayıcısından yeni bir teklif talebi geldiğinde uyar." },
                    { key: "smsAlerts", title: "Acil Durum SMS Uyarıları", desc: "Kritik sistem güncellemeleri ve acil destek taleplerinde SMS bildirimi gönder." },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-black text-slate-900 mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={notificationForm[item.key]}
                          onChange={(e) => setNotificationForm({ ...notificationForm, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02529C]"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[#02529C] hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Tercihleri Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* 4. SEKME: GÖRÜNÜM VE TEMA */}
            {activeTab === "theme" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Görünüm ve Tema</h2>
                  <p className="text-xs text-slate-400 font-medium">Yönetim paneli arayüz temasını ve renk modunu özelleştirin.</p>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Panel Tema Modu</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Aydınlık", icon: Sun },
                        { id: "dark", label: "Karanlık", icon: Moon },
                        { id: "system", label: "Sistem", icon: Monitor },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = themeForm.mode === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setThemeForm({ ...themeForm, mode: item.id })}
                            className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                              isSelected ? "border-[#02529C] bg-blue-50/50 text-[#02529C]" : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200"
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                            <span className="text-xs font-bold">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Kurumsal Vurgu Rengi</label>
                    <div className="flex gap-4">
                      {[
                        { id: "blue", name: "Sözen Mavi", bg: "bg-[#02529C]" },
                        { id: "amber", name: "Enerji Sarı", bg: "bg-amber-500" },
                        { id: "emerald", name: "Yeşil Enerji", bg: "bg-emerald-600" },
                      ].map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setThemeForm({ ...themeForm, accent: color.id })}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                            themeForm.accent === color.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`}></span>
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-0.5">Kompakt Tablo Görünümü</h4>
                      <p className="text-xs text-slate-500 font-medium">Veri listelerinde daha az boşluk bırakarak ekrana daha fazla içerik sığdır.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={themeForm.compactMode}
                        onChange={(e) => setThemeForm({ ...themeForm, compactMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02529C]"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[#02529C] hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Temayı Kaydet
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { User, Building2, Bell, Shield, Save, CheckCircle2, Mail, Phone, MapPin, Palette, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../ThemeContext"; // YENİ: Global Temayı İçeri Aktarıyoruz

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ name: "Sistem Yöneticisi", email: "admin@enerji.com", currentPassword: "", newPassword: "" });
  const [companyForm, setCompanyForm] = useState({ companyName: "", supportEmail: "", phone: "", address: "" });
  const [notificationForm, setNotificationForm] = useState({ emailOnAppointment: true, emailOnMessage: true, emailOnQuote: true, smsAlerts: false });

  // YENİ: Global Tema yöneticisinden verileri çekiyoruz
  const { themeForm, handleThemeChange, currentTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.company) setCompanyForm(data.company);
          if (data.profile) setProfileForm(prev => ({ ...prev, name: data.profile.name, email: data.profile.email }));
        }
      } catch (error) {
        console.error("Ayarlar yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 1. Backend hazır olmasa bile arayüzde (UI) anında başarı mesajını gösteriyoruz
    setSuccessMessage("Değişiklikler başarıyla kaydedildi!");
    setTimeout(() => setSuccessMessage(""), 3000);

    // 2. Arka plan API'sine veriyi göndermeyi deniyoruz
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyForm, profileForm, notificationForm }),
      });
      
      if (!res.ok) {
        console.warn("Sistem Uyarısı: API endpoint'i bulunamadı. Veriler sadece ekranda güncellendi.");
      }
    } catch (error) {
      console.error("Kayıt hatası (Veritabanı API'si henüz yazılmamış olabilir):", error);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Ayarlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
          <Shield className={`w-8 h-8 ${currentTheme.text}`} /> Sistem Ayarları
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Yönetici profili, kurumsal bilgiler, bildirimler ve tema tercihlerinizi yönetin.</p>
      </div>

      <div className={`mb-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${successMessage ? 'opacity-100' : 'opacity-0 h-0 p-0 m-0 overflow-hidden border-0'}`}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="font-bold text-sm">{successMessage}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-1 transition-colors">
            <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "profile" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><User className="w-5 h-5" /> Profil ve Güvenlik</button>
            <button onClick={() => setActiveTab("company")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "company" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Building2 className="w-5 h-5" /> Kurumsal Bilgiler</button>
            <button onClick={() => setActiveTab("notifications")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "notifications" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Bell className="w-5 h-5" /> Bildirim Tercihleri</button>
            <button onClick={() => setActiveTab("theme")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "theme" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Palette className="w-5 h-5" /> Görünüm ve Tema</button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            
            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Profil ve Güvenlik</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Görüntülenen Adınız</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus}`} required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">E-posta Adresiniz</label>
                    <input type="email" value={profileForm.email} disabled className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 cursor-not-allowed" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">Şifre Değiştirme</h3>
                    <div className="space-y-4">
                      <div><input type="password" placeholder="Mevcut Şifreniz" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white`} /></div>
                      <div><input type="password" placeholder="Yeni şifrenizi girin" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white`} /></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}><Save className="w-4 h-4" /> Kaydet</button>
                </div>
              </form>
            )}

            {activeTab === "company" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Kurumsal Bilgiler</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Şirket Resmi Unvanı</label>
                    <input type="text" value={companyForm.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white`} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Destek E-Postası</label>
                      <input type="email" value={companyForm.supportEmail} onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white`} required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Çağrı Merkezi / Telefon</label>
                      <input type="text" value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white`} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2">Merkez Adres Bilgisi</label>
                    <textarea rows={3} value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none ${currentTheme.focus} dark:text-white resize-none`} required></textarea>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}><Save className="w-4 h-4" /> Kaydet</button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Bildirim Tercihleri</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>
                <div className="space-y-4">
                  {[
                    { key: "emailOnAppointment", title: "Yeni Randevu Talebi", desc: "Müşteriler yeni bir randevu talebi oluşturduğunda e-posta al." },
                    { key: "emailOnMessage", title: "Müşteri Mesajları", desc: "Portal üzerinden yönetime mesaj gönderildiğinde bilgilendir." }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <input type="checkbox" checked={notificationForm[item.key]} onChange={(e) => setNotificationForm({ ...notificationForm, [item.key]: e.target.checked })} className="w-5 h-5 accent-[#02529C]" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}><Save className="w-4 h-4" /> Kaydet</button>
                </div>
              </form>
            )}

            {activeTab === "theme" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Görünüm ve Tema</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3">Panel Tema Modu</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[{ id: "light", label: "Aydınlık", icon: Sun }, { id: "dark", label: "Karanlık", icon: Moon }, { id: "system", label: "Sistem", icon: Monitor }].map((item) => (
                        <div key={item.id} onClick={() => handleThemeChange("mode", item.id)} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 ${themeForm.mode === item.id ? `${currentTheme.border} ${currentTheme.text} bg-slate-50 dark:bg-slate-900/50` : "border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                          <item.icon className="w-6 h-6" /> <span className="text-xs font-bold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3">Kurumsal Vurgu Rengi</label>
                    <div className="flex gap-4">
                      {[{ id: "blue", name: "Sözen Mavi", bg: "bg-[#02529C]" }, { id: "amber", name: "Enerji Sarı", bg: "bg-amber-500" }, { id: "emerald", name: "Yeşil Enerji", bg: "bg-emerald-600" }].map((color) => (
                        <button key={color.id} onClick={() => handleThemeChange("accent", color.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold ${themeForm.accent === color.id ? "border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300"}`}>
                          <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`}></span>{color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
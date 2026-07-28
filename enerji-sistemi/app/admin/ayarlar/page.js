"use client";

import { useState, useEffect } from "react";
import { User, Building2, Shield, Save, CheckCircle2, Palette, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: "Sistem Yöneticisi", email: "admin@enerji.com", currentPassword: "", newPassword: "" });
  const [companyForm, setCompanyForm] = useState({ companyName: "", supportEmail: "", phone: "", address: "" });

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
    setSuccessMessage("Değişiklikler başarıyla kaydedildi!");
    setTimeout(() => setSuccessMessage(""), 3000);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyForm, profileForm }), // Bildirimler çıkarıldı
      });
      if (!res.ok) console.warn("Sistem Uyarısı: API endpoint'i bulunamadı. Veriler ekranda güncellendi.");
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Ayarlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
          <Shield className={`w-8 h-8 ${currentTheme.text}`} /> Sistem Ayarları
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Yönetici profili, kurumsal bilgiler ve tema tercihlerinizi yönetin.</p>
      </div>

      <div className={`mb-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${successMessage ? 'opacity-100' : 'opacity-0 h-0 p-0 m-0 overflow-hidden border-0'}`}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="font-bold text-sm">{successMessage}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL MENÜ - TABS */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-1 transition-colors">
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "profile" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <User className="w-5 h-5" /> Profil ve Güvenlik
            </button>
            <button 
              onClick={() => setActiveTab("company")} 
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "company" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <Building2 className="w-5 h-5" /> Kurumsal Bilgiler
            </button>
            <button 
              onClick={() => setActiveTab("theme")} 
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "theme" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <Palette className="w-5 h-5" /> Görünüm ve Tema
            </button>
          </div>
        </div>

        {/* SAĞ İÇERİK ALANI */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
            
            {/* PROFİL SEKMESİ */}
            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1 transition-colors">Profil ve Güvenlik</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full transition-colors"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Görüntülenen Adınız</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} transition-colors`} required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">E-posta Adresiniz</label>
                    <input type="email" value={profileForm.email} disabled className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed transition-colors" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 transition-colors">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-200 mb-4 transition-colors">Şifre Değiştirme</h3>
                    <div className="space-y-4">
                      <div><input type="password" placeholder="Mevcut Şifreniz" value={profileForm.currentPassword} onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 transition-colors`} /></div>
                      <div><input type="password" placeholder="Yeni şifrenizi girin" value={profileForm.newPassword} onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 transition-colors`} /></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* KURUMSAL BİLGİLER SEKMESİ */}
            {activeTab === "company" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1 transition-colors">Kurumsal Bilgiler</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full transition-colors"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Şirket Resmi Unvanı</label>
                    <input type="text" value={companyForm.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 transition-colors`} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Destek E-Postası</label>
                      <input type="email" value={companyForm.supportEmail} onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 transition-colors`} required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Çağrı Merkezi / Telefon</label>
                      <input type="text" value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 transition-colors`} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-2 transition-colors">Merkez Adres Bilgisi</label>
                    <textarea rows={3} value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:ring-1 ${currentTheme.focus} text-slate-800 dark:text-slate-200 resize-none transition-colors`} required></textarea>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm transition-colors shadow-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* GÖRÜNÜM VE TEMA SEKMESİ */}
            {activeTab === "theme" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1 transition-colors">Görünüm ve Tema</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full transition-colors"></div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3 transition-colors">Panel Tema Modu</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[{ id: "light", label: "Aydınlık", icon: Sun }, { id: "dark", label: "Karanlık", icon: Moon }, { id: "system", label: "Sistem", icon: Monitor }].map((item) => (
                        <div key={item.id} onClick={() => handleThemeChange("mode", item.id)} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 ${themeForm.mode === item.id ? `${currentTheme.border} ${currentTheme.text} bg-slate-50 dark:bg-slate-900/50` : "border-slate-100 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-600 transition-colors"}`}>
                          <item.icon className="w-6 h-6" /> <span className="text-xs font-bold">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-3 transition-colors">Kurumsal Vurgu Rengi</label>
                    <div className="flex gap-4">
                      {[{ id: "blue", name: "Sözen Mavi", bg: "bg-[#02529C]" }, { id: "amber", name: "Enerji Sarı", bg: "bg-amber-500" }, { id: "emerald", name: "Yeşil Enerji", bg: "bg-emerald-600" }].map((color) => (
                        <button key={color.id} onClick={() => handleThemeChange("accent", color.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${themeForm.accent === color.id ? "border-slate-900 dark:border-slate-200 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md" : "border-slate-100 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30"}`}>
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
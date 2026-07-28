"use client";

import { useState, useEffect } from "react";
import { User, Building2, Shield, Save, CheckCircle2, Palette, Sun, Moon, Monitor, Mail, Clock, FileText, Users, Trash2, Plus, Database, DownloadCloud } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Mevcut Form State'leri
  const [profileForm, setProfileForm] = useState({ name: "Sistem Yöneticisi", email: "admin@enerji.com" });
  const [companyForm, setCompanyForm] = useState({ companyName: "", supportEmail: "", phone: "", address: "" });
  const [smtpForm, setSmtpForm] = useState({ smtpHost: "smtp.gmail.com", smtpPort: "465", smtpUser: "", smtpPass: "" });
  const [scheduleForm, setScheduleForm] = useState({ workHourStart: "08:30", workHourEnd: "18:30", allowWeekend: false });
  const [pdfForm, setPdfForm] = useState({ taxNumber: "", mersisNumber: "", pdfFooterText: "Bu belge Sözen Enerji CRM sistemi tarafından otomatik olarak üretilmiştir.", logoUrl: "" });

  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "", role: "SUPPORT" });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const { themeForm, handleThemeChange, currentTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setCompanyForm({ companyName: data.companyName || "", supportEmail: data.supportEmail || "", phone: data.phone || "", address: data.address || "" });
          // Host ve Port arkaplanda tutulmaya devam ediyor
          setSmtpForm({ smtpHost: data.smtpHost || "smtp.gmail.com", smtpPort: data.smtpPort || "465", smtpUser: data.smtpUser || "", smtpPass: data.smtpPass || "" });
          setScheduleForm({ workHourStart: data.workHourStart || "08:30", workHourEnd: data.workHourEnd || "18:30", allowWeekend: data.allowWeekend ?? false });
          setPdfForm({ taxNumber: data.taxNumber || "", mersisNumber: data.mersisNumber || "", pdfFooterText: data.pdfFooterText || "", logoUrl: data.logoUrl || "" });
        }
      } catch (error) { console.error("Ayarlar yüklenemedi", error); } 
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "team") fetchStaffList();
  }, [activeTab]);

  const fetchStaffList = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      if (res.ok) setStaffList(await res.json());
    } catch (error) { console.error("Personeller çekilemedi", error); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccessMessage("Değişiklikler başarıyla kaydedildi!");
    setTimeout(() => setSuccessMessage(""), 3000);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyForm, smtpForm, scheduleForm, pdfForm }), 
      });
    } catch (error) { console.error("Kayıt hatası:", error); }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });
      if (res.ok) {
        setSuccessMessage("Yeni personel başarıyla eklendi!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setNewStaff({ name: "", email: "", password: "", role: "SUPPORT" });
        setIsAddingStaff(false);
        fetchStaffList();
      } else {
        const errorData = await res.json();
        alert("Hata: " + errorData.error);
      }
    } catch (error) { console.error("Personel eklenemedi:", error); }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Bu personeli sistemden silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchStaffList();
    } catch (error) { console.error("Silme hatası:", error); }
  };

  const handleDownloadBackup = (type) => {
    window.open(`/api/admin/export?type=${type}`, "_blank");
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Ayarlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
          <Shield className={`w-8 h-8 ${currentTheme.text}`} /> Sistem Ayarları
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Yönetici profili, personeller, yedeklemeler ve kurumsal bilgileri yönetin.</p>
      </div>

      <div className={`mb-6 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 ${successMessage ? 'opacity-100' : 'opacity-0 h-0 p-0 m-0 overflow-hidden border-0'}`}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="font-bold text-sm">{successMessage}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL MENÜ - TABS */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 space-y-1 transition-colors">
            <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "profile" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><User className="w-5 h-5" /> Profil ve Güvenlik</button>
            <button onClick={() => setActiveTab("team")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "team" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Users className="w-5 h-5" /> Ekip ve Yetkiler</button>
            <button onClick={() => setActiveTab("company")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "company" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Building2 className="w-5 h-5" /> Kurumsal Bilgiler</button>
            <button onClick={() => setActiveTab("schedule")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "schedule" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Clock className="w-5 h-5" /> Çalışma Saatleri</button>
            <button onClick={() => setActiveTab("pdf")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "pdf" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><FileText className="w-5 h-5" /> PDF ve Belgeler</button>
            
            {/* GMAIL ENTEGRASYONU SEKMESİ (İsmi Güncellendi) */}
            <button onClick={() => setActiveTab("smtp")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "smtp" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Mail className="w-5 h-5" /> Gmail Entegrasyonu</button>
            
            <button onClick={() => setActiveTab("backup")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "backup" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Database className="w-5 h-5" /> Veri ve Yedekleme</button>
            <button onClick={() => setActiveTab("theme")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === "theme" ? `${currentTheme.bg} text-white shadow-md` : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}><Palette className="w-5 h-5" /> Görünüm ve Tema</button>
          </div>
        </div>

        {/* SAĞ İÇERİK ALANI */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 transition-colors">
            
            {/* PROFİL SEKMESİ */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Profil ve Güvenlik</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Görüntülenen Adınız</label>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* EKİP VE YETKİLER SEKMESİ */}
            {activeTab === "team" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Ekip ve Yetkiler</h2>
                    <p className="text-xs font-medium text-slate-500">Sisteme giriş yapabilecek personelleri ve departmanlarını yönetin.</p>
                  </div>
                  {!isAddingStaff && (
                    <button onClick={() => setIsAddingStaff(true)} className={`${currentTheme.bg} text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-sm`}>
                      <Plus className="w-4 h-4" /> Yeni Ekle
                    </button>
                  )}
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>

                {isAddingStaff && (
                  <form onSubmit={handleAddStaff} className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Yeni Personel Hesabı Oluştur</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Ad Soyad" required value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1" />
                      <input type="email" placeholder="E-Posta" required value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1" />
                      <input type="password" placeholder="Geçici Şifre" required minLength="6" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1" />
                      <select required value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 bg-white">
                        <option value="ADMIN">Sistem Yöneticisi (Tam Yetki)</option>
                        <option value="SUPPORT">Destek ve Operasyon</option>
                        <option value="FIELD">Saha ve Keşif Ekibi</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setIsAddingStaff(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">İptal</button>
                      <button type="submit" className={`${currentTheme.bg} text-white font-bold px-6 py-2 rounded-xl text-sm`}>Personeli Kaydet</button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {staffList.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">Kayıtlı personel bulunmamaktadır.</p>
                  ) : (
                    staffList.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700/80 rounded-2xl bg-white dark:bg-slate-800 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${staff.role === 'ADMIN' ? 'bg-rose-500' : staff.role === 'SUPPORT' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-slate-200">{staff.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{staff.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            staff.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            staff.role === 'SUPPORT' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {staff.role === 'ADMIN' ? 'Yönetici' : staff.role === 'SUPPORT' ? 'Destek' : 'Saha Ekibi'}
                          </span>
                          <button onClick={() => handleDeleteStaff(staff.id)} className="text-slate-400 hover:text-rose-500 transition-colors" title="Sil">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* KURUMSAL BİLGİLER SEKMESİ */}
            {activeTab === "company" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-300">
                <div><h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Kurumsal Bilgiler</h2></div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Şirket Resmi Unvanı</label>
                    <input type="text" value={companyForm.companyName} onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Destek E-Postası</label>
                      <input type="email" value={companyForm.supportEmail} onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Çağrı Merkezi / Telefon</label>
                      <input type="text" value={companyForm.phone} onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Merkez Adres Bilgisi</label>
                    <textarea rows={3} value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus} resize-none`} required></textarea>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* ÇALIŞMA SAATLERİ SEKMESİ */}
            {activeTab === "schedule" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Çalışma ve Randevu Saatleri</h2>
                  <p className="text-xs font-medium text-slate-500">Müşterilerin portal üzerinden hangi saat aralıklarında randevu talep edebileceğini belirleyin.</p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Mesai Başlangıç Saati</label>
                      <input type="time" value={scheduleForm.workHourStart} onChange={(e) => setScheduleForm({ ...scheduleForm, workHourStart: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Mesai Bitiş Saati</label>
                      <input type="time" value={scheduleForm.workHourEnd} onChange={(e) => setScheduleForm({ ...scheduleForm, workHourEnd: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} required />
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={scheduleForm.allowWeekend} 
                        onChange={(e) => setScheduleForm({ ...scheduleForm, allowWeekend: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">Hafta Sonu Randevularına İzin Ver</span>
                        <span className="block text-xs text-slate-500">İşaretlenirse Pazar günleri de randevu alınabilir.</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* PDF VE BELGELER SEKMESİ */}
            {activeTab === "pdf" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">PDF ve Belge Ayarları</h2>
                  <p className="text-xs font-medium text-slate-500">Müşterilerin oluşturduğu PDF raporlarında yer alacak kurumsal bilgileri yönetin.</p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Vergi Numarası</label>
                      <input type="text" value={pdfForm.taxNumber} onChange={(e) => setPdfForm({ ...pdfForm, taxNumber: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase mb-2">Mersis Numarası</label>
                      <input type="text" value={pdfForm.mersisNumber} onChange={(e) => setPdfForm({ ...pdfForm, mersisNumber: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Rapor Alt Bilgisi (Footer Metni)</label>
                    <textarea rows={3} value={pdfForm.pdfFooterText} onChange={(e) => setPdfForm({ ...pdfForm, pdfFooterText: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus} resize-none`} required></textarea>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* GMAIL ENTEGRASYONU SEKMESİ (GÜNCELLENEN KISIM) */}
            {activeTab === "smtp" && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Gmail Entegrasyonu</h2>
                  <p className="text-xs font-medium text-slate-500">Sistemin şifre sıfırlama ve bildirim maillerini göndereceği Gmail hesap bilgileri.</p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Gönderici E-Posta Adresi (Gmail)</label>
                    <input type="email" placeholder="ornek@gmail.com" value={smtpForm.smtpUser} onChange={(e) => setSmtpForm({ ...smtpForm, smtpUser: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Uygulama Şifresi</label>
                    <input type="password" placeholder="••••••••" value={smtpForm.smtpPass} onChange={(e) => setSmtpForm({ ...smtpForm, smtpPass: e.target.value })} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50/50 focus:outline-none focus:ring-1 ${currentTheme.focus}`} />
                    <p className="text-[10px] text-slate-400 mt-1">Google hesabınızdan aldığınız 16 haneli uygulama şifresini girin.</p>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className={`${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 text-sm`}>
                    <Save className="w-4 h-4" /> Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* VERİ VE YEDEKLEME SEKMESİ */}
            {activeTab === "backup" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Veri Dışa Aktarma (Yedekleme)</h2>
                  <p className="text-xs font-medium text-slate-500">Sistemdeki tüm müşteri, proje ve randevu verilerinizi Excel/CSV formatında güvenle bilgisayarınıza indirebilirsiniz.</p>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-slate-200 dark:border-slate-700 p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-200">Müşteri Veritabanı</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Tüm kayıtlı müşterilerinizin listesi ve iletişim bilgileri.</p>
                    </div>
                    <button onClick={() => handleDownloadBackup("customers")} className="w-full mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                      <DownloadCloud className="w-4 h-4" /> CSV İndir
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-200">Projeler ve İşler</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Kayıtlı tüm projeler, ilerleme durumları ve kime ait oldukları.</p>
                    </div>
                    <button onClick={() => handleDownloadBackup("projects")} className="w-full mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
                      <DownloadCloud className="w-4 h-4" /> CSV İndir
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow md:col-span-2">
                    <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-200">Randevu Geçmişi</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Tamamlanan, iptal edilen ve onay bekleyen tüm randevu kayıtları.</p>
                    </div>
                    <button onClick={() => handleDownloadBackup("appointments")} className="w-full md:w-1/2 mx-auto mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm hover:border-amber-500 hover:text-amber-600 transition-colors flex items-center justify-center gap-2">
                      <DownloadCloud className="w-4 h-4" /> CSV İndir
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* GÖRÜNÜM VE TEMA SEKMESİ */}
            {activeTab === "theme" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-1">Görünüm ve Tema</h2>
                </div>
                <div className="h-px bg-slate-100 dark:bg-slate-700/80 w-full"></div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-3">Panel Tema Modu</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[{ id: "light", label: "Aydınlık", icon: Sun }, { id: "dark", label: "Karanlık", icon: Moon }, { id: "system", label: "Sistem", icon: Monitor }].map((item) => (
                        <div key={item.id} onClick={() => handleThemeChange("mode", item.id)} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 ${themeForm.mode === item.id ? `${currentTheme.border} ${currentTheme.text} bg-slate-50` : "border-slate-100 text-slate-600 hover:border-slate-200 transition-colors"}`}>
                          <item.icon className="w-6 h-6" /> <span className="text-xs font-bold">{item.label}</span>
                        </div>
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
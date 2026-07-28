"use client";

import { useState } from "react";
import { 
  BookOpen, LayoutDashboard, MessageSquare, FolderKanban, 
  CalendarDays, Users, Settings, UserCircle, FileDown, 
  Clock, ShieldCheck, Mail, MonitorSmartphone 
} from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("admin");
  const { currentTheme, themeForm } = useTheme();

  const adminGuide = [
    {
      icon: FolderKanban,
      title: "Projeler & İşler Yönetimi",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
      content: "Müşterilerinize ait projeleri buradan sisteme eklersiniz. Proje durumunu (ilerleme yüzdesini) güncellediğinizde müşteri kendi panelinde bunu anlık olarak görür. Sistem her proje için otomatik ve kurumsal bir PDF raporu üretir."
    },
    {
      icon: CalendarDays,
      title: "Randevu Yaşam Döngüsü",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
      content: "Sisteme düşen müşteri randevuları 'Onay Bekliyor' statüsündedir. Görüşmeyi onaylayabilir veya reddedebilirsiniz. Hizmet fiziksel olarak tamamlandığında 'Tamamla' butonuna basarak işi arşivlersiniz. Tamamlanma saati anında müşteriye bildirilir."
    },
    {
      icon: MessageSquare,
      title: "Gelen Kutusu ve Mesajlar",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
      content: "Web sitesindeki iletişim formundan ve doğrudan müşteri portalından gelen 'Teknik Destek', 'Proje Sorusu' gibi kategorize edilmiş iletileri tek bir ekrandan okuyabilir ve arşivleyebilirsiniz."
    },
    {
      icon: Users,
      title: "Müşteri Veritabanı",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30",
      content: "Sisteme kayıt olan veya sizin eklediğiniz tüm müşteriler burada listelenir. Hangi müşterinin hangi projeye sahip olduğunu tek tıkla görebilirsiniz."
    },
    {
      icon: Settings,
      title: "Sistem ve Tema Ayarları",
      color: "text-slate-600 bg-slate-100 dark:bg-slate-800",
      content: "Firma adınızı, destek e-postanızı ve iletişim numaralarınızı güncelleyebilirsiniz. Ayrıca panelin renk vurgularını (Sözen Mavi, Enerji Sarı vb.) ve Aydınlık/Karanlık mod tercihlerini yönetebilirsiniz."
    }
  ];

  const customerGuide = [
    {
      icon: UserCircle,
      title: "Kayıt ve Güvenli Giriş",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
      content: "Müşteriler, e-posta adresleri ve telefon numaraları ile sisteme saniyeler içinde kayıt olup giriş yapabilirler. Şifrelerini unuttuklarında, güvenli e-posta onayı (token) ile yeni şifre belirleyebilirler."
    },
    {
      icon: MonitorSmartphone,
      title: "Kişisel Kontrol Paneli",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
      content: "Müşteri giriş yaptığında, sadece kendine ait projeleri ve randevuları gördüğü, karmaşadan uzak, mobil uyumlu, temiz bir arayüzle karşılaşır."
    },
    {
      icon: FileDown,
      title: "Proje Takibi & PDF İndirme",
      color: "text-rose-600 bg-rose-50 dark:bg-rose-900/30",
      content: "Müşteri aktif projesinin % kaç tamamlandığını ilerleme çubuğuyla takip edebilir. 'Raporu İndir' butonuna basarak, Sözen Enerji antetli ve kişiye özel müşteri numarası içeren PDF Durum Raporu'nu indirebilir."
    },
    {
      icon: Clock,
      title: "Etkileşimli Zaman Çizelgesi",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30",
      content: "Randevu talebi oluşturulduğunda, müşteri 'Talep İletildi', 'Onaylandı' ve 'Hizmet Tamamlandı' aşamalarını saat ve tarih bilgisiyle şık bir zaman çizelgesi (timeline) üzerinde görür."
    },
    {
      icon: Mail,
      title: "Yönetime Direkt Mesaj",
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30",
      content: "Müşteriler, portal içindeki 'Bize Ulaşın' arayüzünden doğrudan projesiyle ilgili revizyon, destek veya genel konu taleplerini hızlıca merkeze iletebilir."
    }
  ];

  const activeData = activeTab === "admin" ? adminGuide : customerGuide;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      
      {/* Üst Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-200 flex items-center gap-3 transition-colors">
          <BookOpen className={`w-8 h-8 ${currentTheme.text}`} /> Sistem Kullanım Kılavuzu
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
          EnerjiPanel yönetim sistemini ve Müşteri Portalı işleyişini tam verimle kullanmak için detaylı sistem rehberi.
        </p>
      </div>

      {/* Sekme Seçici (Tabs) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm backdrop-blur-sm transition-colors">
        <button
          onClick={() => setActiveTab("admin")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "admin" 
              ? `${currentTheme.bg} text-white shadow-md` 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          Yönetici (Admin) Paneli Rehberi
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "customer" 
              ? `${currentTheme.bg} text-white shadow-md` 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          }`}
        >
          <UserCircle className="w-5 h-5" />
          Müşteri Portalı Rehberi
        </button>
      </div>

      {/* Kılavuz İçeriği (Grid Yapısı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeData.map((item, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700/80 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl flex-shrink-0 transition-colors ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2 pt-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Bilgi */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 text-center transition-colors">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Daha fazla yardıma mı ihtiyacınız var? Sistemin geliştiricisi veya IT departmanı ile iletişime geçebilirsiniz.
        </p>
      </div>

    </div>
  );
}
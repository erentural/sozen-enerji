"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Mail, CalendarDays, ClipboardList, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState({ messages: [], appointments: [], quotes: [] });
  const [loading, setLoading] = useState(true);
  
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Bildirimler alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde ve her 1 dakikada bir yeni bildirimleri kontrol et
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  }, []);

  // Menü açıkken dışarı tıklanırsa kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sayfa değiştirildiğinde menüyü otomatik kapat
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Farklı tablolardan gelen verileri tek bir listede birleştir ve tarihe göre sırala
  const allNotifs = [
    ...notifications.quotes.map(q => ({ id: `q-${q.id}`, type: "quote", title: "Yeni Teklif Talebi", desc: `${q.name} - ${q.service}`, time: q.createdAt, link: "/admin/teklifler", icon: ClipboardList, color: "text-[#FFC107]", bg: "bg-yellow-500/10" })),
    ...notifications.messages.map(m => ({ id: `m-${m.id}`, type: "message", title: "Yeni Mesaj", desc: m.name, time: m.createdAt, link: "/admin/mesajlar", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" })),
    ...notifications.appointments.map(a => ({ id: `a-${a.id}`, type: "appointment", title: "Yeni Randevu", desc: a.name, time: a.createdAt, link: "/admin/randevular", icon: CalendarDays, color: "text-green-500", bg: "bg-green-500/10" }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

  const totalCount = allNotifs.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Zil Butonu */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-[22px] h-[22px]" />
        {totalCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-950 animate-pulse"></span>
        )}
      </button>

      {/* Açılır Menü (left-0 ile ana içeriğe doğru açılması sağlandı) */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-80 md:w-96 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Başlık Alanı */}
          <div className="bg-gray-50/80 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Bildirimler</h3>
            {totalCount > 0 && (
              <span className="bg-[#02529C] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {totalCount} Yeni
              </span>
            )}
          </div>
          
          {/* Liste Alanı */}
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500 font-medium">Yükleniyor...</div>
            ) : allNotifs.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500 font-medium">Okunmamış yeni bildiriminiz bulunmuyor.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {allNotifs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.id} 
                      href={item.link}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50/80 transition-colors group"
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${item.bg}`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#02529C] transition-colors">{item.title}</p>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{item.desc}</p>
                        <p className="text-xs text-gray-400 mt-2 font-medium">
                          {new Date(item.time).toLocaleDateString("tr-TR", { month: "short", day: "numeric", hour: '2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Alt Bilgi */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={() => { setIsOpen(false); fetchNotifications(); }} 
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-[#02529C] transition-colors py-1"
            >
              Listeyi Yenile
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState({ count: 0, items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Verileri çekme fonksiyonu
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Bildirim hatası", error);
    }
  };

 useEffect(() => {
    fetchNotifications();
    
    // Her 30 saniyede bir arka planda kontrol et
    const interval = setInterval(fetchNotifications, 30000);
    
    // Diğer sayfalardan gelen "yenile" sinyalini dinle
    const handleUpdate = () => fetchNotifications();
    window.addEventListener("notificationsUpdated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Zil Butonu */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {notifications.count > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-gray-950"></span>
          </span>
        )}
      </button>

      {/* Açılır Menü (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800">Bildirimler</h3>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
              {notifications.count} Yeni
            </span>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.items.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Yeni bildiriminiz bulunmuyor.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.items.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'message' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {item.type === 'message' ? <MessageSquare className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{item.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.date).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
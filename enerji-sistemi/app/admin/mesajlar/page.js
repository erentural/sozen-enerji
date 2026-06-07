"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, CheckCircle2, Trash2 } from "lucide-react";

export default function MesajlarPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde mesajları çek
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Mesajlar çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  // Okundu olarak işaretle
 const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
        // Sinyal gönder (YENİ EKLENDİ)
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (error) {
      console.error("Okundu olarak işaretlenemedi", error);
    }
  };

  // Mesajı Sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı kalıcı olarak silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        // Sinyal gönder (YENİ EKLENDİ)
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
    } catch (error) {
      console.error("Mesaj silinemedi", error);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gelen Kutusu</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">Gelen kutunuzda hiç mesaj bulunmuyor.</p>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start justify-between p-5 rounded-xl border transition-all ${
                  msg.isRead ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-blue-100 shadow-sm'
                }`}
              >
                <div className="flex gap-4 w-full">
                  <div className="mt-1 shrink-0">
                    {msg.isRead ? (
                      <MailOpen className="w-6 h-6 text-gray-400" />
                    ) : (
                      <Mail className="w-6 h-6 text-[#02529C]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3">
                      Gönderen: <span className="font-semibold text-gray-900">{msg.name}</span> 
                      {msg.email && ` (${msg.email})`}
                    </p>
                    <div className="bg-white border border-gray-100 p-4 rounded-lg text-gray-700 italic mb-3 shadow-sm">
                      "{msg.message}"
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString("tr-TR")}
                      </p>
                      {msg.phone && (
                        <p className="text-xs font-semibold text-gray-500 border border-gray-200 px-2 py-1 rounded bg-white">
                          Tel: {msg.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Aksiyon Butonları */}
                <div className="flex flex-col gap-3 ml-6 shrink-0 border-l border-gray-100 pl-4">
                  {!msg.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Okundu olarak işaretle"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Mesajı Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
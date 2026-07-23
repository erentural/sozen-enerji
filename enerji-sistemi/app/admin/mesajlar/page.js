"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Search, User, Calendar } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500 font-medium">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="w-8 h-8 text-[#02529C]" /> Öneri, Şikayet & Mesajlar
          </h1>
          <p className="text-gray-500 text-sm mt-1">Müşterilerin iletişim formu üzerinden ilettiği geri bildirimler.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Arama Alanı */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, konu veya mesaj içeriği ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
            />
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <p className="text-gray-500 text-sm py-12 text-center">Görüntülenecek mesaj bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-blue-50/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{msg.name}</h3>
                    <span className="bg-gray-100 text-gray-700 font-semibold px-3 py-0.5 rounded-full text-xs">
                      {msg.subject || "Genel Mesaj / Öneri"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pt-1">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {msg.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(msg.createdAt).toLocaleString("tr-TR")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
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
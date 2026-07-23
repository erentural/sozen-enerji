"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Search, User, Calendar, Phone, CheckCircle2, MessageSquare, Send, X, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        router.refresh();
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // YENİ EKLENEN: Sadece Okundu İşaretleme Fonksiyonu
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch("/api/admin/messages/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // İşlem başarılıysa sadece ilgili mesajın read değerini true yap, sayfayı yenileme
        setMessages(messages.map(m => 
          m.id === id ? { ...m, read: true } : m
        ));
        router.refresh();
      }
    } catch (error) {
      console.error("Okundu işaretleme hatası:", error);
    }
  };

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText("");
    setIsModalOpen(true);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMessage.id,
          replyMessage: replyText
        }),
      });

      if (res.ok) {
        setMessages(messages.map(m => 
          m.id === selectedMessage.id ? { ...m, replied: true, read: true } : m
        ));
        router.refresh();
        setIsModalOpen(false);
        alert("Yanıtınız başarıyla müşteriye e-posta olarak iletildi!");
      } else {
        alert("İşlem başarısız oldu.");
      }
    } catch (error) {
      console.error("Yanıt hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500 font-medium">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#02529C]" /> Öneri, Şikayet & Mesajlar
          </h1>
          <p className="text-gray-500 text-sm mt-1">Müşterilerin iletişim formu üzerinden ilettiği geri bildirimleri yönetin ve yanıtlayın.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Arama Alanı */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya konu ara..." 
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
              // MESAJ SATIRI RENKLENDİRMESİ GÜNCELLENDİ
              <div key={msg.id} className={`p-6 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 
                ${msg.replied ? 'bg-white hover:bg-gray-50' : (msg.read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50/50 hover:bg-blue-100/50')}
              `}>
                
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={`text-lg font-bold ${!msg.read ? 'text-[#02529C]' : 'text-gray-900'}`}>{msg.name}</h3>
                    
                    {/* Okunmamışsa Yeni Etiketi */}
                    {!msg.read && (
                      <span className="bg-blue-100 text-[#02529C] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Yeni</span>
                    )}

                    <span className="bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full text-xs border border-gray-200">
                      {msg.subject || "Genel Mesaj"}
                    </span>
                    <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border ${msg.replied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {msg.replied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1" />}
                      {msg.replied ? "Yanıtlandı" : "Bekliyor"}
                    </span>
                  </div>

                  <p className={`text-sm p-4 rounded-xl border border-gray-100 shadow-sm ${!msg.read ? 'bg-white font-medium text-gray-800' : 'bg-white/80 text-gray-600'}`}>
                    "{msg.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:text-[#02529C] transition-colors"><Mail className="w-4 h-4 text-gray-400" /> {msg.email}</a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 hover:text-[#02529C] transition-colors"><Phone className="w-4 h-4 text-gray-400" /> {msg.phone}</a>
                    )}
                  </div>
                </div>

                <div className="flex flex-row xl:flex-col items-center xl:items-end gap-3 w-full xl:w-auto justify-between xl:justify-center border-t xl:border-t-0 pt-4 xl:pt-0 border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 text-right">
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' })} <br className="hidden xl:block" />
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block ml-2 xl:ml-0">
                      {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    
                    {/* YENİ EKLENEN BUTON: Sadece okunmamış mesajlarda görünür */}
                    {!msg.read && (
                      <button 
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold shadow-sm bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                        title="Sadece okundu olarak işaretle"
                      >
                        <Eye className="w-4 h-4" /> 
                        Okundu İşaretle
                      </button>
                    )}

                    <button 
                      onClick={() => openReplyModal(msg)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold shadow-sm ${msg.replied ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'bg-[#02529C] text-white hover:bg-blue-800'}`}
                    >
                      <Send className="w-4 h-4" /> 
                      {msg.replied ? "Tekrar Yanıtla" : "Yanıtla"}
                    </button>

                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Mesajı Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MESAJ YANITLAMA MODALI */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#02529C]" /> Mesajı Yanıtla
            </h2>
            <p className="text-sm text-gray-500 mb-6">Müşteriye iletilecek olan resmi yanıtınızı yazın.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-1">Gönderen: <span className="text-[#02529C]">{selectedMessage.name}</span></p>
              <p className="text-sm text-gray-600 mb-2">Konu: {selectedMessage.subject || "Genel"}</p>
              <p className="text-xs text-gray-500 italic bg-white p-2 rounded border border-gray-200">"{selectedMessage.message}"</p>
            </div>

            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Yanıtınız</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Sayın müşterimiz, iletmiş olduğunuz konuyla ilgili..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#02529C] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> 
                  {isSubmitting ? "Gönderiliyor..." : "Yanıtı Müşteriye E-Posta Olarak Gönder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
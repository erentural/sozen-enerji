"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Search, User, Calendar, Phone, CheckCircle2, MessageSquare, Send, X, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeContext"; // YENİ: Global Tema Context'ini çekiyoruz

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Tema yöneticisinden verileri çekiyoruz
  const { currentTheme } = useTheme();

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
        window.dispatchEvent(new Event("refreshNotifications"));
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch("/api/admin/messages/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages(messages.map(m => 
          m.id === id ? { ...m, read: true } : m
        ));
        router.refresh();
        window.dispatchEvent(new Event("refreshNotifications"));
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
        setIsModalOpen(false);
        alert("Yanıtınız başarıyla müşteriye e-posta olarak iletildi!");
        router.refresh();
        window.dispatchEvent(new Event("refreshNotifications"));
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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      
      {/* Sayfa Başlığı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <MessageSquare className={`w-8 h-8 ${currentTheme.text}`} /> Öneri, Şikayet & Mesajlar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Müşterilerin iletişim formu üzerinden ilettiği geri bildirimleri yönetin ve yanıtlayın.</p>
        </div>
      </div>

      {/* Mesajlar Kutusu */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        
        {/* Arama Alanı */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, e-posta veya konu ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-1 ${currentTheme.focus} bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-medium transition-colors`}
            />
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-12 text-center font-medium transition-colors">Görüntülenecek mesaj bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredMessages.map((msg) => {
              
              // Mesaj satırı arka planını duruma ve temaya göre belirliyoruz
              let rowBg = "";
              if (msg.replied) rowBg = "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50";
              else if (msg.read) rowBg = "bg-slate-50/50 dark:bg-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-700/80";
              else rowBg = `bg-slate-50 dark:bg-slate-800 border-l-4 ${currentTheme.border} hover:bg-slate-100 dark:hover:bg-slate-700/80`;

              return (
                <div key={msg.id} className={`p-6 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 ${rowBg}`}>
                  
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className={`text-lg font-black transition-colors ${!msg.read ? currentTheme.text : 'text-slate-900 dark:text-white'}`}>
                        {msg.name}
                      </h3>
                      
                      {/* Okunmamışsa Yeni Etiketi */}
                      {!msg.read && (
                        <span className={`${currentTheme.bg} text-white font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider shadow-sm`}>
                          Yeni
                        </span>
                      )}

                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-full text-xs border border-slate-200 dark:border-slate-600 transition-colors">
                        {msg.subject || "Genel Mesaj"}
                      </span>
                      
                      {/* Durum Rozeti */}
                      <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                        msg.replied 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}>
                        {msg.replied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Clock className="w-3.5 h-3.5 mr-1" />}
                        {msg.replied ? "Yanıtlandı" : "Bekliyor"}
                      </span>
                    </div>

                    <p className={`text-sm p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors ${
                      !msg.read 
                        ? 'bg-white dark:bg-slate-900/50 font-medium text-slate-800 dark:text-slate-200' 
                        : 'bg-white/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}>
                      "{msg.message}"
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium transition-colors">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:opacity-80 transition-opacity">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {msg.email}
                      </a>
                      {msg.phone && (
                        <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:opacity-80 transition-opacity">
                          <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {msg.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row xl:flex-col items-center xl:items-end gap-3 w-full xl:w-auto justify-between xl:justify-center border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-100 dark:border-slate-700 transition-colors">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 text-right">
                      {new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' })} <br className="hidden xl:block" />
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md mt-1 inline-block ml-2 xl:ml-0 transition-colors">
                        {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                      
                      {/* Okundu İşaretle Butonu */}
                      {!msg.read && (
                        <button 
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors text-sm font-bold shadow-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          title="Sadece okundu olarak işaretle"
                        >
                          <Eye className="w-4 h-4" /> 
                          Okundu İşaretle
                        </button>
                      )}

                      {/* Yanıtla Butonu (Temaya Uyumlu) */}
                      <button 
                        onClick={() => openReplyModal(msg)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-bold shadow-sm ${
                          msg.replied 
                            ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700' 
                            : `${currentTheme.bg} ${currentTheme.hoverBg} text-white`
                        }`}
                      >
                        <Send className="w-4 h-4" /> 
                        {msg.replied ? "Tekrar Yanıtla" : "Yanıtla"}
                      </button>

                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                        title="Mesajı Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MESAJ YANITLAMA MODALI (DARK MODE UYUMLU) */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-700 transition-colors">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 p-1 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2 transition-colors">
              <Mail className={`w-5 h-5 ${currentTheme.text}`} /> Mesajı Yanıtla
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium transition-colors">Müşteriye iletilecek olan resmi yanıtınızı yazın.</p>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 transition-colors">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                Gönderen: <span className={currentTheme.text}>{selectedMessage.name}</span>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium transition-colors">
                Konu: {selectedMessage.subject || "Genel"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors shadow-sm">
                "{selectedMessage.message}"
              </p>
            </div>

            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 transition-colors">Yanıtınız</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Sayın müşterimiz, iletmiş olduğunuz konuyla ilgili..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-1 ${currentTheme.focus} bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white text-sm font-medium resize-none transition-colors`}
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full ${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 shadow-md flex items-center justify-center gap-2`}
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
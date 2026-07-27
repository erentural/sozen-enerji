"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Clock, CheckCircle2, Phone, Trash2, Search, MapPin, Sun, Banknote, Mail, Send, X } from "lucide-react";
import { useTheme } from "../ThemeContext"; // YENİ: Global Tema Context'i

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Tema State'leri
  const { currentTheme, themeForm } = useTheme();
  const isCompact = themeForm?.compactMode || false; // Kompakt tablo kontrolü

  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [offerData, setOfferData] = useState({ price: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/teklifler");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Teklifler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu teklif talebini silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/teklifler?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const openOfferModal = (lead) => {
    setSelectedLead(lead);
    setOfferData({ price: lead.priceOffer || "", message: "" });
    setIsModalOpen(true);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/teklifler/onayla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLead.id,
          priceOffer: offerData.price,
          messageToCustomer: offerData.message
        }),
      });

      if (res.ok) {
        setLeads(leads.map(l => 
          l.id === selectedLead.id 
            ? { ...l, status: "KAPANDI", priceOffer: Number(offerData.price) } 
            : l
        ));
        setIsModalOpen(false);
        alert("Teklif başarıyla onaylandı ve müşteriye mail iletildi!");
      } else {
        alert("İşlem sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.error("Onay hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dinamik Durum Rozetleri (Dark Mode Uyumlu)
  const getStatusStyle = (status) => {
    switch(status) {
      case "YENI": return "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "GORUSULDU": return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "KAPANDI": return "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      default: return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-500 font-medium">Teklif talepleri yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans transition-colors duration-300">
      
      {/* Sayfa Başlığı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <ClipboardList className={`w-8 h-8 ${currentTheme.text}`} /> Teklif Talepleri & Keşifler
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Web sitesi hesaplayıcısından ve teklif formundan gelen potansiyel müşteri talepleri.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        
        {/* Arama Alanı */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, hizmet veya şehir ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-1 ${currentTheme.focus} bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-medium transition-colors`}
            />
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm py-12 text-center font-medium transition-colors">Henüz gelen bir teklif talebi bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 group ${isCompact ? "p-4" : "p-6"}`}>
                
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white transition-colors">{lead.name}</h3>
                    <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border transition-colors ${getStatusStyle(lead.status)}`}>
                      {lead.status === "YENI" ? <Clock className="w-3.5 h-3.5 mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {lead.status === "YENI" ? "Yeni Talep" : "Onaylandı & İletildi"}
                    </span>
                    {lead.priceOffer && (
                      <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 text-xs rounded-full border border-emerald-200 dark:border-emerald-800 transition-colors">
                        Verilen Fiyat: {lead.priceOffer.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {lead.phone}</span>
                    {lead.email && (
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {lead.email}</span>
                    )}
                    <span className={`flex items-center gap-1.5 font-bold transition-colors ${currentTheme.text}`}>
                      <ClipboardList className="w-4 h-4" /> {lead.service}
                    </span>
                    {lead.city && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {lead.city}</span>
                    )}
                    {lead.bill && (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold transition-colors">
                        <Banknote className="w-4 h-4" /> Fatura: {lead.bill.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                    {lead.panelCount && (
                      <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold transition-colors">
                        <Sun className="w-4 h-4" /> {lead.panelCount} Panel
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto justify-end border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-100 dark:border-slate-700 transition-colors">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:block text-right transition-colors">
                    {new Date(lead.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' })} <br/>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md mt-1 inline-block transition-colors">
                      {new Date(lead.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openOfferModal(lead)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all shadow-sm text-sm font-bold text-white ${currentTheme.bg} ${currentTheme.hoverBg}`}
                    >
                      <Send className="w-4 h-4" /> 
                      {lead.status === "YENI" ? "İncele & Teklif At" : "Teklifi Güncelle"}
                    </button>

                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                      title="Talebi Sil"
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

      {/* TEKLİF ONAYLAMA & MAİL MODALI */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200 border border-slate-100 dark:border-slate-700 transition-colors">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2 transition-colors">
              <Mail className={`w-6 h-6 ${currentTheme.text}`} /> Müşteriye Teklif İlet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium transition-colors">Fiyatı belirleyin ve müşteriye iletilecek notunuzu yazın.</p>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 transition-colors">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 transition-colors">Müşteri: <span className={currentTheme.text}>{selectedLead.name}</span></p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors">Alıcı: {selectedLead.email || "E-posta girilmemiş"}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors">Talep: {selectedLead.service} ({selectedLead.panelCount} Panel)</p>
            </div>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Hesaplanan Fiyat Teklifi (TL)</label>
                <input 
                  type="number" 
                  required
                  placeholder="Örn: 150000"
                  value={offerData.price}
                  onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 ${currentTheme.focus} font-bold ${currentTheme.text} bg-white dark:bg-slate-900/50 transition-colors`}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">Müşteriye İletilecek E-Posta Açıklaması</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Sayın müşterimiz, sistem gereksinimleriniz incelenmiş olup projeniz için..."
                  value={offerData.message}
                  onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                  className={`w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 ${currentTheme.focus} text-sm resize-none bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white transition-colors`}
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedLead.email}
                  className={`w-full ${currentTheme.bg} ${currentTheme.hoverBg} text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 shadow-md flex items-center justify-center gap-2`}
                >
                  <Send className="w-5 h-5" /> 
                  {isSubmitting ? "İşleniyor..." : selectedLead.email ? "Teklifi Onayla ve Mail At" : "E-Posta Adresi Eksik"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
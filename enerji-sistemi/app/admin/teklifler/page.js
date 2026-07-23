"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Clock, CheckCircle2, Phone, Trash2, Search, MapPin, Sun, Banknote, Mail, Send, X } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Modalı Açma Fonksiyonu
  const openOfferModal = (lead) => {
    setSelectedLead(lead);
    setOfferData({ price: lead.priceOffer || "", message: "" });
    setIsModalOpen(true);
  };

  // Teklifi Onaylama ve Mail Atma Fonksiyonu
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
        // Tabloyu sayfa yenilemeden güncelle
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

  const getStatusStyle = (status) => {
    switch(status) {
      case "YENI": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "GORUSULDU": return "bg-blue-100 text-[#02529C] border-blue-200";
      case "KAPANDI": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-500 font-medium">Teklif talepleri yükleniyor...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[#FFC107]" /> Teklif Talepleri & Keşifler
          </h1>
          <p className="text-gray-500 text-sm mt-1">Web sitesi hesaplayıcısından ve teklif formundan gelen potansiyel müşteri talepleri.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Arama Alanı */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="İsim, hizmet veya şehir ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#02529C] bg-white text-gray-700"
            />
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <p className="text-gray-500 text-sm py-12 text-center">Henüz gelen bir teklif talebi bulunmuyor.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-6 hover:bg-blue-50/20 transition-all flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                    <span className={`flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(lead.status)}`}>
                      {lead.status === "YENI" ? <Clock className="w-3.5 h-3.5 mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {lead.status === "YENI" ? "Yeni Talep" : "Onaylandı & İletildi"}
                    </span>
                    {lead.priceOffer && (
                      <span className="bg-green-50 text-green-700 font-bold px-3 py-1 text-xs rounded-full border border-green-200">
                        Verilen Fiyat: {lead.priceOffer.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {lead.phone}</span>
                    {lead.email && (
                      <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {lead.email}</span>
                    )}
                    <span className="flex items-center gap-1.5 font-bold text-[#02529C]"><ClipboardList className="w-4 h-4" /> {lead.service}</span>
                    {lead.city && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {lead.city}</span>
                    )}
                    {lead.bill && (
                      <span className="flex items-center gap-1.5 text-green-700 font-semibold"><Banknote className="w-4 h-4" /> Fatura: {lead.bill.toLocaleString("tr-TR")} ₺</span>
                    )}
                    {lead.panelCount && (
                      <span className="flex items-center gap-1.5 text-blue-800"><Sun className="w-4 h-4" /> {lead.panelCount} Panel</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto justify-end border-t xl:border-t-0 pt-4 xl:pt-0 border-gray-100">
                  {/* YENİ: Saat ve Tarih Birlikte */}
                  <span className="text-xs font-semibold text-gray-400 hidden sm:block text-right">
                    {new Date(lead.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' })} <br/>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {new Date(lead.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* YENİ: Teklifi Yanıtla Butonu */}
                    <button 
                      onClick={() => openOfferModal(lead)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#02529C] text-white hover:bg-blue-800 rounded-lg transition-colors text-sm font-bold shadow-sm"
                    >
                      <Send className="w-4 h-4" /> 
                      {lead.status === "YENI" ? "İncele & Teklif At" : "Teklifi Güncelle"}
                    </button>

                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#02529C]" /> Müşteriye Teklif İlet
            </h2>
            <p className="text-sm text-gray-500 mb-6">Fiyatı belirleyin ve müşteriye iletilecek notunuzu yazın.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-1">Müşteri: <span className="text-[#02529C]">{selectedLead.name}</span></p>
              <p className="text-sm text-gray-600">Alıcı: {selectedLead.email || "E-posta girilmemiş"}</p>
              <p className="text-sm text-gray-600">Talep: {selectedLead.service} ({selectedLead.panelCount} Panel)</p>
            </div>

            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hesaplanan Fiyat Teklifi (TL)</label>
                <input 
                  type="number" 
                  required
                  placeholder="Örn: 150000"
                  value={offerData.price}
                  onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] font-semibold text-[#02529C]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Müşteriye İletilecek E-Posta Açıklaması</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Sayın müşterimiz, sistem gereksinimleriniz incelenmiş olup projeniz için..."
                  value={offerData.message}
                  onChange={(e) => setOfferData({ ...offerData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedLead.email}
                  className="w-full bg-[#02529C] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70 shadow-sm flex items-center justify-center gap-2"
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
"use client";

import { useState } from "react";
import { ClipboardList, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function TeklifAlPage() {
  // formType: "quote" (Fiyat Teklifi) veya "message" (Öneri/Şikayet)
  const [formType, setFormType] = useState("quote");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+90",
    service: "Genel Proje Talebi",
    subject: "Öneri",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formType === "quote") {
        // --- 1. FİYAT TEKLİFİ GÖNDERİMİ ---
        const res = await fetch("/api/teklif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
            // Hesaplayıcıdan gelmediği için varsayılan değerleri gönderiyoruz
            service: `${formData.service} (Detay: ${formData.message})`,
            bill: 0,
            region: "Belirtilmedi",
            city: "Belirtilmedi",
            panelCount: 0,
            roiYears: "0",
          }),
        });
        if (res.ok) setIsSuccess(true);
      } else {
        // --- 2. ÖNERİ / ŞİKAYET GÖNDERİMİ ---
        const res = await fetch("/api/mesaj", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        });
        if (res.ok) setIsSuccess(true);
      }
    } catch (error) {
      console.error("Gönderim hatası:", error);
      alert("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Talebiniz Alındı!</h2>
          <p className="text-gray-500 text-lg mb-8">
            {formType === "quote" 
              ? "Proje detaylarınız mühendislerimize iletildi. En kısa sürede sizinle iletişime geçeceğiz." 
              : "Mesajınız yönetim ekibimize iletildi. Geri bildiriminiz için teşekkür ederiz."}
          </p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ ...formData, name: "", email: "", phone: "", message: "" });
            }}
            className="bg-[#02529C] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors"
          >
            Yeni Bir Form Doldur
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Üst Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Bizimle İletişime Geçin</h1>
          <p className="text-gray-500 text-lg">Projeniz için fiyat teklifi alabilir veya görüşlerinizi iletebilirsiniz.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Sekme Seçici (Tab) */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setFormType("quote")}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-colors ${
                formType === "quote" ? "bg-[#02529C] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ClipboardList className="w-5 h-5" /> Fiyat Teklifi Al
            </button>
            <button
              onClick={() => setFormType("message")}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-colors ${
                formType === "message" ? "bg-[#02529C] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="w-5 h-5" /> Öneri & Şikayet
            </button>
          </div>

          {/* Form Alanı */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Ortak Alanlar (İsim & E-Posta) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresiniz *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Fiyat Teklifi Özel Alanları */}
              {formType === "quote" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numaranız *</label>
                      <div className="flex gap-2">
                        <select 
                          value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white font-medium"
                        >
                          <option value="+90">+90</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+49">+49</option>
                        </select>
                        <input 
                          type="tel" 
                          required
                          maxLength="10"
                          value={formData.phone}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            if (onlyNums.length <= 10) setFormData({ ...formData, phone: onlyNums });
                          }}
                          placeholder="555 123 4567"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Proje Türü</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white text-gray-700"
                      >
                        <option value="Genel Proje Talebi">Genel Proje Talebi</option>
                        <option value="Çatı GES Kurulumu">Çatı GES Kurulumu</option>
                        <option value="Arazi Tipi GES">Arazi Tipi GES</option>
                        <option value="Endüstriyel Kurulum">Endüstriyel Kurulum</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Öneri/Şikayet Özel Alanları */}
              {formType === "message" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Konu *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white text-gray-700"
                  >
                    <option value="Öneri">Öneri</option>
                    <option value="Şikayet">Şikayet</option>
                    <option value="Bilgi Talebi">Genel Bilgi Talebi</option>
                  </select>
                </div>
              )}

              {/* Ortak Metin Alanı */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {formType === "quote" ? "Proje Detayları *" : "Mesajınız *"}
                </label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={formType === "quote" ? "Projeniz hakkında kısaca bilgi verin..." : "İletmek istediğiniz konuyu detaylıca yazabilirsiniz..."}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFC107] hover:bg-yellow-500 text-gray-900 font-black py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-lg"
              >
                <Send className="w-6 h-6" /> 
                {isSubmitting ? "Gönderiliyor..." : formType === "quote" ? "Teklif Talebini Gönder" : "Mesajı Gönder"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
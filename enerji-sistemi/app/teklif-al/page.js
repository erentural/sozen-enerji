"use client";

import { useState, useEffect } from "react";
// YENİ İKONLAR EKLENDİ (Home, ArrowLeft)
import { ClipboardList, MessageSquare, Send, CheckCircle2, MapPin, Map, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeklifAlPage() {
  const [formType, setFormType] = useState("quote");
  
  const turkeyData = {
    "Adana": ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan", "Kozan"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Gölbaşı"],
    "Antalya": ["Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Serik", "Döşemealtı", "Kemer"],
    "Bursa": ["Osmangazi", "Nilüfer", "Yıldırım", "İnegöl", "Mudanya", "Gemlik", "Gürsu", "Kestel"],
    "Gaziantep": ["Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Nurdağı"],
    "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Bakırköy", "Üsküdar", "Maltepe", "Pendik", "Esenyurt", "Beylikdüzü", "Sarıyer"],
    "İzmir": ["Bornova", "Karşıyaka", "Konak", "Buca", "Karabağlar", "Çiğli", "Gaziemir", "Bayraklı", "Balçova"],
    "Kocaeli": ["İzmit", "Gebze", "Gölcük", "Körfez", "Derince", "Kartepe", "Darıca", "Çayırova"],
    "Mersin": ["Akdeniz", "Mezitli", "Yenişehir", "Toroslar", "Tarsus", "Erdemli", "Silifke"],
    "Trabzon": ["Ortahisar", "Akçaabat", "Araklı", "Of", "Yomra", "Arsin", "Sürmene"],
    "Diğer": ["Merkez"]
  };

  const cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+90",
    service: "Genel Proje Talebi",
    city: "İstanbul",
    district: "Kadıköy",
    detailedAddress: "",
    subject: "Öneri",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (turkeyData[formData.city]) {
      setFormData(prev => ({ ...prev, district: turkeyData[formData.city][0] }));
    } else {
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formType === "quote") {
        const fullLocation = `${formData.city} / ${formData.district}`;
        const fullMessage = `Adres Detayı: ${formData.detailedAddress}\n\nProje Notu: ${formData.message}`;

        const res = await fetch("/api/teklif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
            service: formData.service,
            bill: 0,
            region: "Türkiye",
            city: fullLocation,
            message: fullMessage,
            panelCount: 0,
            roiYears: "0",
          }),
        });
        if (res.ok) setIsSuccess(true);
      } else {
        const res = await fetch("/api/mesaj", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
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

  // Yeni Form Doldurma (Sıfırlama) Fonksiyonu
  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryCode: "+90",
      service: "Genel Proje Talebi",
      city: "İstanbul",
      district: "Kadıköy",
      detailedAddress: "",
      subject: "Öneri",
      message: "",
    });
  };

  // YENİ PREMIUM BAŞARI EKRANI
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 bg-gray-50/30">
        <div className="relative bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 max-w-lg w-full text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#02529C] to-blue-400"></div>

          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-green-50 rounded-full ring-8 ring-green-50/50">
              <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
            Talebiniz Alındı!
          </h2>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10 font-medium px-2">
            {formType === "quote" 
              ? "Proje detaylarınız ve konum bilgileriniz keşif ekibimize iletildi. En kısa sürede sizinle iletişime geçeceğiz." 
              : "Mesajınız yönetim ekibimize başarıyla iletildi. İlgili departmanımız en kısa sürede sizinle iletişime geçecektir."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button 
              onClick={handleResetForm} 
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-[#02529C] hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Yeni Form Doldur
            </button>

            <Link 
              href="/" 
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#02529C] hover:bg-blue-50 hover:text-[#02529C] text-gray-600 font-bold py-3.5 px-6 rounded-xl transition-all hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Bizimle İletişime Geçin</h1>
          <p className="text-gray-500 text-lg">Projeniz için detaylı keşif talebi oluşturabilir veya görüşlerinizi iletebilirsiniz.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setFormType("quote")}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-colors ${
                formType === "quote" ? "bg-[#02529C] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ClipboardList className="w-5 h-5" /> Keşif & Fiyat Teklifi Al
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

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Ortak Alanlara Telefon Eklendi */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 space-y-6">
                <h3 className="text-[#02529C] font-bold border-b border-blue-100 pb-2">Kişisel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Adınız Soyadınız / Firma Adı *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresiniz *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon Numaranız *</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white font-medium shadow-sm"
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
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiyat Teklifi Özel Alanları */}
              {formType === "quote" && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <h3 className="text-gray-800 font-bold border-b border-gray-200 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Proje Konumu ve Detayları
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">İl *</label>
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700 shadow-sm"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">İlçe *</label>
                      {turkeyData[formData.city] && turkeyData[formData.city].length > 0 ? (
                        <select 
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700 shadow-sm"
                        >
                          {turkeyData[formData.city].map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          type="text"
                          required
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          placeholder="İlçe adını yazınız"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white shadow-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-400" /> Açık Adres *
                    </label>
                    <textarea 
                      required
                      rows={2}
                      value={formData.detailedAddress}
                      onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                      placeholder="Mahalle, Cadde, Sokak, Bina/Apartman No..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white resize-none shadow-sm"
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">Keşif ekiplerimizin tam konumu bulabilmesi için lütfen açık adresi detaylı yazınız.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Proje Türü *</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700 shadow-sm"
                    >
                      <option value="Çatı GES Kurulumu">Çatı GES Kurulumu</option>
                      <option value="Arazi Tipi GES">Arazi Tipi GES</option>
                      <option value="Endüstriyel Kurulum">Endüstriyel Kurulum</option>
                      <option value="Tarımsal Sulama GES">Tarımsal Sulama GES</option>
                      <option value="Hibrit Enerji Sistemleri">Hibrit Enerji Sistemleri</option>
                      <option value="Enerji Depolama Sistemleri">Enerji Depolama Sistemleri</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Öneri/Şikayet Özel Alanları */}
              {formType === "message" && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Konu *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700 shadow-sm"
                  >
                    <option value="Öneri">Öneri</option>
                    <option value="Şikayet">Şikayet</option>
                    <option value="Bilgi Talebi">Genel Bilgi Talebi</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {formType === "quote" ? "Eklemek İstediğiniz Notlar (Opsiyonel)" : "Mesajınız *"}
                </label>
                <textarea 
                  required={formType === "message"} 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={formType === "quote" ? "Mevcut elektrik altyapınız, çatı tipiniz veya özel istekleriniz..." : "İletmek istediğiniz konuyu detaylıca yazabilirsiniz..."}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFC107] hover:bg-yellow-500 text-gray-900 font-black py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-lg mt-8"
              >
                <Send className="w-6 h-6" /> 
                {isSubmitting ? "Gönderiliyor..." : formType === "quote" ? "Keşif Talebini Gönder" : "Mesajı Gönder"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { ClipboardList, MessageSquare, Send, CheckCircle2, MapPin, Map } from "lucide-react";

export default function TeklifAlPage() {
  const [formType, setFormType] = useState("quote");
  
  // Örnek: İllere göre ilçeler veritabanı (Gerçek projede tüm ilçeler eklenebilir)
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
    // Not: Diğer illeri boş ilçe dizisi ile tanımlayalım, kullanıcı dilerse manuel yazabilir
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
    district: "Kadıköy", // İlçe
    detailedAddress: "", // Açık Adres
    subject: "Öneri",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Şehir değiştiğinde ilçeyi otomatik olarak o şehrin ilk ilçesi yap
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
        // --- 1. FİYAT TEKLİFİ GÖNDERİMİ ---
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
            city: fullLocation, // Şehir ve ilçe birleştirildi (Örn: İstanbul / Kadıköy)
            message: fullMessage, // Açık adres mesajın içine eklendi
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
              ? "Proje detaylarınız ve konum bilgileriniz keşif ekibimize iletildi. En kısa sürede sizinle iletişime geçeceğiz." 
              : "Mesajınız yönetim ekibimize iletildi. Geri bildiriminiz için teşekkür ederiz."}
          </p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setFormData({ ...formData, name: "", email: "", phone: "", message: "", detailedAddress: "" });
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
      <div className="max-w-4xl mx-auto">
        
        {/* Üst Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Bizimle İletişime Geçin</h1>
          <p className="text-gray-500 text-lg">Projeniz için detaylı keşif talebi oluşturabilir veya görüşlerinizi iletebilirsiniz.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Sekme Seçici */}
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

          {/* Form Alanı */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Ortak Alanlar (Kişisel Bilgiler) */}
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
                  {formType === "quote" && (
                    <div>
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
                  )}
                </div>
              </div>

              {/* Fiyat Teklifi Özel Alanları (Konum & Proje) */}
              {formType === "quote" && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <h3 className="text-gray-800 font-bold border-b border-gray-200 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Proje Konumu ve Detayları
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* İl Seçimi */}
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

                    {/* İlçe Seçimi */}
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

                  {/* Detaylı Açık Adres */}
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

                  {/* Proje Türü */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Proje Türü *</label>
                    <select 
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-white text-gray-700 shadow-sm"
                    >
                      <option value="Genel Proje Talebi">Genel Proje Talebi</option>
                      <option value="Çatı GES Kurulumu">Çatı GES Kurulumu</option>
                      <option value="Arazi Tipi GES">Arazi Tipi GES</option>
                      <option value="Endüstriyel Kurulum">Endüstriyel Kurulum</option>
                      <option value="Tarımsal Sulama GES">Tarımsal Sulama GES</option>
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

              {/* Ortak Metin Alanı (Proje Notu / Mesaj) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {formType === "quote" ? "Eklemek İstediğiniz Notlar (Opsiyonel)" : "Mesajınız *"}
                </label>
                <textarea 
                  required={formType === "message"} // Teklifte opsiyonel, mesajda zorunlu
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
"use client";

import { useState, useEffect } from "react";
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
    service: "Çatı GES Kurulumu", 
    otherServiceDetail: "", 
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
        
        const finalService = formData.service === "Diğer" 
          ? `Diğer - ${formData.otherServiceDetail}` 
          : formData.service;

        const res = await fetch("/api/teklif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
            service: finalService,
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

  const handleResetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryCode: "+90",
      service: "Çatı GES Kurulumu",
      otherServiceDetail: "",
      city: "İstanbul",
      district: "Kadıköy",
      detailedAddress: "",
      subject: "Öneri",
      message: "",
    });
  };

  if (isSuccess) {
    return (
      // Başarı Ekranı Karanlık Mod Güncellemesi
      <div className="flex items-center justify-center min-h-[60vh] p-4 bg-gray-50/30 dark:bg-slate-950/50 transition-colors duration-300">
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-slate-800 p-8 md:p-12 max-w-lg w-full text-center overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#02529C] to-blue-400 dark:from-blue-600 dark:to-blue-400"></div>

          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-green-100 dark:bg-emerald-900/40 rounded-full animate-ping opacity-20"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-green-50 dark:bg-emerald-900/60 rounded-full ring-8 ring-green-50/50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-12 h-12 text-green-500 dark:text-emerald-400" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 mb-4 tracking-tight">
            Talebiniz Alındı!
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-10 font-medium px-2">
            {formType === "quote" 
              ? "Proje detaylarınız ve konum bilgileriniz keşif ekibimize iletildi. En kısa sürede sizinle iletişime geçeceğiz." 
              : "Mesajınız yönetim ekibimize başarıyla iletildi. İlgili departmanımız en kısa sürede sizinle iletişime geçecektir."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button 
              onClick={handleResetForm} 
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-[#02529C] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Yeni Form Doldur
            </button>

            <Link 
              href="/" 
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-[#02529C] dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-[#02529C] dark:hover:text-blue-400 font-bold py-3.5 px-6 rounded-xl transition-all hover:-translate-y-0.5"
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
    // Form Ekranı Karanlık Mod Güncellemesi
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-slate-100 mb-3 transition-colors">Bizimle İletişime Geçin</h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg transition-colors">Projeniz için detaylı keşif talebi oluşturabilir veya görüşlerinizi iletebilirsiniz.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          
          {/* TABLAR */}
          <div className="flex border-b border-gray-100 dark:border-slate-800 transition-colors">
            <button
              onClick={() => setFormType("quote")}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-colors ${
                formType === "quote" 
                  ? "bg-[#02529C] dark:bg-blue-600 text-white" 
                  : "bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <ClipboardList className="w-5 h-5" /> Keşif & Fiyat Teklifi Al
            </button>
            <button
              onClick={() => setFormType("message")}
              className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-colors ${
                formType === "message" 
                  ? "bg-[#02529C] dark:bg-blue-600 text-white" 
                  : "bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <MessageSquare className="w-5 h-5" /> Öneri & Şikayet
            </button>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* KİŞİSEL BİLGİLER */}
              <div className="bg-blue-50/50 dark:bg-slate-800/80 p-6 rounded-2xl border border-blue-100/50 dark:border-slate-700 space-y-6 transition-colors">
                <h3 className="text-[#02529C] dark:text-blue-400 font-bold border-b border-blue-100 dark:border-slate-700 pb-2 transition-colors">Kişisel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Adınız Soyadınız / Firma Adı *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">E-Posta Adresiniz *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Telefon Numaranız *</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="px-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium shadow-sm transition-colors"
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
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KEŞİF / TEKLİF FORMU DETAYLARI */}
              {formType === "quote" && (
                <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 space-y-6 transition-colors">
                  <h3 className="text-gray-800 dark:text-slate-200 font-bold border-b border-gray-200 dark:border-slate-700 pb-2 flex items-center gap-2 transition-colors">
                    <MapPin className="w-4 h-4" /> Proje Konumu ve Detayları
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">İl *</label>
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-100 shadow-sm transition-colors"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">İlçe *</label>
                      {turkeyData[formData.city] && turkeyData[formData.city].length > 0 ? (
                        <select 
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-100 shadow-sm transition-colors"
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
                          className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm transition-colors"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-400 dark:text-slate-500" /> Açık Adres *
                    </label>
                    <textarea 
                      required
                      rows={2}
                      value={formData.detailedAddress}
                      onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                      placeholder="Mahalle, Cadde, Sokak, Bina/Apartman No..."
                      className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 resize-none shadow-sm transition-colors"
                    ></textarea>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1.5 ml-1">Keşif ekiplerimizin tam konumu bulabilmesi için lütfen açık adresi detaylı yazınız.</p>
                  </div>

                  {/* Proje Türü Seçimi ve Şartlı Input */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Proje Türü *</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-100 shadow-sm transition-colors"
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

                    {/* Proje türü 'Diğer' seçilirse açılacak açıklama alanı */}
                    {formData.service === "Diğer" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-bold text-[#02529C] dark:text-blue-400 mb-2 transition-colors">
                          Lütfen istediğiniz proje türünü kısaca açıklayınız *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.otherServiceDetail}
                          onChange={(e) => setFormData({ ...formData, otherServiceDetail: e.target.value })}
                          placeholder="Örn: Güneş paneli temizlik ve bakım hizmeti..."
                          className="w-full px-4 py-3 border border-blue-200 dark:border-blue-900/50 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 text-gray-900 dark:text-slate-100 shadow-sm transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MESAJ / ÖNERİ FORMU DETAYLARI */}
              {formType === "message" && (
                <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Konu *</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-100 shadow-sm transition-colors"
                  >
                    <option value="Öneri">Öneri</option>
                    <option value="Şikayet">Şikayet</option>
                    <option value="Bilgi Talebi">Genel Bilgi Talebi</option>
                  </select>
                </div>
              )}

              {/* ORTAK MESAJ ALANI */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                  {formType === "quote" ? "Eklemek İstediğiniz Notlar (Opsiyonel)" : "Mesajınız *"}
                </label>
                <textarea 
                  required={formType === "message"} 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={formType === "quote" ? "Mevcut elektrik altyapınız, çatı tipiniz veya özel istekleriniz..." : "İletmek istediğiniz konuyu detaylıca yazabilirsiniz..."}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-gray-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-slate-100 resize-none transition-colors"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFC107] dark:bg-amber-500 hover:bg-yellow-500 dark:hover:bg-amber-400 text-gray-900 font-black py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-lg mt-8"
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
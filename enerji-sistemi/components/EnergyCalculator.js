"use client";

import { useState, useEffect } from "react";
import { Calculator, Sun, Banknote, MapPin, Zap, Building2, Send, X, CheckCircle2 } from "lucide-react";

export default function EnergyCalculator() {
  const [bill, setBill] = useState(3500);
  const [region, setRegion] = useState("marmara");
  const [city, setCity] = useState("İstanbul");
  const [panelPower, setPanelPower] = useState(400); 
  const [structure, setStructure] = useState("mustakil"); 

  // Modal ve Form State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", countryCode: "+90" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const regionsData = {
    marmara: { name: "Marmara Bölgesi", multiplier: 1.05, cities: ["İstanbul", "Bursa", "Kocaeli", "Tekirdağ", "Balıkesir", "Çanakkale", "Sakarya"] },
    ege: { name: "Ege Bölgesi", multiplier: 1.20, cities: ["İzmir", "Aydın", "Muğla", "Manisa", "Denizli", "Afyonkarahisar", "Kütahya"] },
    akdeniz: { name: "Akdeniz Bölgesi", multiplier: 1.35, cities: ["Antalya", "Mersin", "Adana", "Hatay", "Isparta", "Burdur", "Osmaniye"] },
    icanadolu: { name: "İç Anadolu Bölgesi", multiplier: 1.15, cities: ["Ankara", "Konya", "Kayseri", "Eskişehir", "Sivas", "Aksaray", "Nevşehir"] },
    karadeniz: { name: "Karadeniz Bölgesi", multiplier: 0.90, cities: ["Samsun", "Trabzon", "Ordu", "Rize", "Giresun", "Zonguldak", "Amasya"] },
    doguanadolu: { name: "Doğu Anadolu Bölgesi", multiplier: 1.10, cities: ["Erzurum", "Malatya", "Elazığ", "Van", "Erzincan", "Kars", "Ağrı"] },
    guneydogu: { name: "Güneydoğu Anadolu", multiplier: 1.40, cities: ["Gaziantep", "Diyarbakır", "Şanlıurfa", "Mardin", "Batman", "Adıyaman", "Şırnak"] }
  };

  const structuresData = {
    mustakil: { name: "Müstakil Ev", tariff: 3.0, baseMultiplier: 2.5 },
    apartman: { name: "Apartman (Ortak Alan)", tariff: 3.0, baseMultiplier: 2.4 },
    dukkan: { name: "Dükkan / Ticarethane", tariff: 4.5, baseMultiplier: 2.2 },
    fabrika: { name: "Fabrika / Endüstriyel Tesis", tariff: 3.8, baseMultiplier: 2.0 },
    sanayi: { name: "Sanayi Kuruluşu", tariff: 3.8, baseMultiplier: 2.0 },
    tarla: { name: "Arazi / Güneş Paneli Tarlası", tariff: 3.0, baseMultiplier: 1.8 },
  };

  const panelOptions = [
    { power: 400, label: "400W - Standart Monokristal", price: 4500 },
    { power: 455, label: "455W - Yarı Kesim (Half-Cut)", price: 5100 },
    { power: 545, label: "545W - Endüstriyel Yüksek Verim", price: 6100 },
  ];

  useEffect(() => {
    setCity(regionsData[region].cities[0]);
  }, [region]);

  // HESAPLAMA ALGORİTMASI
  const currentBill = Number(bill) || 0; 
  const selectedStructure = structuresData[structure];
  const dailyKwh = (currentBill / selectedStructure.tariff) / 30; 
  const requiredKw = dailyKwh / (4 * regionsData[region].multiplier); 
  const panelCount = Math.ceil((requiredKw * 1000) / panelPower); 
  
  const selectedPanelPrice = panelOptions.find(p => p.power === panelPower)?.price || 4500;
  const rawPanelsCost = panelCount * selectedPanelPrice; 
  
  let dynamicMultiplier = selectedStructure.baseMultiplier;
  if (panelCount > 10) {
    const scaleDiscount = Math.min(0.35, Math.log10(panelCount / 10) * 0.12);
    dynamicMultiplier = dynamicMultiplier * (1 - scaleDiscount);
  }
  
  const estimatedCost = rawPanelsCost * dynamicMultiplier; 
  const yearlySavings = currentBill * 12;
  const roiYears = yearlySavings > 0 ? (estimatedCost / yearlySavings).toFixed(1) : "0.0";

  // TEKLİF GÖNDERME İŞLEMİ
  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         name: formData.name,
          email: formData.email, 
          phone: `${formData.countryCode} ${formData.phone}`, 
          service: `${selectedStructure.name} - GES Kurulumu`,
          bill: currentBill,
          region: regionsData[region].name,
          city: city,
          panelCount: panelCount,
          roiYears: roiYears
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSuccess(false);
          setFormData({ name: "", phone: "", email: "", countryCode: "+90" });
        }, 3000);
      } else {
        alert("Teklif gönderilirken bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 p-8 transition-colors duration-300 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 text-[#02529C] dark:text-blue-400 rounded-xl flex items-center justify-center transition-colors">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Gelişmiş Enerji Hesaplayıcı</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm transition-colors">Tarifenize, şehrinize ve projenize özel amorti süresi analizi.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fatura Ayarı */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-medium text-gray-700 dark:text-slate-300 transition-colors">Aylık Ortalama Elektrik Faturanız</label>          
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#02529C] dark:focus-within:ring-blue-500 transition-all">
              <input 
                type="number" 
                min="0"
                max="9999999" 
                value={bill === 0 ? "" : bill} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > 7) return;
                  setBill(val === "" ? 0 : Number(val));
                }}
                className="w-32 text-right font-bold text-[#02529C] dark:text-blue-400 text-lg bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none transition-colors"
                placeholder="0"
              />
              <span className="font-bold text-[#02529C] dark:text-blue-400 text-lg transition-colors">₺</span>
            </div>
          </div>
          <input 
            type="range" 
            min="500" max="1000000" step="500" 
            value={bill} 
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#02529C] dark:accent-blue-500 transition-colors"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-2 font-medium transition-colors">
            <span>Kaydırın veya kutuya elinizle yazın</span>
            <span>Önerilen Max: 1.000.000 ₺</span>
          </div>
        </div>

        {/* Seçenekler Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2 text-sm transition-colors">
              <Building2 className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Kurulum Alanı (Abone Tipi)
            </label>
            <select 
              value={structure} 
              onChange={(e) => setStructure(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] dark:focus:ring-blue-500 text-gray-700 dark:text-slate-200 font-medium transition-colors"
            >
              {Object.entries(structuresData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2 text-sm transition-colors">Bölgeniz</label>
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] dark:focus:ring-blue-500 text-gray-700 dark:text-slate-200 transition-colors"
            >
              {Object.entries(regionsData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2 text-sm transition-colors">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-500" /> Şehriniz
            </label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] dark:focus:ring-blue-500 text-gray-700 dark:text-slate-200 transition-colors"
            >
              {regionsData[region].cities.map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <label className="font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2 text-sm transition-colors">
              <Zap className="w-4 h-4 text-[#FFC107] dark:text-amber-400" /> Tercih Edilen Panel Gücü
            </label>
            <select 
              value={panelPower} 
              onChange={(e) => setPanelPower(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] dark:focus:ring-blue-500 text-gray-700 dark:text-slate-200 transition-colors"
            >
              {panelOptions.map((panel) => (
                <option key={panel.power} value={panel.power}>{panel.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sonuç Kartları */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800 mt-2 transition-colors">
          <div className="bg-blue-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-blue-100 dark:border-slate-700 flex flex-col justify-center transition-colors">
            <div className="flex items-center gap-2 text-[#02529C] dark:text-blue-400 mb-2 transition-colors">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-semibold">Gereksinim</span>
            </div>
            <p className="text-3xl font-black text-blue-950 dark:text-slate-100 transition-colors">
              {panelCount} <span className="text-lg font-bold text-blue-800/60 dark:text-slate-400">Panel</span>
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-green-100 dark:border-slate-700 flex flex-col justify-center transition-colors">
            <div className="flex items-center gap-2 text-green-700 dark:text-emerald-400 mb-2 transition-colors">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-semibold">Amorti Süresi</span>
            </div>
            <p className="text-3xl font-black text-green-950 dark:text-slate-100 transition-colors">
              {roiYears} <span className="text-lg font-bold text-green-800/60 dark:text-slate-400">Yıl</span>
            </p>
          </div>
        </div>

        {/* Harekete Geçirici Mesaj (CTA) Butonu */}
        <div className="pt-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#FFC107] dark:bg-amber-500 hover:bg-yellow-500 dark:hover:bg-amber-400 text-gray-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" /> Bu Sistem İçin Ücretsiz Teklif Al
          </button>
        </div>
      </div>

      {/* TEKLİF FORMU MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800 transition-colors">
            {!isSuccess && (
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 p-1 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Talebiniz Alındı!</h3>
                <p className="text-gray-500 dark:text-slate-400 transition-colors">Mühendislerimiz hesabınızı inceleyip en kısa sürede sizinle iletişime geçecek.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Teklif Detayları</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 transition-colors">Hesaplanan verilerinizle birlikte size özel fiyat çalışması yapabilmemiz için bilgilerinizi girin.</p>
                </div>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 transition-colors">Adınız Soyadınız / Firma Adı</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: Ahmet Yılmaz veya ABC Enerji A.Ş."
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 transition-colors">E-Posta Adresiniz</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Örn: ahmet@sirket.com"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1.5 transition-colors">Telefon Numaranız</label>
                    <div className="flex gap-2">
                      <select 
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="px-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors font-medium text-gray-700 dark:text-slate-300"
                      >
                        <option value="+90">+90 (TR)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+994">+994 (AZ)</option>
                      </select>
                      <input 
                        type="tel" 
                        required
                        maxLength="10"
                        value={formData.phone}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          if (onlyNums.length <= 10) {
                            setFormData({ ...formData, phone: onlyNums });
                          }
                        }}
                        placeholder="555 123 4567"
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#02529C] dark:focus:border-blue-400 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Özet Bilgi Kutusu */}
                  <div className="bg-blue-50 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-100 dark:border-slate-700 mt-2 transition-colors">
                    <p className="text-xs font-bold text-[#02529C] dark:text-blue-400 mb-1 transition-colors">Gönderilecek Keşif Verileri:</p>
                    <p className="text-xs text-blue-800 dark:text-slate-300 font-medium transition-colors">
                      {city} • {selectedStructure?.name} • {panelCount} Panel İhtiyacı
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#02529C] dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-2"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
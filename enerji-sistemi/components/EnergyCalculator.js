"use client";

import { useState, useEffect } from "react";
import { Calculator, Sun, BatteryCharging, Banknote, MapPin, Zap, Building2 } from "lucide-react";

export default function EnergyCalculator() {
  const [bill, setBill] = useState(3500);
  const [region, setRegion] = useState("marmara");
  const [city, setCity] = useState("İstanbul");
  const [panelPower, setPanelPower] = useState(400); 
  const [structure, setStructure] = useState("mustakil"); 

  const regionsData = {
    marmara: { 
      name: "Marmara Bölgesi", 
      multiplier: 1.05,
      cities: ["İstanbul", "Bursa", "Kocaeli", "Tekirdağ", "Balıkesir", "Çanakkale", "Sakarya"]
    },
    ege: { 
      name: "Ege Bölgesi", 
      multiplier: 1.20,
      cities: ["İzmir", "Aydın", "Muğla", "Manisa", "Denizli", "Afyonkarahisar", "Kütahya"]
    },
    akdeniz: { 
      name: "Akdeniz Bölgesi", 
      multiplier: 1.35,
      cities: ["Antalya", "Mersin", "Adana", "Hatay", "Isparta", "Burdur", "Osmaniye"]
    },
    icanadolu: { 
      name: "İç Anadolu Bölgesi", 
      multiplier: 1.15,
      cities: ["Ankara", "Konya", "Kayseri", "Eskişehir", "Sivas", "Aksaray", "Nevşehir"]
    },
    karadeniz: { 
      name: "Karadeniz Bölgesi", 
      multiplier: 0.90,
      cities: ["Samsun", "Trabzon", "Ordu", "Rize", "Giresun", "Zonguldak", "Amasya"]
    },
    doguanadolu: { 
      name: "Doğu Anadolu Bölgesi", 
      multiplier: 1.10,
      cities: ["Erzurum", "Malatya", "Elazığ", "Van", "Erzincan", "Kars", "Ağrı"]
    },
    guneydogu: { 
      name: "Güneydoğu Anadolu", 
      multiplier: 1.40, 
      cities: ["Gaziantep", "Diyarbakır", "Şanlıurfa", "Mardin", "Batman", "Adıyaman", "Şırnak"]
    }
  };

  // Baz çarpanlar biraz daha yüksek tutuldu ki indirim eğrisi daha güzel çalışsın
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

  // --- GELİŞMİŞ LOGARİTMİK HESAPLAMA ALGORİTMASI ---
  const currentBill = Number(bill) || 0; 
  const selectedStructure = structuresData[structure];
  
  // 1. Tüketilen Günlük Elektrik (kWh)
  const dailyKwh = (currentBill / selectedStructure.tariff) / 30; 
  
  // 2. Gereken Kurulu Güç
  const requiredKw = dailyKwh / (4 * regionsData[region].multiplier); 
  
  // 3. Gereken Panel Adedi
  const panelCount = Math.ceil((requiredKw * 1000) / panelPower); 
  
  // 4. Ham Panel Maliyeti
  const selectedPanelPrice = panelOptions.find(p => p.power === panelPower)?.price || 4500;
  const rawPanelsCost = panelCount * selectedPanelPrice; 
  
  // 5. DİNAMİK ANAHTAR TESLİM ÇARPANI (Logaritmik Ölçek Ekonomisi)
  let dynamicMultiplier = selectedStructure.baseMultiplier;
  
  // Sistem 10 panelden büyükse, maliyet çarpanını sürekli eğimle (logaritmik) düşür.
  if (panelCount > 10) {
    // Math.log10 sayesinde sistem büyüdükçe indirim oranı yavaş yavaş artar.
    // Maksimum %35 toptan alım/proje indirimi olacak şekilde sınırlandırıldı (Math.min).
    const scaleDiscount = Math.min(0.35, Math.log10(panelCount / 10) * 0.12);
    dynamicMultiplier = dynamicMultiplier * (1 - scaleDiscount);
  }
  
  // 6. Toplam Maliyet ve Amorti Süresi
  const estimatedCost = rawPanelsCost * dynamicMultiplier; 
  const yearlySavings = currentBill * 12;
  const roiYears = yearlySavings > 0 ? (estimatedCost / yearlySavings).toFixed(1) : "0.0";

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-[#02529C] rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gelişmiş Keşif Hesaplayıcı</h3>
          <p className="text-gray-500 text-sm">Tarifenize, şehrinize ve projenize özel amorti süresi analizi.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Fatura Ayarı */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-medium text-gray-700">Aylık Ortalama Elektrik Faturanız</label>          
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#02529C] transition-all">
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
                className="w-32 text-right font-bold text-[#02529C] text-lg bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="font-bold text-[#02529C] text-lg">₺</span>
            </div>
          </div>
          
          <input 
            type="range" 
            min="500" 
            max="1000000" 
            step="500" 
            value={bill} 
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#02529C]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>Kaydırın veya kutuya elinizle yazın</span>
            <span>Önerilen Max: 1.000.000 ₺</span>
          </div>
        </div>

        {/* Seçenekler Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700 block mb-2 flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-blue-500" /> Kurulum Alanı (Abone Tipi)
            </label>
            <select 
              value={structure} 
              onChange={(e) => setStructure(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] text-gray-700 font-medium"
            >
              {Object.entries(structuresData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700 block mb-2 flex items-center gap-2 text-sm">
               Bölgeniz
            </label>
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] text-gray-700"
            >
              {Object.entries(regionsData).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700 block mb-2 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" /> Şehriniz
            </label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] text-gray-700"
            >
              {regionsData[region].cities.map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <label className="font-medium text-gray-700 block mb-2 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-[#FFC107]" /> Tercih Edilen Panel Gücü
            </label>
            <select 
              value={panelPower} 
              onChange={(e) => setPanelPower(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#02529C] text-gray-700"
            >
              {panelOptions.map((panel) => (
                <option key={panel.power} value={panel.power}>{panel.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sonuç Kartları */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-2">
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#02529C] mb-2">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-semibold">Gereksinim</span>
            </div>
            <p className="text-3xl font-black text-blue-950">{panelCount} <span className="text-lg font-bold text-blue-800/60">Panel</span></p>
            <p className="text-xs text-[#02529C]/70 mt-1 font-medium">
              Tüketim: <b>{Math.round(dailyKwh)} kWh/Gün</b>
            </p>
          </div>
          
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-semibold">Amorti Süresi</span>
            </div>
            <p className="text-3xl font-black text-green-950">{roiYears} <span className="text-lg font-bold text-green-800/60">Yıl</span></p>
            <p className="text-xs text-green-700/70 mt-1 font-medium">
              Tahmini yatırım dönüşü
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
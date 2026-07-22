"use client";

import { useState, useEffect } from "react";
import { Calculator, Sun, BatteryCharging, Banknote, MapPin, Zap } from "lucide-react";

export default function EnergyCalculator() {
  const [bill, setBill] = useState(3500);
  const [region, setRegion] = useState("akdeniz");
  const [city, setCity] = useState("Antalya");
  const [panelPower, setPanelPower] = useState(400); // Panel gücü (Watt)

  // Bölgeler ve o bölgelere ait popüler şehirler veri yapısı
  const regionsData = {
    akdeniz: { 
      name: "Akdeniz & G.Doğu", 
      multiplier: 1.2,
      cities: ["Antalya", "Mersin", "Adana", "Gaziantep", "Diyarbakır", "Hatay"]
    },
    ege: { 
      name: "Ege Bölgesi", 
      multiplier: 1.1,
      cities: ["İzmir", "Aydın", "Muğla", "Manisa", "Denizli", "Afyonkarahisar"]
    },
    icanadolu: { 
      name: "İç Anadolu & Marmara", 
      multiplier: 1.0,
      cities: ["Ankara", "İstanbul", "Bursa", "Konya", "Kayseri", "Eskişehir"]
    },
    karadeniz: { 
      name: "Karadeniz", 
      multiplier: 0.85,
      cities: ["Samsun", "Trabzon", "Ordu", "Rize", "Giresun", "Zonguldak"]
    },
  };

  // Piyasada en çok kullanılan panel tipleri ve tahmini birim maliyetleri
  const panelOptions = [
    { power: 400, label: "400W - Standart Monokristal", price: 4500 },
    { power: 455, label: "455W - Yarı Kesim (Half-Cut)", price: 5100 },
    { power: 545, label: "545W - Endüstriyel Yüksek Verim", price: 6000 },
  ];

  // Kullanıcı bölgeyi değiştirdiğinde, şehri otomatik olarak o bölgenin ilk şehri yap
  useEffect(() => {
    setCity(regionsData[region].cities[0]);
  }, [region]);

  // Gelişmiş Hesaplama Algoritması
  const dailyKwh = (bill / 2.5) / 30; // 1 kWh = 2.5 TL ortalama alındı
  const requiredKw = dailyKwh / (4 * regionsData[region].multiplier); // Çarpanla günlük güneşlenme hesabı
  
  // Seçilen panele göre adet hesabı
  const panelCount = Math.ceil((requiredKw * 1000) / panelPower); 
  
  // 1. Sadece panelin ham maliyeti
  const selectedPanelPrice = panelOptions.find(p => p.power === panelPower)?.price || 4500;
  const rawPanelsCost = panelCount * selectedPanelPrice;
   
  
  // 2. ANAHTAR TESLİM ÇARPANI (İnvertör, işçilik, konstrüksiyon, kablo ve mühendislik eklendi)
  // Gerçek projelerde toplam maliyet, ham panel maliyetinin ortalama 2.2 ile 2.4 katı arasındadır.
  // ÖLÇEK EKONOMİSİ MANTIĞI: Sistem büyüdükçe anahtar teslim çarpanı ucuzlar
  let turnkeyMultiplier = 2.3; // Standart ev tipi
  if (panelCount > 20) turnkeyMultiplier = 2.1; // Orta ölçekli ticarethane
  if (panelCount > 50) turnkeyMultiplier = 1.9; // Fabrika / Endüstriyel
  
  const estimatedCost = rawPanelsCost * turnkeyMultiplier;
  
  // 3. Amorti Hesabı
  const yearlySavings = bill * 12;
  const roiYears = (estimatedCost / yearlySavings).toFixed(1);
  

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-[#02529C] rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Tasarruf Hesaplayıcı</h3>
          <p className="text-gray-500 text-sm">Sistemin kendini ne kadar sürede amorti edeceğini detaylıca görün.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fatura Ayarı */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-gray-700">Aylık Ortalama Elektrik Faturanız</label>
            <span className="font-bold text-[#02529C] text-lg">{bill.toLocaleString("tr-TR")} ₺</span>
          </div>
          <input 
            type="range" 
            min="500" 
            max="30000" 
            step="500" 
            value={bill} 
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#02529C]"
          />
        </div>

        {/* Lokasyon ve Panel Seçimi Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Bölge Seçimi */}
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

          {/* Şehir Seçimi */}
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

          {/* Panel Tipi Seçimi (Tam genişlik kaplar) */}
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
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 text-[#02529C] mb-2">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-semibold">Gereken Panel</span>
            </div>
            <p className="text-3xl font-black text-blue-950">{panelCount} <span className="text-lg font-bold text-blue-800/60">Adet</span></p>
            <p className="text-xs text-[#02529C]/70 mt-1 font-medium">~{requiredKw.toFixed(1)} kW Kurulu Güç</p>
          </div>
          
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-semibold">Amorti Süresi</span>
            </div>
            <p className="text-3xl font-black text-green-950">{roiYears} <span className="text-lg font-bold text-green-800/60">Yıl</span></p>
            <p className="text-xs text-green-700/70 mt-1 font-medium">Tahmini yatırım dönüşü</p>
          </div>
        </div>
      </div>
    </div>
  );
}
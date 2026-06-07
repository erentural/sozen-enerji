"use client";

import { useState } from "react";
import { Calculator, Sun, BatteryCharging, Banknote } from "lucide-react";

export default function EnergyCalculator() {
  const [bill, setBill] = useState(2500);
  const [region, setRegion] = useState("karadeniz");

  // Bölgelere göre güneşlenme/verim çarpanı
  const regions = {
    akdeniz: { name: "Akdeniz & G.Doğu", multiplier: 1.2 },
    ege: { name: "Ege Bölgesi", multiplier: 1.1 },
    icanadolu: { name: "İç Anadolu & Marmara", multiplier: 1.0 },
    karadeniz: { name: "Karadeniz (Samsun, Trabzon vb.)", multiplier: 0.85 },
  };

  // Basit bir hesaplama algoritması
  const dailyKwh = (bill / 2.5) / 30; // Yaklaşık 1 kWh = 2.5 TL varsayımı
  const requiredKw = dailyKwh / (4 * regions[region].multiplier); // Günlük ortalama 4 saat güneş
  const panelCount = Math.ceil((requiredKw * 1000) / 400); // 400W paneller
  const estimatedCost = panelCount * 4500; // Panel başı ortalama maliyet (TL)
  const yearlySavings = bill * 12;
  const roiYears = (estimatedCost / yearlySavings).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 transition-colors">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Tasarruf Hesaplayıcı</h3>
          <p className="text-gray-500 text-sm">Sistemin kendini ne kadar sürede amorti edeceğini görün.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Fatura Ayarı */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-gray-700">Aylık Ortalama Elektrik Faturanız</label>
            <span className="font-bold text-blue-600">{bill.toLocaleString("tr-TR")} ₺</span>
          </div>
          <input 
            type="range" 
            min="500" 
            max="20000" 
            step="500" 
            value={bill} 
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Bölge Ayarı */}
        <div>
          <label className="font-medium text-gray-700 block mb-2">Bulunduğunuz Bölge</label>
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(regions).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>

        {/* Sonuç Kartları */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-semibold">Gereken Panel</span>
            </div>
            <p className="text-2xl font-black text-blue-950">{panelCount} Adet</p>
            <p className="text-xs text-blue-600/70 mt-1">~{Math.ceil(requiredKw)} kW Sistem</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-semibold">Amorti Süresi</span>
            </div>
            <p className="text-2xl font-black text-green-950">{roiYears} Yıl</p>
            <p className="text-xs text-green-600/70 mt-1">Tahmini geri dönüş</p>
          </div>
        </div>
      </div>
    </div>
  );
}
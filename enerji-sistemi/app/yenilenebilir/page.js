"use client";

import Navbar from "@/components/Navbar";
import { Sun, BatteryCharging, Leaf } from "lucide-react";

export default function YenilenebilirPage() {
  return (
    // dark:bg-slate-950 ve transition eklendi
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar />
      
      <section className="bg-[#02529C] dark:bg-slate-900 py-20 text-center px-4 transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-slate-100 mb-4 transition-colors">Yenilenebilir Enerji (GES)</h1>
        <p className="text-blue-100 dark:text-slate-300 max-w-2xl mx-auto text-lg transition-colors">Kendi elektriğinizi üreterek maliyetlerinizi sıfırlayın ve doğayı koruyun.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          
          <div className="text-center group">
            <Sun className="w-16 h-16 text-[#FFC107] mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Çatı Tipi Güneş Santrali</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm transition-colors">Fabrika ve konut çatılarına uygun, yüksek verimli monokristal panel sistemleri.</p>
          </div>
          
          <div className="text-center group">
            <BatteryCharging className="w-16 h-16 text-[#02529C] dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Enerji Depolama</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm transition-colors">Ürettiğiniz fazla enerjiyi depolayarak gece veya kesinti anında kullanım imkanı.</p>
          </div>
          
          <div className="text-center group">
            <Leaf className="w-16 h-16 text-green-600 dark:text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">Sıfır Karbon İzi</h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm transition-colors">Şirketinizin karbon ayak izini silin, doğa dostu kurumsal kimliğinizi güçlendirin.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
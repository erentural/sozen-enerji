import Navbar from "@/components/Navbar";
import { Sun, BatteryCharging, Leaf } from "lucide-react";

export default function YenilenebilirPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <section className="bg-[#02529C] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Yenilenebilir Enerji (GES)</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">Kendi elektriğinizi üreterek maliyetlerinizi sıfırlayın ve doğayı koruyun.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="text-center">
            <Sun className="w-16 h-16 text-[#FFC107] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Çatı Tipi Güneş Santrali</h3>
            <p className="text-gray-600 text-sm">Fabrika ve konut çatılarına uygun, yüksek verimli monokristal panel sistemleri.</p>
          </div>
          <div className="text-center">
            <BatteryCharging className="w-16 h-16 text-[#02529C] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enerji Depolama</h3>
            <p className="text-gray-600 text-sm">Ürettiğiniz fazla enerjiyi depolayarak gece veya kesinti anında kullanım imkanı.</p>
          </div>
          <div className="text-center">
            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sıfır Karbon İzi</h3>
            <p className="text-gray-600 text-sm">Şirketinizin karbon ayak izini silin, doğa dostu kurumsal kimliğinizi güçlendirin.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
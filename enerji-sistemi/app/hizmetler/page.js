import Navbar from "@/components/Navbar";
import { Home, Factory, Lightbulb, Wrench, Shield, Zap } from "lucide-react";

export default function HizmetlerPage() {
  const services = [
    { icon: Home, title: "Konut Elektrik Tesisatı", desc: "Sıfırdan tesisat çekimi, arıza tespiti ve akıllı ev sistemleri entegrasyonu." },
    { icon: Factory, title: "Endüstriyel Çözümler", desc: "Fabrika güç panoları, kompanzasyon takibi ve ağır sanayi elektrik altyapısı." },
    { icon: Lightbulb, title: "Mimari Aydınlatma", desc: "İç ve dış mekanlar için enerji tasarruflu, estetik LED aydınlatma projeleri." },
    { icon: Zap, title: "Trafo ve Yüksek Gerilim", desc: "Trafo kurulumu, periyodik bakımı ve yüksek gerilim işletme sorumluluğu." },
    { icon: Shield, title: "Topraklama ve Paratoner", desc: "Tesis güvenliği için yasal mevzuatlara uygun topraklama ve yıldırımdan korunma." },
    { icon: Wrench, title: "7/24 Teknik Servis", desc: "Acil arızalara karşı donanımlı araçlarımızla günün her saati hızlı müdahale." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Üst Başlık */}
      <section className="bg-[#02529C] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hizmetlerimiz</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">İhtiyacınız olan tüm elektriksel çözümleri tek çatı altında, profesyonel bir standartla sunuyoruz.</p>
      </section>

      {/* Hizmetler Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-[#FFC107] hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-50 flex items-center justify-center rounded-lg mb-6">
                <srv.icon className="w-8 h-8 text-[#02529C]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{srv.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
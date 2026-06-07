import Navbar from "@/components/Navbar";
import { Target, Award, Users, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Üst Başlık (Hero) */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h1 className="text-5xl font-black mb-6">Geleceği Aydınlatıyoruz</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Yenilikçi enerji çözümleriyle, doğaya saygılı ve sürdürülebilir bir dünya için 10 yılı aşkın süredir çalışıyoruz.
          </p>
        </div>
        {/* Dekoratif Arka Plan */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </section>

      {/* Misyon & Vizyon Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Müşterilerimizin enerji maliyetlerini düşürürken, karbon ayak izini minimize eden yüksek verimli ve güvenilir teknolojik sistemler kurmak. Her projede kaliteyi standart hale getirmek.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Yenilenebilir enerji sektöründe teknolojiye öncülük eden, ulusal çapta referans gösterilen ve yeni nesil akıllı şebeke sistemlerinde pazar lideri bir mühendislik firması olmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Neden Bizi Seçmelisiniz?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Uzman Mühendislik</h3>
              <p className="text-gray-600">Sahadaki her bir bağlantı, sertifikalı ve tecrübeli mühendislerimiz tarafından standartlara uygun tasarlanır.</p>
            </div>
            <div className="space-y-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Şeffaf Süreç Yönetimi</h3>
              <p className="text-gray-600">Sadece bize özel Müşteri Portalı sayesinde projenizin her aşamasını % olarak canlı takip edebilirsiniz.</p>
            </div>
            <div className="space-y-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">7/24 Destek</h3>
              <p className="text-gray-600">Kurulum sonrası bakım ve teknik servis hizmetlerimizle sisteminizin ömrünü maksimuma çıkarıyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA (Harekete Geçirici Mesaj) */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Projeleriniz İçin Hazırız</h2>
          <p className="text-lg text-gray-600 mb-8">
            Enerji dönüşümünüze bugün başlayın. Ücretsiz saha analizi ve maliyet tahmini için bizimle iletişime geçin.
          </p>
          <Link href="/#iletisim" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block shadow-lg shadow-blue-200">
            Bizimle İletişime Geçin
          </Link>
        </div>
      </section>

    </div>
  );
}
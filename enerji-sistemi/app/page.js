"use client";

import { useEffect, useState } from "react"; 
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Home, Factory, Sun, Lightbulb, Wrench, Settings, Zap, Clock, Phone, MapPin, Mail, FolderKanban, CheckCircle2, ChevronRight } from "lucide-react";
import EnergyCalculator from "@/components/EnergyCalculator";

export default function HomePage() {
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    // Sayfa açıldığında %100 olan projeleri API'den çek
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/public/projects");
        if (res.ok) {
          const data = await res.json();
          setCompletedProjects(data);
        }
      } catch (error) {
        console.error("Tamamlanan projeler yüklenemedi", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* 1. HERO (Ana Karşılama) BÖLÜMÜ */}
      <section className="relative bg-white">
        <div className="flex flex-col md:flex-row h-auto md:h-[550px]">
          {/* Sol Mavi Kısım */}
          <div className="w-full md:w-1/2 bg-[#02529C] p-10 md:p-20 flex flex-col justify-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Geleceğin Enerjisini<br />Bugün Kuruyoruz
            </h1>
            <p className="text-blue-100 text-lg mb-10 max-w-lg">
              Güvenilir Elektrik Hizmetleri ve Yenilikçi Enerji Çözümleri
            </p>
            {/* YENİ DIJİTAL YÖNLENDİRME BUTONLARI */}
            <div className="flex flex-wrap gap-4">
              {/* Müşteri Paneli Girişi - Sarı Buton */}
              <Link href="/login" className="bg-[#FFC107] text-gray-900 font-black px-8 py-4 rounded hover:bg-yellow-500 transition-colors shadow-md flex items-center gap-2">
                <Settings className="w-5 h-5 animate-spin-slow" /> Müşteri Paneli Girişi
              </Link>
              
              {/* Tamamlanan Projeler - Beyaz Buton */}
              <Link href="/tamamlanan-projeler" className="bg-white text-[#02529C] font-bold px-8 py-4 rounded hover:bg-gray-100 transition-colors shadow-md flex items-center gap-2">
                <FolderKanban className="w-5 h-5" /> Tamamlanan Projeler
              </Link>
            </div>
          </div>

          {/* Sağ Görsel Kısım */}
          <div className="w-full md:w-1/2 relative h-[350px] md:h-auto bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
              alt="Elektrik Panosu ve Sistemleri"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING (Üste Binen) HİZMET KARTLARI */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Home, title: "Konut Elektrik", desc: "Konut elektrik uzman montaj" },
            { icon: Factory, title: "Endüstriyel Elektrik", desc: "Endüstriyel tesis pano çözümleri" },
            { icon: Sun, title: "Yenilenebilir Enerji", desc: "Güneş enerjisi ve sürdürülebilirlik" },
            { icon: Lightbulb, title: "Aydınlatma Tasarımı", desc: "LED ve mimari aydınlatma" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] p-8 text-center flex flex-col items-center border-b-4 border-transparent hover:border-[#FFC107] transition-all cursor-pointer">
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <item.icon className="w-12 h-12 text-[#02529C]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEDEN BİZ? BÖLÜMÜ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Neden Biz?</h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
              Güvenilir, standartlara uygun ve yenilikçi çözümlerimizle projelerinizi eksiksiz tamamlıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Wrench, title: "Uzman Ekip", desc: "Alanında deneyimli sertifikalı personeller." },
              { icon: Settings, title: "Kaliteli İşçilik", desc: "Uzun ömürlü ve güvenli tesisat garantisi." },
              { icon: Zap, title: "Hızlı Servis", desc: "İhtiyaç anında anında profesyonel müdahale." },
              { icon: Clock, title: "Hızlı Garanti", desc: "Tüm aşamalarda koşulsuz destek ve garanti." },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10 text-[#02529C]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-xs px-4">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TAMAMLANAN PROJELER BÖLÜMÜ (Dinamik Veritabanı Bağlantılı) */}
      <section id="faaliyetler" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tamamlanan Projelerimiz</h2>
          
          {completedProjects.length === 0 ? (
            <p className="text-center text-gray-500 font-medium">Henüz sergilenecek tamamlanmış bir proje bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {completedProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer border border-gray-100 flex flex-col">
                  
                  {/* Proje Görseli */}
                  <div className="overflow-hidden h-56 bg-gray-100 flex items-center justify-center relative">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      // Eğer admin bilerek görsel yüklemediyse şık bir boşluk gösterilir
                      <div className="text-gray-400 flex flex-col items-center">
                        <FolderKanban className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-semibold">Görsel Bulunmuyor</span>
                      </div>
                    )}
                    
                    {/* Üzerine gelince çıkan ince detay */}
                    <div className="absolute inset-0 bg-[#02529C]/0 group-hover:bg-[#02529C]/10 transition-colors duration-300"></div>
                  </div>

                  {/* Proje Başlığı ve Lokasyonu */}
                  <div className="p-5 text-center border-t border-gray-100 flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{project.title}</h4>
                    {project.location && (
                      <p className="text-xs text-gray-500 font-medium">📍 {project.location}</p>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* YENİ EKLENEN BÖLÜM: ENERJİ HESAPLAYICI */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Güneş Enerjisi Tasarruf Hesaplayıcı</h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
              Elektrik faturanıza ve bulunduğunuz bölgeye göre ne kadar tasarruf edeceğinizi hemen hesaplayın.
            </p>
          </div>
          {/* Hesaplayıcı Bileşenini Buraya Çağırıyoruz */}
          <EnergyCalculator />
        </div>
      </section>

      {/* 5. İLETİŞİM BİLGİLERİ (Mavi Alt Kısım) */}
      <section id="iletisim" className="bg-[#02529C] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            
            {/* Sol Kısım: İletişim Bilgileri */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Merkez Ofis Bilgileri</h2>
                <p className="text-blue-100 mb-12 leading-relaxed text-lg">
                  Elektrik ve inşaat projeleriniz için bize aşağıdaki kanallardan ulaşabilir veya ofisimizi ziyaret edebilirsiniz.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 text-white">
                  
                  {/* Adres */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#FFC107] shrink-0 shadow-inner">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Adres</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Yaşardoğu, Şehit Tuncay Karataş Bulvarı<br/>
                       No:40, 55050<br/>
                        İlkadım / Samsun
                      </p>
                    </div>
                  </div>

                  {/* Telefon */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#FFC107] shrink-0 shadow-inner">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Telefon</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        +90 (850) 123 45 67<br/>
                        +90 (555) 987 65 43
                      </p>
                    </div>
                  </div>

                  {/* Çalışma Saatleri */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#FFC107] shrink-0 shadow-inner">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Çalışma Saatleri</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Pzt - Cmt: 08:30 - 18:30<br/>
                        Teknik Servis: <span className="text-[#FFC107] font-bold">7/24 Aktif</span>
                      </p>
                    </div>
                  </div>

                  {/* E-Posta */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#FFC107] shrink-0 shadow-inner">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">E-Posta</h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        info@sozenenerji.com<br/>
                        destek@sozenenerji.com
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Footer Yazıları */}
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-blue-200 text-sm gap-4">
                <div className="flex gap-6 font-medium">
                  <a href="/" className="hover:text-white transition-colors">Anasayfa</a>
                  <a href="/hizmetler" className="hover:text-white transition-colors">Hizmetler</a>
                  <a href="/yenilenebilir" className="hover:text-white transition-colors">Yenilenebilir</a>
                </div>
                <div className="font-medium text-center sm:text-right">Sözen Enerji Elektrik & İnşaat - Copyright © 2026</div>
              </div>
            </div>
            
            {/* Sağ Kısım: Harita */}
            <div className="h-full min-h-[450px] lg:min-h-full bg-gray-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.44026058646097!2d36.32091074417883!3d41.26437418165213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4087d9264eed768b%3A0xbff58871b30cda09!2sORTAKLAR%20APARTMANI!5e0!3m2!1str!2str!4v1780858554476!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
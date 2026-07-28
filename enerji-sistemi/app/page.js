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
    // dark:bg-slate-950 ve transition eklendi
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar />

      {/* 1. HERO (Ana Karşılama) BÖLÜMÜ */}
      <section className="relative bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="flex flex-col md:flex-row h-auto md:h-[550px]">
          {/* Sol Mavi Kısım - Karanlık modda dark:bg-slate-900 */}
          <div className="w-full md:w-1/2 bg-[#02529C] dark:bg-slate-900 p-10 md:p-20 flex flex-col justify-center z-10 transition-colors duration-300">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-slate-100 leading-tight mb-6 transition-colors">
              Geleceğin Enerjisini<br />Bugün Kuruyoruz
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-lg mb-10 max-w-lg transition-colors">
              Güvenilir Elektrik Hizmetleri ve Yenilikçi Enerji Çözümleri
            </p>
            {/* DİJİTAL YÖNLENDİRME BUTONLARI */}
            <div className="flex flex-wrap gap-4">
              {/* Müşteri Paneli Girişi - Sarı Buton */}
              <Link href="/login" className="bg-[#FFC107] dark:bg-amber-500 text-gray-900 font-black px-8 py-4 rounded hover:bg-yellow-500 dark:hover:bg-amber-400 transition-colors shadow-md flex items-center gap-2">
                <Settings className="w-5 h-5 animate-spin-slow" /> Müşteri Paneli Girişi
              </Link>
              
              {/* Tamamlanan Projeler - Beyaz Buton */}
              <Link href="/tamamlanan-projeler" className="bg-white dark:bg-slate-800 text-[#02529C] dark:text-slate-100 font-bold px-8 py-4 rounded border border-transparent dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-md flex items-center gap-2">
                <FolderKanban className="w-5 h-5 dark:text-blue-400" /> Tamamlanan Projeler
              </Link>
            </div>
          </div>

          {/* Sağ Görsel Kısım */}
          <div className="w-full md:w-1/2 relative h-[350px] md:h-auto bg-gray-200 dark:bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
              alt="Elektrik Panosu ve Sistemleri"
              className="w-full h-full object-cover opacity-90 dark:opacity-75 transition-opacity"
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
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-none border border-transparent dark:border-slate-700 p-8 text-center flex flex-col items-center border-b-4 hover:border-b-[#FFC107] dark:hover:border-b-amber-500 transition-all cursor-pointer group">
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <item.icon className="w-12 h-12 text-[#02529C] dark:text-blue-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEDEN BİZ? BÖLÜMÜ */}
      <section className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Neden Biz?</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-3 text-sm max-w-xl mx-auto transition-colors">
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
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-center mb-6 transition-colors">
                  <feature.icon className="w-10 h-10 text-[#02529C] dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-xs px-4 transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* 4. FAALİYET ALANLARIMIZ BÖLÜMÜ (Sabit Projeler) */}
      <section id="faaliyetler" className="py-20 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 text-center mb-12 transition-colors">Faaliyet Alanlarımız</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Modern Ofis Aydınlatması", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
              { title: "Modern Ofis Santrali", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2069&auto=format&fit=crop" },
              { title: "Güneş Enerjisi Santrali", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop" },
              { title: "Fabrika Otomasyonu", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop" },
              { title: "Konut Güneş Paneli", img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2058&auto=format&fit=crop" },
              { title: "Şantiye Altyapısı", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop" },
            ].map((project, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm group cursor-pointer border border-gray-100 dark:border-slate-700 transition-colors">
                <div className="overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img src={project.img} alt={project.title} className="w-full h-56 object-cover opacity-90 dark:opacity-80 group-hover:scale-105 transition-all duration-500 group-hover:opacity-100" />
                </div>
                <div className="p-4 text-center border-t border-gray-100 dark:border-slate-700 transition-colors">
                  <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-sm transition-colors">{project.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 5. ENERJİ HESAPLAYICI */}
      <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Güneş Enerjisi Tasarruf Hesaplayıcı</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-3 text-sm max-w-xl mx-auto transition-colors">
              Elektrik faturanıza ve bulunduğunuz bölgeye göre ne kadar tasarruf edeceğinizi hemen hesaplayın.
            </p>
          </div>
          {/* Hesaplayıcı Bileşenini Buraya Çağırıyoruz */}
          <EnergyCalculator />
        </div>
      </section>

      {/* 6. İLETİŞİM BİLGİLERİ (Mavi Alt Kısım) */}
      <section id="iletisim" className="bg-[#02529C] dark:bg-slate-900 border-t-0 dark:border-t dark:border-slate-800 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            
            {/* Sol Kısım: İletişim Bilgileri */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white dark:text-slate-100 mb-4 transition-colors">Merkez Ofis Bilgileri</h2>
                <p className="text-blue-100 dark:text-slate-300 mb-12 leading-relaxed text-lg transition-colors">
                  Elektrik ve inşaat projeleriniz için bize aşağıdaki kanallardan ulaşabilir veya ofisimizi ziyaret edebilirsiniz.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 text-white dark:text-slate-200">
                  
                  {/* Adres */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#FFC107] dark:text-amber-400 shrink-0 shadow-inner transition-colors">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Adres</h3>
                      <p className="text-blue-100 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                        Yaşardoğu, Şehit Tuncay Karataş Bulvarı<br/>
                        No:40, 55050<br/>
                        İlkadım / Samsun
                      </p>
                    </div>
                  </div>

                  {/* Telefon */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#FFC107] dark:text-amber-400 shrink-0 shadow-inner transition-colors">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Telefon</h3>
                      <p className="text-blue-100 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                        +90 (850) 123 45 67<br/>
                        +90 (555) 987 65 43
                      </p>
                    </div>
                  </div>

                  {/* Çalışma Saatleri */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#FFC107] dark:text-amber-400 shrink-0 shadow-inner transition-colors">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Çalışma Saatleri</h3>
                      <p className="text-blue-100 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                        Pzt - Cmt: 08:30 - 18:30<br/>
                        Teknik Servis: <span className="text-[#FFC107] dark:text-amber-400 font-bold">7/24 Aktif</span>
                      </p>
                    </div>
                  </div>

                  {/* E-Posta */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#FFC107] dark:text-amber-400 shrink-0 shadow-inner transition-colors">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">E-Posta</h3>
                      <p className="text-blue-100 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                        info@sozenenerji.com<br/>
                        destek@sozenenerji.com
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              
              {/* Footer Yazıları */}
              <div className="mt-16 pt-8 border-t border-white/10 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-blue-200 dark:text-slate-500 text-sm gap-4 transition-colors">
                <div className="flex gap-6 font-medium">
                  <a href="/" className="hover:text-white dark:hover:text-slate-300 transition-colors">Anasayfa</a>
                  <a href="/hizmetler" className="hover:text-white dark:hover:text-slate-300 transition-colors">Hizmetler</a>
                  <a href="/yenilenebilir" className="hover:text-white dark:hover:text-slate-300 transition-colors">Yenilenebilir</a>
                </div>
                <div className="font-medium text-center sm:text-right">Sözen Enerji Elektrik & İnşaat - Copyright © 2026</div>
              </div>
            </div>
            
            {/* Sağ Kısım: Harita */}
            <div className="h-full min-h-[450px] lg:min-h-full bg-gray-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 dark:border-slate-800 relative transition-colors">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187.44026058646097!2d36.32091074417883!3d41.26437418165213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4087d9264eed768b%3A0xbff58871b30cda09!2sORTAKLAR%20APARTMANI!5e0!3m2!1str!2str!4v1780858554476!5m2!1str!2str" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-90 dark:opacity-80 transition-opacity"
              >
            </iframe>
          </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
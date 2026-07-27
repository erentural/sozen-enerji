"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Calendar, MapPin, Zap, ArrowLeft, ShieldCheck, Award, Leaf, PhoneCall, CheckCircle2 } from "lucide-react";

export default function ProjeDetayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProjectDetail = async () => {
      try {
        const res = await fetch(`/api/public/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Proje detayları yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium text-lg">Proje detayları yükleniyor...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-lg">Proje bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#02529C] selection:text-white">
      <Navbar />

      {/* Üst Banner / Görsel Alanı */}
      <div className="relative h-[500px] bg-slate-900 overflow-hidden">
        <img 
          src={project.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"} 
          alt={project.title}
          className="w-full h-full object-cover opacity-50 scale-105 animate-in fade-in zoom-in-105 duration-1000"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="absolute bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm font-bold transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-xl w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Projelere Dön
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#10B981] text-white text-[11px] font-black tracking-widest uppercase px-4 py-2 rounded-lg shadow-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> %100 Teslim Edildi
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {project.title}
          </h1>
        </div>
      </div>

      {/* İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sol Kolon: Detaylı Açıklama (Grid 8) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Yönetici Özeti Kutusu */}
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              Genel Bakış
            </h2>
            
            {/* Açıklama kısa bile olsa şık görünmesi için Quote/Highlight tarzı tasarım */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#02529C] to-blue-400 rounded-full"></div>
              <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed pl-8 py-2 whitespace-pre-line">
                {project.description || "Proje detayları güncelleniyor."}
              </p>
            </div>
          </div>

          {/* Sözen Enerji Standartları Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#02529C] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-3">Yüksek Verimlilik</h4>
              <p className="text-slate-500 font-medium leading-relaxed">
                Uluslararası IEC standartlarına uygun, maksimum performans odaklı mühendislik çözümleri.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#02529C] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-7 h-7" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-3">Garantili İşçilik</h4>
              <p className="text-slate-500 font-medium leading-relaxed">
                Sözen Enerji kalite güvencesiyle alanında uzman sertifikalı ekipler tarafından kurulum.
              </p>
            </div>

          </div>
        </div>

        {/* Sağ Kolon: Künye ve Teklif Kutusu (Grid 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Proje Künyesi (Modern Tablo Görünümü) */}
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="font-black text-slate-900 text-xl mb-8">Proje Künyesi</h3>
            
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-[#02529C] group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teslim Tarihi</p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100"></div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-[#02529C] group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operasyon Bölgesi</p>
                  <p className="text-sm font-bold text-slate-900 leading-snug">
                    {project.location || "Adres Belirtilmedi"}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100"></div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-[#02529C] group-hover:text-white transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hizmet Sınıfı</p>
                  <p className="text-sm font-bold text-slate-900">Endüstriyel Enerji Çözümleri</p>
                </div>
              </div>

            </div>
          </div>

          {/* Premium CTA (Call to Action) Kutusu */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#02529C] to-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-900/20">
            {/* Dekoratif Arka Plan Halkaları */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6 text-blue-200" />
              </div>
              <h3 className="font-black text-2xl mb-3">Benzer Bir Projeniz mi Var?</h3>
              <p className="text-sm text-blue-100/80 font-medium mb-8 leading-relaxed">
                İşletmenizin enerji maliyetlerini düşürmek ve verimliliğini artırmak için uzman mühendis kadromuzla ücretsiz keşif planlayın.
              </p>
              
              <button 
                onClick={() => router.push('/teklif-al')} 
                className="w-full bg-white hover:bg-slate-50 text-[#02529C] text-sm font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Projenizi Görüşelim
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
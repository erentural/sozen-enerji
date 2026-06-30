"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Calendar, MapPin, Zap, ArrowLeft, ShieldCheck, Award } from "lucide-react";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Proje detayları yükleniyor...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-red-500">Proje bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Üst Banner / Görsel Alanı */}
      <div className="relative h-[450px] bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Projelere Geri Dön
          </button>
          <span className="bg-green-500 text-white text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-md shadow-sm inline-block mb-3">
            ✓ Anahtar Teslim Kurulum
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{project.title}</h1>
        </div>
      </div>

      {/* İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Sol 2 Kolon: Detaylı Açıklama */}
        <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Proje Hakkında Genel Bakış</h2>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-gray-900">Yüksek Enerji Verimliliği</h4>
                <p className="text-sm text-gray-500 mt-0.5">Uluslararası standartlara uygun mühendislik çözümleri.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Award className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-gray-900">Garantili İşçilik</h4>
                <p className="text-sm text-gray-500 mt-0.5">Sözen Enerji güvencesiyle 2 yıl tam sistem desteği.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ 1 Kolon: Künye ve Teklif Kutusu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Proje Künyesi</h3>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Teslim Tarihi</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(project.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Operasyon Bölgesi</p>
                <p className="text-sm font-bold text-gray-900">Merkez / Saha Kurulumu</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hizmet Sınıfı</p>
                <p className="text-sm font-bold text-slate-800">Endüstriyel Enerji Çözümleri</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-6 rounded-xl text-white text-center shadow-lg">
            <h3 className="font-bold text-lg mb-2">Benzer Bir Projeniz mi Var?</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">Uzman mühendis kadromuzla şirketiniz için en verimli enerji çözümlerini planlayalım.</p>
            <button onClick={() => router.push('/randevular')} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-lg shadow transition-colors">
              Hemen Randevu Alın
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
// YENİ: Modal içinde kullanacağımız X, Calendar, MapPin ve Zap ikonlarını ekledik
import { CheckCircle2, ChevronRight, X, Calendar, MapPin, Zap } from "lucide-react"; 

export default function TamamlananProjelerPage() {
  const [completedProjects, setCompletedProjects] = useState([]);
  
  // YENİ: Hangi projenin detayına tıklandığını aklında tutacak hafıza (State)
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/public/projects");
        if (res.ok) {
          const data = await res.json();
          setCompletedProjects(data);
        }
      } catch (error) {
        console.error("Projeler yüklenemedi", error);
      }
    };
    fetchProjects();
  }, []);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Navbar />
      
      {/* Sayfa Üst Bilgi Alanı */}
      <div className="bg-[#02529C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-white mb-4">Tamamlanan Projelerimiz</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Sözen Enerji güvencesiyle başarıyla teslim edilmiş projelerimizin güncel listesi.
          </p>
        </div>
      </div>

      {/* Dinamik Projeler Listesi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {completedProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 font-medium text-lg">Sistemde şu an %100 olarak tamamlanmış güncel proje bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completedProjects.map((project, i) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)} // YENİ: Karta tıklandığında projeyi hafızaya al
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 cursor-pointer flex flex-col"
              >
                <div className="overflow-hidden relative h-64">
                  <img src={placeholderImages[i % placeholderImages.length]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Teslim Edildi
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="font-bold text-gray-900 text-xl mb-3">{project.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <span className="text-[#02529C] text-sm font-bold flex items-center gap-1 group-hover:text-[#FFC107] transition-colors">
                      Proje Detayı <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YENİ: PROFESYONEL PROJE DETAY MODALI */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10 shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Sol Taraf: Proje Görseli */}
              <div className="h-64 md:h-full min-h-[300px] bg-slate-200 relative">
                {/* Modal içinde de karta karşılık gelen aynı resmi gösteriyoruz */}
                <img 
                  src={placeholderImages[completedProjects.findIndex(p => p.id === selectedProject.id) % placeholderImages.length]} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-4 h-4" /> Teslim Edildi
                </div>
              </div>

              {/* Sağ Taraf: Proje Detayları */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {selectedProject.title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Teknik Detaylar */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tamamlanma</p>
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(selectedProject.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <MapPin className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lokasyon</p>
                    <p className="text-sm font-bold text-slate-900">Merkez Şube</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2 flex items-center gap-3">
                    <div className="bg-[#02529C]/10 p-2 rounded-lg text-[#02529C]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Kurum Standartları</p>
                      <p className="text-sm font-bold text-slate-900">Sözen Enerji Kalite Güvencesi</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = "/iletisim"}
                  className="w-full bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                  Benzer Bir Proje İçin Teklif Al
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
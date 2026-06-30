"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ChevronRight } from "lucide-react"; 
import Link from "next/link"; // Link bileşenini ekledik

export default function TamamlananProjelerPage() {
  const [completedProjects, setCompletedProjects] = useState([]);
  
  // NOT: Modal kullanmayacağımız için selectedProject state'ini tamamen sildik.

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
              
              // DİKKAT: Buradaki <div> etiketini <Link> olarak değiştirdik ve href ekledik!
              <Link 
                key={project.id} 
                href={`/projeler/${project.id}`} // Tıklanan projenin kendi sayfasına gider
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
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* NOT: Ekranın en altındaki o uzun Modal kodlarını tamamen sildik çünkü artık ayrı sayfaya gidiyoruz. */}
    </div>
  );
}
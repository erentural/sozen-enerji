"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ChevronRight, Image as ImageIcon } from "lucide-react"; 
import Link from "next/link"; 

export default function TamamlananProjelerPage() {
  const [completedProjects, setCompletedProjects] = useState([]);
  
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

  return (
    // dark:bg-slate-950 ve transition-colors eklendi
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans relative transition-colors duration-300">
      <Navbar />
      
      {/* Sayfa Üst Bilgi Alanı */}
      <div className="bg-[#02529C] dark:bg-slate-900 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-white dark:text-slate-100 mb-4 transition-colors">Tamamlanan Projelerimiz</h1>
          <p className="text-blue-100 dark:text-slate-300 text-lg max-w-2xl mx-auto transition-colors">
            Sözen Enerji güvencesiyle başarıyla teslim edilmiş projelerimizin güncel listesi.
          </p>
        </div>
      </div>

      {/* Dinamik Projeler Listesi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {completedProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors duration-300">
            <p className="text-gray-500 dark:text-slate-400 font-medium text-lg transition-colors">Sistemde şu an %100 olarak tamamlanmış güncel proje bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completedProjects.map((project) => (
              
              <Link 
                key={project.id} 
                href={`/projeler/${project.id}`} 
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md dark:shadow-none hover:shadow-xl border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* GÜNCELLENEN KISIM: Gerçek Proje Görseli Gösterimi */}
                <div className="overflow-hidden relative h-64 bg-gray-100 dark:bg-slate-700 transition-colors">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-100 dark:opacity-80 group-hover:opacity-100" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-slate-500 group-hover:scale-105 transition-transform duration-700">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-xs font-medium">Görsel Eklenmemiş</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-green-500 dark:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Teslim Edildi
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col transition-colors">
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 text-xl mb-3 transition-colors">{project.title}</h4>
                  <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 transition-colors">{project.description}</p>
                  <div className="mt-auto border-t border-gray-100 dark:border-slate-700 pt-4 transition-colors">
                    <span className="text-[#02529C] dark:text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:text-[#FFC107] dark:group-hover:text-amber-400 transition-colors">
                      Proje Detayı <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
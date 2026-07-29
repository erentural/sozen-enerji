"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Phone } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle"; 

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname(); 

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Yenilenebilir Enerji", href: "/yenilenebilir" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-800/50 font-sans sticky top-0 z-50 transition-colors duration-300 border-b border-transparent dark:border-slate-800">
      
      {/* 1. Üst İletişim Bandı */}
      <div className="bg-gray-50 dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 py-2 px-6 lg:px-12 flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <div className="hidden md:block">
          Güvenilir Elektrik ve Yenilenebilir Enerji Çözümleri
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold ml-auto">
          <Phone className="w-3.5 h-3.5 text-[#02529C] dark:text-blue-400" />
          7/24 Destek: 444 0 123
        </div>
      </div>

      {/* 2. Ana Menü */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          
          {/* GERÇEK KURUMSAL LOGO ALANI */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            
            {/* icon.png Görseli */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md border border-gray-100 dark:border-slate-700 shrink-0 group-hover:shadow-lg transition-all duration-300 bg-white">
              <img 
                src="/icon.png" 
                alt="Sözen Enerji Logo" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Orijinal Logoya Uygun Serif Tipografi */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-[#02529C] dark:text-slate-100 transition-colors">
                SÖZEN ENERJİ
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-4 h-[2px] bg-[#FFC107] dark:bg-amber-400"></div>
                <p className="text-[9px] sm:text-[10px] font-sans font-semibold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase leading-none mt-0.5">
                  Elektrik & İnşaat
                </p>
              </div>
            </div>

          </Link>

          {/* Orta Kısım: Sayfa Linkleri */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center mx-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`relative text-sm transition-colors whitespace-nowrap group ${
                    isActive 
                      ? "text-[#02529C] dark:text-blue-400 font-bold" 
                      : "text-gray-600 dark:text-gray-300 hover:text-[#02529C] dark:hover:text-blue-400 font-medium"
                  }`}
                >
                  {link.name}
                  {/* Modern Alt Çizgi Animasyonu */}
                  <span 
                    className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-full bg-[#FFC107]" : "w-0 bg-[#02529C] dark:bg-blue-400 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Sağ Kısım: Aksiyon Butonları */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            <Link 
              href="/teklif-al" 
              className="hidden md:flex px-5 py-2.5 text-sm font-bold text-slate-900 bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors whitespace-nowrap shadow-sm"
            >
              Fiyat Teklifi Al
            </Link>

            <Link 
              href="/admin-login" 
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 dark:text-slate-400 hover:text-[#02529C] dark:hover:text-blue-400 transition-colors whitespace-nowrap" 
              title="Yönetici Girişi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="hidden xl:inline">Yönetici</span>
            </Link>

            <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 transition-colors"></div>

            <Link 
              href="/login" 
              className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#02529C] border border-[#02529C] dark:border-blue-600 dark:bg-blue-600 rounded-md hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
            >
              Müşteri Girişi
            </Link>

            {/* TEMA DEĞİŞTİRME BUTONU */}
            <ThemeToggle />

          </div>
        </div>
      </div>
    </nav>
  );
}
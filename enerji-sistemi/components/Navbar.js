"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Zap, Phone, UserCircle } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // Şu anki sayfanın yolunu (URL) alır

  // Menü linklerimizi bir dizi (array) içinde tanımlıyoruz ki yönetmesi kolay olsun
  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Mağaza", href: "/urunler" },
    { name: "Yenilenebilir Enerji", href: "/yenilenebilir" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ];

  return (
    <nav className="bg-white shadow-sm font-sans sticky top-0 z-50">
      {/* 1. Üst İletişim Bandı */}
      <div className="bg-gray-50 border-b border-gray-100 py-2 px-6 lg:px-12 flex justify-between items-center text-xs font-medium text-gray-500">
        <div className="hidden md:block">
          Güvenilir Elektrik ve Yenilenebilir Enerji Çözümleri
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-bold ml-auto">
          <Phone className="w-3.5 h-3.5 text-[#02529C]" />
          7/24 Destek: 444 0 123
        </div>
      </div>

      {/* 2. Ana Menü */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo Alanı */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="text-5xl font-black text-[#02529C] italic tracking-tighter">V</span>
              <Zap className="w-6 h-6 text-[#FFC107] absolute -right-3 top-1 fill-[#FFC107]" />
            </div>
           {/* SÖZEN ENERJİ LOGOSU */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#02529C] rounded-xl flex items-center justify-center shadow-inner">
                <Zap className="w-6 h-6 text-[#FFC107] fill-[#FFC107]" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-black text-[#02529C] leading-none tracking-tight">
                  SÖZEN<span className="text-[#FFC107]">ENERJİ</span>
                </h1>
                <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase mt-0.5">Elektrik & İnşaat</p>
              </div>
            </div>
          </Link>

          {/* Orta Kısım: Sayfa Linkleri (Sadece Masaüstü) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              // Eğer şu anki URL, linkin href değeri ile aynıysa aktif kabul et
              const isActive = pathname === link.href;
              
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`pb-1 transition-colors border-b-2 ${
                    isActive 
                      ? "text-[#02529C] font-bold border-[#FFC107]" // Aktif sayfa stilleri (Sarı çizgi ve Lacivert kalın yazı)
                      : "text-gray-700 hover:text-[#02529C] font-semibold border-transparent" // Pasif sayfa stilleri
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Sağ Kısım: Aksiyon Butonları */}
          <div className="flex items-center gap-4 lg:gap-6">
  
              {/* FİYAT TEKLİFİ AL BUTONU */}
              <Link 
                href="/teklif" 
                className="hidden md:flex px-5 py-2.5 text-sm font-bold text-slate-900 bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors whitespace-nowrap shadow-sm"
              >
                Fiyat Teklifi Al
              </Link>

            {/* YÖNETİCİ GİRİŞİ (Daha zarif, sadece ikon ve ince metin) */}
              <Link 
                href="/admin/login" 
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap" 
                title="Yönetici Girişi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span className="hidden xl:inline">Yönetici</span>
              </Link>
              {/* ZARİF BİR AYIRAÇ ÇİZGİSİ */}
                <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
             : (
              <Link 
                href="/login" 
                className="text-gray-400 hover:text-[#02529C] font-semibold text-sm transition-colors ml-2 flex items-center gap-1"
                title="Müşteri Portalı Girişi"
              >
                Giriş
              </Link>
            )
            <div className="flex items-center gap-4">
              {/* YÖNETİCİ GİRİŞİ: Sadece ince bir kilit ikonu veya "Yönetici" yazısı */}
              <Link href="/admin/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors" title="Yönetici Girişi">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <span className="hidden sm:inline">Yönetici</span>
              </Link>

              {/* DİKEY ÇİZGİ AYIRAÇ */}
              <div className="w-px h-6 bg-gray-300"></div>

              {/* MÜŞTERİ GİRİŞİ (Tek satıra zorlanmış, mavi arka planlı belirgin buton) */}
              <Link 
                href="/login" 
                className="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Müşteri Girişi
              </Link>

            </div>
                        
          </div>
        </div>
      </div>
    </nav>
  );
}
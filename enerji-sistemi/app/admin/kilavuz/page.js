"use client";

import React from 'react';
import { useTheme } from "../ThemeContext"; // Global Tema Context'i
import { BookOpen, Mail, Package, FolderKanban, CalendarDays } from "lucide-react";

export default function GuidePage() {
  const { currentTheme } = useTheme();

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 pb-20 font-sans transition-colors duration-300">
      
      {/* Sayfa Başlığı */}
      <header className="mb-10 border-b border-slate-200 dark:border-slate-700 pb-6 transition-colors duration-300">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3 transition-colors">
          <BookOpen className={`w-8 h-8 ${currentTheme.text}`} /> Sistem Kullanım Kılavuzu
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">
          EnerjiPanel yönetim sistemini tam verimle kullanmak için detaylı modül rehberi.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {/* MESAJLAR MODÜLÜ */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 group">
          <h2 className={`text-2xl font-black flex items-center gap-3 mb-6 transition-colors ${currentTheme.text}`}>
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20`}>
              <Mail className="w-6 h-6" />
            </div>
            Mesajlar Yönetimi
          </h2>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed text-base transition-colors marker:text-slate-400 dark:marker:text-slate-500">
            <li><strong className="text-slate-900 dark:text-white transition-colors">Müşteri İletişimi:</strong> Web sitesindeki iletişim formundan gönderilen tüm mesajlar bu ekrana düşer.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Okunma Durumu:</strong> Yeni gelen mesajları kalın (bold) harflerle görürsünüz. İncelediğiniz mesajları "Okundu" olarak işaretleyerek takibini kolaylaştırabilirsiniz.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Arşivleme:</strong> Yanıtlanan veya işlemi biten mesajları silerek gelen kutunuzu temiz tutabilirsiniz.</li>
          </ul>
        </div>

        {/* ÜRÜNLER MODÜLÜ */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 group">
          <h2 className={`text-2xl font-black flex items-center gap-3 mb-6 transition-colors ${currentTheme.text}`}>
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20`}>
              <Package className="w-6 h-6" />
            </div>
            Ürünler & Katalog
          </h2>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed text-base transition-colors marker:text-slate-400 dark:marker:text-slate-500">
            <li><strong className="text-slate-900 dark:text-white transition-colors">Katalog Güncelleme:</strong> "Yeni Ürün Ekle" butonu ile web sitenizin vitrinine anında yeni ürünler, resimler ve teknik detaylar ekleyebilirsiniz.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Stok & Fiyat:</strong> Ürünlerin fiyatlarını veya stok durumlarını düzenleyip kaydederek müşterilerinize her zaman güncel bilgi sunarsınız.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Kategori Yönetimi:</strong> Ürünleri Güneş Panelleri, İnvertörler gibi doğru kategorilere atayarak sitedeki filtrelemelerin düzgün çalışmasını sağlarsınız.</li>
          </ul>
        </div>

        {/* PROJELER MODÜLÜ */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 group">
          <h2 className={`text-2xl font-black flex items-center gap-3 mb-6 transition-colors ${currentTheme.text}`}>
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20`}>
              <FolderKanban className="w-6 h-6" />
            </div>
            Projeler & İşler
          </h2>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed text-base transition-colors marker:text-slate-400 dark:marker:text-slate-500">
            <li><strong className="text-slate-900 dark:text-white transition-colors">Referans Ekleme:</strong> Tamamladığınız başarılı projeleri (örn: 100kW Çatı GES Projesi) görselleriyle birlikte buraya ekleyerek web sitenizin "Projelerimiz" sayfasında sergileyebilirsiniz.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Aktif İş Takibi:</strong> Şu an sahada devam eden projelerin durumlarını güncelleyerek merkez ofis ile saha arasındaki koordinasyonu sağlayabilirsiniz.</li>
          </ul>
        </div>

        {/* RANDEVULAR MODÜLÜ */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 group">
          <h2 className={`text-2xl font-black flex items-center gap-3 mb-6 transition-colors ${currentTheme.text}`}>
            <div className={`p-2.5 rounded-2xl ${currentTheme.bg} bg-opacity-10 dark:bg-opacity-20`}>
              <CalendarDays className="w-6 h-6" />
            </div>
            Randevular & Talepler
          </h2>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed text-base transition-colors marker:text-slate-400 dark:marker:text-slate-500">
            <li><strong className="text-slate-900 dark:text-white transition-colors">Keşif Talepleri:</strong> Web sitesinden ücretsiz keşif veya danışmanlık talep eden müşterilerin formları bu modülde listelenir.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">Durum Yönetimi:</strong> Gelen talepleri "Bekliyor", "Onaylandı" veya "Tamamlandı" olarak işaretleyerek operasyon takvimini kusursuz yönetebilirsiniz.</li>
            <li><strong className="text-slate-900 dark:text-white transition-colors">İletişim Hızı:</strong> Randevu detayına girerek müşterinin telefon numarasına veya adresine tek tıkla ulaşabilirsiniz.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
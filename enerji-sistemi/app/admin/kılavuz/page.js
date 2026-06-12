import React from 'react';

export const metadata = {
  title: 'Kullanım Kılavuzu | EnerjiPanel',
};

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 pb-20">
      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-800 mb-2">📖 Sistem Kullanım Kılavuzu</h1>
        <p className="text-slate-500 text-lg">EnerjiPanel yönetim sistemini tam verimle kullanmak için detaylı modül rehberi.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {/* MESAJLAR MODÜLÜ */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-4">
            ✉️ Mesajlar Yönetimi
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-3 leading-relaxed text-base">
            <li><strong>Müşteri İletişimi:</strong> Web sitesindeki iletişim formundan gönderilen tüm mesajlar bu ekrana düşer.</li>
            <li><strong>Okunma Durumu:</strong> Yeni gelen mesajları kalın (bold) harflerle görürsünüz. İncelediğiniz mesajları "Okundu" olarak işaretleyerek takibini kolaylaştırabilirsiniz.</li>
            <li><strong>Arşivleme:</strong> Yanıtlanan veya işlemi biten mesajları silerek gelen kutunuzu temiz tutabilirsiniz.</li>
          </ul>
        </div>

        {/* ÜRÜNLER MODÜLÜ */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2 mb-4">
            📦 Ürünler & Katalog
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-3 leading-relaxed text-base">
            <li><strong>Katalog Güncelleme:</strong> "Yeni Ürün Ekle" butonu ile web sitenizin vitrinine anında yeni ürünler, resimler ve teknik detaylar ekleyebilirsiniz.</li>
            <li><strong>Stok & Fiyat:</strong> Ürünlerin fiyatlarını veya stok durumlarını düzenleyip kaydederek müşterilerinize her zaman güncel bilgi sunarsınız.</li>
            <li><strong>Kategori Yönetimi:</strong> Ürünleri Güneş Panelleri, İnvertörler gibi doğru kategorilere atayarak sitedeki filtrelemelerin düzgün çalışmasını sağlarsınız.</li>
          </ul>
        </div>

        {/* PROJELER MODÜLÜ */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-amber-500 flex items-center gap-2 mb-4">
            🏗️ Projeler & İşler
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-3 leading-relaxed text-base">
            <li><strong>Referans Ekleme:</strong> Tamamladığınız başarılı projeleri (örn: 100kW Çatı GES Projesi) görselleriyle birlikte buraya ekleyerek web sitenizin "Projelerimiz" sayfasında sergileyebilirsiniz.</li>
            <li><strong>Aktif İş Takibi:</strong> Şu an sahada devam eden projelerin durumlarını güncelleyerek merkez ofis ile saha arasındaki koordinasyonu sağlayabilirsiniz.</li>
          </ul>
        </div>

        {/* RANDEVULAR MODÜLÜ */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2 mb-4">
            📅 Randevular & Talepler
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-3 leading-relaxed text-base">
            <li><strong>Keşif Talepleri:</strong> Web sitesinden ücretsiz keşif veya danışmanlık talep eden müşterilerin formları bu modülde listelenir.</li>
            <li><strong>Durum Yönetimi:</strong> Gelen talepleri "Bekliyor", "Onaylandı" veya "Tamamlandı" olarak işaretleyerek operasyon takvimini kusursuz yönetebilirsiniz.</li>
            <li><strong>İletişim Hızı:</strong> Randevu detayına girerek müşterinin telefon numarasına veya adresine tek tıkla ulaşabilirsiniz.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
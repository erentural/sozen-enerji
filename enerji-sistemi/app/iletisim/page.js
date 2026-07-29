import Navbar from "@/components/Navbar";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function IletisimPage() {
  return (
    // dark:bg-slate-950 ve transition-colors eklendi
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Üst Başlık (Hero) */}
      <section className="bg-[#02529C] dark:bg-slate-900 py-20 text-center px-4 transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-slate-100 mb-4 transition-colors">Bizimle İletişime Geçin</h1>
        <p className="text-blue-100 dark:text-slate-300 max-w-2xl mx-auto text-lg transition-colors">Projeleriniz, talepleriniz ve teknik destek için 7/24 yanınızdayız.</p>
      </section>

      {/* İletişim Bilgileri Kutusu */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 mb-10 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-8 border-b pb-4 border-gray-100 dark:border-slate-700 transition-colors">Merkez Ofis Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Sol Kolon */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#02529C] dark:text-blue-400 shrink-0 mt-1 transition-colors" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 transition-colors">Adres</h4>
                  <p className="text-gray-600 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                    Yaşardoğu, Şehit Tuncay Karataş Bulvarı<br/>No:40, 55050<br/>İlkadım / Samsun
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#02529C] dark:text-blue-400 shrink-0 mt-1 transition-colors" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 transition-colors">Çalışma Saatleri</h4>
                  <p className="text-gray-600 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                    Pzt - Cmt: 08:30 - 18:30<br/>Teknik Servis: 7/24 Aktif
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#02529C] dark:text-blue-400 shrink-0 mt-1 transition-colors" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 transition-colors">Telefon</h4>
                  <p className="text-gray-600 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                    +90 (850) 123 45 67<br/>+90 (555) 987 65 43
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#02529C] dark:text-blue-400 shrink-0 mt-1 transition-colors" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100 transition-colors">E-Posta</h4>
                  <p className="text-gray-600 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                    info@sozenenerji.com<br/>destek@sozenenerji.com
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
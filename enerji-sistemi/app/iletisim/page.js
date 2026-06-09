import Navbar from "@/components/Navbar";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <section className="bg-[#02529C] py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Bizimle İletişime Geçin</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">Projeleriniz, talepleriniz ve teknik destek için 7/24 yanınızdayız.</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 border-gray-100">Merkez Ofis Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#02529C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Adres</h4>
                  <p className="text-gray-600 mt-1 leading-relaxed">Yaşardoğu, Şehit Tuncay Karataş BulvarıNo:40, 55050<br/>İlkadım / Samsun</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#02529C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Çalışma Saatleri</h4>
                  <p className="text-gray-600 mt-1 leading-relaxed">Pzt - Cmt: 08:30 - 18:30<br/>Teknik Servis: 7/24 Aktif</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#02529C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">Telefon</h4>
                  <p className="text-gray-600 mt-1 leading-relaxed">+90 (850) 123 45 67<br/>+90 (555) 987 65 43</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#02529C] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">E-Posta</h4>
                  <p className="text-gray-600 mt-1 leading-relaxed">info@sozenenerji.com<br/>destek@sozenenerji.com</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminRandevularPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // YENİ: Hangi randevu üzerinde işlem (mail gönderme) yapıldığını takip eden hafıza
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Randevular çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  // GELİŞTİRİLMİŞ Durum Güncelleme Fonksiyonu
  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoadingId(id); // İşlem başlar başlamaz o randevunun butonlarını kilitle

      // Not: Eğer bir önceki adımda oluşturduğumuz API dosyan app/api/appointments/[id] yolundaysa,
      // aşağıdaki fetch URL'ini `/api/appointments/${id}` olarak değiştirmelisin. 
      // Kendi API yapına göre burayı teyit et.
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Ekrandaki listeyi anında güncelle
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        ));
        
        // Zili güncellemesi için sinyal gönder
        window.dispatchEvent(new Event("notificationsUpdated"));

        // İşlem bittiğinde yöneticiye bilgi ver
        alert(`Müşteriye "${newStatus === 'APPROVED' ? 'Onay' : 'Red'}" e-postası başarıyla gönderildi!`);
      } else {
        const data = await res.json();
        alert("Hata: " + (data.error || "İşlem başarısız oldu."));
      }
    } catch (error) {
      console.error("Durum güncellenemedi", error);
      alert("Sistemsel bir bağlantı hatası oluştu.");
    } finally {
      setLoadingId(null); // İşlem bitince (başarılı veya başarısız) kilidi mutlaka aç
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-medium">Randevular yükleniyor...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Randevu Talepleri</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">Henüz hiç randevu talebi bulunmuyor.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className={`mt-1 shrink-0 p-2 rounded-lg ${
                    app.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {app.status === 'APPROVED' ? <CheckCircle className="w-5 h-5" /> :
                     app.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> : 
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{app.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Müşteri: <span className="font-semibold">{app.customer?.name || "Bilinmiyor"}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(app.date).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                {/* YENİ: Yüklenme Durumuna (loadingId) Göre Tepki Veren Butonlar */}
                <div className="flex items-center gap-3">
                  {app.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleStatusChange(app.id, "APPROVED")}
                        disabled={loadingId === app.id}
                        className={`px-4 py-2 border text-sm font-bold rounded transition-colors ${
                          loadingId === app.id 
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                            : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {loadingId === app.id ? "İşleniyor..." : "Onayla"}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                        disabled={loadingId === app.id}
                        className={`px-4 py-2 border text-sm font-bold rounded transition-colors ${
                          loadingId === app.id 
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" 
                            : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {loadingId === app.id ? "İşleniyor..." : "Reddet"}
                      </button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 text-sm font-bold rounded border ${
                      app.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {app.status === 'APPROVED' ? 'Onaylandı' : 'İptal Edildi'}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
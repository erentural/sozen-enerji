"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FolderKanban, CalendarDays, LogOut, FileDown, FileText, Download, PlusCircle, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CustomerPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({ projects: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  // Randevu Formu State'leri
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ subject: "", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // YENİ: Takvimin geçmişi seçmesini engellemek için şu anki zamanı hesapla
  const getLocalMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const minDateTime = getLocalMinDateTime();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCustomerData();
    }
  }, [status]);

  const fetchCustomerData = async () => {
    try {
      const res = await fetch("/api/customer/data");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Veriler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni Randevu Gönderme Fonksiyonu (GÜNCELLENDİ)
  const handleApptSubmit = async (e) => {
    e.preventDefault();
    
    // YENİ: Arayüz (Frontend) Güvenlik Kontrolü - Göndermeden önce tarihi son kez teyit et
    const secilenTarih = new Date(newAppt.date);
    const suAn = new Date();
    
    if (secilenTarih < suAn) {
      alert("Hata: Geçmiş bir tarihe veya saate randevu talebi oluşturamazsınız!");
      return; // İşlemi durdur, API'ye gönderme
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/customer/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAppt,
          email: session.user.email
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setNewAppt({ subject: "", date: "" });
        fetchCustomerData(); // Listeyi yenile
        // Admin zili için sinyal gönder
        window.dispatchEvent(new Event("notificationsUpdated"));
        alert("Randevu talebiniz başarıyla iletildi!");
      } else {
        const errorData = await res.json();
        alert("Hata: " + (errorData.error || "Randevu oluşturulamadı."));
      }
    } catch (error) {
      console.error("Randevu oluşturulamadı", error);
      alert("Sistemsel bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = (project) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("Enerji Sistemleri Proje Raporu", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString("tr-TR");
    doc.text(`Rapor Tarihi: ${dateStr}`, 14, 32);
    
    doc.setTextColor(0, 0, 0);
    doc.text(`Musteri: ${session?.user?.name}`, 14, 45);
    doc.text(`Proje Adi: ${project.title}`, 14, 53);
    doc.text(`Tamamlanma Orani: %${project.progress}`, 14, 61);

    autoTable(doc, {
      startY: 75,
      head: [['Proje Aciklamasi', 'Baslangic Tarihi', 'Guncel Durum']],
      body: [
        [project.description, new Date(project.createdAt).toLocaleDateString("tr-TR"), `%${project.progress} Tamamlandi`],
      ],
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Bu belge sistem tarafindan otomatik olarak olusturulmustur.", 14, finalY + 20);
    doc.save(`${project.title}_Durum_Raporu.pdf`);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Yükleniyor...</div>;
  }

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED": return "Onaylandı";
      case "REJECTED": return "İptal Edildi";
      case "COMPLETED": return "Tamamlandı";
      default: return "Onay Bekliyor";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-12">
        <h1 className="text-xl font-bold text-gray-900">Müşteri Takip Portalı</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            Hoş geldiniz, <span className="font-bold">{session?.user?.name}</span>
          </span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <LogOut className="w-4 h-4 mr-1" /> Çıkış
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FolderKanban className="w-5 h-5 mr-2 text-blue-600" /> Projelerinizin Durumu
            </h2>
            {data.projects.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">Adınıza tanımlı aktif bir proje bulunamadı.</p>
            ) : (
              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div key={project.id} className="border border-gray-100 p-5 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {project.progress === 100 ? "Tamamlandı" : "Devam Ediyor"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>İlerleme Oranı</span><span className="text-blue-600">%{project.progress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-gray-200 pt-4 mt-2">
                      <button onClick={() => generatePDF(project)} className="flex items-center gap-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                        <FileDown className="w-4 h-4" /> Raporu İndir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-600" /> Randevularınız
              </h2>
              {!showForm && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Yeni Randevu Talep Et"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            {showForm ? (
              <form onSubmit={handleApptSubmit} className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-blue-900">Yeni Randevu Talebi</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Görüşme Konusu (Örn: Saha Keşfi)" 
                  value={newAppt.subject}
                  onChange={(e) => setNewAppt({...newAppt, subject: e.target.value})}
                  className="w-full text-sm px-3 py-2 mb-3 border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  required
                />
                
                {/* YENİ: min={minDateTime} özelliği eklendi! */}
                <input 
                  type="datetime-local" 
                  value={newAppt.date}
                  min={minDateTime}
                  onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                  className="w-full text-sm px-3 py-2 mb-4 border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  required
                />
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white text-sm font-bold py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                </button>
              </form>
            ) : null}

            {data.appointments.length === 0 && !showForm ? (
              <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded-lg">Geçmiş veya planlanan randevunuz yok.</p>
            ) : (
              <div className="space-y-4">
                {data.appointments.map((app) => (
                  <div key={app.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-semibold text-gray-900 text-sm">{app.subject}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(app.date).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        app.status === "APPROVED" ? "bg-green-50 text-green-700" :
                        app.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {getStatusText(app.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" /> Resmi Belgeler
            </h2>
            <div className="space-y-3">
              {[
                { name: "Sistem Kullanım Kılavuzu", size: "2.4 MB", type: "PDF" },
                { name: "Garanti Şartnamesi", size: "1.1 MB", type: "PDF" },
                { name: "Genel Hizmet Sözleşmesi", size: "850 KB", type: "PDF" }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 text-red-500 rounded-md flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 group-hover:text-blue-600 transition-colors" title="Belgeyi İndir">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
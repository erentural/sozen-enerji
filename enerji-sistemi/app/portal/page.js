"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FolderKanban, CalendarDays, LogOut, FileDown, FileText, 
  Download, PlusCircle, X, Clock, CheckCircle2, MessageSquare, 
  Send, Image as ImageIcon 
} from "lucide-react";
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

  // Mesaj Formu State'leri
  const [messageForm, setMessageForm] = useState({ subject: "Proje Hakkında Soru", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);

  // Takvimin geçmişi seçmesini engellemek için şu anki zamanı hesapla
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

  // Randevu Gönderme Fonksiyonu
  const handleApptSubmit = async (e) => {
    e.preventDefault();
    
    const secilenTarih = new Date(newAppt.date);
    const suAn = new Date();
    
    if (secilenTarih < suAn) {
      alert("Hata: Geçmiş bir tarihe veya saate randevu talebi oluşturamazsınız!");
      return;
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

  // Yönetime Mesaj Gönderme Fonksiyonu
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch("/api/mesaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name || "Müşteri",
          email: session?.user?.email || "",
          phone: "Sistemde Kayıtlı", // Session'da telefon yoksa varsayılan
          subject: `PORTAL: ${messageForm.subject}`, 
          message: messageForm.message,
        }),
      });

      if (res.ok) {
        setMessageSuccess(true);
        setMessageForm({ ...messageForm, message: "" });
        // 3 saniye sonra başarı mesajını gizle
        setTimeout(() => setMessageSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Mesaj gönderilemedi:", error);
    } finally {
      setIsSending(false);
    }
  };

  const temizleTR = (text) => {
    if (!text) return "";
    return text
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U');
  };

  const generatePDF = (project) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // 1. KURUMSAL ÜST BİLGİ (HEADER) ALANI
    doc.setFillColor(2, 82, 156); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SOZEN ENERJI", 14, 24);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Guvenilir Elektrik ve Yenilenebilir Enerji Cozumleri", 14, 32);

    // 2. RAPOR BAŞLIĞI VE ÇİZGİ
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROJE DURUM RAPORU", 14, 55);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 60, pageWidth - 14, 60);

    // 3. PROJE VE MÜŞTERİ BİLGİLERİ
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Musteri Bilgileri", 14, 70);
    doc.text("Proje Bilgileri", 110, 70);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text("Ad Soyad:", 14, 78);
    doc.setFont("helvetica", "normal");
    doc.text(temizleTR(session?.user?.name || "Musteri"), 35, 78);
    doc.setFont("helvetica", "bold");
    doc.text("Rapor Tarihi:", 14, 85);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("tr-TR"), 38, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Proje Adi:", 110, 78);
    doc.setFont("helvetica", "normal");
    doc.text(temizleTR(project.title), 132, 78);
    doc.setFont("helvetica", "bold");
    doc.text("Guncel Durum:", 110, 85);
    doc.setFont("helvetica", "normal");
    doc.text(`%${project.progress} Tamamlandi`, 138, 85);

    // 4. TABLO TASARIMI
    autoTable(doc, {
      startY: 95,
      head: [['Proje Aciklamasi', 'Baslangic Tarihi', 'Ilerleme']],
      body: [
        [
          temizleTR(project.description), 
          new Date(project.createdAt).toLocaleDateString("tr-TR"), 
          `%${project.progress}`
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [2, 82, 156], textColor: 255, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 10, cellPadding: 8, textColor: [60, 60, 60] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
      },
      alternateRowStyles: { fillColor: [245, 248, 250] },
    });

    // 5. ALT BİLGİ
    const finalY = doc.lastAutoTable.finalY || 120;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Bu belge Sozen Enerji sistemleri tarafindan otomatik olarak uretilmistir.", 14, finalY + 20);
    doc.text("Herhangi bir sorunuz icin: destek@sozen-enerji.com | 444 0 123", 14, finalY + 25);

    const dosyaIsmi = `SozenEnerji_${temizleTR(project.title).replace(/\s+/g, '_')}_Raporu.pdf`;
    doc.save(dosyaIsmi);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Yükleniyor...</div>;
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
    <div className="min-h-screen bg-gray-50/50 font-sans">
      
      {/* ÜST BİLGİ VE ÇIKIŞ ÇUBUĞU */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#02529C] rounded-xl flex items-center justify-center shadow-md">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Müşteri Takip Portalı</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-500 font-medium">Hoş geldiniz,</p>
              <p className="text-sm font-bold text-[#02529C]">{session?.user?.name}</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* ANA İÇERİK ALANI */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL KOLON: PROJELER */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <FolderKanban className="w-6 h-6 text-[#02529C]" /> Projelerinizin Durumu
            </h2>
            
            {data.projects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <FolderKanban className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium text-lg">Adınıza tanımlı aktif bir proje bulunamadı.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {data.projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col sm:flex-row">
                    
                    {/* Proje Görseli (Eğer veritabanında imageUrl yoksa placeholder gösterir) */}
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto relative bg-gray-50 overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <ImageIcon className="w-12 h-12 mb-2" />
                          <span className="text-xs font-medium">Görsel Eklenmemiş</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm font-black text-[#02529C] text-sm">
                        %{project.progress} Tamamlandı
                      </div>
                    </div>

                    {/* Proje Detayları ve İlerleme Çubuğu */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{project.title}</h3>
                            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${project.progress === 100 ? 'bg-green-500' : 'bg-[#02529C]'}`}></span> 
                              {project.progress === 100 ? "Tamamlandı" : "Aktif Proje"} • {project.location || "Konum Belirtilmedi"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{project.description}</p>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                          <span>Süreç Başlangıcı</span>
                          <span>Teslimat</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner relative mb-6">
                          <div 
                            className="bg-gradient-to-r from-[#02529C] to-blue-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${project.progress}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                          </div>
                        </div>

                        {/* PDF İndirme Butonu */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => generatePDF(project)} 
                            className="flex items-center gap-2 text-sm font-bold bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:border-[#02529C] hover:text-[#02529C] hover:bg-blue-50 transition-all shadow-sm hover:shadow"
                          >
                            <FileDown className="w-4 h-4" /> Raporu İndir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SAĞ KOLON: RANDEVULAR, BİZE ULAŞIN VE BELGELER */}
          <div className="space-y-6">
            
            {/* 1. Randevular Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#02529C]" /> Randevularınız
                </h3>
                {!showForm && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="text-[#02529C] text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Yeni
                  </button>
                )}
              </div>

              {showForm ? (
                <form onSubmit={handleApptSubmit} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-4 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-[#02529C]">Yeni Talep</h3>
                    <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Görüşme Konusu (Örn: Saha Keşfi)" 
                    value={newAppt.subject}
                    onChange={(e) => setNewAppt({...newAppt, subject: e.target.value})}
                    className="w-full text-sm px-3 py-2.5 mb-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C]"
                    required
                  />
                  <input 
                    type="datetime-local" 
                    value={newAppt.date}
                    min={minDateTime}
                    onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                    className="w-full text-sm px-3 py-2.5 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C]"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#02529C] text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                  </button>
                </form>
              ) : null}

              {data.appointments.length === 0 && !showForm ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Geçmiş veya planlanan randevunuz yok.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.appointments.map((app) => (
                    <div key={app.id} className="border border-gray-100 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                      <p className="font-bold text-gray-900 text-sm mb-2">{app.subject}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(app.date).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                          app.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          app.status === "REJECTED" ? "bg-red-100 text-red-700" : 
                          app.status === "COMPLETED" ? "bg-gray-200 text-gray-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Yönetime Mesaj Gönder Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
              
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1 relative z-10">
                <MessageSquare className="w-5 h-5 text-[#02529C]" /> Bize Ulaşın
              </h3>
              <p className="text-xs font-medium text-gray-500 mb-4 relative z-10">Projenizle ilgili her türlü soruyu direkt yönetime iletebilirsiniz.</p>

              {messageSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                  <p className="font-bold text-sm">Mesajınız İletildi!</p>
                  <p className="text-xs mt-1 font-medium">Yönetim ekibimiz en kısa sürede dönüş yapacaktır.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3 relative z-10">
                  <select 
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                    className="w-full text-sm font-medium px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50"
                  >
                    <option value="Proje Hakkında Soru">Proje Hakkında Soru</option>
                    <option value="Teknik Destek">Teknik Destek</option>
                    <option value="Ek Talep">Ek Talep / Revizyon</option>
                    <option value="Diğer">Diğer Konular</option>
                  </select>
                  
                  <textarea 
                    required
                    rows={3}
                    placeholder="Mesajınızı buraya yazınız..."
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                    className="w-full text-sm font-medium px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 resize-none"
                  ></textarea>
                  
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-[#02529C] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-sm"
                  >
                    {isSending ? "Gönderiliyor..." : <><Send className="w-4 h-4" /> Yönetime Gönder</>}
                  </button>
                </form>
              )}
            </div>

            {/* 3. Belgeler Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#02529C]" /> Resmi Belgeler
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Sistem Kullanım Kılavuzu", size: "2.4 MB", type: "PDF" },
                  { name: "Garanti Şartnamesi", size: "1.1 MB", type: "PDF" },
                  { name: "Genel Hizmet Sözleşmesi", size: "850 KB", type: "PDF" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2.5 rounded-lg text-red-500"><FileText className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                        <p className="text-xs font-medium text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-300 group-hover:text-[#02529C] transition-colors" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Progress bar animasyonu için gerekli global CSS eklentisi */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { background-position: 40px 0; }
        }
      `}} />
    </div>
  );
}
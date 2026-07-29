"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FolderKanban, CalendarDays, LogOut, FileDown, FileText, 
  Download, PlusCircle, X, Clock, CheckCircle2, MessageSquare, 
  Send, Image as ImageIcon, Check, AlertCircle, Info
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CustomerPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [data, setData] = useState({ projects: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  let toastTimeout;

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000); 
  };

  // YENİ: PDF ayarları sisteme dahil edildi
  const [sysSettings, setSysSettings] = useState({ 
    workHourStart: "08:30", 
    workHourEnd: "18:30", 
    allowWeekend: false,
    taxNumber: "",
    mersisNumber: "",
    pdfFooterText: "Bu belge Sözen Enerji CRM sistemi tarafından otomatik olarak üretilmiştir."
  });

  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ subject: "", date: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messageForm, setMessageForm] = useState({ 
    subject: "Proje Hakkında Soru", 
    otherSubjectDetail: "", 
    message: "" 
  });
  const [isSending, setIsSending] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);

  const getLocalMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().split("T")[0];
  };
  const minDate = getLocalMinDate();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCustomerData();
      fetchSystemSettings(); 
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

  const fetchSystemSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const result = await res.json();
        // YENİ: PDF ayarları API'den state'e aktarıldı
        setSysSettings({
          workHourStart: result.workHourStart || "08:30",
          workHourEnd: result.workHourEnd || "18:30",
          allowWeekend: result.allowWeekend ?? false,
          taxNumber: result.taxNumber || "",
          mersisNumber: result.mersisNumber || "",
          pdfFooterText: result.pdfFooterText || "Bu belge Sözen Enerji CRM sistemi tarafından otomatik olarak üretilmiştir."
        });
      }
    } catch (error) {
      console.error("Ayarlar çekilemedi", error);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const day = dateObj.getDay(); 
      
      if (!sysSettings.allowWeekend && day === 0) {
        showToast("Pazar günleri kapalıyız. Lütfen Pazartesi - Cumartesi arası bir gün seçin.", "warning");
        setNewAppt({ ...newAppt, date: "" }); 
        return;
      }
    }
    
    setNewAppt({ ...newAppt, date: selectedDate });
  };

  const handleApptSubmit = async (e) => {
    e.preventDefault();
    
    if (!newAppt.date || !newAppt.time) {
      showToast("Lütfen hem tarih hem de saat seçiniz.", "warning");
      return;
    }

    const secilenTarih = new Date(`${newAppt.date}T${newAppt.time}`);
    const suAn = new Date();
    
    if (secilenTarih < suAn) {
      showToast("Geçmiş bir tarihe veya saate randevu talebi oluşturamazsınız!", "error");
      return;
    }

    const gun = secilenTarih.getDay();
    const saat = secilenTarih.getHours();
    const dakika = secilenTarih.getMinutes();
    const toplamDakika = (saat * 60) + dakika;
    
    const [startHour, startMin] = sysSettings.workHourStart.split(':').map(Number);
    const [endHour, endMin] = sysSettings.workHourEnd.split(':').map(Number);
    const mesaiBaslangic = (startHour * 60) + startMin; 
    const mesaiBitis = (endHour * 60) + endMin; 

    if (!sysSettings.allowWeekend && gun === 0) {
      showToast("Pazar günleri hizmet verememekteyiz.", "error");
      return;
    }
    if (toplamDakika < mesaiBaslangic || toplamDakika > mesaiBitis) {
      showToast(`Randevu talepleri sadece ${sysSettings.workHourStart} - ${sysSettings.workHourEnd} saatleri arasında oluşturulabilir.`, "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/customer/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newAppt.subject,
          date: secilenTarih.toISOString(),
          email: session.user.email
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setNewAppt({ subject: "", date: "", time: "" });
        fetchCustomerData(); 
        window.dispatchEvent(new Event("notificationsUpdated"));
        showToast("Randevu talebiniz başarıyla iletildi!", "success");
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Randevu oluşturulamadı.", "error");
      }
    } catch (error) {
      console.error("Randevu oluşturulamadı", error);
      showToast("Sistemsel bir hata oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const finalSubject = messageForm.subject === "Diğer Konular"
        ? `PORTAL: Diğer - ${messageForm.otherSubjectDetail}`
        : `PORTAL: ${messageForm.subject}`;

      const res = await fetch("/api/mesaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name || "Müşteri",
          email: session?.user?.email || "",
          phone: "Sistemde Kayıtlı", 
          subject: finalSubject, 
          message: messageForm.message,
        }),
      });

      if (res.ok) {
        setMessageSuccess(true);
        setMessageForm({ subject: "Proje Hakkında Soru", otherSubjectDetail: "", message: "" });
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
    return String(text)
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U');
  };

  // 1. Proje Durum Raporu PDF'i 
  const generatePDF = (project) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFillColor(2, 82, 156); 
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(255, 193, 7); 
    doc.rect(0, 35, pageWidth, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(temizleTR("SÖZEN ENERJİ"), 14, 22);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(temizleTR("Güvenilir Elektrik ve Yenilenebilir Enerji Çözümleri"), 14, 28);

    doc.setTextColor(30, 41, 59); 
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(temizleTR("PROJE DURUM RAPORU"), 14, 52);

    doc.setFillColor(248, 250, 252); 
    doc.setDrawColor(226, 232, 240); 
    doc.roundedRect(14, 60, 88, 65, 3, 3, 'FD'); 
    doc.roundedRect(108, 60, 88, 65, 3, 3, 'FD'); 

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); 
    doc.setFont("helvetica", "bold");
    doc.text(temizleTR("MÜŞTERİ BİLGİLERİ"), 18, 68);

    doc.setTextColor(15, 23, 42); 
    doc.text("Ad Soyad:", 18, 77);
    doc.setFont("helvetica", "normal");
    const safeName = session?.user?.name || "Musteri";
    doc.text(temizleTR(safeName), 42, 77, { maxWidth: 55 }); 

    doc.setFont("helvetica", "bold");
    doc.text("E-Posta:", 18, 89);
    doc.setFont("helvetica", "normal");
    const safeEmail = session?.user?.email || "Belirtilmedi";
    doc.text(temizleTR(safeEmail), 42, 89, { maxWidth: 55 });

    doc.setFont("helvetica", "bold");
    doc.text("Musteri No:", 18, 101);
    doc.setFont("helvetica", "normal");
    
    const rawId = session?.user?.id || "00000";
    const corporateCustomerNo = `SZN-${rawId.substring(rawId.length - 5).toUpperCase()}`;
    doc.text(corporateCustomerNo, 42, 101);

    doc.setFont("helvetica", "bold");
    doc.text("Rapor Tarihi:", 18, 113);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("tr-TR"), 42, 113);

    doc.setTextColor(100, 116, 139); 
    doc.setFont("helvetica", "bold");
    doc.text(temizleTR("PROJE BİLGİLERİ"), 112, 68);

    doc.setTextColor(15, 23, 42); 
    doc.text("Proje Adi:", 112, 77);
    doc.setFont("helvetica", "normal");
    const safeTitle = project.title || "";
    doc.text(temizleTR(safeTitle), 136, 77, { maxWidth: 55 });

    doc.setFont("helvetica", "bold");
    doc.text("Konum:", 112, 89);
    doc.setFont("helvetica", "normal");
    const safeLoc = project.location || "Belirtilmedi";
    doc.text(temizleTR(safeLoc), 136, 89, { maxWidth: 55 });

    doc.setFont("helvetica", "bold");
    doc.text("Baslangic:", 112, 101);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(project.createdAt).toLocaleDateString("tr-TR"), 136, 101);

    doc.setFont("helvetica", "bold");
    doc.text("Durum:", 112, 113);
    doc.setTextColor(2, 82, 156); 
    doc.text(temizleTR(`%${project.progress} Tamamlandi`), 136, 113);
    
    autoTable(doc, {
      startY: 135,
      head: [[temizleTR('Proje Açıklaması'), temizleTR('Başlangıç Tarihi'), temizleTR('İlerleme')]],
      body: [
        [
          temizleTR(project.description || "-"), 
          new Date(project.createdAt).toLocaleDateString("tr-TR"), 
          `%${project.progress}`
        ],
      ],
      theme: 'plain',
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 6, textColor: [51, 65, 85] },
      headStyles: { fillColor: [255, 255, 255], textColor: [2, 82, 156], fontStyle: 'bold', lineWidth: { bottom: 0.5 }, lineColor: [200, 200, 200] },
      bodyStyles: { lineWidth: { bottom: 0.5 }, lineColor: [241, 245, 249] },
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 40, halign: 'center' }, 2: { cellWidth: 30, halign: 'center', fontStyle: 'bold', textColor: [2, 82, 156] } },
    });

    const finalY = doc.lastAutoTable.finalY || 140;
    
    // YENİ: DİNAMİK FOOTER VE KİMLİK BİLGİLERİ (VERGİ / MERSİS)
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); 
    doc.setFont("helvetica", "normal");
    
    doc.text(temizleTR(sysSettings.pdfFooterText), pageWidth / 2, pageHeight - 22, { align: 'center' });
    
    let officialIds = [];
    if (sysSettings.taxNumber) officialIds.push(`Vergi No: ${sysSettings.taxNumber}`);
    if (sysSettings.mersisNumber) officialIds.push(`Mersis No: ${sysSettings.mersisNumber}`);
    
    let footerLine2 = "www.sozen-enerji.com | destek@sozen-enerji.com | Müşteri Hizmetleri: 444 0 123";
    if (officialIds.length > 0) {
        footerLine2 += ` | ${officialIds.join(" | ")}`;
    }
    doc.text(temizleTR(footerLine2), pageWidth / 2, pageHeight - 16, { align: 'center' });

    const safeFileName = temizleTR(project.title || "Proje").replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`SozenEnerji_${safeFileName}_Raporu.pdf`);
  };

  // 2. Profesyonel Resmi Belge ve Kılavuz PDF'i
  const generateOfficialDocument = (type) => {
    showToast("Belgeniz hazırlanıyor, lütfen bekleyin...", "info");
    
    setTimeout(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // ÜST BİLGİ (HEADER) 
      doc.setFillColor(2, 82, 156); 
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFillColor(255, 193, 7); 
      doc.rect(0, 45, pageWidth, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(temizleTR("SÖZEN ENERJİ"), 20, 26);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 220, 255);
      doc.text(temizleTR("Güvenilir Elektrik ve Yenilenebilir Enerji Çözümleri"), 20, 34);

      // Tarih ve Belge No (Sağ Üst)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(temizleTR(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`), pageWidth - 20, 26, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(temizleTR(`Belge No: SZN-${Math.floor(1000 + Math.random() * 9000)}`), pageWidth - 20, 34, { align: "right" });

      // İÇERİK AYARLARI 
      let title = "";
      let fileName = "";
      let introText = "";
      let sections = [];

      if (type === "kilavuz") {
        title = "MÜŞTERİ PORTALI KULLANIM KILAVUZU";
        fileName = "SozenEnerji_Kullanim_Kilavuzu.pdf";
        introText = "Değerli Müşterimiz,\nEnerjiPanel yönetim sistemini ve Müşteri Portalı işleyişini tam verimle kullanmak için detaylı sistem rehberi aşağıda sunulmuştur.";
        sections = [
          { t: "1. Kayıt ve Güvenli Giriş", c: "Müşteriler, e-posta adresleri ve telefon numaraları ile sisteme saniyeler içinde kayıt olup giriş yapabilirler. Şifrelerini unuttuklarında, güvenli e-posta onayı (token) ile yeni şifre belirleyebilirler." },
          { t: "2. Kişisel Kontrol Paneli", c: "Müşteri giriş yaptığında, sadece kendine ait projeleri ve randevuları gördüğü, karmaşadan uzak, mobil uyumlu, temiz bir arayüzle karşılaşır." },
          { t: "3. Proje Takibi & PDF İndirme", c: "Müşteri aktif projesinin % kaç tamamlandığını ilerleme çubuğuyla takip edebilir. 'Raporu İndir' butonuna basarak, Sözen Enerji antetli ve kişiye özel müşteri numarası içeren PDF Durum Raporu'nu indirebilir." },
          { t: "4. Etkileşimli Zaman Çizelgesi", c: "Randevu talebi oluşturulduğunda, müşteri 'Talep İletildi', 'Onaylandı' ve 'Hizmet Tamamlandı' aşamalarını saat ve tarih bilgisiyle şık bir zaman çizelgesi (timeline) üzerinde görür." },
          { t: "5. Yönetime Direkt Mesaj", c: "Müşteriler, portal içindeki 'Bize Ulaşın' arayüzünden doğrudan projesiyle ilgili revizyon, destek veya genel konu taleplerini hızlıca merkeze iletebilir." }
        ];
      } else if (type === "garanti") {
        title = "GARANTİ VE SERVİS ŞARTNAMESİ";
        fileName = "SozenEnerji_Garanti_Sartnamesi.pdf";
        introText = "Bu belge, Sözen Enerji tarafından sağlanan hizmetlerin ve projelerde kullanılan materyallerin garanti koşullarını, yasal haklarınızı ve servis şartlarını içermektedir.";
        sections = [
          { t: "1. Genel Garanti Kapsamı", c: "Sözen Enerji tarafından gerçekleştirilen tüm elektrik taahhüt, montaj, pano kurulumu ve altyapı işlemleri, projenin teslim tarihinden itibaren 2 (İki) yıl süreyle işçilik hatalarına karşı firmamızın garantisi altındadır." },
          { t: "2. Malzeme ve Donanım Garantisi", c: "Projelerde kullanılan tüm bileşenlerin (kablo, aydınlatma armatürü, sigorta, şalter vb.) malzeme garantileri, üretici firmaların belirlediği standart süreler ve koşullar kapsamında değerlendirilmektedir. Sözen Enerji, arızalı ürünlerin üreticiye gönderimi konusunda müşteriye aracılık eder." },
          { t: "3. Garanti Dışı Kalan Durumlar", c: "Yetkisiz kişilerce yapılan hatalı müdahaleler, şebeke kaynaklı yüksek voltaj dalgalanmaları, yıldırım düşmesi, su baskını gibi doğal afetlerden (mücbir sebepler) kaynaklanan arızalar ve periyodik bakımların aksatılması durumu garanti kapsamı dışındadır." }
        ];
      } else if (type === "sozlesme") {
        title = "GENEL HİZMET VE GİZLİLİK SÖZLEŞMESİ";
        fileName = "SozenEnerji_Hizmet_Sozlesmesi.pdf";
        introText = "İşbu sözleşme, hizmeti sağlayan Sözen Enerji ile hizmeti alan Müşteri arasında, dijital portal üzerinden yürütülen işlemlerin genel çerçevesini ve gizlilik esaslarını belirler.";
        sections = [
          { t: "1. Sözleşmenin Konusu ve Taraflar", c: "Bu sözleşme, Sözen Enerji CRM Portalı üzerinden müşteri adına açılan projelerin takibi, randevu yönetimi ve dijital iletişim süreçlerindeki tarafların hak ve yükümlülüklerini düzenler." },
          { t: "2. Hizmet Taahhüdü", c: "Sözen Enerji, müşteri tarafından onaylanan projeleri ve yapılan ön anlaşmaları; ulusal ve uluslararası elektrik, iş güvenliği ve teknik şartnamelere tam uygun şekilde, eksiksiz ve taahhüt edilen sürede teslim etmeyi kabul eder." },
          { t: "3. Kişisel Verilerin Korunması (KVKK)", c: "Müşteriye ait projeler, lokasyon bilgileri, randevular, ödeme kayıtları ve iletişim bilgileri kesinlikle üçüncü şahıslarla veya kurumlarla paylaşılmaz. Tüm veriler 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında şifreli olarak muhafaza edilir." }
        ];
      }

      // BELGE BAŞLIĞI
      doc.setTextColor(15, 23, 42); 
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(temizleTR(title), 20, 65);

      // ÖZET (INTRO) KUTUSU
      doc.setFillColor(240, 247, 255); 
      doc.setDrawColor(186, 230, 253); 
      doc.roundedRect(20, 75, pageWidth - 40, 35, 3, 3, 'FD');

      doc.setTextColor(30, 58, 138); 
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const introLines = doc.splitTextToSize(temizleTR(introText), pageWidth - 50);
      doc.text(introLines, 25, 83);

      // MADDELER VE SECTİONLAR
      let yPos = 125;
      
      sections.forEach((sec) => {
        // Dinamik Sayfa Ekleme Kontrolü
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 30; 
        }

        doc.setTextColor(2, 82, 156);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(temizleTR(sec.t), 20, yPos);
        
        yPos += 7;

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const secLines = doc.splitTextToSize(temizleTR(sec.c), pageWidth - 40);
        doc.text(secLines, 20, yPos);

        yPos += (secLines.length * 5) + 12; 
      });

      // İMZA / ONAY ALANI
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 30;
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPos, pageWidth - 20, yPos); 
      
      yPos += 10;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(temizleTR("SÖZEN ENERJİ YÖNETİMİ"), 20, yPos);
      doc.text(temizleTR("MÜŞTERİ ONAYI"), pageWidth - 60, yPos);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(temizleTR("E-İmza ile onaylanmıştır."), 20, yPos + 6);
      doc.text(temizleTR("Okudum, anladım ve kabul ediyorum."), pageWidth - 80, yPos + 6);


      // YENİ: DİNAMİK FOOTER VE KİMLİK BİLGİLERİ (VERGİ / MERSİS)
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252); 
        doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
        
        doc.setDrawColor(226, 232, 240);
        doc.line(0, pageHeight - 25, pageWidth, pageHeight - 25);
        
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        
        doc.text(temizleTR(sysSettings.pdfFooterText), pageWidth / 2, pageHeight - 17, { align: 'center' });
        
        let officialIds = [];
        if (sysSettings.taxNumber) officialIds.push(`Vergi No: ${sysSettings.taxNumber}`);
        if (sysSettings.mersisNumber) officialIds.push(`Mersis No: ${sysSettings.mersisNumber}`);
        
        let footerLine2 = "www.sozen-enerji.com | destek@sozen-enerji.com";
        if (officialIds.length > 0) footerLine2 += ` | ${officialIds.join(" | ")}`;
        
        doc.text(temizleTR(footerLine2), pageWidth / 2, pageHeight - 12, { align: 'center' });
        doc.text(temizleTR(`Sayfa ${i} / ${pageCount}`), pageWidth / 2, pageHeight - 7, { align: 'center' });
      }

      doc.save(fileName);
      showToast("Belgeniz başarıyla indirildi.", "success");
    }, 800); 
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
    <div className="min-h-screen bg-gray-50/50 font-sans relative overflow-x-hidden">
      
      {/* Şık Bildirim (Toast) Bileşeni */}
      <div 
        className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${
          toast.show ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border-l-4 min-w-[300px] max-w-md ${
          toast.type === "success" ? "bg-white border-l-emerald-500 text-slate-800" :
          toast.type === "error" ? "bg-white border-l-rose-500 text-slate-800" :
          "bg-white border-l-amber-500 text-slate-800"
        }`}>
          <div className="mt-0.5">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === "warning" && <Info className="w-5 h-5 text-amber-500" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-0.5">
              {toast.type === "success" ? "Başarılı İşlem" : toast.type === "error" ? "Hata Oluştu" : "Bilgilendirme"}
            </h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{toast.message}</p>
          </div>
          <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

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
                    
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto relative bg-gray-50 overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                          <div className="bg-gradient-to-r from-[#02529C] to-blue-400 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${project.progress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                          <button onClick={() => generatePDF(project)} className="flex items-center gap-2 text-sm font-bold bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:border-[#02529C] hover:text-[#02529C] hover:bg-blue-50 transition-all shadow-sm hover:shadow">
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

          {/* SAĞ KOLON */}
          <div className="space-y-6">
            
            {/* 1. Randevular Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#02529C]" /> Randevularınız
                </h3>
                {!showForm && (
                  <button onClick={() => setShowForm(true)} className="text-[#02529C] text-sm font-bold hover:underline flex items-center gap-1">
                    <PlusCircle className="w-4 h-4" /> Yeni
                  </button>
                )}
              </div>

              {showForm ? (
                <form onSubmit={handleApptSubmit} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-4 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-[#02529C]">Yeni Talep</h3>
                    <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1 shadow-sm"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="mb-3 p-3 bg-white rounded-xl border border-blue-100 flex items-start gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                      Lütfen sadece <strong>{sysSettings.workHourStart} - {sysSettings.workHourEnd}</strong> saatleri arasında bir randevu seçin. 
                      {!sysSettings.allowWeekend && " (Pazar günleri kapalıyız)"}
                    </p>
                  </div>

                  <input 
                    type="text" 
                    placeholder="Görüşme Konusu (Örn: Saha Keşfi)" 
                    value={newAppt.subject} 
                    onChange={(e) => setNewAppt({...newAppt, subject: e.target.value})} 
                    className="w-full text-sm px-3 py-2.5 mb-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C]" 
                    required 
                  />
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <input 
                      type="date" 
                      min={minDate} 
                      value={newAppt.date} 
                      onChange={handleDateChange} 
                      className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C]" 
                      required 
                    />
                    <input 
                      type="time" 
                      min={sysSettings.workHourStart} 
                      max={sysSettings.workHourEnd} 
                      value={newAppt.time} 
                      onChange={(e) => setNewAppt({...newAppt, time: e.target.value})} 
                      className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C]" 
                      required 
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#02529C] text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50">
                    {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
                  </button>
                </form>
              ) : null}

              {data.appointments.length === 0 && !showForm ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Geçmiş veya planlanan randevunuz yok.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.appointments.map((app) => (
                    <div key={app.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-5 border-b border-gray-100 pb-4">
                        <div>
                          <h3 className="text-base font-black text-gray-900">{app.subject}</h3>
                          <p className="text-xs font-medium text-gray-500 mt-1">Randevu Tarihi: {new Date(app.date).toLocaleDateString("tr-TR")}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${app.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : app.status === 'APPROVED' ? 'bg-blue-50 text-blue-700 border-blue-200' : app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>
                      <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-gray-100">
                        <div className="relative flex items-center justify-between group">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-[#02529C] text-white shadow shrink-0 absolute -left-3"><Check className="w-3 h-3" /></div>
                          <div className="w-full ml-6 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <CalendarDays className="w-4 h-4 text-gray-400" />
                              <h4 className="font-bold text-xs text-gray-900">Talep İletildi</h4>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium">{new Date(app.createdAt).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}</p>
                          </div>
                        </div>
                        {app.status === "COMPLETED" && app.completedAt && (
                          <div className="relative flex items-center justify-between group animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 absolute -left-3"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                            <div className="w-full ml-6 p-3 rounded-xl bg-green-50/50 border border-green-100">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <h4 className="font-bold text-xs text-green-700">Hizmet Tamamlandı</h4>
                              </div>
                              <p className="text-[10px] text-green-600/70 font-medium">İşlem Saati: {new Date(app.completedAt).toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Yönetime Mesaj Gönder Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1 relative z-10"><MessageSquare className="w-5 h-5 text-[#02529C]" /> Bize Ulaşın</h3>
              <p className="text-xs font-medium text-gray-500 mb-4 relative z-10">Projenizle ilgili her türlü soruyu direkt yönetime iletebilirsiniz.</p>

              {messageSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                  <p className="font-bold text-sm">Mesajınız İletildi!</p>
                  <p className="text-xs mt-1 font-medium">Yönetim ekibimiz en kısa sürede dönüş yapacaktır.</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3 relative z-10">
                  <div className="flex flex-col gap-3">
                    <select value={messageForm.subject} onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})} className="w-full text-sm font-medium px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50">
                      <option value="Proje Hakkında Soru">Proje Hakkında Soru</option>
                      <option value="Teknik Destek">Teknik Destek</option>
                      <option value="Ek Talep">Ek Talep / Revizyon</option>
                      <option value="Diğer Konular">Diğer Konular</option>
                    </select>
                    {messageForm.subject === "Diğer Konular" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <input type="text" required value={messageForm.otherSubjectDetail} onChange={(e) => setMessageForm({ ...messageForm, otherSubjectDetail: e.target.value })} placeholder="Lütfen konuyu kısaca belirtiniz..." className="w-full text-sm font-medium px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-blue-50/50 shadow-sm transition-all" />
                      </div>
                    )}
                  </div>
                  <textarea required rows={3} placeholder="Mesajınızı buraya yazınız..." value={messageForm.message} onChange={(e) => setMessageForm({...messageForm, message: e.target.value})} className="w-full text-sm font-medium px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#02529C] bg-gray-50 resize-none"></textarea>
                  <button type="submit" disabled={isSending} className="w-full bg-[#02529C] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70 shadow-sm">
                    {isSending ? "Gönderiliyor..." : <><Send className="w-4 h-4" /> Yönetime Gönder</>}
                  </button>
                </form>
              )}
            </div>

            {/* 3. Belgeler Widget'ı */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-[#02529C]" /> Resmi Belgeler</h3>
              <div className="space-y-3">
                {[
                  { id: "kilavuz", name: "Sistem Kullanım Kılavuzu", size: "1.2 MB", type: "PDF" },
                  { id: "garanti", name: "Garanti Şartnamesi", size: "850 KB", type: "PDF" },
                  { id: "sozlesme", name: "Genel Hizmet Sözleşmesi", size: "450 KB", type: "PDF" }
                ].map((doc, index) => (
                  <div 
                    key={index} 
                    onClick={() => generateOfficialDocument(doc.id)} 
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-blue-50/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2.5 rounded-lg text-red-500"><FileText className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#02529C] transition-colors">{doc.name}</p>
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

      <style dangerouslySetInnerHTML={{__html: `@keyframes shimmer { 100% { background-position: 40px 0; } }`}} />
    </div>
  );
}
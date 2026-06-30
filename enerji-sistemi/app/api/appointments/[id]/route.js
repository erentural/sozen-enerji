import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// DİKKAT: Burada ikinci parametreyi 'context' olarak alıyoruz
export async function PATCH(request, context) {
  try {
    // 1. KESİN ÇÖZÜM: params'ı await ile çözüyoruz (Next.js 15 uyumluluğu)
    const resolvedParams = await context.params;
    
    // Klasörünün adı [id] ise bu satır kusursuz çalışacaktır.
    const id = resolvedParams.id; 

    // Hem verinin hiç gelmemesi (undefined) hem de Frontend'den yanlışlıkla "undefined" metni gelmesine karşı çifte kilit:
    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json({ error: "Sistem Hatası: Randevu ID'si URL'den alınamadı! (Klasör adının [id] olduğundan emin olun)" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // 2. ID TİPİNİ GÜVENCEYE AL
    const islemId = isNaN(Number(id)) ? id : Number(id);

    // 3. PRİSMA GÜNCELLEMESİ
    const updatedAppointment = await prisma.appointment.update({
      where: { id: islemId },
      data: { status },
      include: { customer: true }
    });

    // 4. MAİL GÖNDERİMİ
    if (status === 'APPROVED' || status === 'REJECTED') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS  
        }
      });

      let mailSubject = '';
      let mailHtml = '';

      const musteriAdi = updatedAppointment.customer?.name || 'Değerli Müşterimiz';
      const musteriMaili = updatedAppointment.customer?.email;
      const isBasligi = updatedAppointment.subject || 'Randevu Talebi';
      
      const randevuTarihi = updatedAppointment.date 
        ? new Date(updatedAppointment.date).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) 
        : 'Belirtilen tarih';

      if (status === 'APPROVED') {
        mailSubject = '✅ Randevunuz Onaylandı - Sözen Enerji';
        mailHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #10b981; margin-top: 0;">Randevunuz Onaylandı!</h2>
            <p>Sayın <strong>${musteriAdi}</strong>,</p>
            <p>Sözen Enerji üzerinden oluşturduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz onaylanmıştır.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Randevu Zamanı:</strong> ${randevuTarihi}</p>
            </div>
            <p>İyi günler dileriz.</p>
          </div>
        `;
      } else if (status === 'REJECTED') {
        mailSubject = '❌ Randevu Talebiniz Hakkında - Sözen Enerji';
        mailHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #ef4444; margin-top: 0;">Randevu Bilgilendirmesi</h2>
            <p>Sayın <strong>${musteriAdi}</strong>,</p>
            <p>İletmiş olduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz mevcut planlamalar sebebiyle maalesef onaylanamamıştır.</p>
          </div>
        `;
      }

      if (musteriMaili && musteriMaili.includes('@')) {
        await transporter.sendMail({
          from: `"Sözen Enerji Bildirim" <${process.env.EMAIL_USER}>`,
          to: musteriMaili,
          subject: mailSubject,
          html: mailHtml
        }).catch(err => console.error("Mail Hatası:", err));
      }
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("API GÜNCELLEME HATASI:", error);
    return NextResponse.json({ error: error.message || "İşlem başarısız" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function PATCH(request, { params }) {
  try {
    // 1. STANDART YAKALAMA (Next.js 13/14 Uyumludur)
    const { id } = params;

    // Kilit: ID yoksa işlemi Prisma'ya gitmeden durdur
    if (!id) {
      return NextResponse.json({ error: "Sistem Hatası: Randevu ID'si URL'den alınamadı!" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // 2. ID TİPİNİ GÜVENCEYE AL: Harfli (CUID) ise string, rakamsa sayı yap
    const islemId = isNaN(Number(id)) ? id : Number(id);

    // 3. PRİSMA GÜNCELLEMESİ VE MÜŞTERİ VERİSİNİ ÇEKME
    const updatedAppointment = await prisma.appointment.update({
      where: { id: islemId },
      data: { status },
      include: { customer: true } // Müşteri detaylarını çekmek zorundayız
    });

    // 4. MAİL GÖNDERİM İŞLEMİ
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
            <p>İletmiş olduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz maalesef onaylanamamıştır.</p>
          </div>
        `;
      }

      // Müşterinin maili varsa gönder
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
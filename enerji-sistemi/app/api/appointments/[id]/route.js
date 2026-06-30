import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // 1. GÜNCELLEME BURADA: include { customer: true } ekledik ki mail adresini çekebilelim!
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { customer: true } // Müşteri tablosundaki verileri (isim, mail) de getir
    });

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

      // 2. GÜNCELLEME BURADA: Artık verileri "customer" objesinin içinden alıyoruz
      const musteriAdi = updatedAppointment.customer?.name || 'Değerli Müşterimiz';
      const musteriMaili = updatedAppointment.customer?.email; // Maili buradan yakalıyoruz
      const isBasligi = updatedAppointment.subject || 'Randevu'; // Frontend'de subject kullanmışsın
      
      const randevuTarihi = updatedAppointment.date 
        ? new Date(updatedAppointment.date).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) 
        : 'Belirtilen tarih';

      if (status === 'APPROVED') {
        mailSubject = '✅ Randevunuz Onaylandı - Sözen Enerji';
        mailHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #10b981; margin-top: 0;">Randevunuz Onaylandı!</h2>
            <p>Sayın <strong>${musteriAdi}</strong>,</p>
            <p>Sözen Enerji üzerinden oluşturduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz tarafımızca onaylanmıştır.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Randevu Zamanı:</strong> ${randevuTarihi}</p>
            </div>
            <p>Görüşmek üzere, iyi günler dileriz.</p>
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

      if (musteriMaili && musteriMaili.includes('@')) {
        await transporter.sendMail({
          from: `"Sözen Enerji Bildirim" <${process.env.EMAIL_USER}>`,
          to: musteriMaili,
          subject: mailSubject,
          html: mailHtml
        });
      }
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    // HATAYI GÖRMEK İÇİN: Sunucu loglarına hatanın gerçek sebebini yazdırıyoruz
    console.error("RANDEVU GÜNCELLEME VE MAİL HATASI OLUŞTU:", error);
    return NextResponse.json({ error: error.message || "İşlem başarısız" }, { status: 500 });
  }
}
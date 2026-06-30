import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body; // PENDING, APPROVED, REJECTED, COMPLETED

    // 1. Veritabanında randevuyu güncelle ve güncel veriyi çek
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    // 2. EĞER DURUM "ONAYLANDI" VEYA "REDDEDİLDİ" İSE MAİL SİSTEMİNİ TETİKLE
    if (status === 'APPROVED' || status === 'REJECTED') {
      
      // Mail gönderim ayarlarını .env dosyasından alıyoruz
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS  
        }
      });

      let mailSubject = '';
      let mailHtml = '';

      // NOT: Veritabanındaki sütun isimlerin farklıysa (örn: isim için sadece 'name' veya mail için 'email' kullanıyorsan) burayı ona göre değiştir:
      const musteriAdi = updatedAppointment.customerName || updatedAppointment.name || 'Değerli Müşterimiz';
      const musteriMaili = updatedAppointment.customerEmail || updatedAppointment.email;
      const isBasligi = updatedAppointment.title || 'Randevu';
      
      // Tarih formatını Türkiye standartlarına çeviriyoruz
      const randevuTarihi = updatedAppointment.date 
        ? new Date(updatedAppointment.date).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' }) 
        : 'Belirtilen tarih';

      // 3. Duruma göre mail içeriğini (HTML) hazırla
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
            <p>İletmiş olduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz yoğunluk veya planlama değişiklikleri sebebiyle maalesef onaylanamamıştır.</p>
            <p>Farklı bir zaman dilimi için sistem üzerinden yeniden talep oluşturabilirsiniz.</p>
            <p>Anlayışınız için teşekkür ederiz.</p>
          </div>
        `;
      }

      // 4. Eğer müşterinin geçerli bir mail adresi varsa gönderimi tamamla
      if (musteriMaili && musteriMaili.includes('@')) {
        await transporter.sendMail({
          from: `"Sözen Enerji Bildirim" <${process.env.EMAIL_USER}>`,
          to: musteriMaili,
          subject: mailSubject,
          html: mailHtml
        }).catch(err => console.error("Mail gönderme hatası:", err)); // Gönderilemezse sistemi çökertmemesi için hatayı yakalıyoruz
      }
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Randevu Güncelleme Hatası:", error);
    return NextResponse.json({ error: "Randevu güncellenirken hata oluştu." }, { status: 500 });
  }
}
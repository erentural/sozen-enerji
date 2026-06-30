import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function PATCH(request, context) {
  try {
    // 1. KRİTİK DÜZELTME: Next.js 15 Uyumlu ID Yakalama
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Hata: URL'den randevu ID'si alınamadı!" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // 2. KRİTİK DÜZELTME: Veritabanında ID Metin mi, Sayı mı?
    // Eğer masaüstü uygulamasındaki gibi 1,2,3 diye artan tamsayı (Int) ise parseInt(id) kullanmalıyız.
    // Eğer UUID (karmaşık harfler) ise id olarak bırakmalısın. Biz garanti olsun diye otomatik çevirici ekliyoruz:
    const islemId = isNaN(Number(id)) ? id : Number(id);

    // 3. KRİTİK DÜZELTME: Müşteri bilgilerini de beraberinde çekiyoruz (Mail atabilmek için şart)
    const updatedAppointment = await prisma.appointment.update({
      where: { id: islemId },
      data: { status },
      include: { customer: true } // Müşteri detaylarını veritabanından çek
    });

    // Durum "Onaylandı" veya "Reddedildi" ise Mail gönderimini başlat
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

      // Müşteri bilgilerini Prisma'dan gelen veriden alıyoruz
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
            <p>İletmiş olduğunuz <b>"${isBasligi}"</b> konulu randevu talebiniz mevcut planlamalar sebebiyle maalesef onaylanamamıştır.</p>
            <p>Farklı bir tarih için sistem üzerinden yeniden talep oluşturabilirsiniz. Anlayışınız için teşekkür ederiz.</p>
          </div>
        `;
      }

      // Mail adresi geçerliyse gönder!
      if (musteriMaili && musteriMaili.includes('@')) {
        await transporter.sendMail({
          from: `"Sözen Enerji Bildirim" <${process.env.EMAIL_USER}>`,
          to: musteriMaili,
          subject: mailSubject,
          html: mailHtml
        }).catch(err => console.error("Mail gönderilemedi:", err));
      } else {
        console.warn("Müşterinin e-posta adresi bulunamadığı için mail atılamadı.");
      }
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("API GÜNCELLEME HATASI:", error);
    return NextResponse.json({ error: error.message || "İşlem başarısız" }, { status: 500 });
  }
}
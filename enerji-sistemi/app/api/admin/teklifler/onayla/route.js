import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { id, priceOffer, messageToCustomer } = await request.json();

    if (!id || !priceOffer) {
      return NextResponse.json({ error: "Kayıt ID ve Fiyat bilgisi zorunludur." }, { status: 400 });
    }

    // 1. Veritabanında teklifi güncelle
    const updatedQuote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: "KAPANDI",
        priceOffer: Number(priceOffer),
      },
    });

    // 2. GERÇEK E-POSTA GÖNDERİM İŞLEMİ
    if (updatedQuote.email) {
      // Nodemailer aktarım ayarları (Örn: Gmail için)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Gönderilecek Mailin İçeriği ve Tasarımı
      const mailOptions = {
        from: `"Sözen Enerji" <${process.env.EMAIL_USER}>`,
        to: updatedQuote.email,
        subject: `${updatedQuote.service} Projeniz İçin Fiyat Teklifimiz`,
        html: `
          <div style="font-family: Arial, sans-serif; max-w-lg; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #02529C;">Sayın ${updatedQuote.name},</h2>
            <p>Sözen Enerji web sitesi üzerinden oluşturduğunuz <strong>${updatedQuote.service}</strong> (${updatedQuote.panelCount} Panel) talebiniz mühendislerimiz tarafından incelenmiştir.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #FFC107; margin: 20px 0;">
              <h3 style="margin: 0; color: #333;">Hesaplanan Fiyat Teklifi:</h3>
              <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 10px 0;">${priceOffer.toLocaleString("tr-TR")} TL</p>
            </div>

            <p style="color: #4b5563; line-height: 1.6;"><strong>Uzmanımızın Notu:</strong><br/> ${messageToCustomer}</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">Detaylı görüşmek ve onaylamak için bizimle iletişime geçebilirsiniz.<br/><strong>Sözen Enerji Yönetim Sistemi</strong></p>
          </div>
        `,
      };

      // Maili gönder
      await transporter.sendMail(mailOptions);
      console.log(`Mail başarıyla gönderildi: ${updatedQuote.email}`);
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Teklif onaylanırken hata:", error);
    return NextResponse.json({ error: "İşlem başarısız oldu." }, { status: 500 });
  }
}
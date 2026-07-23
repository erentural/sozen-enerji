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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Müşterinin talebinin nereden geldiğini anlıyoruz
      const isFromCalculator = updatedQuote.panelCount && updatedQuote.panelCount > 0;
      
      // Proje adını formattaki gereksiz notlardan temizleyelim
      const cleanServiceName = updatedQuote.service.split('(')[0].trim();

      // Duruma göre değişen giriş metni
      const introText = isFromCalculator 
        ? `Sözen Enerji <strong>Gelişmiş Enerji Hesaplayıcısı</strong> üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> (${updatedQuote.panelCount} Panel ihtiyacı) analizi mühendislerimiz tarafından incelenmiş ve ön keşif süreci tamamlanmıştır.`
        : `Sözen Enerji web sitesi üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> talebiniz (Konum: ${updatedQuote.city || "Belirtilmedi"}) mühendislerimiz tarafından detaylı bir şekilde incelenmiştir.`;

      const mailOptions = {
        from: `"Sözen Enerji" <${process.env.EMAIL_USER}>`,
        to: updatedQuote.email,
        subject: `${cleanServiceName} Projeniz İçin Fiyat Teklifimiz`,
        html: `
          <div style="font-family: Arial, sans-serif; max-w-lg; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #02529C; margin-bottom: 5px;">Sayın ${updatedQuote.name},</h2>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${introText}</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #FFC107; margin: 25px 0;">
              <h3 style="margin: 0; color: #333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Hesaplanan Fiyat Teklifi</h3>
              <p style="font-size: 28px; font-weight: bold; color: #16a34a; margin: 10px 0 5px 0;">${Number(priceOffer).toLocaleString("tr-TR")} TL</p>
              ${isFromCalculator ? `<p style="margin: 0; font-size: 13px; color: #64748b; font-weight: bold;">Tahmini Amorti Süresi: ${updatedQuote.roiYears} Yıl</p>` : ''}
            </div>

            <div style="background-color: #fff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; color: #02529C; font-weight: bold; font-size: 14px;">Mühendisimizin Notu:</p>
              <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${messageToCustomer}</p>
            </div>
            
            <!-- YENİ EKLENEN İLETİŞİM ALANI -->
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px solid #bae6fd;">
              <p style="margin: 0 0 10px 0; color: #0369a1; font-weight: bold; font-size: 15px;">Bize Ulaşın</p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #0f172a;">
                <strong style="display: inline-block; width: 65px;">📞 Telefon:</strong> 
                <a href="tel:4440123" style="color: #02529C; text-decoration: none; font-weight: bold;">444 0 123</a>
              </p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #0f172a;">
                <strong style="display: inline-block; width: 65px;">✉️ E-Posta:</strong> 
                <a href="mailto:info@sozen-enerji.com" style="color: #02529C; text-decoration: none;">info@sozen-enerji.com</a>
              </p>
              <p style="margin: 0; font-size: 13px; color: #0f172a; line-height: 1.4;">
                <strong style="display: inline-block; width: 65px; vertical-align: top;">📍 Adres:</strong> 
                <span style="display: inline-block; width: calc(100% - 70px);">Sanayi Mahallesi, Enerji Caddesi No: 42, İstanbul / Türkiye</span>
              </p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af; line-height: 1.5;">
              Bu teklif bilgilendirme amaçlıdır. Keşif randevusu oluşturmak ve detayları görüşmek için bizimle iletişime geçebilirsiniz.<br/>
              <strong style="color: #02529C;">Sözen Enerji Yönetim Sistemi</strong>
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Mail başarıyla gönderildi: ${updatedQuote.email}`);
    }

    return NextResponse.json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Teklif onaylanırken hata:", error);
    return NextResponse.json({ error: "İşlem başarısız oldu." }, { status: 500 });
  }
}
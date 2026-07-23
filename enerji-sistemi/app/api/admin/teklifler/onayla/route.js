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

      // Müşterinin talebinin nereden geldiğini anlıyoruz (Hesaplayıcı mı yoksa Genel Form mu?)
      const isFromCalculator = updatedQuote.panelCount && updatedQuote.panelCount > 0;
      
      // Proje adını formattaki gereksiz notlardan temizleyelim (örneğin "Çatı GES Kurulumu (Detay: ...)")
      const cleanServiceName = updatedQuote.service.split('(')[0].trim();

      // Duruma göre değişen giriş metni
      const introText = isFromCalculator 
        ? `Sözen Enerji <strong>Gelişmiş Enerji Hesaplayıcısı</strong> üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> (${updatedQuote.panelCount} Panel ihtiyacı) analizi mühendislerimiz tarafından incelenmiş ve ön keşif süreci tamamlanmıştır.`
        : `Sözen Enerji web sitesi üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> talebiniz mühendislerimiz tarafından detaylı bir şekilde incelenmiştir.`;

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
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
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
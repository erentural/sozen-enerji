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
        ? `Sözen Enerji <strong>Gelişmiş Enerji Hesaplayıcısı</strong> üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> (${updatedQuote.panelCount} Panel ihtiyacı) analizi mühendislerimiz tarafından incelenmiş ve ön inceleme süreci tamamlanmıştır.`
        : `Sözen Enerji web sitesi üzerinden oluşturduğunuz <strong>${cleanServiceName}</strong> talebiniz mühendislerimiz tarafından detaylı bir şekilde incelenmiştir.`;

      // YENİ ŞIK HTML MAİL TASARIMI
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sözen Enerji - Fiyat Teklifi</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333333;">

            <!-- Ana Konteyner -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 30px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                
                <!-- Header (Kurumsal Başlık) -->
                <tr>
                    <td align="center" bgcolor="#003366" style="padding: 30px 20px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">SÖZEN ENERJİ</h1>
                        <p style="color: #8ab4f8; margin: 5px 0 0 0; font-size: 14px;">Geleceğin Enerjisi, Bugünden Yanınızda</p>
                    </td>
                </tr>

                <!-- İçerik Alanı -->
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="margin-top: 0; color: #003366; font-size: 20px;">Merhaba ${updatedQuote.name},</h2>
                        <p style="line-height: 1.6; font-size: 15px; color: #555555;">
                            ${introText}
                        </p>

                        <!-- Fiyat Teklifi Kutusu (Vurgulu ve Şık) -->
                        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 25px; margin: 30px 0; border-radius: 6px;">
                            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">HESAPLANAN FİYAT TEKLİFİ</p>
                            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #10b981;">
                                ${Number(priceOffer).toLocaleString("tr-TR")} TL
                            </p>
                            ${isFromCalculator ? `<p style="margin: 10px 0 0 0; font-size: 14px; font-weight: bold; color: #64748b;">Tahmini Amorti Süresi: <span style="color: #0f172a;">${updatedQuote.roiYears} Yıl</span></p>` : ''}
                        </div>

                        <!-- Mühendis Notu Kutusu -->
                        ${messageToCustomer ? `
                        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 20px; margin: 25px 0; border-radius: 6px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #0f172a;">
                                <span style="color: #3b82f6; margin-right: 5px;">✍️</span> Mühendisimizin Notu:
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${messageToCustomer}</p>
                        </div>
                        ` : ''}

                        <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; line-height: 1.5; border-top: 1px dashed #e2e8f0; padding-top: 20px;">
                            * Bu teklif bilgilendirme amaçlıdır. Keşif randevusu oluşturmak ve detayları görüşmek için bizimle iletişime geçebilirsiniz.
                        </p>
                    </td>
                </tr>

                <!-- Footer / Bize Ulaşın Alanı -->
                <tr>
                    <td bgcolor="#f1f5f9" style="padding: 30px; border-top: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; margin-bottom: 15px;">Bize Ulaşın</h3>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #475569; line-height: 1.8;">
                            <tr>
                                <td width="25" valign="top">📞</td>
                                <td valign="top"><strong>Telefon:</strong> <a href="tel:4440123" style="color: #3b82f6; text-decoration: none;">444 0 123</a></td>
                            </tr>
                            <tr>
                                <td width="25" valign="top">✉️</td>
                                <td valign="top"><strong>E-Posta:</strong> <a href="mailto:info@sozenenerji.com" style="color: #3b82f6; text-decoration: none;">info@sozen-enerji.com</a></td>
                            </tr>
                            <tr>
                                <td width="25" valign="top">📍</td>
                                <td valign="top"><strong>Adres:</strong> Yaşardoğu, Şehit Tuncay Karataş Bulvarı No:40, 55050 İlkadım / Samsun</td>
                            </tr>
                        </table>
                        
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                            <tr>
                                <td align="center" style="padding-top: 20px; border-top: 1px solid #cbd5e1;">
                                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} Sözen Enerji. Tüm hakları saklıdır.</p>
                                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;"><a href="https://www.sozen-enerji.com" style="color: #94a3b8; text-decoration: underline;">www.sozen-enerji.com</a></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

            </table>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Sözen Enerji" <${process.env.EMAIL_USER}>`,
        to: updatedQuote.email,
        subject: `${cleanServiceName} Projeniz İçin Fiyat Teklifimiz`,
        html: emailHtml,
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
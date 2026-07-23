import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { id, replyMessage } = await request.json();

    if (!id || !replyMessage) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
    }

    // 1. Veritabanında mesajı güncelleyip "Cevaplandı" ve "Okundu" olarak işaretle
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { 
        replied: true, 
        read: true 
      },
    });

    // 2. Müşteriye Gerçek E-Posta Gönderimi (Yeni Şık Şablon ile)
    if (updatedMessage.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Sözen Enerji" <${process.env.EMAIL_USER}>`,
        to: updatedMessage.email,
        subject: `Yanıt: ${updatedMessage.subject || "İletişim Talebiniz Hakkında"}`,
        html: `
          <!DOCTYPE html>
          <html lang="tr">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Sözen Enerji - İletişim Yanıtı</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333333;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 30px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                  
                  <!-- Header (Logo / Başlık) -->
                  <tr>
                      <td align="center" bgcolor="#003366" style="padding: 30px 20px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">SÖZEN ENERJİ</h1>
                          <p style="color: #8ab4f8; margin: 5px 0 0 0; font-size: 14px;">Geleceğin Enerjisi, Bugünden Yanınızda</p>
                      </td>
                  </tr>

                  <!-- İçerik Alanı -->
                  <tr>
                      <td style="padding: 40px 30px;">
                          <h2 style="margin-top: 0; color: #003366; font-size: 20px;">Merhaba ${updatedMessage.name},</h2>
                          <p style="line-height: 1.6; font-size: 15px; color: #555555;">
                              Bize ilettiğiniz mesajınız alınmış ve yönetim ekibimiz tarafından incelenmiştir.
                          </p>

                          <!-- Müşterinin Kendi Mesajı -->
                          <div style="background-color: #f8fafc; border-left: 4px solid #FFC107; padding: 20px; margin: 25px 0; border-radius: 4px;">
                              <p style="margin: 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">SİZİN MESAJINIZ</p>
                              <p style="margin: 10px 0 0 0; font-size: 14px; font-style: italic; color: #475569;">
                                  "${updatedMessage.message}"
                              </p>
                          </div>

                          <!-- Yetkili Yanıtı -->
                          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 20px; margin: 25px 0; border-radius: 6px;">
                              <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #0f172a;">
                                  <span style="color: #3b82f6; margin-right: 5px;">✍️</span> Yetkili Yanıtı:
                              </p>
                              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                                  ${replyMessage}
                              </p>
                          </div>
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
                                  <td valign="top"><strong>E-Posta:</strong> <a href="mailto:info@sozen-enerji.com" style="color: #3b82f6; text-decoration: none;">info@sozen-enerji.com</a></td>
                              </tr>
                              <tr>
                                  <td width="25" valign="top">📍</td>
                                  <td valign="top"><strong>Adres:</strong> Yaşardoğu, Şehit Tuncay Karataş BulvarıNo:40,55050 İlkadım / Samsun</td>
                              </tr>
                          </table>
                          
                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                              <tr>
                                  <td align="center" style="padding-top: 20px; border-top: 1px solid #cbd5e1;">
                                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">© 2026 Sözen Enerji. Tüm hakları saklıdır.</p>
                                      <p style="margin: 5px 0 0 0; font-size: 12px; color: #94a3b8;"><a href="https://www.xn--szen-enerji-rfb.com" style="color: #94a3b8; text-decoration: underline;">www.xn--szen-enerji-rfb.com</a></p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>

              </table>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error("Mesaj yanıtlanırken hata:", error);
    return NextResponse.json({ error: "Yanıt gönderilemedi." }, { status: 500 });
  }
}
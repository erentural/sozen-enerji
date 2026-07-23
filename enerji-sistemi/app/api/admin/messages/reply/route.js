import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { id, replyMessage } = await request.json();

    if (!id || !replyMessage) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz." }, { status: 400 });
    }

    // 1. Veritabanında mesajı güncelleyip "Cevaplandı" olarak işaretle
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { 
        replied: true, 
        read: true 
      },
    });

    // 2. Müşteriye Gerçek E-Posta Gönderimi
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
          <div style="font-family: Arial, sans-serif; max-w-lg; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #02529C;">Merhaba ${updatedMessage.name},</h2>
            <p>Bize ilettiğiniz mesajınız alınmış ve yönetim ekibimiz tarafından incelenmiştir.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #FFC107; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 13px;">Sizin Mesajınız:</p>
              <p style="font-size: 14px; font-style: italic; color: #333; margin: 5px 0 0 0;">"${updatedMessage.message}"</p>
            </div>

            <p style="color: #4b5563; line-height: 1.6;"><strong>Yetkili Yanıtı:</strong><br/> ${replyMessage}</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">İlginiz için teşekkür ederiz.<br/><strong>Sözen Enerji Yönetim Sistemi</strong></p>
          </div>
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
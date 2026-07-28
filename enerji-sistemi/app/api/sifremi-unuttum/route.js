import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta adresi gereklidir." }, { status: 400 });
    }

    // 1. Kullanıcıyı bul
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı." }, { status: 404 });
    }

    // 2. Güvenli ve benzersiz bir token oluştur (1 saat geçerli olacak)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Şu an + 1 Saat

    // 3. Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 4. Müşteriye gidecek tıklanabilir URL'yi oluştur
    // NEXT_PUBLIC_SITE_URL environment variable'ına sitenin adresini eklemelisin (Örn: https://sozen-enerji.com)
    // Şimdilik test için localhost kullanıyoruz.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "www.xn--szen-enerji-rfb.com";
    const resetUrl = `${siteUrl}/sifre-sifirla?token=${resetToken}`;

    // 5. Nodemailer ile Turhost üzerinden Mail Gönderimi
    const transporter = nodemailer.createTransport({
      host: "mail.sozen-enerji.com", 
      port: 465,
      secure: true,
      auth: {
        user: "eren.tural61@gmail.com", // Kendi mailin
        pass: "pefj fcan lbpm doap",           // Kendi şifren
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: '"Sözen Enerji Sistem" <info@sozen-enerji.com>',
      to: email,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #02529C; margin-bottom: 20px;">Şifre Sıfırlama Talebi</h2>
          <p style="color: #333; font-size: 16px;">Merhaba <strong>${user.name}</strong>,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.5;">
            Sisteme giriş şifrenizi sıfırlamak için bir talepte bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563EB; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          <p style="color: #888; font-size: 13px;">
            <em>Not: Bu bağlantı güvenlik amacıyla 1 saat boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</em>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Şifre sıfırlama maili gönderildi." }, { status: 200 });

  } catch (error) {
    console.error("Şifre sıfırlama maili hatası:", error);
    return NextResponse.json({ error: "Sistemsel bir hata oluştu." }, { status: 500 });
  }
}
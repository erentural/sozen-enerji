import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject, text } = await request.json();

    // Kendi e-posta bilgilerini buraya girmelisin
    const transporter = nodemailer.createTransport({
      service: "gmail", // Veya kullandığın başka bir servis
      auth: {
        user: "eren.tural61@gmail.com", 
        pass: "pefj fcan lbpm doap", // Normal şifren değil, Google'dan alacağın 16 haneli uygulama şifresi
      },
    });

    const mailOptions = {
      from: '"Enerji Sistemleri" <eren.tural61@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "E-posta başarıyla gönderildi." }, { status: 200 });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 });
  }
}
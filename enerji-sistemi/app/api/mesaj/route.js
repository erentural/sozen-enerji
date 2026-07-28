import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import nodemailer from "nodemailer"; // Mail atmak için kullanacağın kütüphane (Aktif etmek için başındaki // işaretini kaldır)

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Zorunlu alanların kontrolü
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    // Veritabanından gerçek telefon numarasını bulma
    let finalPhone = phone;

    // Eğer e-posta adresi varsa, veritabanında bu müşteriyi arıyoruz
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email }
      });
      
      // Eğer kullanıcı sistemde kayıtlıysa ve profilinde telefon numarası varsa onu al
      if (existingUser && existingUser.phone) {
        finalPhone = existingUser.phone;
      }
    }

    // 1. Veritabanına kayıt işlemi (Panele düşmesi için her zaman çalışır)
    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: finalPhone, // Formdan gelen "Sistemde Kayıtlı" yazısı yerine gerçek numara kaydedilir
        subject: subject || "Genel Mesaj",
        message,
        read: false,
        replied: false,
      },
    });

    // ====================================================================
    // 2. BİLDİRİM KONTROLÜ (Ayarlardaki Checkbox'a Göre Mail Atma)
    // ====================================================================
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });

    // Eğer ayar açıksa (true ise) yöneticiye mail at
    if (settings && settings.emailOnMessage === true) {
      
      const adminEmail = settings.supportEmail || "info@enerjipanel.com"; // Mailin gideceği adres

      // Sistemin çökmeyeceğinden emin olmak için terminale log basıyoruz
      console.log(`[BİLDİRİM - AKTİF]: ${adminEmail} adresine yeni mesaj maili gönderiliyor...`);
      
      
      // GERÇEK MAİL GÖNDERME KODU (Nodemailer Örneği)
      // Kendi SMTP bilgilerine göre burayı aktif edebilirsin:
      
      const transporter = nodemailer.createTransport({
        host: "mail.sozen-enerji.com", // Kendi mail sunucun
        port: 465,
        secure: true,
        auth: {
          user: "eren.tural61@gmail.com", // Mail adresin
          pass: "pefj fcan lbpm doap", // Mail şifren
        },
      }); 
          

      await transporter.sendMail({
        from: '"Sistem Bildirimi" <eren.tural61@gmail.com>',
        to: adminEmail,
        subject: "Yeni Müşteri Mesajı Alındı!",
        html: `
          <h3>Web sitesi üzerinden yeni bir mesaj aldınız!</h3>
          <p><strong>Gönderen:</strong> ${name} (${email})</p>
          <p><strong>Telefon:</strong> ${finalPhone}</p>
          <p><strong>Konu:</strong> ${subject || "Genel Mesaj"}</p>
          <p><strong>Mesaj:</strong><br/>${message}</p>
          <br>
          <p>Panele girerek mesajı okuyabilir ve yanıtlayabilirsiniz.</p>
        `,
      });
      
    } else {
      console.log(`[BİLDİRİM - PASİF]: Ayarlardan "Müşteri Mesajları" bildirimi kapalı olduğu için mail atılmadı.`);
    }
    // ====================================================================

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Mesaj kaydedilirken hata:", error);
    return NextResponse.json({ error: "Mesaj kaydedilemedi." }, { status: 500 });
  }
}
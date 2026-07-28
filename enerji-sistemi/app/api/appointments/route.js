import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import nodemailer from "nodemailer"; // Mail atmak için kullanacağın kütüphane (Aktif etmek için başındaki // işaretini kaldır)

// GET: Tüm randevuları ilişkili müşteri bilgileriyle birlikte getirir (Admin için)
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        customer: true,
      },
      orderBy: { date: "asc" }, // Kronolojik sıra
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: "Randevular getirilemedi." }, { status: 500 });
  }
}

// POST: Yeni randevu talebi oluşturur (Müşteri için)
export async function POST(request) {
  try {
    const body = await request.json();
    const { date, subject, customerEmail } = body;

    // 1. Randevuyu oluşturan müşteriyi bul
    const customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı." }, { status: 404 });
    }

    // 2. Randevuyu veritabanına kaydet (Panelde görünmesi için bu HER ZAMAN çalışır)
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        subject,
        customerId: customer.id,
        status: "PENDING", 
      },
    });

    // ====================================================================
    // 3. BİLDİRİM KONTROLÜ (Ayarlardaki Checkbox'a Göre Mail Atma)
    // ====================================================================
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });

    // Eğer ayar açıksa (true ise) yöneticiye mail at
    if (settings && settings.emailOnAppointment === true) {
      
      const adminEmail = settings.supportEmail || "info@enerjipanel.com"; // Mailin gideceği adres

      // Sistemin çökmeyeceğinden emin olmak için terminale log basıyoruz
      console.log(`[BİLDİRİM - AKTİF]: ${adminEmail} adresine yeni randevu maili gönderiliyor...`);
      
      /* 
      // GERÇEK MAİL GÖNDERME KODU (Nodemailer Örneği)
      // Kendi SMTP bilgilerine göre burayı aktif edebilirsin:
      
      const transporter = nodemailer.createTransport({
        host: "smtp.yandex.com", // Kendi mail sunucun
        port: 465,
        secure: true,
        auth: {
          user: "senin_sistem_mailin@yandex.com",
          pass: "mail_sifren",
        },
      });

      await transporter.sendMail({
        from: '"Sistem Bildirimi" <senin_sistem_mailin@yandex.com>',
        to: adminEmail,
        subject: "Yeni Randevu Talebi Var!",
        html: `
          <h3>Yeni bir keşif/görüşme talebi aldınız!</h3>
          <p><strong>Müşteri:</strong> ${customer.name} (${customerEmail})</p>
          <p><strong>Tarih:</strong> ${new Date(date).toLocaleString('tr-TR')}</p>
          <p><strong>Konu:</strong> ${subject}</p>
          <br>
          <p>Panele girerek randevuyu onaylayabilirsiniz.</p>
        `,
      });
      */
    } else {
      console.log(`[BİLDİRİM - PASİF]: Ayarlardan "Yeni Randevu Talebi" bildirimi kapalı olduğu için mail atılmadı.`);
    }
    // ====================================================================

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Randevu oluşturulamadı." }, { status: 500 });
  }
}
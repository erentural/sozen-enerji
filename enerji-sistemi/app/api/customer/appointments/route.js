import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, date, email } = body;

    if (!subject || !date || !email) {
      return NextResponse.json({ error: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    // E-posta üzerinden hangi müşterinin talep ettiğini bul
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

  // Randevuyu 'PENDING' durumuyla ve müşteriye 'connect' ederek kaydet
    const appointment = await prisma.appointment.create({
      data: {
        subject,
        date: new Date(date),
        status: "PENDING",
        customer: {
          connect: { id: user.id }
        }
      }
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error("Randevu oluşturulurken hata:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
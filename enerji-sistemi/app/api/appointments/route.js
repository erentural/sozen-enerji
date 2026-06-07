import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Randevuyu oluşturan müşteriyi bul
    const customer = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı." }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        subject,
        customerId: customer.id,
        status: "PENDING", // İlk başta onay bekliyor durumunda başlar
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Randevu oluşturulamadı." }, { status: 500 });
  }
}
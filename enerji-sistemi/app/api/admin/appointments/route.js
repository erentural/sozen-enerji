import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Tüm randevuları tarihe göre sıralayarak getir
    // include: { customer: true } diyerek randevuyu kimin aldığı bilgisini de çekiyoruz
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true 
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Randevular getirilemedi:", error);
    return NextResponse.json({ error: "Randevular alınamadı." }, { status: 500 });
  }
}
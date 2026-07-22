import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Veritabanından gerçek istatistikleri eş zamanlı çekiyoruz
    const [projects, pendingAppointments, unreadMessages, customers] = await Promise.all([
      prisma.project.count(),
      prisma.appointment ? prisma.appointment.count({ where: { status: "PENDING" } }) : Promise.resolve(0),
      prisma.message ? prisma.message.count({ where: { read: false } }) : prisma.message.count().catch(() => 0),
      prisma.user.count(), // Ürünler yerine gerçek müşteri sayısı eklendi
    ]);

    return NextResponse.json({
      projects,
      pendingAppointments,
      unreadMessages,
      customers, // Frontend'in beklediği stats.customers verisi
    });
  } catch (error) {
    console.error("Dashboard istatistikleri alınamadı:", error);
    return NextResponse.json({ error: "İstatistikler yüklenemedi." }, { status: 500 });
  }
}
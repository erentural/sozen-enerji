import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js'in bu API yanıtını önbelleğe (cache) almasını engeller
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Aktif Proje Sayısı
    const projectsCount = await prisma.project.count().catch(() => 0);

    // 2. Bekleyen Randevu / Teklif Talebi Sayısı 
    // (Propendeki tablonun adına göre model adını kontrol edebilirsin, örn: quote veya appointment)
    const pendingAppointmentsCount = await prisma.quote.count({
      where: { status: "PENDING" }
    }).catch(() => 0);

    // 3. YENİ MESAJ SAYISI (Sadece henüz okunmamış olanlar: read: false)
    const unreadMessagesCount = await prisma.message.count({
      where: {
        read: false
      }
    }).catch(() => 0);

    // 4. Müşteri Sayısı
    const customersCount = await prisma.customer.count().catch(() => 0);

    return NextResponse.json({
      projects: projectsCount,
      pendingAppointments: pendingAppointmentsCount,
      unreadMessages: unreadMessagesCount, // Artık sadece okunmamışlar sayılıyor
      customers: customersCount,
    });

  } catch (error) {
    console.error("Dashboard istatistikleri alınırken hata:", error);
    return NextResponse.json({ error: "İstatistikler yüklenemedi." }, { status: 500 });
  }
}
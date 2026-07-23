import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js'in bu API yanıtını önbelleğe (cache) almasını engeller
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Aktif Projeler (Project tablosu)
    // Eğer sadece devam edenleri saymak istersen { where: { isCompleted: false } } eklenebilir.
    const projectsCount = await prisma.project.count().catch(() => 0);

    // 2. Bekleyen Randevular (Appointment tablosu)
    // schema.prisma'daki AppointmentStatus enum'una göre "PENDING" olanlar
    const pendingAppointmentsCount = await prisma.appointment.count({
      where: { status: "PENDING" }
    }).catch(() => 0);

    // 3. Yeni Mesajlar (Message tablosu)
    // Sadece okunmamış mesajlar (read: false)
    const unreadMessagesCount = await prisma.message.count({
      where: { read: false }
    }).catch(() => 0);

    // 4. Müşteriler (User tablosu)
    // Customer tablosu yerine, Role'ü "USER" olan kullanıcılar sayılıyor
    const customersCount = await prisma.user.count({
      where: { role: "USER" }
    }).catch(() => 0);

    return NextResponse.json({
      projects: projectsCount,
      pendingAppointments: pendingAppointmentsCount,
      unreadMessages: unreadMessagesCount,
      customers: customersCount,
    });

  } catch (error) {
    console.error("Dashboard istatistikleri alınırken hata:", error);
    return NextResponse.json({ error: "İstatistikler yüklenemedi." }, { status: 500 });
  }
}
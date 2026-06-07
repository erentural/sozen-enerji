import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Okunmamış mesajları getir (En yeni 3 adet)
    const unreadMessages = await prisma.contactMessage.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    // 2. Bekleyen randevuları getir (En yeni 3 adet)
    const pendingAppointments = await prisma.appointment.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    // 3. Verileri ortak bir bildirim formatında birleştir
    const notifications = [
      ...unreadMessages.map(m => ({
        id: `msg-${m.id}`,
        type: 'message',
        title: 'Yeni Mesaj',
        desc: `${m.name} size bir mesaj gönderdi.`,
        date: m.createdAt,
        link: '/admin/mesajlar'
      })),
      ...pendingAppointments.map(a => ({
        id: `app-${a.id}`,
        type: 'appointment',
        title: 'Randevu Talebi',
        desc: `Yeni bir randevu onayı bekliyor.`,
        date: a.createdAt,
        link: '/admin/randevular'
      }))
    ];

    // Tarihe göre en yeniden eskiye sırala ve en güncel 5 tanesini al
    const sortedNotifications = notifications
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Toplam okunmamış/bekleyen sayısını hesapla
    const totalCount = await prisma.contactMessage.count({ where: { isRead: false } }) + 
                       await prisma.appointment.count({ where: { status: 'PENDING' } });

    return NextResponse.json({
      count: totalCount,
      items: sortedNotifications
    });

  } catch (error) {
    console.error("Bildirimler alınırken hata:", error);
    return NextResponse.json({ error: "Bildirimler alınamadı." }, { status: 500 });
  }
}
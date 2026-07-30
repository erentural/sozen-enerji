import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Prisma bağlantı yolunuzu kendi yapınıza göre uyarlayın

export async function GET() {
  try {
    // 1. İstatistik Sayılarını Çek
    const projectsCount = await prisma.project.count({ where: { progress: { lt: 100 } } });
    const pendingAppointments = await prisma.appointment.count({ where: { status: "PENDING" } });
    const unreadMessages = await prisma.message.count({ where: { isRead: false } });
    const customersCount = await prisma.user.count({ where: { role: "USER" } });

    // 2. Aktif Projeleri Çek (Son 4 Proje)
    const recentProjectsData = await prisma.project.findMany({
      where: { progress: { lt: 100 } },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      include: { user: true } // Müşteri adını alabilmek için user tablosunu dahil ediyoruz
    });

    const recentProjects = recentProjectsData.map(p => ({
      id: p.id,
      title: p.title,
      progress: p.progress,
      customerName: p.user?.name || "Bilinmeyen Müşteri"
    }));

    // 3. Bekleyen Randevuları Çek (Son 4 Randevu)
    const pendingApptsData = await prisma.appointment.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { user: true }
    });

    const pendingAppointmentsList = pendingApptsData.map(a => ({
      id: a.id,
      subject: a.subject,
      date: a.date,
      customerName: a.user?.name || "Bilinmeyen Müşteri"
    }));

    // Tüm verileri tek bir JSON objesi olarak arayüze gönder
    return NextResponse.json({
      stats: {
        projects: projectsCount,
        pendingAppointments: pendingAppointments,
        unreadMessages: unreadMessages,
        customers: customersCount
      },
      recentProjects: recentProjects,
      pendingAppointments: pendingAppointmentsList
    });

  } catch (error) {
    console.error("Dashboard Stats API Hatası:", error);
    return NextResponse.json({ error: "Veriler alınırken bir hata oluştu." }, { status: 500 });
  }
}
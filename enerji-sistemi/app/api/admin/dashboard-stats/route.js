import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js'in bu API yanıtını önbelleğe (cache) almasını engeller
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. İstatistik Sayılarını Çek
    // Çökme durumunda eski kodundaki gibi .catch(() => 0) ile güvenlik önlemi alındı
    const projectsCount = await prisma.project.count({ 
      where: { progress: { lt: 100 } } 
    }).catch(() => 0);
    
    const pendingAppointments = await prisma.appointment.count({ 
      where: { status: "PENDING" } 
    }).catch(() => 0);
    
    // HATA DÜZELTİLDİ: isRead yerine şemandaki read alanı kullanıldı
    const unreadMessages = await prisma.message.count({ 
      where: { read: false } 
    }).catch(() => 0);
    
    const customersCount = await prisma.user.count({ 
      where: { role: "USER" } 
    }).catch(() => 0);

    // 2. Aktif Projeleri Çek (Son 4 Proje)
    const recentProjectsData = await prisma.project.findMany({
      where: { progress: { lt: 100 } },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      // HATA DÜZELTİLDİ: user yerine şemandaki relation adı olan customer kullanıldı
      include: { customer: true } 
    }).catch(() => []);

    const recentProjects = recentProjectsData.map(p => ({
      id: p.id,
      title: p.title,
      progress: p.progress,
      // Şemadaki customer ilişkisinden isim çekildi
      customerName: p.customer?.name || "Bilinmeyen Müşteri" 
    }));

    // 3. Bekleyen Randevuları Çek (Son 4 Randevu)
    const pendingApptsData = await prisma.appointment.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: 'desc' },
      take: 4,
      // HATA DÜZELTİLDİ: user yerine customer kullanıldı
      include: { customer: true } 
    }).catch(() => []);

    const pendingAppointmentsList = pendingApptsData.map(a => ({
      id: a.id,
      subject: a.subject,
      date: a.date,
      customerName: a.customer?.name || "Bilinmeyen Müşteri"
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
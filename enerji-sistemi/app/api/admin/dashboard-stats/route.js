import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let projects = 0;
    let customers = 0;
    let unreadMessages = 0;
    let pendingAppointments = 0;

    try { projects = await prisma.project.count(); } catch (e) {}
    try { customers = await prisma.user.count(); } catch (e) {}
    try { unreadMessages = await prisma.message.count(); } catch (e) {}
    
    // Sadece durumu henüz belli olmayan (bekleyen) randevuları filtreleyerek sayıyoruz
    try { 
      pendingAppointments = await prisma.appointment.count({ 
        where: { 
          status: { 
            in: ["PENDING", "Beklemede", "bekliyor", "YENI", "new"] 
          } 
        } 
      }); 
    } catch (e) { 
      // Eğer veritabanında status alanı yoksa veya farklı bir sorgu gerekiyorsa güvenli fallback
      try { 
        pendingAppointments = await prisma.appointment.count(); 
      } catch (err) {}
    }

    return NextResponse.json({
      projects,
      customers,
      unreadMessages,
      pendingAppointments,
    });
  } catch (error) {
    console.error("Dashboard istatistik hatası:", error);
    return NextResponse.json({ 
      projects: 0, 
      customers: 0, 
      unreadMessages: 0, 
      pendingAppointments: 0 
    });
  }
}
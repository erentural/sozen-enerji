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
    
    // Güvenli Filtreleme: Önce doğrudan veritabanından süzmeyi dene, 
    // hata alırsan tüm listeyi çekip JavaScript ile sadece bekleyenleri filtrele.
    try { 
      pendingAppointments = await prisma.appointment.count({ 
        where: { 
          status: { 
            in: ["PENDING", "Beklemede", "bekliyor", "YENI", "new"] 
          } 
        } 
      }); 
    } catch (e) { 
      try { 
        const allAppointments = await prisma.appointment.findMany();
        pendingAppointments = allAppointments.filter(app => 
          !app.status || 
          ["PENDING", "Beklemede", "bekliyor", "YENI", "new", "PENDING"].includes(app.status)
        ).length;
      } catch (err) {
        pendingAppointments = 0;
      }
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
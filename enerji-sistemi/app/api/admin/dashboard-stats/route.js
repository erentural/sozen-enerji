import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Her tabloyu ayrı ayrı güvenli şekilde saydırıyoruz ki biri hata verse bile diğerleri çalışsın
    let projects = 0;
    let customers = 0;
    let unreadMessages = 0;
    let pendingAppointments = 0;

    try { projects = await prisma.project.count(); } catch (e) {}
    try { customers = await prisma.user.count(); } catch (e) {}
    try { unreadMessages = await prisma.message.count(); } catch (e) {}
    try { pendingAppointments = await prisma.appointment.count(); } catch (e) {}

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
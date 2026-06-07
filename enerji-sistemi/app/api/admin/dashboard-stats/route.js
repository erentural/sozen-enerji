import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [projects, pendingAppointments, unreadMessages, products] = await Promise.all([
      prisma.project.count(), // Tüm projeleri say
      prisma.appointment.count({ where: { status: "PENDING" } }), // Bekleyen randevuları say
      prisma.contactMessage.count({ where: { isRead: false } }), // Okunmamış mesajları say
      prisma.product.count() // Tüm ürünleri say
    ]);

    return NextResponse.json({
      projects,
      pendingAppointments,
      unreadMessages,
      products
    });
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı" }, { status: 500 });
  }
}
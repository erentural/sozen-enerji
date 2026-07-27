import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Sadece "progress" değeri 100 olan projeleri en yeniden eskiye sıralayarak getir
    const completedProjects = await prisma.project.findMany({
      where: { 
        progress: 100 
      },
      orderBy: { 
        createdAt: "desc" 
      },
      take: 6, // Ana sayfayı boğmamak için sadece en son biten 6 projeyi alıyoruz
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true, // YENİ EKLENDİ: Artık görsel linki de ön yüze gönderiliyor!
        // Müşteri maili gibi gizli verileri bilerek dışarı aktarmıyoruz (Güvenlik)
      }
    });

    return NextResponse.json(completedProjects);
  } catch (error) {
    console.error("Projeler çekilemedi:", error);
    return NextResponse.json({ error: "Projeler alınamadı." }, { status: 500 });
  }
}